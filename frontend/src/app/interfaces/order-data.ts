export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderData {
  items: Array<{
    product_id: string;
    quantity: number;
    price_at_purchase: number;
  }>;
  shipping_address: {
    city: string;
    street: string;
  };
  total_price: number;
  payment_status: string;
}