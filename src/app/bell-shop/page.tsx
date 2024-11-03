import { Suspense } from "react";
import { fetchCategories, fetchInitialProducts } from "./actions";
import ClientShop from "@/components/BellShop/ClientShop";

async function BellShopPage() {
  // Fetch data on server side
  const categories = await fetchCategories();
  const initialProducts = await fetchInitialProducts(categories[0]?._id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientShop initialCategories={categories} initialProducts={initialProducts} />
    </Suspense>
  );
}

export default BellShopPage;
