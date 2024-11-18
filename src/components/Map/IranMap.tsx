import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../ui/Button/Button";
import { Input } from "../ui/Input/Input";

export interface Location {
  x: number;
  y: number;
}

interface MapModalProps {
  onClose: () => void;
  onLocationSelect: (location: Location, isInServiceArea: boolean) => void;
  initialLocation?: Location;
}

interface CircularArea {
  center: Location;
  radius: number;
  color: string;
}

interface SearchResult {
  name: string;
  location: Location;
  boundingbox?: [string, string, string, string];
}

const defaultCenter: Location = { x: 32.4279, y: 53.688 };
const defaultZoom = 6;
const iranBounds: L.LatLngBoundsExpression = [
  [25.064, 44.036],
  [39.777, 63.317],
];

const predefinedAreas: CircularArea[] = [
  { center: { x: 35.7219, y: 51.3347 }, radius: 50000, color: "#ff0000" },
  { center: { x: 32.6539, y: 51.666 }, radius: 30000, color: "#00ff00" },
];

const MapModal: React.FC<MapModalProps> = ({ onClose, onLocationSelect, initialLocation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location>(
    initialLocation || defaultCenter
  );
  console.log({ initialLocation });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string; location: Location }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationSelect = () => {
    const isInServiceArea = predefinedAreas.some(
      (area) =>
        L.latLng(currentLocation.x, currentLocation.y).distanceTo(
          L.latLng(area.center.x, area.center.y)
        ) <= area.radius
    );
    onLocationSelect(currentLocation, isInServiceArea);
    // if (!isInServiceArea) {
    //   alert("این مکان خارج از محدوده خدمات ماست، اما می‌توانید آن را انتخاب کنید.");
    // }
    onClose();
  };

  const handleSearch = async () => {
    if (searchQuery.length < 3) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=ir`
      );
      const data = await response.json();
      const filteredSuggestions: SearchResult[] = data.map((item: any) => ({
        name: item.display_name,
        location: { x: parseFloat(item.lat), y: parseFloat(item.lon) },
        boundingbox: item.boundingbox,
      }));
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("خطا در جستجو. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSuggestionClick = (result: SearchResult) => {
    setCurrentLocation(result.location);
    if (mapRef.current) {
      if (result.boundingbox) {
        const southWest = L.latLng(
          parseFloat(result.boundingbox[0]),
          parseFloat(result.boundingbox[2])
        );
        const northEast = L.latLng(
          parseFloat(result.boundingbox[1]),
          parseFloat(result.boundingbox[3])
        );
        const bounds = L.latLngBounds(southWest, northEast);
        mapRef.current.fitBounds(bounds);
      } else {
        mapRef.current.setView([result.location.x, result.location.y], 13);
      }
    }
    setSuggestions([]);
  };

  const handleGetMyLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
      setIsLoading(false);
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      const newLocation = {
        x: position.coords.latitude,
        y: position.coords.longitude,
      };

      // Check if location is within Iran's boundaries
      const isInIran = L.latLngBounds(iranBounds).contains([newLocation.x, newLocation.y]);

      if (isInIran) {
        setCurrentLocation(newLocation);
        if (mapRef.current) {
          // Use setView instead of flyTo for more reliable positioning
          mapRef.current.setView([newLocation.x, newLocation.y], 13, {
            animate: true,
            duration: 1,
          });
        }
      } else {
        setError("موقعیت شما خارج از مرزهای ایران است.");
      }
      setIsLoading(false);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = "خطا در دریافت موقعیت مکانی.";

      switch (error.code) {
        case GeolocationPositionError.PERMISSION_DENIED:
          errorMessage =
            "دسترسی به موقعیت مکانی رد شد. لطفاً دسترسی را در تنظیمات مرورگر خود فعال کنید.";
          break;
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          errorMessage = "اطلاعات موقعیت مکانی در دسترس نیست. لطفاً دوباره تلاش کنید.";
          break;
        case GeolocationPositionError.TIMEOUT:
          errorMessage = "درخواست برای دریافت موقعیت مکانی به پایان رسید. لطفاً دوباره تلاش کنید.";
          break;
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout to 15 seconds
      maximumAge: 0, // Always get fresh position
    };

    try {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } catch (e) {
      console.log(e);
      setError("خطای غیرمنتظره در دریافت موقعیت مکانی.");
      setIsLoading(false);
    }
  };

  const LocationMarker: React.FC = () => {
    const map = useMapEvents({
      click(e) {
        const newLocation = { x: e.latlng.lat, y: e.latlng.lng };
        if (L.latLngBounds(iranBounds).contains([newLocation.x, newLocation.y])) {
          setCurrentLocation(newLocation);
          map.flyTo([newLocation.x, newLocation.y], map.getZoom());
        } else {
          setError("لطفاً مکانی درون مرزهای ایران انتخاب کنید.");
        }
      },
    });

    useEffect(() => {
      map.flyTo([currentLocation.x, currentLocation.y], map.getZoom());
    }, [currentLocation, map]);

    return (
      <Marker
        position={[currentLocation.x, currentLocation.y]}
        icon={L.icon({
          iconUrl: "/images/icons/leaf-orange.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowUrl: "/images/icons/leaf-shadow.png",
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        })}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 p-4">
          <h3 className="text-lg font-semibold">انتخاب موقعیت روی نقشه</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col mb-4 relative">
          <div className="flex items-center space-x-2">
            <Input
              variant="search"
              className="!placeholder:pr-3 flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نقشه"
            />
            <Button
              className="absolute top-[385px] right-[24px] z-[800] h-12 w-12 !p-1 border-2 border-black bg-white"
              variant="tertiary"
              onClick={handleGetMyLocation}
              disabled={isLoading}
              icon="gps"
            >
              {isLoading ? "در حال دریافت..." : "دریافت موقعیت من"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="absolute w-full top-[50px] left-4 right-0 bg-gray-100 border-b-2 border-black max-h-56 overflow-hidden z-[8888888888] shadow-lg">
            <ul
              className={`transition-all duration-300 ease-in-out ${
                suggestions.length > 0 ? "max-h-56" : "max-h-0"
              } overflow-y-auto`}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer z-[8888888888] transition-all duration-300 ease-in-out text-sm font-bold"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                  <div
                    className={`w-full h-[0.4px] mt-5 bg-black ${
                      index === suggestions.length - 1 ? "hidden" : ""
                    }`}
                  ></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-grow relative rounded-xl p-4">
          <MapContainer
            center={[defaultCenter.x, defaultCenter.y]}
            zoom={defaultZoom}
            className="!rounded-xl"
            style={{ height: "100%", width: "100%", borderRadius: "32px" }}
            maxBounds={iranBounds}
            ref={(map) => {
              if (map) {
                mapRef.current = map;
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            {predefinedAreas.map((area, index) => (
              <Circle
                key={index}
                center={[area.center.x, area.center.y]}
                radius={area.radius}
                pathOptions={{ color: area.color, fillColor: area.color, fillOpacity: 0.2 }}
              />
            ))}
          </MapContainer>
        </div>
        <div className="flex justify-between mt-4 p-4">
          <Button onXsIsText onClick={handleLocationSelect} className="w-full mx-5">
            ادامه
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
