import { logout } from "@/app/actions/auth";

export async function GET() {
  return logout();
}
