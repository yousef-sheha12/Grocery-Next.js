import { ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editSmartListSchema } from "@/lib/schemas/smartListSchema";
import { useUpdateSmartList } from "@/hooks/smartList/useSmartList";
import { useSearchMeals } from "@/hooks/categories/useCategories";

type EditListProps = {
  list: any;
  onClose: () => void;
};

export default function EditList({ list, onClose }: EditListProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof editSmartListSchema>>({
    resolver: zodResolver(editSmartListSchema),
    defaultValues: {
      name: list?.name || "",
      dis: list?.description || "",
      meal_ids: list?.meals?.map((m: any) => String(m.id)) || [],
    },
  });

  const { mutateAsync: updateSmartList, isPending } = useUpdateSmartList();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: meals } = useSearchMeals("");

  const watchMealIds = watch("meal_ids") || [];

  const handleCheckboxChange = (productId: any) => {
    const idAsString = String(productId);
    const currentIds = watchMealIds;
    const newIds = currentIds.includes(idAsString)
      ? currentIds.filter((id) => id !== idAsString)
      : [...currentIds, idAsString];
    setValue("meal_ids", newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof editSmartListSchema>) => {
    try {
      await updateSmartList({
        id: list.id,
        data: {
          name: data.name,
          description: data.dis,
          meal_ids: data.meal_ids,
        } as any,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update smart list:", error);
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
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#014162]/5 to-transparent -mr-12 -mt-12 rounded-full z-0" />

        <div className="relative z-10 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#014162] mb-0.5">
                Edit Smart List
              </h2>
              <p className="text-gray-500 text-xs font-medium tracking-tight">
                Update your collection details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-5 text-gray-400" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">
                List Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Healthy Breakfast"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none"
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1">
                Description
              </label>
              <input
                {...register("dis")}
                type="text"
                placeholder="What is this list for?"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none"
              />
              {errors.dis && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.dis.message}
                </p>
              )}
            </div>

            <div className="relative space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Products
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-left flex items-center justify-between"
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
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {selectedProducts?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedProducts?.slice(0, 4).map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-[#014162]/5 text-[#014162] text-[9px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1.5"
                    >
                      {product.title}
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(product.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="size-3" />
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
                <div className="mt-2 bg-gray-50 rounded-xl border border-gray-100 max-h-48 overflow-y-auto p-1.5 z-20">
                  <div className="px-2 pb-2 sticky top-0 bg-gray-50 z-10">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 outline-none"
                    />
                  </div>
                  {filteredProducts?.length > 0 ? (
                    filteredProducts?.map((product: any) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-2.5 py-2 px-3 cursor-pointer hover:bg-white rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={watchMealIds?.includes(String(product.id))}
                          onChange={() => handleCheckboxChange(product.id)}
                          className="size-4 rounded border-2 border-gray-200 checked:bg-[#014162] text-[#014162]"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          {product.title}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[10px] font-bold text-gray-400">
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

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-2 bg-[#014162] text-white py-3 rounded-xl text-xs font-bold shadow-lg hover:bg-[#013550] transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? "Updating..." : "Update Smart List"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
