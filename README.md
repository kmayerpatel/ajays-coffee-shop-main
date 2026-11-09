# Ajay's Coffee Shop

A small example [Next.js](https://nextjs.org) app that uses [Supabase Realtime](https://supabase.com/docs/guides/realtime) for live updates, [tRPC](https://trpc.io) for type-safe APIs, and [Drizzle ORM](https://orm.drizzle.team) for database access.

- **`/`** - customers browse the menu and place orders. They receive a toast when the cashier announces their order is ready (Realtime *broadcast*).
- **`/cashier`** - staff see new orders appear live as they are inserted (Realtime *Postgres changes*), fulfill them, and announce them.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Supabase values.
2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer view and [http://localhost:3000/cashier](http://localhost:3000/cashier) for the cashier view.

## Project Structure

This project uses the Next.js **App Router**.

| Path | Purpose |
| --- | --- |
| `app/layout.tsx` | Root layout: `<html>`, header, tRPC/React Query provider, toaster |
| `app/page.tsx`, `app/order-menu.tsx` | Home page (Server Component) and its interactive menu (Client Component) |
| `app/cashier/page.tsx`, `app/cashier/cashier-view.tsx` | Cashier page and its live order list |
| `app/api/trpc/[trpc]/route.ts` | Route handler that serves the tRPC API |
| `server/api/` | tRPC context, procedures, and routers |
| `server/db/schema.ts` | Drizzle table definitions |
| `server/db/relations.ts` | Drizzle relations (`defineRelations`) used by `db.query` |
| `utils/trpc/client.tsx` | `TRPCReactProvider` and the `useTRPC()` hook for Client Components |
| `utils/trpc/server.tsx` | `trpc` + `HydrateClient` for prefetching in Server Components |
| `utils/supabase/clients/` | Supabase clients for the browser (`component.ts`) and server (`server.ts`) |

### Calling the API

In a Client Component, get the tRPC proxy with `useTRPC()` and pass its options to TanStack Query's hooks:

```tsx
const trpc = useTRPC();
const { data: coffee } = useQuery(trpc.coffee.getCoffee.queryOptions());
const { mutate: placeOrder } = useMutation(trpc.orders.placeOrder.mutationOptions());
```

In a Server Component, prefetch data so it is already in the initial HTML:

```tsx
await getQueryClient().prefetchQuery(trpc.coffee.getCoffee.queryOptions());
return (
  <HydrateClient>
    <OrderMenu />
  </HydrateClient>
);
```

### Querying with Drizzle 1.0

Relational queries use plain objects for filtering and ordering:

```ts
await db.query.ordersTable.findMany({
  with: { coffee: { columns: { name: true } } },
  where: { fulfilled: false },
  orderBy: { id: "asc" },
});
```

## Learn More

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [tRPC with the Next.js App Router](https://trpc.io/docs/client/nextjs/app-router-setup)
- [Drizzle relational queries](https://orm.drizzle.team/docs/rqb-v2)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
