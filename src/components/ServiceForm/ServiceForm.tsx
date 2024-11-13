import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import CheckMarkInput from "../ui/Input/CheckMarkInput";
import { Address } from "../Profile/Address/types";
import { LineIcon } from "@/icons/Icons";
import { TimeSlot } from "../DateTimeSelector";
import { PlanItem } from "../BellClean/ClientClean";
// import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
// import { getCookie } from "cookies-next";
// import { showError, showSuccess } from "@/lib/toastService";

interface FormData {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedServices: string[];
  selectedDateTime: { date: string; time: TimeSlot } | null;
}

interface ServiceFormProps {
  formData: FormData;
  onFormChange: (newData: Partial<FormData>) => void;
  packages: PlanItem[] | undefined;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ formData, onFormChange, packages }) => {
  // const authenticatedFetch = useAuthenticatedFetch();
  const [selectedPackages, setSelectedPackages] = useState<string[]>(formData.selectedServices);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // const [loading, setLoading] = useState<boolean>(false);

  // محاسبه قیمت کل به صورت مموایز شده
  const calculateTotalPrice = useCallback(
    (selectedIds: string[]) => {
      return selectedIds.reduce((sum, packageId) => {
        const pkg = packages?.find((p) => p._id === packageId);
        return sum + (pkg ? pkg.price : 0);
      }, 0);
    },
    [packages]
  );

  // مدیریت تغییر پکیج‌های انتخاب شده
  const handlePackageToggle = useCallback(
    (packageId: string) => {
      setSelectedPackages((prev) => {
        const newSelected = prev.includes(packageId)
          ? prev.filter((id) => id !== packageId)
          : [...prev, packageId];

        // آپدیت formData
        onFormChange({ selectedServices: newSelected });
        return newSelected;
      });
    },
    [onFormChange]
  );

  // آپدیت قیمت کل زمانی که پکیج‌های انتخابی تغییر می‌کنند
  useEffect(() => {
    const newTotalPrice = calculateTotalPrice(selectedPackages);
    setTotalPrice(newTotalPrice);
  }, [selectedPackages, calculateTotalPrice]);

  // const addToCartSelectedItems = async () => {
  // const token = getCookie("auth_token");
  // if (!token) {
  //   showError("برای انجام این عملیات باید وارد حساب خود شده باشید");
  //   return;
  // }
  // setLoading( true);
  // try {
  //   const response = await authenticatedFetch<ApiResponse>("/cart", {
  //     method: "POST",
  //     body: JSON.stringify({ productId }),
  //   });
  //   if (response.status === "success") {
  //     showSuccess("محصول به سبد خرید اضافه شد");
  //   }
  // } catch (error) {
  //   showError(error instanceof Error ? error.message : "خطا در برقراری ارتباط با سرور");
  // } finally {
  //   setLoading( false);
  // }
  // };

  return (
    <div className="pt-4 px-4">
      <h2 className="text-xl font-bold mt-2 mb-4">خدمات مورد نیاز خود را انتخاب کنید</h2>

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
          <span className="mb-3 text-right">
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
      {packages?.map((pkg) => (
        <div key={pkg._id} className="my-6 bg-white border-2 border-black rounded-xl">
          <div
            className={`relative flex flex-row gap-4 items-center justify-between mb-4 p-4 rounded-t-xl ${
              selectedPackages.includes(pkg._id) ? "bg-primary-100" : "bg-gray-100"
            }`}
            onClick={() => {
              handlePackageToggle(pkg._id);
              // addToCartSelectedItems();
            }}
          >
            <CheckMarkInput
              isChecked={selectedPackages.includes(pkg._id)}
              onChange={() => handlePackageToggle(pkg._id)}
            />
            <div className="w-full flex flex-col">
              <span className="text-right font-bold text-md flex-grow">{pkg.data.title}</span>
              <span className="text-sm text-right">
                {pkg?.id_clean?.map((x) => x.data["short-description"])}
                <span className="mr-1 z-10 price relative font-bold text-black after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-full after:h-[5px] after:bg-primary-400 after:z-[-1]">
                  {formatCurrency(pkg.price)}
                </span>
              </span>
            </div>
          </div>
          <div className="relative" style={{ top: "-50px" }}>
            <LineIcon className="w-full relative" />
          </div>
          {/* Services */}
          <div className="space-y-2 p-4 relative" style={{ top: "-50px" }}>
            {pkg.data.data.map((service) => (
              <div key={service.id} className="flex flex-col items-start justify-start">
                <div>
                  <span className="text-right text-sm font-bold">{service.title}</span>

                  <span className="mr-1 py-1 px-2 bg-gray-200 rounded-full text-[10px] font-bold">
                    {service.count} عدد
                  </span>
                </div>
                <p className="mt-2 text-[11px]">{service.data.join(", ")}</p>
              </div>
            ))}
          </div>

          {/* Other services */}
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
