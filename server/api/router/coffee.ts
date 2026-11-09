/**
 * tRPC APIs that contains all of the functionality for creating,
 * reading, updating, and deleting coffee data in our database.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";

import { CoffeeModel } from "@/server/models/coffee";

const getCoffee = publicProcedure
  .output(CoffeeModel.array())
  .query(async () => {
    const result = await db.query.coffeeTable.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        price: true,
        label: true,
        imageUrl: true,
      },
      orderBy: { id: "asc" },
    });
    return CoffeeModel.array().parse(result);
  });

/**
 * Router for all coffee-related APIs.
 */
export const coffeeApiRouter = createTRPCRouter({
  getCoffee,
});
