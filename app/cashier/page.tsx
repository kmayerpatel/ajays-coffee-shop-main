/**
 * Cashier page (`/cashier`), where staff see incoming orders in real time.
 *
 * The Server Component prefetches the menu and the open orders; the
 * `CashierView` Client Component then keeps the order list live with
 * Supabase Realtime.
 */

import { getQueryClient, HydrateClient, trpc } from "@/utils/trpc/server";
import CashierView from "./cashier-view";

// This page reads auth cookies and shows live data, so always render it per
// request instead of prerendering it at build time.
export const dynamic = "force-dynamic";

export default async function CashierPage() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trpc.coffee.getCoffee.queryOptions()),
    queryClient.prefetchQuery(trpc.orders.getOrders.queryOptions()),
  ]);

  return (
    <HydrateClient>
      <CashierView />
    </HydrateClient>
  );
}
