"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="bg-[#ECE6F0] h-screen items-center justify-center flex">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-80"
      >
        <p className="text-purple-700 font-black text-center">Login To Analytics Dashboard</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border p-2 border-purple-700 placeholder:text-gray-500 placeholder:text-sm text-gray-800"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border p-2 border-purple-700 placeholder:text-gray-500 placeholder:text-sm text-gray-800"
        />
        <button type="submit" className="p-2 bg-purple-700 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
