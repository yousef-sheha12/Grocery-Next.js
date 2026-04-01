"use client";

import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import DeliveryDetails from "./_components/DeliveryDetails";
import Container from "@/components/common/Container";
import SlideProduct from "@/components/common/SlideProduct";
import { useMeals } from "@/hooks/meals/useMeals";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import PageTitel from "../checkout/components/PageTitel";
export default function CartPage() {
  const { data: meals } = useMeals();

  const items = useCartStore((state) => state.items);

  return (
    <Container className="pt-12 pb-24">
      <PageTitel track="Home /" current_page="Cart" />

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Shopping Cart
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="hidden sm:grid sm:grid-cols-12 py-4 px-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="divide-y top-0 divide-zinc-200 dark:divide-zinc-800 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {items.length === 0 ? (
                <div className="text-center w-full h-full py-20 rounded-3xl backdrop-blur-sm">
                  <div className="bg-white size-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ShoppingCart className="size-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Your cart collection is empty
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Start Shopping and add some products to cart.
                  </p>
                  <Link href={"/shop"}>
                    <Button
                      variant="outline"
                      className="cursor-pointer mt-6 border-gray-200 hover:bg-white rounded-xl font-bold"
                    >
                      Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                items.map((product: any) => (
                  <CartItem key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 flex flex-col gap-6">
          <DeliveryDetails />
          <CartSummary />
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            More To Explore
          </h2>
        </div>
        <SlideProduct meals={meals} />
      </div>
    </Container>
  );
}
