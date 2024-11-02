import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileMainPageClient from "./ProfileMainPageClient";

async function getProfileData() {
  const token = cookies().get("auth_token")?.value;

  if (!token) {
    // logout();

    redirect("/api/auth/logout");
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      // logout();
      redirect("/api/auth/logout");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
}

export default async function ProfilePage() {
  const profileData = await getProfileData();

  return <ProfileMainPageClient profileData={profileData} />;
}
