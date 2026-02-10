export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  options?: string[];
  features: string[];
  materials: string[];
  deliveryTime: string;
  popularity?: number;
}