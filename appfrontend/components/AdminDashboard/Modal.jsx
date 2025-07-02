import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
// Optional toast library (you can replace with Alert if needed)
import Toast from "react-native-toast-message";

const CustomModal = ({ show, handleClose }) => {
  const [addAdmin, setAddAdmin] = useState({ adminId: "", password: "" });
  const baseUrl = "http://localhost:8000/api/admin/signup";

  const onSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // Use react-native-async-storage/async-storage

      if (!token) {
        Toast.show({ type: "error", text1: "You must be logged in to add an admin." });
        return;
      }

      await axios.post(baseUrl, addAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({ type: "success", text1: "Admin added successfully" });
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Adding Admin failed";
      Toast.show({ type: "error", text1: errorMessage });
    }
  };

  const handleChange = (field, value) => {
    setAddAdmin({ ...addAdmin, [field]: value });
  };

  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Enter Admin Details</Text>

          <Text style={styles.label}>Admin ID:</Text>
          <TextInput
            style={styles.input}
            value={addAdmin.adminId}
            onChangeText={(text) => handleChange("adminId", text)}
            placeholder="Enter Admin ID"
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={addAdmin.password}
            secureTextEntry
            onChangeText={(text) => handleChange("password", text)}
            placeholder="Enter Password"
          />

          <TouchableOpacity onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 15,
    width: "80%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    transform: [{ translateY: 0 }], // for animation (custom control needed)
  },
  modalClose: {
    position: "absolute",
    right: 12,
    top: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: "#aaa",
  },
  modalForm: {
    marginTop: 30,
  },
  modalLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  modalInput: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomModal;
