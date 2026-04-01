"use client";

import { useRef } from "react";
import { CardProductC } from "@/components/common/CardProduct";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Meal } from "@/lib/types";

export default function SlideProduct({ meals }: { meals: { meals: Meal[] } }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approx card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredMeals =
    meals?.meals
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
      }) || [];

  const hasEnoughItems = filteredMeals.length >= 4;

  return (
    <section className="mb-12 relative group/section">
      <div className="relative flex items-center gap-2 md:gap-4 lg:gap-6">
        {/* Left Arrow - Absolute Positioned */}
        {hasEnoughItems && (
          <button
            onClick={() => scroll("left")}
            className="-left-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-[#083C5A] w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md border border-slate-100 hidden md:flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide scroll-smooth"
        >
          {filteredMeals.map((meal: Meal) => {
            const discount =
              ((meal.price - (meal.discount_price || 0)) / meal.price) * 100;
            return (
              <div key={meal.id} className="min-w-full sm:min-w-[304px] h-full">
                <CardProductC
                  product={{
                    link: String(meal.id),
                    title: meal.title.replace(/Choclate/g, "Chocolate"),
                    image: meal.image_url,
                    price: meal.final_price ?? 0,
                    originalPrice: meal.price ?? 0,
                    rating: meal.rating ?? 0,
                    discount: discount.toFixed(),
                    inStock: meal.in_stock,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow - Absolute Positioned */}
        {hasEnoughItems && (
          <button
            onClick={() => scroll("right")}
            className="bg-white hover:bg-slate-50 text-[#083C5A] w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md border border-slate-100 hidden md:flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </section>
  );
}
