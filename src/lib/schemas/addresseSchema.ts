import z from "zod";

export const addAddressSchema = z.object({
  apartment: z.string().optional(),
  building_number: z.string().optional(),
  city: z
    .string()
    .min(1, "City is required")
    .min(4, "City is required at least 4 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .min(4, "Country is required at least 4 characters"),
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(4, "Full name is required at least 4 characters"),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  label: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+[\d\s-]{10,}$/, "Invalid phone number (e.g. +201012345678)"),
  street_address: z
    .string()
    .min(1, "Street address is required")
    .min(10, "Street address is required at least 10 characters"),
});
