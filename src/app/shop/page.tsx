"use client";

import Image from "next/image";
import heroImg from "@/assets/shopBg.jpg";
import Container from "@/components/common/Container";
import SideFilter from "./_components/SideFilter";
import { CardProductC } from "@/components/common/CardProduct";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSearchMeals } from "@/hooks/categories/useCategories";
import Counter from "./_components/Counter";
import Features from "./_components/Features";
import Link from "next/link";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: searchMeals, isLoading } = useSearchMeals(
    searchParams.toString(),
  );

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-8 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#014162]/30 border-t-[#014162] rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-8 md:py-12">
      <div className="filter flex flex-col md:flex-row items-start justify-between gap-8 py-8 md:py-12">
        <SideFilter />
        <div className="w-full">
          {searchMeals?.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchMeals?.data
                ?.filter(
                  (meal: any) =>
                    !meal?.title?.toLowerCase().includes("marwa") &&
                    !meal?.brand?.toLowerCase().includes("marwa") &&
                    !meal?.vendor?.toLowerCase().includes("marwa"),
                )
                .map((meal: any) => {
                  const discount = 100 - (meal.final_price / meal.price) * 100;
                  return (
                    <CardProductC
                      key={meal.id}
                      product={{
                        title: meal.title,
                        image: meal.image_url,
                        price: meal.final_price,
                        originalPrice: meal.price,
                        rating: meal.rating,
                        discount: discount.toFixed(1),
                        inStock: meal.in_stock,
                        link: meal.id,
                      }}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-xl font-medium">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  router.push("/shop");
                }}
                className="mt-4 text-[#014162] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Counter />
      <Features />
    </Container>
  );
}

export default function ShopPage() {
  return (
    <>
      <div
        className="relative w-full flex justify-between items-center"
        style={{ minHeight: "70vh" }}
      >
        <Image
          src={heroImg}
          alt="hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#08415FC7]"></div>

        <div className="relative w-full text-white pt-[20vh] md:pt-[30vh] pb-12">
          <Container className="flex flex-col md:flex-row items-center md:items-end h-full justify-between gap-6">
            <div className="flex flex-col items-start">
              <p className="md:text-[26px] text-[18px] font-bold uppercase tracking-widest text-white/70">
                /
              </p>
              <h1 className="md:text-[50px] lg:text-[60px] text-[40px] text-[#08ABFF] font-bold">
                Shop
              </h1>
            </div>
            <div className="path font-bold text-sm flex items-center gap-2">
              <Link
                href="/"
                className="text-white/60 md:text-sm text-[18px] hover:text-white transition-colors"
              >
                Home
              </Link>
              <span className="text-[#08ABFF]">/</span>
              <span className="text-[#08ABFF] md:text-sm text-[18px]">
                Shop
              </span>
            </div>
          </Container>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            Loading shop...
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </>
  );
}
