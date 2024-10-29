export interface ProductType {
  id: number;
  name: string;
  price: number;
  description: string;
  shortDescription?: string;
  imageUrls: string[];
}

export interface FlavorTier {
  product: ProductType;
  quantity: number;
}

export interface FlavorPyramidFormData {
  tiers: FlavorTier[];
  totalPrice: number;
}
