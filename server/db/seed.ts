/**
 * Seeds the `coffee` table with the drinks on the menu.
 *
 *   npm run db:seed    Adds the menu if the coffee table is empty.
 *   npm run db:reset   Deletes all coffee AND all orders, then adds the menu.
 *
 * Run `npx drizzle-kit push` (or `migrate`) first so the tables exist.
 * The images live in `public/coffee/`, so `imageUrl` is a path relative
 * to the site root.
 */

import { sql } from "drizzle-orm";
import { client, db } from "@/server/db";
import { coffeeTable } from "@/server/db/schema";

const drinks: (typeof coffeeTable.$inferInsert)[] = [
  {
    name: "Pumpkin Spice Latte",
    description:
      "Espresso and steamed milk with pumpkin, cinnamon, nutmeg, and clove, topped with whipped cream and pumpkin spice.",
    price: 5.75,
    label: "Seasonal",
    imageUrl: "/coffee/pumpkin-spice-latte.svg",
  },
  {
    name: "Caffè Latte",
    description:
      "A double shot of espresso with plenty of steamed milk and a thin layer of microfoam.",
    price: 4.5,
    label: "Popular",
    imageUrl: "/coffee/caffe-latte.svg",
  },
  {
    name: "Cappuccino",
    description:
      "Equal parts espresso, steamed milk, and a deep cap of airy foam, dusted with cocoa.",
    price: 4.25,
    label: null,
    imageUrl: "/coffee/cappuccino.svg",
  },
  {
    name: "Caramel Macchiato",
    description:
      "Vanilla-sweetened milk marked with espresso and finished with a crosshatch of caramel sauce.",
    price: 5.25,
    label: "Popular",
    imageUrl: "/coffee/caramel-macchiato.svg",
  },
  {
    name: "Mocha",
    description:
      "Espresso and rich chocolate sauce with steamed milk, topped with whipped cream and a chocolate drizzle.",
    price: 5.0,
    label: null,
    imageUrl: "/coffee/mocha.svg",
  },
  {
    name: "Flat White",
    description:
      "Two ristretto shots with a small pour of velvety microfoam for a bold, smooth cup.",
    price: 4.75,
    label: "New",
    imageUrl: "/coffee/flat-white.svg",
  },
];

async function main() {
  const reset = process.argv.includes("--reset");

  if (reset) {
    // Orders reference coffee, so CASCADE clears them too. RESTART IDENTITY
    // resets the serial ids so the menu is numbered 1-6 again.
    await db.execute(sql`truncate table coffee, orders restart identity cascade`);
    console.log("Cleared the coffee and orders tables.");
  } else {
    const existing = await db.$count(coffeeTable);
    if (existing > 0) {
      console.log(
        `The coffee table already has ${existing} row(s); nothing to do. ` +
          "Run `npm run db:reset` to clear it and seed again."
      );
      return;
    }
  }

  const inserted = await db
    .insert(coffeeTable)
    .values(drinks)
    .returning({ id: coffeeTable.id, name: coffeeTable.name });

  for (const { id, name } of inserted) console.log(`  ${id}. ${name}`);
  console.log(`Seeded ${inserted.length} coffee drinks.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
