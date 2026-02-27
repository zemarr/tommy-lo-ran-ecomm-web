import { cartItemSchema, cartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, paymentResultSchema, shippingAddressSchema, updateProductSchema } from "@/lib/validators";
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
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null,
  isDelivered: boolean;
  deliveredAt: Date | null,
  orderItems: OrderItem[];
  user: {
    name: string,
    email: string
  };
  // paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type InsertProductSchema = z.infer<typeof insertProductSchema> & {
  popularity: number;
}
export type UpdateProductSchema = z.infer<typeof updateProductSchema>
