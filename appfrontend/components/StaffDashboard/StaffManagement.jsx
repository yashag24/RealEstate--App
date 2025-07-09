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
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get('window');

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
  
  // Fixed: Added fallback for BASE_URL
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const nameInputRef = useRef(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      // Check if BASE_URL is properly configured
      if (!BASE_URL || BASE_URL === 'undefined') {
        throw new Error('API base URL not configured. Please check your environment variables.');
      }

      const token = await AsyncStorage.getItem("authToken");
      
      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('Fetching staff from:', `${BASE_URL}/api/staff/all`);
      
      const res = await axios.get(`${BASE_URL}/api/staff/all`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000, // 10 second timeout
      });

      // Check if response has data
      if (res.data) {
        setStaffList(Array.isArray(res.data) ? res.data.reverse() : []);
      } else {
        setStaffList([]);
      }
      
    } catch (err) {
      console.error('Error fetching staff:', err);
      
      let errorMessage = "Failed to fetch staff list.";
      
      if (err.message.includes('Network Error')) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
        // Optionally redirect to login
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to view staff list.";
      } else if (err.response?.status === 404) {
        errorMessage = "Staff endpoint not found. Please check API configuration.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Toast.show({ 
        type: "error", 
        text1: errorMessage,
        text2: err.response?.data?.message || ''
      });
      
      setStaffList([]);
    } finally {
      setLoading(false);
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
    
    if (!token) {
      Toast.show({ type: "error", text1: "Authentication token not found. Please login again." });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/staff/signup`, form, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000,
      });
      Toast.show({ type: "success", text1: "Staff created successfully!" });
      setShowModal(false);
      fetchStaff();
      setForm({ fullName: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error('Error creating staff:', err);
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
          
          if (!token) {
            Toast.show({ type: "error", text1: "Authentication token not found. Please login again." });
            return;
          }

          try {
            await axios.delete(`${BASE_URL}/api/staff/${id}`, {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: 10000,
            });
            Toast.show({ type: "success", text1: "Staff deleted successfully." });
            fetchStaff();
          } catch (err) {
            console.error('Error deleting staff:', err);
            Toast.show({ 
              type: "error", 
              text1: err.response?.data?.message || "Failed to delete staff." 
            });
          }
        },
      },
    ]);
  };

  const renderStaffHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Staff ID</Text>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Email</Text>
      <Text style={styles.headerCell}>Role</Text>
      <Text style={styles.headerCell}>Created</Text>
      <Text style={styles.headerCell}>Action</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast position="top" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>Staff Management</Text>
        <Text style={styles.subtitle}>Manage your team members</Text>
      </View>

      {/* Add Staff Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add New Staff</Text>
      </TouchableOpacity>

      {/* Staff List */}
      <View style={styles.listContainer}>
        {renderStaffHeader()}
        <FlatList
          data={staffList}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchStaff}
          renderItem={({ item, index }) => (
            <View style={[
              styles.staffRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <View style={styles.staffInfo}>
                <Text style={styles.staffId}>{item.staffId || 'N/A'}</Text>
                <Text style={styles.staffName}>{item.fullName || 'N/A'}</Text>
                <Text style={styles.staffEmail}>{item.email || 'N/A'}</Text>
                <Text style={styles.staffRole}>{item.role || 'N/A'}</Text>
                <Text style={styles.staffDate}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDelete(item._id || item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {loading ? "Loading staff..." : "No staff members found"}
              </Text>
              <Text style={styles.emptySubtext}>
                {loading ? "Please wait..." : "Add your first staff member to get started"}
              </Text>
            </View>
          }
        />
      </View>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Staff Member</Text>
                <Text style={styles.modalSubtitle}>Fill in the details below</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  ref={nameInputRef}
                  style={styles.input}
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChangeText={(text) => handleChange("fullName", text)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={form.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) => handleChange("email", text)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., support, admin, manager"
                  value={form.role}
                  onChangeText={(text) => handleChange("role", text)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.createButton} 
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Create Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                  activeOpacity={0.8}
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
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "400",
  },
  addButton: {
    backgroundColor: "#007bff",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#dee2e6",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#fafbfc",
  },
  staffInfo: {
    flex: 1,
    flexDirection: "row",
  },
  staffId: {
    flex: 1,
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },
  staffName: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
    fontWeight: "600",
  },
  staffEmail: {
    flex: 1,
    fontSize: 13,
    color: "#6c757d",
  },
  staffRole: {
    flex: 1,
    fontSize: 13,
    color: "#007bff",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  staffDate: {
    flex: 1,
    fontSize: 12,
    color: "#868e96",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6c757d",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#adb5bd",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#212529",
    backgroundColor: "#f8f9fa",
    minHeight: 48,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
  createButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButtonText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default StaffManagement;