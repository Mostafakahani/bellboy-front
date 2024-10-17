"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
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
const defaultCenter: Location = { lat: 32.4279, lng: 53.688 }; // Center of Iran
const defaultZoom = 6;
const iranBounds: L.LatLngBoundsExpression = [
  [25.064, 44.036], // Southwest corner
  [39.777, 63.317], // Northeast corner
];

const predefinedAreas: CircularArea[] = [
  { center: { lat: 35.7219, lng: 51.3347 }, radius: 50000, color: "#ff0000" },
  { center: { lat: 32.6539, lng: 51.666 }, radius: 30000, color: "#00ff00" },
  // Add more predefined areas as needed
];

const MapModal: React.FC<MapModalProps> = ({ onClose, onLocationSelect, initialLocation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location>(
    initialLocation || defaultCenter
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string; location: Location }>>([]);
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationSelect = () => {
    const isInServiceArea = predefinedAreas.some(
      (area) =>
        L.latLng(currentLocation.lat, currentLocation.lng).distanceTo(
          L.latLng(area.center.lat, area.center.lng)
        ) <= area.radius
    );
    onLocationSelect(currentLocation, isInServiceArea);
    if (!isInServiceArea) {
      alert("این مکان خارج از محدوده خدمات ماست، اما می‌توانید آن را انتخاب کنید.");
    }
    onClose();
  };

  const handleSearch = async () => {
    if (searchQuery.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=ir`
      );
      const data = await response.json();
      const filteredSuggestions: SearchResult[] = data.map((item: any) => ({
        name: item.display_name,
        location: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
        boundingbox: item.boundingbox,
      }));
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching search results:", error);
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
        mapRef.current.setView(result.location, 13);
      }
    }
    setSuggestions([]);
  };

  const LocationMarker: React.FC = () => {
    const map = useMapEvents({
      click(e) {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        if (L.latLngBounds(iranBounds).contains(e.latlng)) {
          setCurrentLocation(newLocation);
          map.flyTo(e.latlng, map.getZoom());
        } else {
          alert("لطفاً مکانی درون مرزهای ایران انتخاب کنید.");
        }
      },
    });

    useEffect(() => {
      map.flyTo(currentLocation, map.getZoom());
    }, [currentLocation, map]);

    return (
      <Marker
        position={currentLocation}
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
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
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
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی آدرس"
            className="border border-gray-300 rounded px-4 py-2"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto z-[8888888888]">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer z-[8888888888]"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-grow relative">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: "100%", width: "100%" }}
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
                center={area.center}
                radius={area.radius}
                pathOptions={{ color: area.color, fillColor: area.color, fillOpacity: 0.2 }}
              />
            ))}
          </MapContainer>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleLocationSelect}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            انتخاب این موقعیت
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
