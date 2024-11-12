import { Suspense } from "react";
import { fetchProducts } from "./actions";
import BellMazehClient from "@/components/BellMazeh/ClientShop";

async function BellShopPage() {
  // Fetch data on server side
  const initialProducts = await fetchProducts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BellMazehClient initialProducts={initialProducts} />
    </Suspense>
  );
}

export default BellShopPage;
