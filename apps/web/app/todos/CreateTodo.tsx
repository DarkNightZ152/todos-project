"use client";

import { trpc } from "@repo/trpc/client";
import { useState } from "react";

interface CreateTodoProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateTodo({ visible, onClose }: CreateTodoProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
  const utils = trpc.useUtils();

  const mutation = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setDueDate("");
      setPriority("");
      utils.todo.getAllTodos.invalidate();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    mutation.mutate({
      name,
      description,
      completed: false,
      dueDate,
      priority: priority || undefined,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Create a Todo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Todo name"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
          />

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as "" | "low" | "medium" | "high");
            }}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none"
          >
            <option value="">Priority (Optional)</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 font-medium transition disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create Todo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded flex-1 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
