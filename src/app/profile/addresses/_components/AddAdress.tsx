import { X, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addAddressSchema } from "@/lib/schemas/addresseSchema";
import { Address } from "@/lib/types";
import { useAddAddress } from "@/hooks/addresses/useAddresses";

export default function AddAddressDialog({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof addAddressSchema>>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      city: "",
      country: "",
      street_address: "",
      building_number: "",
      apartment: "",
      landmark: "",
      notes: "",
      label: "Home",
    },
  });

  const selectedLabel = watch("label");
  const { mutateAsync: addAddress, isPending } = useAddAddress();

  const onSubmit = async (data: z.infer<typeof addAddressSchema>) => {
    try {
      const addressData: Partial<Address> = {
        streetName: data.street_address,
        buildingNumber: data.building_number,
        appartment: data.apartment,
        title: data.label,
        details: [data.landmark, data.notes].filter(Boolean).join(", "),
      };
      await addAddress(addressData);
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#014162]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#014162]/5 to-transparent -mr-12 -mt-12 rounded-full z-0" />

          <div className="relative z-10 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#014162]/5 flex items-center justify-center text-[#014162]">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#014162] mb-0.5">
                    Add New Address
                  </h2>
                  <p className="text-gray-500 text-xs font-medium tracking-tight">
                    Add a new delivery location
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="size-5 text-gray-400" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-4"
            >
              {/* Label Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Save As
                </label>
                <div className="flex gap-2">
                  {["Home", "Work"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setValue("label", l)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
                        selectedLabel === l
                          ? "bg-[#014162] text-white shadow-lg shadow-[#014162]/10"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                />
                {errors.full_name && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="01234567890"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* City */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">
                    City
                  </label>
                  <input
                    {...register("city")}
                    type="text"
                    placeholder="Cairo"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                  />
                  {errors.city && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">
                    Country
                  </label>
                  <input
                    {...register("country")}
                    type="text"
                    placeholder="Egypt"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                  />
                  {errors.country && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Street Address
                </label>
                <input
                  {...register("street_address")}
                  type="text"
                  placeholder="90th Street"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                />
                {errors.street_address && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.street_address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Building Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">
                    Building
                  </label>
                  <input
                    {...register("building_number")}
                    type="text"
                    placeholder="12"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                  />
                </div>

                {/* Apartment */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">
                    Apartment
                  </label>
                  <input
                    {...register("apartment")}
                    type="text"
                    placeholder="4B"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Landmark (Optional)
                </label>
                <input
                  {...register("landmark")}
                  type="text"
                  placeholder="Near the mall"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  Delivery Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  placeholder="Knock softly..."
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-[#0e1112] focus:ring-2 focus:ring-[#014162]/10 transition-all outline-none placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-2 bg-[#014162] text-white py-3 rounded-xl text-xs font-bold shadow-lg hover:bg-[#013550] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
