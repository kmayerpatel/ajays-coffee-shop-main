/**
 * Home page (`/`), where customers browse the menu and place orders.
 *
 * This is a Server Component: it prefetches the coffee menu on the server,
 * then hands it to the interactive `OrderMenu` Client Component through
 * `HydrateClient`, so the menu is in the initial HTML instead of loading
 * after the page appears.
 */

import { getQueryClient, HydrateClient, trpc } from "@/utils/trpc/server";
import OrderMenu from "./order-menu";

// This page reads auth cookies and shows live data, so always render it per
// request instead of prerendering it at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  await getQueryClient().prefetchQuery(trpc.coffee.getCoffee.queryOptions());

  return (
    <HydrateClient>
      <OrderMenu />
    </HydrateClient>
  );
}
