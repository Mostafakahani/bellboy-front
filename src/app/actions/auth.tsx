"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  cookies().delete("auth_token");
  redirect("/profile/auth");
}
