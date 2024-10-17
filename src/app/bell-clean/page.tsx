"use client";
import React, { useEffect, useState } from "react";
import MultiStepForm from "@/components/Stepper/Stepper";
import Button from "@/components/ui/Button/Button";
import { Address } from "@/components/Profile/Address/types";
import AddressManagement from "@/components/Profile/Address/AddressManagement";
import Image from "next/image";
import DateTimeSelector from "@/components/DateTimeSelector";
import CheckMarkInput from "@/components/ui/Input/CheckMarkInput";
import { formatCurrency } from "@/utils/formatCurrency";
import FactorDetails from "@/components/Factor/FactorDetails";
interface DetailsFormProps {
  formData: {
    addresses: Address[];
    selectedAddress: Address | null;
  };
  onFormChange: (data: { addresses: Address[]; selectedAddress: Address | null }) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ formData, onFormChange }) => {
  const handleAddressChange = (updatedAddresses: Address[], selectedAddr: Address | null) => {
    onFormChange({ addresses: updatedAddresses, selectedAddress: selectedAddr });
  };

  return (
    <div className="py-4">
      <div className="container mx-auto">
        <AddressManagement
          initialAddresses={formData.addresses}
          onAddressChange={handleAddressChange}
          title="موقعیت خود را انتخاب کنید"
        />
      </div>
    </div>
  );
};
interface Service {
  id: string;
  name: string;
  value: number;
  details?: string;
}

interface OtherService {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  area: string;
  basePrice: number;
  services: Service[];
  otherServices: OtherService[];
}

const packages: Package[] = [
  {
    id: "internal",
    name: "پکیج استاندارد نظافت داخلی",
    area: "تا 250 متر",
    basePrice: 400000,
    services: [
      {
        id: "living",
        value: 3,
        name: "اتاق",
        details: "گردگیری، جارو، شستشوی کف، چیدمان، جمع آوری زباله",
      },
      {
        id: "kitchen",
        value: 1,
        name: "آشپزخانه",
        details: "شستشوی ظروف، تمیز کردن سطوح، جارو و تی کشیدن",
      },
      {
        id: "bathroom",
        value: 1,
        name: "سرویس بهداشتی و حمام",
        details: "ضدعفونی، شستشوی کامل، نظافت آینه و شیرآلات",
      },
      {
        id: "bedroom1",
        value: 1,
        name: "سالن",
        details: "گردگیری مبلمان، جارو، تی کشیدن، مرتب کردن",
      },
      { id: "bedroom2", value: 1, name: "راه پله", details: "جارو، تی کشیدن، گردگیری نرده‌ها" },
    ],
    otherServices: [
      { id: "internal-additional1", name: "جارو برقی کشیدن" },
      { id: "internal-additional2", name: "گردگیری" },
      { id: "internal-additional3", name: "شستشوی کف" },
      { id: "internal-additional4", name: "پنجره" },
      { id: "internal-additional5", name: "هود" },
      { id: "internal-additional6", name: "یخچال" },
      { id: "internal-additional7", name: "داخل کابینت" },
      { id: "internal-additional8", name: "لوستر" },
    ],
  },
  {
    id: "external",
    name: "پکیج استاندارد نظافت خارجی",
    area: "۱۰۰ متر",
    basePrice: 899000,
    services: [
      {
        id: "facade",
        value: 3,
        name: "حیاط",
      },
      { id: "teras", value: 3, name: "تراس" },
      { id: "alachigh", value: 3, name: "آلاچیق" },
      { id: "chairs", value: 3, name: "دست میز و صندلی" },
      {
        id: "trush",
        value: 3,
        name: "جمع آوری زباله",
      },
    ],
    otherServices: [
      { id: "external-additional1", name: "شستشوی نما" },
      { id: "external-additional2", name: "شستشوی محوطه" },
      { id: "external-additional3", name: "جارو برقی کشیدن" },
      { id: "external-additional4", name: "گردگیری" },
      { id: "external-additional5", name: "شستشوی کف" },
      { id: "external-additional6", name: "پنجره" },
      { id: "external-additional7", name: "هود" },
      { id: "external-additional8", name: "یخچال" },
      { id: "external-additional9", name: "داخل کابینت" },
      { id: "external-additional10", name: "لوستر" },
    ],
  },
];
interface FormData {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedServices: string[];
  selectedDateTime: { date: string; time: TimeSlot } | null;
}
interface ServiceFormProps {
  formData: FormData;
  onFormChange: (newData: Partial<FormData>) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ formData, onFormChange }) => {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(formData.selectedServices);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const price = selectedPackages.reduce((sum, packageId) => {
      const pkg = packages.find((p) => p.id === packageId);
      return sum + (pkg ? pkg.basePrice : 0);
    }, 0);
    setTotalPrice(price);
    onFormChange({ selectedServices: selectedPackages });
  }, [selectedPackages]);

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId) ? prev.filter((id) => id !== packageId) : [...prev, packageId]
    );
  };

  return (
    <div className="pt-4">
      <h2 className="text-lg font-bold text-right my-4">خدمات مورد نیاز خود را انتخاب کنید</h2>

      {/* Info messages */}
      {["hand", "hand", "hand"].map((icon, index) => (
        <p key={index} className="flex justify-end gap-2 text-sm mb-2">
          <Image
            className="w-5 h-5"
            src={`/images/icons/${icon}.png`}
            width={20}
            height={20}
            alt={icon}
          />
          <span className="mb-3">
            {index === 0 &&
              "قیمت‌ها پایه و با فرض شرایط عادی است. با حضور و مشاهده کارشناس در محل، امکان تغییر دارد"}
            {index === 1 &&
              "برای خدمات کمتر در هر پکیج (مثلا تعداد اتاق کمتر)، هزینه کامل آن پکیج دریافت می‌شود"}
            {index === 2 &&
              "برای خدمات بیشتر در هر پکیج (مثلا تعداد اتاق بیشتر)، کارشناس در محل، فاکتور شما را بروز خواهد کرد"}
          </span>
        </p>
      ))}

      {/* Package display */}
      {packages.map((pkg) => (
        <div key={pkg.id} className="my-6 bg-white border-2 border-black rounded-xl">
          <div
            className={`relative flex flex-row gap-4 items-center justify-between mb-4 p-4 rounded-t-xl ${
              selectedPackages.includes(pkg.id) ? "bg-primary-100" : "bg-gray-100"
            }`}
          >
            <CheckMarkInput
              isChecked={selectedPackages.includes(pkg.id)}
              onChange={() => handlePackageToggle(pkg.id)}
            />
            <div className="w-full flex flex-col">
              <span className="text-right font-bold text-md flex-grow">{pkg.name}</span>
              <span className="text-sm">
                {pkg.area}
                <span className="mr-1 z-10 price relative font-bold text-black after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-full after:h-[5px] after:bg-primary-400 after:z-[-1]">
                  {formatCurrency(pkg.basePrice)}
                </span>
              </span>
              <div className="w-full absolute left-0 bottom-[-36px]">
                <Image width={1080} height={150} className="w-full" src="/images/line.svg" alt="" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2 p-4">
            {pkg.services.map((service) => (
              <div key={service.id} className="flex flex-col items-start justify-start">
                <div>
                  <span className="text-right text-sm font-bold">{service.name}</span>
                  <span className="mr-1 py-1 px-2 bg-gray-200 rounded-full text-[10px] font-bold">
                    {service.value} عدد
                  </span>
                </div>
                <p className="mt-2 text-[11px]">{service.details}</p>
              </div>
            ))}
          </div>

          {/* Other services */}
          <div className="mb-2 p-4">
            <h4 className="text-right text-sm font-bold">سایر خدمات داخلی:</h4>
            <p className="mt-2 text-[11px]">
              {pkg.otherServices.map((service) => service.name).join("، ")}
            </p>
          </div>
        </div>
      ))}

      {/* Total price */}
      <div className="mt-10 text-right font-bold flex flex-row justify-between items-center">
        <p>مبلغ قابل پرداخت</p>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
};

