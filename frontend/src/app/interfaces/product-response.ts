import { Pagination } from "./pagination";
import { Product } from "./product";

export interface ProductResponse {
  status: string;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}