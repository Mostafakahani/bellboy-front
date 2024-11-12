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
  id_categories: CategoryType[];
  globalDiscount: number;
  disable?: boolean;
}
export interface Product {
  _id?: string;
  id?: string;
  title: string;
  quantity?: number;
  description?: string;
  price: number;
  stock?: number;
  id_stores?: string[];
  id_categories?: string[];
  globalDiscount: number;
  active?: boolean;
  TastingTray?: boolean;
}

export interface StageItem {
  productId: Product;
  quantity: number;
  _id: string;
}

export interface Items {
  quantity: number;
  _id: string;
  stage1: StageItem[];
  stage2: StageItem[];
  stage3: StageItem[];
  stage4: StageItem[];
}

export interface CartItem {
  _id: string;
  id_user: string;
  IsTastePyramids: boolean;
  productId: Product;
  quantity: number;
  items: Items;
}
