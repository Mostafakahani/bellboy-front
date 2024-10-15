export interface Address {
  id?: string;
  title: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
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
