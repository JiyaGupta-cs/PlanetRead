"use client";
import { signOut } from "next-auth/react";
import React from "react";

const SignOut = () => {
  return (
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
};

export default SignOut;
