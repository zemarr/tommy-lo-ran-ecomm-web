import { cartItemSchema, cartSchema, insertCartSchema, insertProductSchema, shippingAddressSchema } from "@/lib/validators";
import { z } from "zod"


export type User = {
  name: string;
  email: string;
  id: string;
  role: string;
  address: ShippingAddress;
}

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryFee = {
  lag: number;
  nationwide: number;
};

export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;