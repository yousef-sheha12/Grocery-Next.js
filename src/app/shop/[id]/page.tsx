"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, ClockFading } from "lucide-react";
import Image from "next/image";
import { useMealById } from "@/hooks/meals/useMeals";
import { useCartStore } from "@/lib/cartStore";
import { useAddToCart } from "@/hooks/cart/useCart";
import PageTitel from "@/app/checkout/components/PageTitel";
import Container from "@/components/common/Container";
import toast from "react-hot-toast";

// Import images
import noImage from "@/assets/no-image.jpg";
import { useParams } from "next/navigation";
import Slides from "./_components/Slides";

const reviews = [
  {
    name: "Alaa Bassel",
    rating: 5,
    date: "9th of December 2025",
    comment: "Super fresh and flavorful-arrived perfectly ripe.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Sama Ahmed",
    rating: 4,
    date: "1st of November 2025",
    comment: "Great for juicing, very sweet and clean.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Jana Emad",
    rating: 5,
    date: "20th Of July 2024",
    comment: "Consistent quality every time, highly recommend.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export default function App() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [imgSrc, setImgSrc] = useState<string>(noImage.src);

  const proms = useParams().id;

  const { data: meal, isLoading } = useMealById(proms);

  const addItem = useCartStore((state) => state.addItem);
  const { mutate: addToCartMutate, isPending } = useAddToCart();

  // Update image source when meal data changes
  useEffect(() => {
    if (meal?.data?.image_url) {
      setImgSrc(meal.data.image_url);
    } else {
      setImgSrc(noImage.src);
    }
  }, [meal?.data?.image_url]);

  const discount =
    ((meal?.data?.price - meal?.data?.discount_price) / meal?.data?.price) *
    100;

  if (isLoading) {
    return (
      <div className="min-h-screen py-6 md:py-8">
        <Container>
          <PageTitel track="Home / Shop /" current_page="Product" />
        </Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#014162]/30 border-t-[#014162] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-8">
      <Container>
        <PageTitel
          track="Home / Shop /"
          current_page={meal?.data?.title || "Product"}
        />
      </Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 mt-4">
        {/* Product Section */}
        <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 bg-white p-5 md:p-8 rounded-lg mb-8">
          {/* Left: Product Image */}
          <div className="w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-[linear-gradient(to_top,#01416280,#014162CC_80%)] text-white text-[10px] font-semibold rounded-tl-lg rounded-br-lg shadow-sm tracking-wide">
                  {meal?.data?.in_stock ? "In Stock" : "Out Stock"}
                </span>
                {meal?.data?.has_offer && (
                  <span className="px-2.5 py-1 bg-[linear-gradient(to_top,#01416280,#014162CC_80%)] text-white text-[10px] font-semibold rounded-tl-lg rounded-br-lg shadow-sm tracking-wide">
                    Save {discount.toFixed()}%
                  </span>
                )}
              </div>
              <div className="rounded-lg relative w-full max-w-xs mx-auto md:max-w-none md:w-[300px] lg:w-[420px] aspect-square overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={meal?.data?.title || "Product image"}
                  className="w-full h-full object-cover"
                  fill
                  onError={() => setImgSrc(noImage.src)}
                />
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#014162] mb-4">
              {meal?.data?.title?.replace(/Choclate/g, "Chocolate")}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span className="line-through">£ {meal?.data?.price}</span>
              <span>|</span>
              <span>{meal?.data?.size}</span>
            </div>
            <p className="text-2xl sm:text-3xl mb-6">
              £ {meal?.data?.final_price}
            </p>

            <div className="bg-gray-200 inline-flex items-center gap-2 px-4 py-2 rounded mb-8">
              <ClockFading className="w-5 h-5" />
              <span>Priority Delivery Available</span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg h-12 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer h-12 w-12 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  <span className="text-xl font-medium">−</span>
                </button>
                <span className="w-16 text-center font-semibold text-lg select-none">
                  {quantity}
                </span>
                <button
                  disabled={(meal?.data?.stock_quantity || 0) < quantity + 1}
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer h-12 w-12 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={(meal?.data?.stock_quantity || 0) < 1 || isPending}
                onClick={() => {
                  if (meal?.data?.id) {
                    const parsedPrice = Number(meal.data.final_price || meal.data.price);
                    const cartItem = {
                      id: Date.now().toString(),
                      meal: {
                        id: meal.data.id,
                        title: meal.data.title,
                        image_url: meal.data.image_url,
                        stock_quantity: meal.data.stock_quantity,
                        in_stock: meal.data.in_stock,
                        unit_price: parsedPrice,
                      },
                      quantity: quantity,
                      unit_price: parsedPrice,
                    };

                    // Optimistically add locally
                    addItem(cartItem);
                    toast.success("Added to cart!");

                    addToCartMutate(
                      { meal_id: meal.data.id, quantity },
                      {
                        onError: (err) => {
                          console.error("Backend error ignored for optimistic UI:", err);
                        },
                      },
                    );
                  }
                }}
                className="cursor-pointer bg-[#014162] text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#014162]/80 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
              >
                <ShoppingCart className="w-5 h-5" />
                {isPending
                  ? "Adding..."
                  : (meal?.data?.stock_quantity || 0) < 1
                    ? "Out of Stock"
                    : "Add To Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white p-5 md:p-8 rounded-lg">
          <div className="flex flex-wrap gap-2 mb-8 border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`cursor-pointer px-6 py-2 rounded-t-lg ${
                activeTab === "description"
                  ? "bg-[#014162] text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`cursor-pointer px-6 py-2 rounded-t-lg ${
                activeTab === "reviews"
                  ? "bg-[#014162] text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`cursor-pointer px-6 py-2 rounded-t-lg ${
                activeTab === "nutrition"
                  ? "bg-[#014162] text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Nutritional Facts
            </button>
          </div>

          {/* Reviews Content */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1">{review.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-gray-400">({review.rating}/5)</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Reviewed in {review.date}
                    </p>
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Description Content */}
          {activeTab === "description" && (
            <div className="space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-semibold text-[#014162] mb-3">
                  About This Product
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {meal?.data?.description}
                </p>
              </div>

              {/* Features */}
              {meal?.data?.features && (
                <div>
                  <h3 className="text-lg font-semibold text-[#014162] mb-3">
                    Key Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meal?.data?.features
                      ?.split(",")
                      .map((f: string, i: number) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 bg-[#014162]/10 text-[#014162] text-sm font-medium rounded-full border border-[#014162]/20"
                        >
                          {f.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Brand", value: meal?.data?.brand },
                  { label: "Size / Weight", value: meal?.data?.size },
                  { label: "Includes", value: meal?.data?.includes },
                  {
                    label: "Category",
                    value: meal?.data?.category?.name,
                  },
                  {
                    label: "Subcategory",
                    value: meal?.data?.subcategory?.name,
                  },
                  {
                    label: "Expiry Date",
                    value: meal?.data?.expiry_date
                      ? new Date(meal?.data?.expiry_date).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" },
                        )
                      : undefined,
                  },
                ]
                  .filter((item) => item.value)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-gray-700 font-medium">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* How to Use */}
              {meal?.data?.how_to_use && (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    🍽️ How to Use
                  </h3>
                  <p className="text-amber-700 leading-relaxed">
                    {meal?.data?.how_to_use}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Nutritional Facts Content */}
          {activeTab === "nutrition" && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ── Left: Stats Card ── */}
              <div className="shrink-0 w-full lg:w-72">
                <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                  {/* Header */}
                  <div className="bg-linear-to-br from-[#014162] to-[#026a9e] px-5 py-6 text-white">
                    <p className="text-xs uppercase tracking-widest font-semibold text-white/60 mb-1">
                      Product Facts
                    </p>
                    <h3 className="text-xl font-extrabold leading-tight">
                      {meal?.data?.title?.replace(/Choclate/g, "Chocolate") ??
                        "—"}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Serving size:{" "}
                      <span className="text-white font-medium">
                        {meal?.data?.title?.replace(/Choclate/g, "Chocolate") ||
                          "Product"}
                      </span>
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="bg-white px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Customer Rating
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="font-bold text-gray-800">
                          {meal?.data?.rating ?? "—"}
                        </span>
                        <span className="text-gray-400 text-xs">/ 5</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-yellow-400 h-1.5 rounded-full"
                        style={{
                          width: `${((meal?.data?.rating ?? 0) / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {meal?.data?.rating_count ?? 0} verified reviews
                    </p>
                  </div>

                  {/* Stat rows */}
                  {[
                    {
                      label: "Units Sold",
                      value: meal?.data?.sold_count ?? "—",
                      icon: "📦",
                      color: "text-gray-800",
                    },
                    {
                      label: "Stock Quantity",
                      value: meal?.data?.stock_quantity ?? "—",
                      icon: "🏪",
                      color: "text-gray-800",
                    },
                    {
                      label: "Availability",
                      value: meal?.data?.in_stock ? "In Stock" : "Out of Stock",
                      icon: meal?.data?.in_stock ? "✅" : "❌",
                      color: meal?.data?.in_stock
                        ? "text-green-600"
                        : "text-red-500",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{row.icon}</span>
                        <span className="text-sm text-gray-500">
                          {row.label}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${row.color}`}>
                        {String(row.value)}
                      </span>
                    </div>
                  ))}

                  {/* Offer block */}
                  {meal?.data?.has_offer && (
                    <div className="px-5 py-4 bg-emerald-50 border-t border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          Active Offer
                        </span>
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {meal?.data?.offer_title}
                        </span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-extrabold text-emerald-700">
                          £{meal?.data?.final_price}
                        </span>
                        <span className="text-sm text-gray-400 line-through mb-0.5">
                          £{meal?.data?.price}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Highlights + Instructions ── */}
              <div className="flex-1 space-y-5">
                <h2 className="text-xl font-semibold text-[#014162]">
                  Product Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      icon: "🏷️",
                      label: "Brand",
                      value: meal?.data?.brand,
                      bg: "bg-blue-50",
                      border: "border-blue-100",
                      iconBg: "bg-blue-100",
                    },
                    {
                      icon: "📦",
                      label: "Package Includes",
                      value: meal?.data?.includes,
                      bg: "bg-violet-50",
                      border: "border-violet-100",
                      iconBg: "bg-violet-100",
                    },
                    {
                      icon: "📅",
                      label: "Best Before",
                      value: meal?.data?.expiry_date
                        ? new Date(meal?.data?.expiry_date).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : undefined,
                      bg: "bg-orange-50",
                      border: "border-orange-100",
                      iconBg: "bg-orange-100",
                    },
                    {
                      icon: "🌿",
                      label: "Key Features",
                      value: meal?.data?.features,
                      bg: "bg-green-50",
                      border: "border-green-100",
                      iconBg: "bg-green-100",
                    },
                    {
                      icon: "🗂️",
                      label: "Category",
                      value: meal?.data?.category?.name,
                      bg: "bg-gray-50",
                      border: "border-gray-100",
                      iconBg: "bg-gray-100",
                    },
                    {
                      icon: "⚖️",
                      label: "Size / Weight",
                      value: meal?.data?.size,
                      bg: "bg-cyan-50",
                      border: "border-cyan-100",
                      iconBg: "bg-cyan-100",
                    },
                  ]
                    .filter((item) => item.value)
                    .map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-4 ${item.bg} border ${item.border} rounded-2xl`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center text-lg shrink-0`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">
                            {item.label}
                          </p>
                          <p className="text-gray-700 font-medium text-sm mt-0.5 wrap-break-word">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Preparation Instructions */}
                {meal?.data?.how_to_use && (
                  <div className="p-5 bg-linear-to-r from-[#014162]/5 to-[#014162]/10 border border-[#014162]/15 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🍽️</span>
                      <h3 className="text-base font-semibold text-[#014162]">
                        Preparation Instructions
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {meal?.data?.how_to_use}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Slides */}
        <Slides category="Frequently Bought Together" />
        <Slides category="More To Explore" />
      </div>
    </div>
  );
}
