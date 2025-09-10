import { PaymentStatus } from "../enums/paymentStatus";
import { Status } from "../enums/status";
import { Address } from "./register-user";

export interface OrderFailResponse {
  status: Status.FAIL;
  data: {
    error: string;
  };
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  _id: string;
  user_id: string;
  items: OrderItem[];
  shipping_address: Address;
  total_price: number;
  payment_status: PaymentStatus;
  is_deleted: boolean;
  created_at: string; 
  updated_at: string; 
}



export interface OrderSuccessResponse {
  status: Status.SUCCESS;
  data: Order;
}

export type OrderResponse = OrderFailResponse | OrderSuccessResponse;
