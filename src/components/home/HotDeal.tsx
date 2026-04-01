// SVG Paths data

import Container from "../common/Container";

// Product images
import Head from "@/components/common/Head";
import { CardProductA } from "../common/CardProduct";
import { useState } from "react";
import { useMeals } from "@/hooks/meals/useMeals";
import Link from "next/link";
import { Meal } from "@/lib/types";

// Product type definition
type Product = {
  id: number;
  image: any;
  category: string;
  name: string;
  rating: number;
  reviewCount: number;
  vendor: string;
  price: string;
  originalPrice: string;
};

// Main component
export default function HotDeal() {
  const [category, setCategory] = useState<string>("");

  const { data: meals, isLoading } = useMeals();

  // Get unique categories from meals data
  const categories: string[] = meals?.meals
    ? ([
        ...new Set(
          meals.meals.map((meal: Meal) => meal.category?.name).filter(Boolean),
        ),
      ] as string[])
    : [];

  // Filter meals by category
  const data = category
    ? meals?.meals?.filter((meal: Meal) => meal.category?.name === category)
    : meals?.meals;

  return (
    <Container className="flex flex-col gap-4 mt-9 md:mt-16 lg:mt-24">
      <Head title="Hot Deals" />

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
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data
            ?.filter(
              (meal: Meal) =>
                !meal?.title?.toLowerCase().includes("marwa") &&
                !meal?.brand?.toLowerCase().includes("marwa") &&
                !meal?.vendor?.toLowerCase().includes("marwa"),
            )
            .sort((a: Meal, b: Meal) => {
              const aIsChocolate =
                a?.title?.toLowerCase().includes("choclate") ||
                a?.title?.toLowerCase().includes("chocolate");
              const bIsChocolate =
                b?.title?.toLowerCase().includes("choclate") ||
                b?.title?.toLowerCase().includes("chocolate");
              if (aIsChocolate && !bIsChocolate) return 1;
              if (!aIsChocolate && bIsChocolate) return -1;
              return 0;
            })
            .map((meal: Meal, index: number) => (
              <CardProductA
                key={index}
                title={meal.title.replace(/Choclate/g, "Chocolate")}
                image_url={meal.image_url}
                category={meal.category?.name ?? ""}
                rating={meal.rating}
                rating_count={meal.rating_count}
                brand={meal.brand}
                price={meal.price}
                final_price={meal.final_price}
                link={meal.id as string}
                in_stock={meal.in_stock as boolean}
              />
            ))
        )}
      </div>
    </Container>
  );
}
