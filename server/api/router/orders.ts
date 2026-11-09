/**
 * tRPC APIs that contains all of the functionality for creating,
 * reading, updating, and deleting order data in our database.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { CoffeeModel } from "@/server/models/coffee";
import { ordersTable } from "@/server/db/schema";
import { OrderModel } from "@/server/models/order";
import { eq } from "drizzle-orm";

const placeOrder = publicProcedure
  .input(
    z.object({
      coffee: CoffeeModel,
      type: z.string(),
      milk: z.string(),
      name: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    await db.insert(ordersTable).values({
      coffeeId: input.coffee.id,
      type: input.type,
      milk: input.milk,
      name: input.name,
      fulfilled: false,
    });
  });

const fulfillOrder = publicProcedure
  .input(
    z.object({
      order: OrderModel,
    })
  )
  .mutation(async ({ input }) => {
    // Drizzle queries are lazy: they only run when awaited (or `.execute()`d).
    // Inserts, updates, and deletes still use the SQL-like query builder and
    // its operators such as `eq` -- only relational queries (`db.query`)
    // changed in Drizzle 1.0.
    await db
      .update(ordersTable)
      .set({ fulfilled: true })
      .where(eq(ordersTable.id, input.order.id));
  });

const getOrders = publicProcedure.output(OrderModel.array()).query(async () => {
  // Drizzle 1.0 relational queries take plain objects for `where` and
  // `orderBy` instead of operator callbacks like `eq(...)`.
  const result = await db.query.ordersTable.findMany({
    columns: {
      id: true,
      type: true,
      milk: true,
      name: true,
      fulfilled: true,
    },
    with: {
      coffee: {
        columns: { name: true },
      },
    },
    where: { fulfilled: false },
    orderBy: { id: "asc" },
  });

  return OrderModel.array().parse(result);
});

/**
 * Router for all order-related APIs.
 */
export const ordersApiRouter = createTRPCRouter({
  placeOrder,
  fulfillOrder,
  getOrders,
});
