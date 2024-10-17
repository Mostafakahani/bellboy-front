export interface Address {
  id?: string;
  title: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  location?: {
    lat: number;
    lng: number;
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
  lat: number;
  lng: number;
}

export interface CircularArea {
  center: Location;
  radius: number;
  color: string;
}
