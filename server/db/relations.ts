/**
 * Relationships between tables, used by Drizzle's relational query API
 * (`db.query.<table>.findMany(...)`).
 *
 * Drizzle 1.0 replaces the per-table `relations()` helper with a single
 * `defineRelations()` call that describes every relationship in one place.
 * The keys (`coffeeTable`, `ordersTable`) are the names the tables are
 * exported under in `schema.ts`.
 */

import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  coffeeTable: {
    // One coffee can appear on many orders. Because the reverse `one`
    // relation is defined below, no `from`/`to` is needed here.
    orders: r.many.ordersTable(),
  },
  ordersTable: {
    // Each order is for exactly one coffee.
    coffee: r.one.coffeeTable({
      from: r.ordersTable.coffeeId,
      to: r.coffeeTable.id,
      // `coffee_id` is NOT NULL, so tell Drizzle the related coffee always
      // exists. This removes `null` from the inferred type of `order.coffee`.
      optional: false,
    }),
  },
}));
