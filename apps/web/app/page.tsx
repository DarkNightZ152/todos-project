"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./auth/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Todos App
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your tasks efficiently
        </p>
        {isAuthenticated ? (
          <button
            onClick={() => router.push("/todos")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl"
          >
            Go to Todos
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
