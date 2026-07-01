import { redirect } from "next/navigation";
import { getAuthenticatedFounder } from "@/data/auth/server-session";

export default async function Page() {
  const founder = await getAuthenticatedFounder();

  redirect(founder ? "/app" : "/login");
}
