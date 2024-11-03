"use server";

export async function fetchCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`, {
      cache: "no-store", // یا از revalidate استفاده کنید اگر می‌خواهید کش داشته باشید
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function fetchInitialProducts(categoryId: string) {
  if (!categoryId) return [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/cat/${categoryId}`,
      {
        cache: "no-store",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching initial products:", error);
    return [];
  }
}
