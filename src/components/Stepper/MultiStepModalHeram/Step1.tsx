import React, { useState } from "react";
import ProductSlider from "@/components/ui/Slider/ProductSlider";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "@/components/ui/Button/Button";
import { Heram1Icon } from "@/icons/Icons";

export interface ProductType {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
}

export type FormDataType = {
  step0: any;
  step1: ProductType | null;
  step2: any;
  step3: any; // تعریف دقیق‌تر بر اساس نیاز
  step4: any; // تعریف دقیق‌تر بر اساس نیاز
  step5: any; // تعریف دقیق‌تر بر اساس نیاز
};

interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
}

interface Step1Props extends StepProps {
  onNext: () => void;
  onPrev: () => void;
  products: ProductType[];
  totalPrice: number;
}

// کامپوننت مرحله اول
export const Step1: React.FC<Step1Props> = ({
  onNext,
  data,
  onUpdate,
  products,
  onPrev,
  totalPrice,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(data || null);

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product);
    onUpdate(product);
  };

  return (
    <div className="flex flex-col justify-between  min-h-[75vh]">
      <div className="w-full flex flex-col justify-between items-center h-36">
        <Heram1Icon className="w-16 h-16" />
        {/* <Image
          src={"/images/icons/heram01.svg"}
          width={200}
          height={200}
          className="w-16 h-16"
          alt="heram 1"
        /> */}
        <h2 className="text-xl font-black mb-4 text-center">انتخاب طبقه اول</h2>
      </div>
      <div className="mt-16 flex flex-row flex-nowrap gap-0 justify-start overflow-x-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex flex-col items-start p-4 min-w-44 first:mr-0 transition-opacity duration-300 ${
              !selectedProduct
                ? "opacity-100"
                : selectedProduct === product
                ? " opacity-100"
                : "opacity-50"
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <ProductSlider className="mb-4" product={product} dots={false} />
            <div>
              <h2 className="text-sm font-black text-right">{product.name}</h2>
              <p className="text-xs mt-1 line-clamp-1">{product.description}</p>
            </div>
            <p className="text-sm mt-3.5">{formatCurrency(product.price)} </p>
          </div>
        ))}

        {/* </div> */}
      </div>
      <div className="flex justify-between mt-10 mx-4">
        <span className="font-bold text-sm">مبلغ قابل پرداخت</span>
        <span className="text-sm">{formatCurrency(totalPrice)}</span>
      </div>

      {/* <div className="px-4 flex flex-col justify-end items-end place-items-end h-[150px]"> */}
      <div className="my-8 flex justify-between gap-7 mx-2">
        <Button icon="right" variant="secondary" onClick={onPrev}>
          قبلی
        </Button>
        <Button className="w-full" onXsIsText onClick={onNext} disabled={!selectedProduct}>
          ادامه
        </Button>
      </div>
    </div>
  );
};
