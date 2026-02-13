import { insertProductSchema } from "@/lib/validators";
import { z } from "zod"


export type User = {
  name: string;
  email: string;
  id: string;
  role: string;
}

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  popularity: number;
  createdAt: string;
}

export type DeliveryFee = {
  lag: number;
  nationwide: number;
};
