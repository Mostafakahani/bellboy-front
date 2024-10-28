export interface Address {
  id?: string;
  title: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  location?: {
    y: number;
    x: number;
  };
}

export interface Province {
  "province-fa": string;
  cities: City[];
}

export interface City {
  "city-fa": string;
}

export interface Location {
  y: number;
  x: number;
}

export interface CircularArea {
  center: Location;
  radius: number;
  color: string;
}
