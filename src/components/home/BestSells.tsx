"use client";

import Container from "../common/Container";
import Head from "@/components/common/Head";
import { CardProductA } from "../common/CardProduct";
import { Meal } from "@/lib/types";
import { useMeals } from "@/hooks/meals/useMeals";

// Main component
export default function BestSells() {
  const { data: meals } = useMeals();

  return (
    <Container className="flex flex-col gap-4">
      <Head title="Daily Best Sells" />

      <div className="flex gap-5 items-center justify-center flex-wrap">
        {meals?.meals
          ?.slice(0, 8)
          .sort((a: Meal, b: Meal) => (b.rating || 0) - (a.rating || 0))
          ?.filter(
            (product: Meal) =>
              !product?.title?.toLowerCase().includes("marwa") &&
              !product?.brand?.toLowerCase().includes("marwa") &&
              !product?.vendor?.toLowerCase().includes("marwa") &&
              !product?.title?.toLowerCase().includes("chocolate") &&
              !product?.title?.toLowerCase().includes("choclate"),
          )
          .map((product: Meal) => (
            <CardProductA
              key={product.id}
              title={product.title}
              image_url={product.image_url || ""}
              category={product.category?.name || ""}
              rating={product.rating}
              rating_count={product.rating_count}
              brand={product.brand || ""}
              price={product.price}
              final_price={product.discount_price}
              link={String(product.id)}
              in_stock={!!product.in_stock || !!product.stock_quantity}
            />
          ))}
      </div>
    </Container>
  );
}
