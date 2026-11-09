/**
 * Creates the TanStack Query client shared by tRPC on both the server
 * (for prefetching in Server Components) and the browser.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With server-side prefetching, set a non-zero stale time so the
        // client does not immediately refetch data it just received.
        staleTime: 30 * 1000,
      },
      // Data prefetched on the server is serialized into the HTML and
      // rehydrated in the browser. Use superjson so that values such as
      // `Date` survive the trip, matching the tRPC transformer.
      dehydrate: {
        serializeData: superjson.serialize,
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
