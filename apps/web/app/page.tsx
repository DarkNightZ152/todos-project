"use client";

import { trpc } from "@repo/trpc/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data } = trpc.todo.getAllTodos.useQuery();
  const router = useRouter();

  console.log("Data", data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Todos App
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your tasks efficiently
        </p>
        <button
          onClick={() => router.push("/todos")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl"
        >
          Go to Todos
        </button>
      </div>
    </div>
  );
}