interface FactorFormProps {
  formData: any; // You might want to define a more specific type here
  onFormChange: (newData: any) => void;
}

const FactorForm: React.FC<FactorFormProps> = () => {
  const orderSummary = {
    products: [
      { name: "پکیج استاندارد نظافت داخلی", price: 400000 },
      { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
      { name: "پکیج استاندارد نظافت خارجی", price: 300000 },
      // You can add more products here as needed
    ],
    shippingCost: 50000,
  };
  // const handleApplyDiscount = (code: string) => {
  //   // Implement discount logic here
  //   console.log(`Applying discount code: ${code}`);
  //   // Update orderSummary and formData as needed
  // };

  return <FactorDetails orderSummary={orderSummary} />;
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-full h-full overflow-auto p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h5 className="font-black text-xl">خدمات نظافت </h5>
          <button onClick={() => onClose()}>
            <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
          </button>
        </div>
        <div className="w-full mt-12">{children}</div>
      </div>
    </div>
  );
};

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
};

export default function Page() {
  const [formData, setFormData] = useState({
    addresses: [] as Address[],
    selectedAddress: null as Address | null,
    selectedServices: [] as string[],
    selectedDateTime: null as { date: string; time: TimeSlot } | null,
    paymentComplete: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  // Sample data for a week
  const demoWeekSchedule: DaySchedule[] = [
    {
      date: "۱۲ مهر",
      dayName: "شنبه",
      timeSlots: [
        { start: "۸", end: "۱۲" },
        { start: "۱۳", end: "۱۷" },
        { start: "۱۸", end: "۲۲" },
      ],
    },
    {
      date: "۱۳ مهر",
      dayName: "یکشنبه",
      timeSlots: [
        { start: "۸", end: "۱۲" },
        { start: "۱۳", end: "۱۷" },
        { start: "۱۸", end: "۲۲" },
      ],
    },
  ];

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDateTime: { date, time },
    }));
  };

  const handleFormChange = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const steps = [
    {
      id: 1,
      label: "موقعیت",
      content: <DetailsForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedAddress !== null,
    },
    {
      id: 2,
      label: "سرویس",
      content: <ServiceForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.selectedServices.length > 0,
    },
    {
      id: 3,
      label: "زمان",
      content: (
        <DateTimeSelector
          weekSchedule={demoWeekSchedule}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onSelect={handleDateTimeSelect}
        />
      ),
      isComplete: () => formData.selectedDateTime !== null && selectedTime !== null,
    },
    {
      id: 4,
      label: "پرداخت",
      content: <FactorForm formData={formData} onFormChange={handleFormChange} />,
      isComplete: () => formData.paymentComplete,
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <div className="p-4">
      <Button onXsIsText onClick={openModal}>
        ثبت سفارش
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <MultiStepForm
          steps={steps}
          formData={formData}
          onFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
