import { z } from "zod";

export const OrderModel = z.object({
  id: z.number(),
  coffee: z.object({ name: z.string() }),
  type: z.string(),
  milk: z.string(),
  name: z.string(),
  fulfilled: z.boolean(),
});

export type Order = z.infer<typeof OrderModel>;

export const NewOrderModel = z.object({
  id: z.number(),
  coffee_id: z.number(),
  type: z.string(),
  milk: z.string(),
  name: z.string(),
  fulfilled: z.boolean(),
});

export type NewOrder = z.infer<typeof NewOrderModel>;
