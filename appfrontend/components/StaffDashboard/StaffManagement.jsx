import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const nameInputRef = useRef(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/all`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
      Alert.alert("Error", "Failed to fetch staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { fullName, email, password, role } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !password || !role) {
      Alert.alert("Validation Error", "Please fill out all fields.");
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create staff");
      }

      Alert.alert("Success", "Staff created successfully!");
      setShowModal(false);
      fetchStaff();
      setForm({ fullName: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Failed to create staff:", err);
      Alert.alert("Error", err.message || "Failed to create staff. Try again.");
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (id) => {
    // Web confirmation
    if (Platform.OS === 'web') {
      const ok = window.confirm("Are you sure you want to delete this staff member?");
      if (!ok) return;
    }
    // Mobile confirmation
    else {
      let proceed = false;
      await new Promise(resolve => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this staff member?",
          [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            { text: "Delete", style: "destructive", onPress: () => resolve(true) }
          ],
          { cancelable: true }
        );
      }).then(res => proceed = res);
      if (!proceed) return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete staff");
      if (Platform.OS === 'web') alert("Staff deleted successfully.");
      else Alert.alert("Success", "Staff deleted successfully.");
      fetchStaff();
    } catch (err) {
      console.error(err);
      const msg = "Failed to delete staff.";
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({ fullName: "", email: "", password: "", role: "" });
    setShowModal(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const renderStaffItem = ({ item: staff }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{staff.staffId}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{staff.fullName}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{staff.email}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{staff.role}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>
          {new Date(staff.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(staff._id)}
          disabled={loading}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Staff ID</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Name</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Email</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Role</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Created</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Actions</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={openModal}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>+ Add Staff</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      <View style={styles.table}>
        {renderTableHeader()}
        <FlatList
          data={staffList.slice().reverse()}
          renderItem={renderStaffItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No staff members found</Text>
              </View>
            )
          }
        />
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add New Staff</Text>
              
              <TextInput
                ref={nameInputRef}
                style={styles.input}
                placeholder="Full Name"
                value={form.fullName}
                onChangeText={(value) => handleChange("fullName", value)}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={form.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry
              />
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.role}
                  onValueChange={(value) => handleChange("role", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Appointment Manager" value="appointment_manager" />
                  <Picker.Item label="Verifier" value="verifier" />
                  <Picker.Item label="Support" value="support" />
                </Picker>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.createButtonText}>
                    {loading ? "Creating..." : "Create"}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6c757d",
  },
  table: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#343a40",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tableCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontSize: 14,
    color: "#495057",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default StaffManagement;