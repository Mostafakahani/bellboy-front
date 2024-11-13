export type OrderStatus = "در حال تامین" | "تحویل شده" | "لغو شده";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  offer: number | undefined;
}

export interface Order {
  _id: string;
  TypeOrder: "shop" | "clean" | "service";
  date: string;
  data: {
    IsTastePyramids: boolean;
    data?: {
      price: number;
      globalDiscount: number;
      id_clean: string[];
      id: string;
      data?: {
        title: string;
        data?: {
          id: number;
          title: string;
          count: number;
          data?: string[];
        }[];
      };
    }[];
    dataTastePyramids?: {
      id: string;
      title: string;
      price: number;
      quantity: number;
      globalDiscount: number;
    }[];
    id: string;
    title: string;
    price: number;
    quantity: number;
    globalDiscount: number;
  }[];
  price: number;
  startHour: string;
  endHour: string;
  status: string;
  paymentStatus: string;
  orderNumber: string;
}
