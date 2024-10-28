export enum AddressFormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
}
export interface Address {
  _id?: string;
  title: string;
  province: string;
  city: string;
  address: string;
  plaque: string;
  x?: number;
  y?: number;
}

export interface Province {
  "province-en": string;
  "province-fa": string;
  cities: City[];
}

export interface City {
  "city-en": string;
  "city-fa": string;
}
