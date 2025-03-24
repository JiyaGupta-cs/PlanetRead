"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session]);

  return (
    <div className="bg-[#ECE6F0] h-screen items-center justify-center flex flex-col">
      <p className="text-black">Not signed in</p>
      <button className="bg-purple-700 rounded-md text-white" onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
