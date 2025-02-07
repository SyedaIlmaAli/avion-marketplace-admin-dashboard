'use client';

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome back, Admin!</h1>
      <p className="text-lg text-gray-700 mb-6">
        If you want to get access to this private dashboard, then please sign in.
      </p>
      <LoginLink orgCode="org_43d75a34998a" className="py-2 px-8 bg-blue-600 text-white font-bold rounded-lg text-center hover:bg-blue-700">Sign in</LoginLink>
    </div>
  );
}
