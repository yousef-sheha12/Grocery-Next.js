import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/lib/types";

// all orders api
async function getAllOrders() {
  const res = await fetch("/api/order");

  if (!res.ok) throw new Error("Failed to get orders");
  const orders = await res.json();
  return orders;
}
// add order api
async function addOrder(order: Partial<Order>) {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Failed to add order");
  const newOrder = await res.json();
  return newOrder;
}

// track order api
async function trackOrder() {
  const res = await fetch(`/api/orders/track`);

  if (!res.ok) throw new Error("Failed to track order");
  const order = await res.json();
  return order;
}

// order details api
async function getOrderDetails(id: string) {
  const res = await fetch(`/api/order/${id}`);

  if (!res.ok) throw new Error("Failed to get order details");
  const orderDetails = await res.json();
  return orderDetails;
}

////////////////////////////////
// orders hooks ////////////////
///////////////////////////////

// all orders hook
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
}

// add order hook
export function useAddOrder() {
  return useMutation({
    mutationFn: addOrder,
  });
}

// track order hook
export function useTrackOrder() {
  return useQuery({
    queryKey: ["track-order"],
    queryFn: trackOrder,
  });
}

// order details hook
export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getOrderDetails(id),
  });
}
