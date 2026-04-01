import Container from "../common/Container";
import { Meal } from "@/lib/types";

// Product images
import Head from "@/components/common/Head";
import { CardProductA } from "../common/CardProduct";
import { useState } from "react";
import { useMeals } from "@/hooks/meals/useMeals";

// Main component
export default function NewProduct() {
  const [category, setCategory] = useState<string>("");
  const { data: meals, isLoading } = useMeals();

  // Get unique categories from meals data
  const categories: string[] = meals?.meals
    ? ([
        ...new Set(
          meals.meals
            .map((product: Meal) => product.category?.name)
            .filter(Boolean),
        ),
      ] as string[])
    : [];

  // Filter products by category + "new" logic (high rating or recent-like filter)
  const data = category
    ? meals?.meals?.filter(
        (product: Meal) => product.category?.name === category,
      )
    : meals?.meals;

  return (
    <Container className="flex flex-col gap-4 mt-9 md:mt-16 lg:mt-24">
      <Head title="New Product" />

      <div className="hidden sm:flex justify-end content-stretch flex-col items-end relative shrink-0 w-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between not-italic p-[5px] relative shrink-0 text-[18px] w-auto gap-4">
          <button
            onClick={() => setCategory("")}
            className={`block cursor-pointer relative shrink-0 text-[#888] ${category === "" && "text-[#014162]"} text-left whitespace-nowrap`}
          >
            All
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`block cursor-pointer relative shrink-0 text-[#888] ${category === cat && "text-[#014162]"} text-left whitespace-nowrap`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center flex-wrap">
        {data
          ?.filter(
            (product: Meal) =>
              !product?.title?.toLowerCase().includes("marwa") &&
              !product?.brand?.toLowerCase().includes("marwa") &&
              !product?.vendor?.toLowerCase().includes("marwa") &&
              !product?.title?.toLowerCase().includes("chocolate") &&
              !product?.title?.toLowerCase().includes("choclate"),
          )
          .slice(0, 8)
          .map((product: Meal) => (
            <CardProductA
              key={product.id}
              title={product.title.replace(/Choclate/g, "Chocolate")}
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
