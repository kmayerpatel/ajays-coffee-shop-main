import { z } from "zod";

export const CoffeeModel = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  label: z.string().nullable(),
  imageUrl: z.string(),
});

export type Coffee = z.infer<typeof CoffeeModel>;

export const milkText = (milk: string) => {
  switch (milk) {
    case "whole":
      return "Whole Milk";
    case "reduced":
      return "2% Milk";
    case "almond":
      return "Almond Milk";
    case "oat":
      return "Oat Milk";
    case "none":
      return "No Milk";
  }
};
