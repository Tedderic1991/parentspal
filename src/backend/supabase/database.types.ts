export interface VenueRow {
  id: string;
  name: string;
  area: string;
  price_cents: number;
  icon: string;
  min_age: number;
  max_age: number;
  description: string;
  pass_window: string;
  surcharge_cents: number;
  walk_in: boolean;
  published: boolean;
  sort_order: number;
}

// Only the public catalog is consumed today; generate full types after migrations.
export interface Database {
  public: {
    Tables: {
      venues: {
        Row: VenueRow;
        Insert: Omit<VenueRow, "published" | "sort_order"> & {
          published?: boolean; sort_order?: number;
        };
        Update: Partial<VenueRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
