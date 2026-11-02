insert into public.venues (
  id, name, area, price_cents, icon, min_age, max_age,
  description, pass_window, surcharge_cents, walk_in, published, sort_order
) values
  ('sprout', 'Sprout & Play', 'Brossard', 1800, '🌱', 1, 5,
   'A cozy sensory play space for little explorers.', 'Weekdays, 9am–2pm', 400, true, true, 1),
  ('jump', 'Jump Junction', 'Saint-Hubert', 2200, '🛝', 2, 8,
   'Big slides, climbing and energetic indoor fun.', 'Weekdays, 10am–3pm', 500, false, true, 2),
  ('cloud', 'Cloud Castle', 'Brossard', 2000, '☁️', 1, 7,
   'Soft-play castle and imaginative pretend zones.', 'Mon–Thu, 9am–4pm', 300, true, true, 3),
  ('mini', 'Mini Makers Club', 'Longueuil', 1600, '🎨', 2, 6,
   'Creative play, building corners and mini workshops.', 'Tue–Fri, 9am–1pm', 300, false, true, 4),
  ('ninja', 'Little Ninja Loft', 'La Prairie', 2400, '🥷', 3, 10,
   'A mini obstacle course for brave little movers.', 'Weekdays, 11am–3pm', 600, false, true, 5)
on conflict (id) do update set
  name = excluded.name,
  area = excluded.area,
  price_cents = excluded.price_cents,
  icon = excluded.icon,
  min_age = excluded.min_age,
  max_age = excluded.max_age,
  description = excluded.description,
  pass_window = excluded.pass_window,
  surcharge_cents = excluded.surcharge_cents,
  walk_in = excluded.walk_in,
  published = excluded.published,
  sort_order = excluded.sort_order;
