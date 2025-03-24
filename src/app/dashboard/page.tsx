import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import SignOut from "@/components/SignOut";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <p>This is a protected dashboard page</p>

      <SignOut/>
    </div>
  );
}
