"use client";

import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, Star } from "lucide-react";
import { useState, useEffect } from "react";
import noImage from "@/assets/no-image.jpg";
import Link from "next/link";
import { useAddToCart } from "@/hooks/cart/useCart";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cartStore";

// Helper to validate and fix image URLs
function getValidImageUrl(url: string | null | undefined): string {
  if (!url) return noImage.src;
  
  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path starting with /, prepend the base URL
  if (url.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`;
  }
  
  // Otherwise assume it's a relative path without /
  return `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${url}`;
}

export interface CardProductAProps {
  title: string;
  image_url?: string;
  category?: string;
  rating?: number;
  rating_count?: number;
  brand?: string;
  price: number;
  final_price?: number;
  link: string;
  in_stock: boolean;
}

export function CardProductA({
  title,
  image_url,
  category,
  rating,
  rating_count,
  brand,
  price,
  final_price,
  link,
  in_stock,
}: CardProductAProps) {
  const { mutate } = useAddToCart();
  const addItem = useCartStore((state) => state.addItem);
  const [imgSrc, setImgSrc] = useState(getValidImageUrl(image_url || ""));

  useEffect(() => {
    setImgSrc(getValidImageUrl(image_url));
  }, [image_url]);

  return (
    <div className="bg-white w-full sm:w-[225px] flex flex-col h-full items-start border border-slate-200 hover:border-[#014162]/30 hover:shadow-xl transition-all duration-300 p-4 relative rounded-xl group">

      <div className="relative w-full h-[180px] bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center p-4 mb-4 transition-transform duration-500 group-hover:scale-[1.03]">
        <Image
          alt={title || "Product image"}
          className="object-contain"
          src={imgSrc}
          fill
          sizes="(max-width: 768px) 100vw, 260px"
          onError={() => setImgSrc(noImage.src)}
        />
      </div>

      <div className="flex flex-col flex-1 w-full gap-3">
        <div className="flex flex-col w-full flex-1">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1 truncate">
            {category}
          </p>
          <Link
            href={`/shop/${link}`}
            className="text-[#253d4e] text-lg font-bold leading-snug truncate hover:text-[#014162] transition-colors"
          >
            {title}
          </Link>
        </div>

        <div className="flex flex-col gap-1.5 w-full my-1">
          {/* rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  size={14}
                  stroke={i < rating ? "#FDC040" : "#D4D4D4"}
                  fill={i < rating ? "#FDC040" : "#D4D4D4"}
                  key={i}
                />
              ))}
            </div>
            <p className="font-medium text-slate-400 text-xs">
              ({rating_count || 0})
            </p>
          </div>

          {/* vendor */}
          <p className="font-medium text-slate-400 text-xs">
            By <span className="text-[#014162]">{brand}</span>
          </p>
        </div>

        {/* price and add to cart */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 leading-[1.1]">
            <p className="font-bold text-[#014162] text-lg">
              £ {(final_price && final_price !== 0) ? final_price : (price && price !== 0 ? price : "")}
            </p>
            {final_price && price && price !== 0 && price !== final_price && !title?.includes("Hot Chocolate") && (
              <p className="font-medium line-through text-slate-400 text-xs">
                £ {price}
              </p>
            )}
          </div>
          <button
            disabled={!in_stock}
            onClick={() => {
              const parsedPrice = Number((final_price && final_price !== 0) ? final_price : price);
              const cartItem = {
                id: Date.now().toString(),
                meal: {
                  id: link,
                  title: title,
                  image_url: image_url,
                  stock_quantity: 100,
                  in_stock: in_stock,
                  unit_price: parsedPrice,
                },
                quantity: 1,
                unit_price: parsedPrice,
              };
              // Optimistically add locally so the user isn't blocked by backend errors
              addItem(cartItem);
              toast.success("Added to cart!");

              mutate(
                { meal_id: link, quantity: 1 },
                {
                  onError: (err) => {
                    console.error("Backend error ignored for optimistic UI:", err);
                  },
                }
              );
            }}
            className={`${in_stock ? "cursor-pointer bg-[#083C5A] hover:bg-[#062d44] text-white" : "cursor-not-allowed bg-slate-200 text-slate-400"} flex shrink-0 items-center gap-1.5 justify-center transition-all duration-300 h-9 px-4 relative rounded-lg font-semibold text-sm ${!in_stock ? "opacity-50" : ""}`}
          >
            <ShoppingCart size={16} />
            <span>{in_stock ? "Add" : "Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export interface CardProductCProps {
  title: string;
  image?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  inStock?: boolean;
  discount?: string | number;
  isOffer?: boolean;
  link: string;
  stock_quantity?: number;
}

export function CardProductC({ product }: { product: CardProductCProps }) {
  const {
    title,
    image,
    price,
    originalPrice,
    rating = 5,
    inStock,
    discount,
    isOffer,
    link,
    stock_quantity,
  } = product;
  const [quantity, setQuantity] = useState(1);

  const { mutate , isPending } = useAddToCart();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-white rounded-2xl min-h-[426px] p-4 border border-slate-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">

      {/* Badges Container */}
      <div className="flex gap-1.5 items-start">
        {!inStock && (
          <span className="px-2.5 py-1 bg-[linear-gradient(to_top,#01416280,#014162CC_80%)] text-white text-[10px] font-semibold rounded-tl-lg rounded-br-lg shadow-sm tracking-wide">
            Out of Stock
          </span>
        )}
        {isOffer && (
          <span className="px-2.5 py-1 bg-[linear-gradient(to_top,#01416280,#014162CC_80%)] text-white text-[10px] font-semibold rounded-tl-lg rounded-br-lg shadow-sm tracking-wide">
            Save {discount}%
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-[200px] my-1 mb-4 flex items-center justify-center p-2">
        <Image
          src={getValidImageUrl(image)}
          alt={title || "no image"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Title & Price Row */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link
            href={`/shop/${link}`}
            className="text-xl font-medium text-slate-800 leading-tight line-clamp-2"
          >
            {title}
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xl font-bold text-slate-900">
              £ {(price && price !== 0) ? price : ""}
            </span>
            {originalPrice && originalPrice !== 0 && originalPrice !== price && (
              <span className="text-sm text-slate-400 line-through font-medium">
                £ {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                size={16}
                key={index}
                stroke={index < (rating || 0) ? "#FDC040" : "#D4D4D4"}
                fill={index < (rating || 0) ? "#FDC040" : "#D4D4D4"}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium pt-0.5">
            ({rating}/5)
          </span>
        </div>

        {/* Actions Row */}
        <div className="mt-auto flex items-center gap-3">
          <button
            disabled={!inStock || quantity === 0 || isPending}
            onClick={() => {
              const parsedPrice = Number((price && price !== 0) ? price : originalPrice);
              const cartItem = {
                id: Date.now().toString(),
                meal: {
                  id: link,
                  title: title,
                  image_url: image,
                  stock_quantity: stock_quantity,
                  in_stock: inStock,
                  unit_price: parsedPrice,
                },
                quantity: quantity,
                unit_price: parsedPrice,
              };
              // Optimistically add locally
              addItem(cartItem);
              toast.success("Added to cart!");
              setQuantity(1);

              mutate(
                { meal_id: link, quantity: quantity },
                {
                  onError: (err) => {
                    console.error("Backend error ignored for optimistic UI:", err);
                  },
                }
              );
            }}
            className={`flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl shadow-sm transition-all duration-200 ${
              inStock && quantity > 0 && !isPending
                ? "bg-[#083C5A] text-white hover:bg-[#062d44] active:scale-95 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={18} strokeWidth={2.5} />
            )}
            <span className="font-semibold text-sm">
              {!inStock ? "Out of Stock" : isPending ? "Adding..." : "Add To Cart"}
            </span>
          </button>

          <div className="flex items-center border border-slate-300 rounded-xl h-[44px] bg-white px-1">
            <button
              disabled={inStock === false}
              onClick={() => {
                if (inStock === true) {
                  setQuantity(quantity - 1);
                } else {
                  return;
                }
              }}
              className={`cursor-pointer w-8 h-full flex items-center ${quantity === 0 && "hidden"} justify-center text-slate-500 hover:text-[#083C5A] transition-colors`}
            >
              {quantity === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
            </button>

            <span className="min-w-[20px] text-center font-bold text-slate-900 text-sm">
              {quantity}
            </span>

            <button
              disabled={!inStock || quantity >= stock_quantity}
              onClick={() => {
                if (inStock) {
                  setQuantity(quantity + 1);
                }
              }}
              className={`w-8 h-full flex items-center justify-center transition-colors ${
                inStock
                  ? "cursor-pointer text-slate-500 hover:text-[#083C5A]"
                  : "cursor-not-allowed text-slate-300"
              }`}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
