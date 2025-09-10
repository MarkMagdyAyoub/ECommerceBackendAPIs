import { PaymentStatus } from "../enums/paymentStatus"
import { Status } from "../enums/status"

export interface OrdersResponse {
  status: Status
  data: OrderResponses[]
}

export interface OrderResponses {
  shipping_address: ShippingAddress
  _id: string
  user_id: string
  items: Item[]
  payment_status: PaymentStatus
  is_deleted: boolean
  total_price: number
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  city: string
  street: string
}

export interface Item {
  product_id: ProductId
  quantity: number
  price_at_purchase: number
  _id: string
}

export interface ProductId {
  _id: string
  name: string
  price: number
}
