import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { demoVenues } from "@/shared/catalog";
import { mapVenue } from "../venues/map-venue";
import type { VenueRow } from "./database.types";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const pass = "33333333-3333-4333-8333-333333333333";
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    insert into auth.users values ('${owner}'), ('${other}');
  `);
  await db.exec(await readFile("supabase/migrations/20261102220000_initial_schema.sql", "utf8"));
  await db.exec(await readFile("supabase/seed.sql", "utf8"));
  await db.exec(`
    insert into public.profiles(id, display_name) values ('${owner}', 'Owner'), ('${other}', 'Other');
    insert into public.passes(id, owner_id, adults, child_ages, total_cents)
      values ('${pass}', '${owner}', 2, array[2], 5400);
    insert into public.pass_admissions(pass_id, venue_id, quantity, unit_price_cents)
      values ('${pass}', 'jump', 1, 2200);
    insert into public.bookings(pass_id, owner_id, venue_id, visit_date, slot)
      values ('${pass}', '${owner}', 'jump', '2026-11-07', '10:00 AM');
  `);
}, 30_000);

afterAll(async () => { await db?.close(); });

async function asRole<T>(role: "anon" | "authenticated", user: string | null, operation: () => Promise<T>) {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user ?? ""]);
  try { return await operation(); }
  finally { await db.exec("reset role"); }
}

describe("Supabase migrations on embedded PostgreSQL", () => {
  it("seeds the same catalog as the keyless demo and can be reapplied", async () => {
    await db.exec(await readFile("supabase/seed.sql", "utf8"));
    const result = await db.query<VenueRow>("select * from public.venues order by sort_order");
    expect(result.rows.map(mapVenue)).toEqual(demoVenues);
  });
  it("allows anonymous reads only for published venues and denies private records/writes", async () => {
    await db.exec("update public.venues set published = false where id = 'ninja'");
    try {
      await asRole("anon", null, async () => {
        const result = await db.query("select id from public.venues");
        expect(result.rows).toHaveLength(4);
        await expect(db.query("select * from public.passes")).rejects.toThrow("permission denied");
        await expect(db.query("update public.venues set price_cents = 1")).rejects.toThrow("permission denied");
      });
    } finally { await db.exec("update public.venues set published = true where id = 'ninja'"); }
  });
  it("isolates passes, admissions, bookings, and profiles by authenticated owner", async () => {
    for (const user of [owner, other]) {
      await asRole("authenticated", user, async () => {
        for (const table of ["passes", "pass_admissions", "bookings"]) {
          const result = await db.query(`select * from public.${table}`);
          expect(result.rows).toHaveLength(user === owner ? 1 : 0);
        }
        const profile = await db.query<{ id: string }>("select id from public.profiles");
        expect(profile.rows).toEqual([{ id: user }]);
        await expect(db.query("delete from public.passes")).rejects.toThrow("permission denied");
      });
    }
  });
  it("rejects a booking owned by someone other than the pass owner", async () => {
    await expect(db.query(`
      insert into public.bookings(pass_id, owner_id, venue_id, visit_date, slot)
      values ($1, $2, 'jump', '2026-11-07', '10:00 AM')
    `, [pass, other])).rejects.toThrow("foreign key constraint");
  });
  it("rejects invalid family ages and over-redemption", async () => {
    await expect(db.query(`
      insert into public.passes(owner_id, adults, child_ages, total_cents)
      values ($1, 2, array[18], 100)
    `, [owner])).rejects.toThrow("check constraint");
    await expect(db.query(`
      update public.pass_admissions set redeemed = 2 where pass_id = $1
    `, [pass])).rejects.toThrow("check constraint");
  });
});
