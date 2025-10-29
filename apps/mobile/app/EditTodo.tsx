import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { trpc } from "@repo/trpc/client";
import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface EditTodoProps {
  visible: boolean;
  todo: {
    id: string;
    name: string;
    description: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
  onClose: () => void;
}

export default function EditTodo({ visible, todo, onClose }: EditTodoProps) {
  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">(
    todo.priority || ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const utils = trpc.useUtils();
  const mutation = trpc.todo.updateTodo.useMutation({
    onSuccess: () => {
      utils.todo.getAllTodos.invalidate();
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) return;

    mutation.mutate({
      id: todo.id,
      data: {
        name,
        description,
        dueDate: dueDate?.toISOString(),
        priority: priority || undefined,
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Todo</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Todo name"
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 80 }]}
          />

          <View style={{ marginBottom: 12 }}>
            <Button
              title={dueDate ? dueDate.toDateString() : "Pick due date"}
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={dueDate ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDueDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => {
                setPriority(itemValue);
              }}
            >
              <Picker.Item label="Priority (optional)" value="" />
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            {mutation.isPending ? (
              <ActivityIndicator color="#2563eb" />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handleSubmit}
                  disabled={mutation.isPending}
                >
                  <Text style={styles.updateButtonText}>Update Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 8,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#2563eb",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#d1d5db",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
