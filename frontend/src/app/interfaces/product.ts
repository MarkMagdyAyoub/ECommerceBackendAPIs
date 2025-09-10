import { Category } from "./category";

export interface Product {
  _id: string;
  name: string;
  category_id: Category;   
  brand: string;
  description: string;
  stock: number;
  price: number;
  images: string[];
  created_at: string;      
  updated_at: string;      
}