import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// all cart api
async function getAllCart() {
  const res = await fetch("/api/cart");

  if (!res.ok) throw new Error("Failed to get cart");
  const cart = await res.json();
  return cart;
}

// add to cart api
async function addToCart(mealId: { meal_id: string | number; quantity: number }) {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(mealId),
  });

  if (!res.ok) return { error: "Failed to add to cart" };
  const newCart = await res.json();
  return newCart;
}

// delete from cart api
async function deleteFromCart(mealId: string) {
  const res = await fetch(`/api/cart/items/${mealId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to delete from cart");
  const newCart = await res.json();
  return newCart;
}

// update cart api
async function updateCart(mealId: string, quantity: number) {
  const res = await fetch(`/api/cart/items/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
  const newCart = await res.json();
  return newCart;
}

// clear cart api
async function clearCart() {
  const res = await fetch("/api/cart/clear", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to clear cart");
  const newCart = await res.json();
  return newCart;
}

///////////////////////
// carts hooks ////////
///////////////////////

// use all cart api
export function useAllCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getAllCart,
  });
}

// use add to cart api
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// use delete from cart api
export function useDeleteFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// use update cart api
export function useUpdateCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mealId, quantity }: { mealId: string; quantity: number }) =>
      updateCart(mealId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// use clear cart api
export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}