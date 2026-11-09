/**
 * Configuration for the server-side tRPC API, including the primary API router.
 * Configuration of the server-side tRPC API.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { coffeeApiRouter } from "./router/coffee";
import { ordersApiRouter } from "./router/orders";

/** Primary router for the API server. */
export const appRouter = createTRPCRouter({
  coffee: coffeeApiRouter,
  orders: ordersApiRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
