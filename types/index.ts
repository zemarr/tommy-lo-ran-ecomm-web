import { insertProductSchema } from "@/lib/validators";
import { z } from "zod"

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
