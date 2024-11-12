"use server";

export async function fetchProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/tasting-tray`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching products tasting:", error);
    return [];
  }
}
