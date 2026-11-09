"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/utils/supabase/clients/component";
import { milkText } from "@/server/models/coffee";
import { NewOrder, NewOrderModel, Order } from "@/server/models/order";
import { broadcastOrderReady } from "@/utils/supabase/realtime/broadcast";
import { useTRPC } from "@/utils/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Megaphone } from "lucide-react";
import { useCallback, useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useRef } from "react";

export default function CashierView() {
  // Create necessary hooks for clients and providers.
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  const { data: coffee } = useQuery(trpc.coffee.getCoffee.queryOptions());
  const { data: orders } = useQuery(trpc.orders.getOrders.queryOptions());
  const { mutate: fulfillOrder } = useMutation(
    trpc.orders.fulfillOrder.mutationOptions(),
  );

  const announceChannel = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase.channel("order-ready").subscribe();
    announceChannel.current = channel;
    return () => {
      supabase.removeChannel(channel);
      announceChannel.current = null;
    };
  }, [supabase]);

  // `queryKey()` returns a typed key, so `setQueryData` knows the cached
  // value is the output of `orders.getOrders`.
  const addOrderToCache = useCallback(
    (newOrder: NewOrder) => {
      queryClient.setQueryData(trpc.orders.getOrders.queryKey(), (oldData) => {
        const coffeeItem = coffee?.find((c) => c.id === newOrder.coffee_id);
        if (!coffeeItem) return oldData;

        const order: Order = {
          ...newOrder,
          coffee: { name: coffeeItem.name },
        };
        return [...(oldData ?? []), order];
      });
    },
    [queryClient, trpc, coffee],
  );

  const removeOrderFromCache = useCallback(
    (order: Order) => {
      queryClient.setQueryData(trpc.orders.getOrders.queryKey(), (oldData) =>
        (oldData ?? []).filter((o) => o.id !== order.id),
      );
    },
    [queryClient, trpc],
  );

  useEffect(() => {
    const dbChangesChannel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addOrderToCache(NewOrderModel.parse(payload.new));
          }
        },
      )
      .subscribe();

    return () => {
      dbChangesChannel.unsubscribe();
    };
  }, [addOrderToCache, supabase]);

  const onFulfillOrder = async (order: Order) => {
    fulfillOrder({ order });
    removeOrderFromCache(order);
  };

  const onAnnounce = (order: Order) => {
    if (announceChannel.current) {
      void broadcastOrderReady(announceChannel.current, order);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            View all orders that have been placed here.
          </p>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-8">
        {orders &&
          orders.map((order: Order, orderIndex: number) => (
            <div key={order.id} className="flex flex-col w-full h-12 gap-3">
              {orderIndex === 0 && <Separator />}
              <div className="flex flex-row items-center w-full gap-4">
                <p className="font-semibold">Order #{order.id}</p>
                <p className="font-semibold">
                  {order.coffee.name} ({order.type})
                </p>
                <p className="text-muted-foreground">
                  {" "}
                  with{" "}
                  <span className="font-semibold">{milkText(order.milk)}</span>
                </p>
                <div className="flex flex-row gap-4 items-center ml-auto">
                  <p className="text-muted-foreground font-semibold mr-3">
                    {order.name}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => onFulfillOrder(order)}
                  >
                    <Check />
                    Fulfill Order
                  </Button>
                  <Button onClick={() => onAnnounce(order)}>
                    <Megaphone />
                    Announce
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
      </div>
    </div>
  );
}
