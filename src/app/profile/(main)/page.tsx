"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import ProfileMainPageClient from "./ProfileMainPageClient";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = getCookie("auth_token");

      if (!token) {
        // Redirect to logout if token is not found
        router.push("/api/auth/logout");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          // Redirect to logout if unauthorized
          router.push("/api/auth/logout");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Handle the error as needed
      }
    };

    fetchProfileData();
  }, [router]);
  if (!profileData) return;
  return <ProfileMainPageClient profileData={profileData} />;
}
