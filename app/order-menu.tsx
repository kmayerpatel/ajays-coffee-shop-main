"use client";

import CoffeeCard from "@/components/coffee/coffee-card";
import CoffeeDialog from "@/components/coffee/coffee-dialog";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/utils/supabase/clients/component";
import { Coffee } from "@/server/models/coffee";
import { useTRPC } from "@/utils/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderMenu() {
  const supabase = useSupabase();
  const trpc = useTRPC();

  const { data: coffee } = useQuery(trpc.coffee.getCoffee.queryOptions());

  useEffect(() => {
    const orderChannel = supabase
      .channel("order-ready")
      .on(
        "broadcast",
        { event: "orderReadyAnnouncement" },
        ({ payload }: { payload: { message: string } }) => {
          console.log(payload);
          toast(`Order ${payload.message} is ready for pickup!`, {
            description: "Please pick up your order at the counter.",
          });
        }
      )
      .subscribe();

    return () => {
      orderChannel.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Order Now</h2>
          <p className="text-sm text-muted-foreground">
            Top picks for you. Updated daily.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row flex-wrap gap-8">
        {coffee &&
          coffee.map((coffee: Coffee) => (
            <CoffeeDialog key={coffee.id} coffee={coffee}>
              <CoffeeCard coffee={coffee} />
            </CoffeeDialog>
          ))}
      </div>
    </div>
  );
}
