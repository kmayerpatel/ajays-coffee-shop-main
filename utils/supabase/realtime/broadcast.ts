import { RealtimeChannel } from "@supabase/supabase-js";
import { Order } from "../../../server/models/order";

export const broadcastOrderReady = (channel: RealtimeChannel, order: Order) =>
  channel.send({
    type: "broadcast",
    event: "orderReadyAnnouncement",
    payload: { message: order.id },
  });