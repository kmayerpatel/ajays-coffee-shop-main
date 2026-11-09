/**
 * This route handler exposes an API endpoint that the client-side tRPC functions use to
 * communicate with the server-side tRPC procedures. Do not modify this file.
 *
 * App Router route handlers use the web-standard `Request` / `Response` objects, so
 * tRPC's fetch adapter is used here instead of the Next.js (Pages Router) adapter.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
