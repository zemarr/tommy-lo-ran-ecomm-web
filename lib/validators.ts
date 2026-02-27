import { z } from "zod"
import { formatNumberToDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z.string()
  .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberToDecimal(Number(value))), "Price is required and must have 2 decimal places (i.e 5000.00)")
// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  price: currency,
  images: z.array(z.string()).min(1, "Product must have at least 1 image"),
  description: z.string().min(10, "Description must not be less than 10 characters"),
  longDescription: z.string().min(30, "Description must not be less than 30 characters"),
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
  // popularity: z.coerce.number().default(0)
});

// schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address').min(3, 'Email must be at least 3 characters').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(255),
});
// schema for signing users up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(255),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(255),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters').max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const cartProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.string(),
  images: z.array(z.string()).default([]),
  stock: z.number(),
});

/**
 * Cart item schema — matches Zustand store
 */
export const cartItemSchema = z.object({
  productId: z.string().min(1), // `${product.id}-${Date.now()}`
  product: cartProductSchema,
  quantity: z
    .number()
    .int()
    .positive("Quantity must be greater than 0"),
});

/**
 * Entire cart schema (for server validation)
 */
export const cartSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema),
});

export const insertCartSchema = z.object({
  userId: z.string().optional().nullable(),
  sessionCartId: z.string().min(1),
  items: z.array(cartItemSchema).default([]),
  itemsPrice: z.string().regex(/^\d+(\.\d{2})?$/), // decimal with 2 places
  taxPrice: z.string().regex(/^\d+(\.\d{2})?$/),
  shippingPrice: z.string().regex(/^\d+(\.\d{2})?$/),
  totalPrice: z.string().regex(/^\d+(\.\d{2})?$/),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "First name is required"),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  streetAddress: z.string().min(3, "Street address is required"),
  city: z.string().min(3, "City is required").optional(),
  state: z.string().min(3, "State is required").optional(),
  postalCode: z.string().min(3, "Postal code is required").optional(),
  country: z.string().min(3, "Country is required"),
  lng: z.string().optional(),
  lat: z.string().optional(),
});

// schema for payment method
export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'Payment method is required'),
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: [ 'type' ],
  message: 'Invalid payment method',
});

// Schema for an OrderItem
export const insertOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  price: currency,
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().url(),
});

// Schema for an Order
export const insertOrderSchema = z.object({
  userId: z.string().uuid(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1),
  paymentResult: z.any().optional(),

  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,

  isPaid: z.boolean().optional(),
  paidAt: z.date().optional() || z.string(),
  isDelivered: z.boolean().optional(),
  deliveredAt: z.date().optional() || z.string(),

  orderItems: z.array(insertOrderItemSchema).optional(),
});

// schema for payment
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  // update_time: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// schema for updating user profile
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  email: z.string().email('Invalid email address').min(3, 'Email must be at least 3 characters').max(255),
  // image: z.string().nullable(),
});

// update user schema
export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, 'User ID is required'),
  role: z.string().min(1, 'Role is required'),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Product ID is required'),
});