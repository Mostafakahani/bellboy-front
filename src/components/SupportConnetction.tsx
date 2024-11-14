import React from "react";
import Button from "./ui/Button/Button";

export default function SupportConnetction() {
  return (
    <div className="mb-20 max-w-3xl">
      <div className="w-full flex flex-col justify-start items-center mt-0">
        <img
          className="h-auto max-w-xs"
          src="/images/main/sup.png"
          alt="map location bell boy"
          onClick={() => window.alert("map")}
        />
        <span className="text-2xl relative inline-block mr-1">
          <span className="relative z-10 font-bold">مریم هستم</span>
          <span className="absolute bottom-1.5 left-0 w-full h-[6px] bg-[#48FDBC]"></span>
        </span>
      </div>
      <p className="text-center text-xl mt-2">پشتیبان و همراه شما</p>
      <div className="flex flex-col justify-start items-center my-5">
        <Button variant="secondary" onXsIsText icon="left">
          شروع گفتگو
        </Button>
      </div>
    </div>
  );
}
