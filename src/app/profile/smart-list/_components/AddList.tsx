import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addSmartListSchema } from "@/lib/schemas/smartListSchema";
import { useAddSmartList } from "@/hooks/smartList/useSmartList";
import { useSearchMeals } from "@/hooks/categories/useCategories";

export default function AddList({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof addSmartListSchema>>({
    resolver: zodResolver(addSmartListSchema),
    defaultValues: {
      name: "",
      dis: "",
      meal_ids: [],
    },
  });

  const { mutateAsync: addSmartList, isPending } = useAddSmartList();

  const [preview, setPreview] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: meals } = useSearchMeals("");

  useEffect(() => {
    register("image");
  }, [register]);

  const watchMealIds = watch("meal_ids") || [];

  const handleCheckboxChange = (productId: any) => {
    const idAsString = String(productId);
    const currentIds = watchMealIds;
    const newIds = currentIds.includes(idAsString)
      ? currentIds.filter((id) => id !== idAsString)
      : [...currentIds, idAsString];
    setValue("meal_ids", newIds, { shouldValidate: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof addSmartListSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.dis);
    if (data.image) {
      formData.append("image", data.image);
    }
    data.meal_ids.forEach((id, index) => {
      formData.append(`meal_ids[${index}]`, id);
    });

    try {
      await addSmartList(formData as any);
      reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Failed to add smart list:", error);
    }
  };

  const mealsList = meals?.data || [];

  const filteredProducts = mealsList.filter((product: any) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedProducts = mealsList.filter((p: any) =>
    watchMealIds.includes(String(p.id)),
  );

  return (
    <div className="fixed inset-0 bg-[#014162]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#014162]/5 to-transparent -mr-12 -mt-12 rounded-full z-0" />

        <div className="relative z-10 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-extrabold text-[#014162] mb-0.5">
            Create Smart List
          </h2>
          <p className="text-gray-500 text-xs mb-6 font-medium tracking-tight">
            Add details to personalize your new collection
          </p>

          <form
            onSubmit={handleSubmit(onSubmit, (err) =>
              console.log("Validation errors:", err),
            )}
            className="flex flex-col gap-4"
          >
            {/* Name Input */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-[10px] font-bold text-gray-400 ml-1"
              >
                List Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Healthy Breakfast"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-1">
              <label
                htmlFor="description"
                className="text-[10px] font-bold text-gray-400 ml-1"
              >
                Description
              </label>
              <input
                {...register("dis")}
                type="text"
                placeholder="What is this list for?"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
              />
              {errors.dis && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.dis.message}
                </p>
              )}
            </div>

            {/* Image Upload with Preview */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">
                Cover Image
              </label>
              <div className="relative group cursor-pointer h-24 w-24">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />

                <div className="absolute inset-0 w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-gray-100/50 group-hover:border-[#014162]/20 transition-all z-10">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="size-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        Upload photo
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.image.message as string}
                </p>
              )}
            </div>

            {/* Associated Products Dropdown */}
            <div className="relative space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Products
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-left flex items-center justify-between group/select"
              >
                <span
                  className={
                    selectedProducts?.length > 0
                      ? "text-[#0e1112]"
                      : "text-gray-300"
                  }
                >
                  {selectedProducts?.length > 0
                    ? `${selectedProducts?.length} selected`
                    : "Choose products..."}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {/* Search input is now inside the dropdown list container below */}

              {/* Selected items tags */}
              {selectedProducts?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedProducts?.slice(0, 4).map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-[#014162]/5 text-[#014162] text-[9px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1.5 animate-in zoom-in-90"
                    >
                      {product.title}
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(product.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {selectedProducts?.length > 4 && (
                    <span className="text-[9px] font-bold text-gray-400 flex items-center px-1">
                      +{selectedProducts?.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {isDropdownOpen && (
                <div className="mt-2 bg-gray-50/50 rounded-xl border border-gray-100 max-h-48 overflow-y-auto animate-in slide-in-from-top-1 duration-200">
                  <div className="px-2 py-2 sticky top-0 bg-gray-50/50 backdrop-blur-sm z-10">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none"
                    />
                  </div>
                  {filteredProducts?.length > 0 ? (
                    filteredProducts?.map((product: any) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-2.5 py-2 px-3 cursor-pointer hover:bg-white rounded-lg transition-colors group/item"
                      >
                        <input
                          type="checkbox"
                          checked={watchMealIds?.includes(String(product.id))}
                          onChange={() => handleCheckboxChange(product.id)}
                          className="size-4 rounded border-2 border-gray-200 checked:bg-[#014162] text-[#014162] focus:ring-0 transition-all cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-700 group-hover/item:text-[#014162] transition-colors">
                          {product.title}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      No products found
                    </div>
                  )}
                </div>
              )}

              {errors.meal_ids && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.meal_ids.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-2 bg-gray-100 text-gray-500 py-3 px-4 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-3 bg-[#014162] text-white py-3 px-4 rounded-xl text-xs font-bold shadow-lg shadow-[#014162]/10 hover:bg-[#013550] transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Smart List"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
