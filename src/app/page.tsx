"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Alma</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your intelligent clinic assistant platform
        </p>
        
        <div className="space-x-4">
          <Link
            href="/sign-in"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors inline-block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
