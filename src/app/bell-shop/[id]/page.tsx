// product/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductType } from "@/hooks/cartType";
import ProductDetails from "./ProductDetails";
import MainHeader from "@/components/mobile/Header/MainHeader";

async function getProduct(id: string): Promise<ProductType[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return {
    title: product ? `${product[0].title} | فروشگاه` : "محصول یافت نشد",
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const data = await getProduct(params.id);
  const product = Array.isArray(data) ? data[0] : data;

  if (!product) {
    notFound();
  }

  return (
    <>
      <MainHeader noBorder />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetails product={product} />
      </Suspense>
    </>
  );
}
