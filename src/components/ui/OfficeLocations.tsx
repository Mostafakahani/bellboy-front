import React from "react";
import { OneLineIcon } from "@/icons/Icons";
import Image from "next/image";

interface Location {
  title: string;
  address: string;
  building: string;
  unit: string;
  postalCode: string;
  phone: string;
}

const locations: Location[] = [
  {
    title: "دفتر مرکزی",
    address: "سهروردی شمالی، جنب پمپ بنزین، نبش کوچه خشنودی",
    building: "پلاک ۳۵۰، ساختمان نیلی",
    unit: "واحد ۵",
    postalCode: "۱۵۷۷۶۳۷۳۳۳",
    phone: "۰۲۱۴۵۴۶۵۰۰۰",
  },
  {
    title: "دفتر کردان",
    address: "سهروردی شمالی، جنب پمپ بنزین، نبش کوچه خشنودی",
    building: "پلاک ۳۵۰، ساختمان نیلی",
    unit: "واحد ۵",
    postalCode: "۱۵۷۷۶۳۷۳۳۳",
    phone: "۰۲۱۴۵۴۶۵۰۰۰",
  },
  {
    title: "دفتر مازندران",
    address: "سهروردی شمالی، جنب پمپ بنزین، نبش کوچه خشنودی",
    building: "پلاک ۳۵۰، ساختمان نیلی",
    unit: "واحد ۵",
    postalCode: "۱۵۷۷۶۳۷۳۳۳",
    phone: "۰۲۱۴۵۴۶۵۰۰۰",
  },
];

const OfficeLocations = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg shadow-sm" dir="rtl">
      <div className="space-y-4 flex flex-col justify-center items-center">
        {locations.map((location, index) => (
          <div key={index}>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-800">{location.title}</h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>{location.address}</p>
                <p>{location.building}</p>
                <p className="text-gray-500">{location.unit}</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-gray-500">کد پستی:</span>
                  <span>{location.postalCode}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span>تلفن:</span>
                  <span>{location.phone}</span>
                </div>
              </div>
            </div>
            {index < locations.length - 1 && <OneLineIcon className="my-10" />}
          </div>
        ))}
        <div>
          <Image width={1080} className="mt-8" height={1080} src={"/images/main/map.svg"} alt="map bell boy" />  
        </div>
      </div>
    </div>
  );
};

export default OfficeLocations;
