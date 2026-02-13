import { z } from "zod"
import { formatNumberToDecimal } from "./utils";

const currency = z.string()
  .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberToDecimal(Number(value))), "Price is required and must have 2 decimal places (i.e 5000.00)")
// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  price: currency,
  images: z.array(z.string()).min(1, "Product must have at least 1 image"),
  description: z.string().min(150, "Description must not be less than 150 characters"),
  longDescription: z.string().min(350, "Description must not be less than 350 characters"),
  features: z.array(z.string()).min(1, "Product must have at least 1 feature"),
  materials: z.array(z.string()).min(1, "Product must have at least 1 material used"),
  care: z.string().nullable(),
  fit: z.string().nullable(),
  deliveryFee: z.object({
    lag: z.coerce.number(),
    nationwide: z.coerce.number(),
  }).nullable(),
  stock: z.coerce.number(),
  deliveryTime: z.string().min(5, "Description must not be less than 5 characters"),
});