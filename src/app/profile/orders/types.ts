export type OrderStatus = "در حال تامین" | "تحویل شده" | "لغو شده";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  tax: number;
  shippingCost: number;
  totalPayable: number;
}
