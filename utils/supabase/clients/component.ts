/**
 * This file defines the Supabase client that is used on
 * the *client side* of the application (for example,
 * from within Client Components).
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export function createSupabaseComponentClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return supabase;
}

/**
 * Hook that creates the browser Supabase client once per component, so that
 * effects which depend on it (such as Realtime subscriptions) do not
 * resubscribe on every render.
 */
export function useSupabase() {
  const [supabase] = useState(createSupabaseComponentClient);
  return supabase;
}
