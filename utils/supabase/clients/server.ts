/**
 * This file defines the Supabase client that is used on the *server side*
 * of the application -- in Server Components, Route Handlers (such as the
 * tRPC endpoint), and Server Actions.
 *
 * With the App Router, cookies are read and written through `cookies()`
 * from `next/headers` instead of the `req` / `res` objects that the Pages
 * Router passed to API routes and `getServerSideProps`.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` throws when called from a Server Component, where
            // cookies are read-only. That is safe to ignore as long as
            // sessions are refreshed somewhere that *can* write cookies
            // (a Route Handler, Server Action, or middleware).
          }
        },
      },
    }
  );
}
