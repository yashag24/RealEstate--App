import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const nameInputRef = useRef(null);

  const fetchStaff = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const res = await axios.get("http://localhost:8000/api/staff/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data.reverse());
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to fetch staff list." });
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { fullName, email, password, role } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !password || !role) {
      Toast.show({ type: "info", text1: "Please fill out all fields." });
      return;
    }

    if (!emailRegex.test(email)) {
      Toast.show({ type: "info", text1: "Please enter a valid email address." });
      return;
    }

    const token = await AsyncStorage.getItem("authToken");
    try {
      await axios.post("http://localhost:8000/api/staff/signup", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({ type: "success", text1: "Staff created successfully!" });
      setShowModal(false);
      fetchStaff();
      setForm({ fullName: "", email: "", password: "", role: "" });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || "Failed to create staff.",
      });
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this staff?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("authToken");
          try {
            await axios.delete(`http://localhost:8000/api/staff/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Toast.show({ type: "success", text1: "Staff deleted successfully." });
            fetchStaff();
          } catch {
            Toast.show({ type: "error", text1: "Failed to delete staff." });
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Toast position="top" />
      <Text style={styles.header}>Staff Management</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+ Add Staff</Text>
      </TouchableOpacity>

      <FlatList
        data={staffList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.staffRow}>
            <Text style={styles.staffCell}>{item.staffId}</Text>
            <Text style={styles.staffCell}>{item.fullName}</Text>
            <Text style={styles.staffCell}>{item.email}</Text>
            <Text style={styles.staffCell}>{item.role}</Text>
            <Text style={styles.staffCell}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Staff</Text>

            <TextInput
              ref={nameInputRef}
              style={styles.input}
              placeholder="Full Name"
              value={form.fullName}
              onChangeText={(text) => handleChange("fullName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              keyboardType="email-address"
              onChangeText={(text) => handleChange("email", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Role (e.g., support)"
              value={form.role}
              onChangeText={(text) => handleChange("role", text)}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  staffContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  staffHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  addStaffButton: {
    backgroundColor: "#007bff",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 20,
    alignItems: "center",
  },
  addStaffButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  staffRow: {
    backgroundColor: "white",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#c6c4c4",
    marginBottom: 5,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  staffCell: {
    fontSize: 14,
    marginBottom: 4,
  },
  staffModalOverlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  staffModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
    textAlign: "center",
  },
  staffInput: {
    width: "100%",
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
  },
  staffSelect: {
    width: "100%",
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
  },
  staffModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  staffCreateButton: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  staffCancelButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  deleteButtonStaff: {
    backgroundColor: "#e74c3c",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontWeight: "500",
    marginTop: 6,
    textAlign: "center",
  },
});


export default StaffManagement;
