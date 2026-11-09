/**
 * This is the client-side entrypoint for the tRPC API.
 *
 * `TRPCReactProvider` wraps the app (see `app/layout.tsx`). Inside any
 * Client Component, call `useTRPC()` to get a type-safe proxy, then pass its
 * options to TanStack Query's own hooks:
 *
 * ```tsx
 * const trpc = useTRPC();
 * const { data } = useQuery(trpc.coffee.getCoffee.queryOptions());
 * const { mutate } = useMutation(trpc.orders.placeOrder.mutationOptions());
 * ```
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client for each request.
    return makeQueryClient();
  }
  // Browser: reuse a single query client so that React does not throw it
  // away if it suspends during the initial render.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => isNonJsonSerializable(op.input),
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: {
              // request - convert data before sending to the tRPC server
              serialize: (data) => data,
              // response - convert the tRPC response before using it in client
              deserialize: superjson.deserialize,
            },
          }),
          false: httpBatchLink({
            transformer: superjson,
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
