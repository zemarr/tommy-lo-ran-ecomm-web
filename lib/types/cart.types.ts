import { z } from 'zod';
import { cartItemSchema, productVariantSchema } from '@/lib/validators';

// What the server stores in the Cart.items JSON field
export const storedCartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  variant: z.object({
    size: z.string(),
    price: z.string().optional(), // stored as string to match DB Decimal
  }).optional(),
  color: z.string().optional(),
});

export type StoredCartItem = z.infer<typeof storedCartItemSchema>;

// Payload for add/update cart operations (sent to server)
export const cartOperationSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(0), // 0 = remove
  variant: z.object({
    size: z.string(),
    price: z.string().optional(),
    stock: z.number().int(),
  }).optional(),
  color: z.string().optional(),
});

export type CartOperation = z.infer<typeof cartOperationSchema>;

// Server response after cart update
export const cartResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  cart: z.array(storedCartItemSchema).optional(),
});

export type CartResponse = z.infer<typeof cartResponseSchema>;

// Keep your existing client-side CartItem (from validators) for UI
export type { CartItem } from '@/lib/types';