"use server";

export async function fetchCleans() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clean`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching initial products:", error);
    return [];
  }
}
