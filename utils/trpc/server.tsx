/**
 * Server-side helpers for tRPC, for use in Server Components only.
 *
 * A Server Component can prefetch a query so that its data is already in
 * the cache when the page's Client Components render:
 *
 * ```tsx
 * export default async function Page() {
 *   await getQueryClient().prefetchQuery(trpc.coffee.getCoffee.queryOptions());
 *   return (
 *     <HydrateClient>
 *       <SomeClientComponent />  // useQuery(...) here gets the data right away
 *     </HydrateClient>
 *   );
 * }
 * ```
 *
 * Prefetching calls the procedures directly on the server, with no HTTP
 * round trip.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { makeQueryClient } from "./query-client";

/** Returns the same query client for the duration of a single request. */
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

/** Sends everything prefetched on the server to the Client Components below. */
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
