export interface StoreImage {
  _id: string;
  name: string;
  size: string;
  type: string;
  location: string;
}

export interface CategoryType {
  _id: string;
  name: string;
  isParent: boolean;
  IsShow: boolean;
  id_store: StoreImage;
  path: string;
  layer: boolean;
}
export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  id_stores: StoreImage[];
  id_categories: string[];
  globalDiscount: number;
  disable: boolean;
}

export interface CartItem {
  _id: string;
  productId: ProductType;
  quantity: number;
  items: {
    quantity: number;
    stage1: any[];
    stage2: any[];
    stage3: any[];
    stage4: any[];
  };
}
