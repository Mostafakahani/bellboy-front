import { fetchCategories, fetchInitialProducts } from "./actions";
import ClientShop from "@/components/BellShop/ClientShop";

async function BellShopPage({ params }: { params: { slug?: string[] } }) {
  const parentCategory = params.slug?.[0] || null;
  const subCategory = params.slug?.[1] || null;
  const categories = await fetchCategories();
  const initialProducts = await fetchInitialProducts(parentCategory || categories[0]?._id);

  return (
    <ClientShop
      initialCategories={categories}
      initialProducts={initialProducts}
      // parentCategory={parentCategory}
      // subCategory={subCategory}
      serverInitialParentCategory={parentCategory || categories[0]?._id}
      serverInitialSubCategory={subCategory}
    />
  );
}

export default BellShopPage;
