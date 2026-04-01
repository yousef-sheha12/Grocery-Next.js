"use client";
import { Trash2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import noImage from "@/assets/no-image.jpg";
import { useCartStore } from "@/lib/cartStore";
import { useDeleteFromCart } from "@/hooks/cart/useCart";

interface CartItemProps {
  product: any;
}

export default function CartItem({ product }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { mutate: deleteCartItem, isPending: isDeleting } = useDeleteFromCart();

  const increment = () => {
    console.log("Increment meal ID:", product?.meal?.id);
    const newQuantity = product.quantity + 1;
    if ((product?.meal?.stock_quantity ?? 100) >= newQuantity) {
      updateQuantity(product.meal.id, newQuantity);
    }
  };

  const decrement = () => {
    console.log("Decrement meal ID:", product?.meal?.id);
    if (product.quantity > 1) {
      updateQuantity(product.meal.id, product.quantity - 1);
    } else {
      // Delete item when quantity = 1
      removeItem(product.meal.id);
      deleteCartItem(String(product.meal.id));
    }
  };

  const handleDelete = () => {
    console.log("Delete meal ID:", product?.meal?.id);
    removeItem(product.meal.id);
    toast.success("Item removed from cart");
  };

  return (
    <div className="group grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
      <div className="sm:col-span-6 flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden shrink-0 flex items-center justify-center p-2">
          <Image
            src={product?.meal.image_url || noImage}
            alt={product?.meal.title}
            width={72}
            height={72}
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
            {product?.meal.title}
          </h3>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            £ {product?.unit_price.toFixed(2)}
          </span>
          <div className="mt-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                product?.meal.in_stock
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
              }`}
            >
              {product?.meal.in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      <div className="sm:col-span-3 flex flex-col items-center justify-between sm:justify-center mt-2 sm:mt-0">
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm h-9">
          <button
            onClick={decrement}
            className="flex items-center justify-center w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-l-lg h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {product.quantity}
          </span>
          <button
            onClick={increment}
            className="flex items-center justify-center w-8 text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-r-lg h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 hidden sm:block">
          £ {product?.subtotal.toFixed(2)}
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
