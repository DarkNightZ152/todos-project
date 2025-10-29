"use client";

import { trpc } from "@repo/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import CreateTodo from "./CreateTodo";
import EditTodo from "./EditTodo";

export default function Todos() {
  const { data: todos, refetch, isRefetching } =
    trpc.todo.getAllTodos.useQuery();
  const utils = trpc.useUtils();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    name: string;
    description: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  const updateMutation = trpc.todo.updateTodo.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });

  const deleteMutation = trpc.todo.deleteTodo.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });

  const handleToggle = (todoId: string, completed: boolean) => {
    updateMutation.mutate({
      id: todoId,
      data: {
        completed: !completed,
      },
    });
  };

  const handleDelete = (todoId: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteMutation.mutate({ id: todoId });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
          {user && (
            <p className="text-gray-600 text-sm">Welcome, {user.name}!</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefetching ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create Todo Button */}
      <button
        onClick={() => setCreateModalVisible(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition w-full mb-4"
      >
        + Create Todo
      </button>

      <CreateTodo
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      {editingTodo && (
        <EditTodo todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
      {todos?.map((todo) => (
        <div
          className="border rounded p-4 bg-white shadow-sm flex justify-between items-start"
          key={todo.id}
        >
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />

            <div>
              <h3
                className={`text-lg font-medium ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {todo.name}
              </h3>
              <p className="text-gray-700">{todo.description}</p>

              <div className="text-sm text-gray-500 mt-1 space-x-2">
                {todo.dueDate && (
                  <span>
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
                {todo.priority && (
                  <span>
                    Priority:{" "}
                    {todo.priority.charAt(0).toUpperCase() +
                      todo.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() =>
                setEditingTodo({
                  id: todo.id,
                  name: todo.name,
                  description: todo.description,
                  dueDate: todo.dueDate,
                  priority: todo.priority,
                })
              }
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
