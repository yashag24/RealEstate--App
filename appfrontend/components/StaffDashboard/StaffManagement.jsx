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
  Platform,
  KeyboardAvoidingView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { addEmployee } from '@/redux/Auth/AuthSlice';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const nameInputRef = useRef(null);
  const dispatch = useDispatch();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    const { fullName, email, password } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName || !email || !password) {
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
      const credentials = {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: 'staff'
      };
      const res = await dispatch(addEmployee(credentials));
      if (res.error) throw new Error(res.payload?.message || 'Signup failed');
      Toast.show({ type: 'success', text1: 'Staff added successfully' });
      setShowModal(false);
      setForm({ fullName: "", email: "", password: "" });
      fetchStaff();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    let proceed = false;
    if (Platform.OS === 'web') {
      proceed = window.confirm("Are you sure you want to delete this staff member?");
    } else {
      proceed = await new Promise(res => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this staff member?",
          [
            { text: "Cancel", style: "cancel", onPress: () => res(false) },
            { text: "Delete", style: "destructive", onPress: () => res(true) }
          ],
          { cancelable: true }
        );
      });
    }
    if (!proceed) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error();
      Toast.show({ type: 'success', text1: 'Staff deleted successfully' });
      fetchStaff();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete staff.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({ fullName: "", email: "", password: "" });
    setShowModal(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const renderStaffItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCellText}>{item.staffId}</Text>
      <Text style={styles.tableCellText}>{item.fullName}</Text>
      <Text style={styles.tableCellText}>{item.email}</Text>
      <Text style={styles.tableCellText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)} disabled={loading}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff Management        </Text>
        <TouchableOpacity style={styles.addButton} onPress={openModal} disabled={loading}>
          <Text style={styles.addButtonText}>+ Add Staff</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      <FlatList
        data={staffList}
        renderItem={renderStaffItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={!loading && <Text style={styles.emptyStateText}>No staff members found</Text>}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Staff</Text>
            <TextInput
              ref={nameInputRef}
              style={styles.input}
              placeholder="Full Name"
              value={form.fullName}
              onChangeText={v => handleChange('fullName', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={v => handleChange('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              secureTextEntry
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.createButton} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)} disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Toast topOffset={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e9ecef' },
  tableCellText: { flex: 1, textAlign: 'center', color: '#495057' },
  deleteButton: { backgroundColor: '#dc3545', padding: 6, borderRadius: 6 },
  deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyStateText: { textAlign: 'center', color: '#6c757d', marginTop: 40 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#f8f9fa' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  createButton: { backgroundColor: '#28a745', flex: 1, padding: 12, borderRadius: 8, marginRight: 8 },
  createButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  cancelButton: { backgroundColor: '#6c757d', flex: 1, padding: 12, borderRadius: 8 },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default StaffManagement;
