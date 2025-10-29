import { trpc } from "@repo/trpc/client";
import { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CreateTodo from "./CreateTodo";
import EditTodo from "./EditTodo";

export default function TodosScreen() {
  const { data: todos, refetch, isRefetching } = trpc.todo.getAllTodos.useQuery();
  const utils = trpc.useUtils();
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    name: string;
    description: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  } | null>(null);

  const updateMutation = trpc.todo.updateTodo.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });

  const deleteMutaton = trpc.todo.deleteTodo.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });

  const handleToggle = (todoId: string, completed: boolean) => {
    updateMutation.mutate({ id: todoId, data: { completed: !completed } });
  };

  const handleDelete = (todoId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutaton.mutate({ id: todoId }),
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          colors={["#2563eb"]}
          tintColor="#2563eb"
        />
      }
    >
      <CreateTodo />

      {editingTodo && (
        <EditTodo
          visible={!!editingTodo}
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {todos?.map((todo) => (
        <View
          key={todo.id}
          style={{
            backgroundColor: "#fff",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Switch
                value={todo.completed}
                onValueChange={() => handleToggle(todo.id, todo.completed)}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                  textDecorationLine: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#888" : "#111",
                }}
              >
                {todo.name}
              </Text>
            </View>

            <Text style={{ color: "#444", marginTop: 4 }}>
              {todo.description}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 6 }}>
              {todo.dueDate && (
                <Text style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </Text>
              )}
              {todo.priority && (
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Priority:{" "}
                  {todo.priority.charAt(0).toUpperCase() +
                    todo.priority.slice(1)}
                </Text>
              )}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() =>
                setEditingTodo({
                  id: todo.id,
                  name: todo.name,
                  description: todo.description,
                  dueDate: todo.dueDate,
                  priority: todo.priority,
                })
              }
            >
              <Text style={{ color: "#2563eb", fontSize: 14, fontWeight: "600" }}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(todo.id)}>
              <Text style={{ color: "#dc2626", fontSize: 14, fontWeight: "600" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
