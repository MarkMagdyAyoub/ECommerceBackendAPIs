import { PaymentStatus } from "../enums/paymentStatus"
import { Address } from "./register-user"

export interface OrderRequest {
  user_id: string
  items: Item[]
  shipping_address: Address
  payment_status: PaymentStatus
  total_price: number
}

export interface Item {
  product_id: string
  quantity: number
  price_at_purchase: number
}

