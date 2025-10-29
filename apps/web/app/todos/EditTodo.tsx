"use client";

import { trpc } from "@repo/trpc/client";
import { useState } from "react";

interface EditTodoProps {
  todo: {
    id: string;
    name: string;
    description: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
  onClose: () => void;
}

export default function EditTodo({ todo, onClose }: EditTodoProps) {
  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description);
  const [dueDate, setDueDate] = useState(todo.dueDate || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">(
    todo.priority || ""
  );
  const utils = trpc.useUtils();

  const mutation = trpc.todo.updateTodo.useMutation({
    onSuccess: () => {
      utils.todo.getAllTodos.invalidate();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    mutation.mutate({
      id: todo.id,
      data: {
        name,
        description,
        dueDate,
        priority: priority || undefined,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md w-full p-6 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Edit Todo
        </h2>

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
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none"
          rows={3}
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

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 font-medium transition disabled:opacity-50"
          >
            {mutation.isPending ? "Updating..." : "Update Todo"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex-1 font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
