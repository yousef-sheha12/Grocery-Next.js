"use client";

import { useRef } from "react";
import { CardProductC } from "@/components/common/CardProduct";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMeals } from "@/hooks/meals/useMeals";

export default function Slides({ category }: any) {
  const { data: meals } = useMeals();

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

  return (
    <section className="mb-12 relative group/section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {category}
        </h2>
      </div>

      <div className="relative flex items-center gap-2 md:gap-4 lg:gap-6">
        {/* Left Arrow - Absolute Positioned */}
        <button
          onClick={() => scroll("left")}
          className="-left-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 text-[#083C5A] w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md border border-slate-100 hidden md:flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide scroll-smooth"
        >
          {meals?.meals
            ?.filter((meal: any) => {
              const title = meal.title?.toLowerCase() || "";
              return !title.includes("marwa") && !title.includes("choclate");
            })
            ?.sort((a: any, b: any) => {
              const aIsChocolate = a.title?.toLowerCase().includes("choclate");
              const bIsChocolate = b.title?.toLowerCase().includes("choclate");
              if (aIsChocolate && !bIsChocolate) return 1;
              if (!aIsChocolate && bIsChocolate) return -1;
              return 0;
            })
            ?.map((meal: any) => {
              return (
                <div
                  key={meal.id}
                  className="min-w-[calc(25%-1.125rem)] h-full"
                >
                  <CardProductC
                    product={{
                      link: meal.id,
                      title: meal.title,
                      image: meal.image_url,
                      price: meal.price,
                      originalPrice: meal.price,
                      rating: meal.rating,
                      discount: meal.has_offer,
                      inStock: meal.in_stock,
                    }}
                  />
                </div>
              );
            })}
        </div>

        {/* Right Arrow - Absolute Positioned */}
        <button
          onClick={() => scroll("right")}
          className="bg-white hover:bg-slate-50 text-[#083C5A] w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md border border-slate-100 hidden md:flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
