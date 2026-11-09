/**
 * Table definitions for the database. Relationships between these tables
 * are defined separately in `relations.ts` using Drizzle 1.0's
 * `defineRelations()` API.
 */

import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const coffeeTable = pgTable("coffee", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price"),
  label: text("label"),
  imageUrl: text("image_url").notNull(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  milk: text("milk").notNull(),
  name: text("name").notNull(),
  fulfilled: boolean("fulfilled").notNull(),
  coffeeId: integer("coffee_id")
    .notNull()
    .references(() => coffeeTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
