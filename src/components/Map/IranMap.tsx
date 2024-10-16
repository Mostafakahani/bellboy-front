import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// تعریف تایپ‌ها
export type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export type CircularArea = {
  center: Location;
  radius: number;
  color: string;
};

type Props = {
  onLocationSelect: (location: Location) => void;
  initialAreas?: CircularArea[];
};

const IranMap: React.FC<Props> = ({ onLocationSelect, initialAreas = [] }) => {
  const [center, setCenter] = useState<[number, number]>([32.4279, 53.688]); // مرکز ایران
  const [marker, setMarker] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [areas, setAreas] = useState<CircularArea[]>(initialAreas);

  // تنظیم مجدد نقشه
  const ResetMapView: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 6);
    }, [center, map]);
    return null;
  };

  // Component to handle map clicks
  const HandleMapClick = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        onLocationSelect({ lat, lng });
        getAddress(lat, lng);
      },
    });
    return null;
  };

  // دریافت موقعیت کاربر
  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setMarker({ lat: latitude, lng: longitude });
          onLocationSelect({ lat: latitude, lng: longitude });
          getAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [onLocationSelect]);

  // جستجوی مکان
  const handleSearch = useCallback(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery},Iran`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setCenter([newLat, newLng]);
        setMarker({ lat: newLat, lng: newLng, address: display_name });
        onLocationSelect({ lat: newLat, lng: newLng, address: display_name });
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  }, [searchQuery, onLocationSelect]);

  // دریافت آدرس براساس مختصات
  const getAddress = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setMarker((prev) => (prev ? { ...prev, address: data.display_name } : null));
          onLocationSelect({ lat, lng, address: data.display_name });
        }
      } catch (error) {
        console.error("Error getting address:", error);
      }
    },
    [onLocationSelect]
  );

  // اضافه کردن محدوده دایره‌ای
  const addCircularArea = useCallback(() => {
    if (marker) {
      const newArea: CircularArea = {
        center: { lat: marker.lat, lng: marker.lng },
        radius: 5000, // شعاع پیش‌فرض 5 کیلومتر
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // رنگ تصادفی
      };
      setAreas((prevAreas) => [...prevAreas, newArea]);
    }
  }, [marker]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی مکان (استان، شهر، خیابان)"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="mt-2 flex justify-between">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            جستجو
          </button>
          <button
            onClick={handleGetLocation}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            دریافت موقعیت من
          </button>
          <button
            onClick={addCircularArea}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            disabled={!marker}
          >
            افزودن محدوده دایره‌ای
          </button>
        </div>
      </div>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ResetMapView center={center} />
        <HandleMapClick />
        <Marker
          position={center}
          icon={L.icon({
            iconUrl: "/images/center-marker-icon.png",
            iconRetinaUrl: "/images/center-marker-icon-2x.png",
            shadowUrl: "/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        />
        {marker && (
          <Marker
            position={[marker.lat, marker.lng]}
            icon={L.icon({
              iconUrl: "/images/marker-icon.png",
              iconRetinaUrl: "/images/marker-icon-2x.png",
              shadowUrl: "/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
        )}
        {areas.map((area, index) => (
          <Circle
            key={index}
            center={[area.center.lat, area.center.lng]}
            radius={area.radius}
            pathOptions={{ color: area.color }}
          />
        ))}
      </MapContainer>
      {marker && (
        <div className="p-4 bg-white border-t border-gray-200">
          <p>
            مختصات انتخاب شده: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </p>
          {marker.address && <p>آدرس: {marker.address}</p>}
        </div>
      )}
    </div>
  );
};

export default IranMap;
