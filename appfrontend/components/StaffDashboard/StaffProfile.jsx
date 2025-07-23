import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { toast } from "react-native-toast-message";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // for mobile, you should use react-native-vector-icons

const StaffProfile = ({ staff, updateToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(staff);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (staff) setEditedStaff(staff);
  }, [staff]);

  if (!staff) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleChange = (name, value) => {
    setEditedStaff({ ...editedStaff, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/staff/update-detail/${staff._id}`,
        {
          fullName: editedStaff.fullName,
          email: editedStaff.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      toast.show({ type: "success", text1: "Profile updated successfully!" });
      localStorage.setItem("authToken", response.data.token);
      updateToken();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.show({ type: "error", text1: "Failed to update profile." });
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return toast.show({ type: "info", text1: "Please fill both password fields." });
    }
    try {
      await axios.put(
        `http://localhost:8000/api/staff/${staff._id}/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.show({ type: "success", text1: "Password changed successfully." });
      setOldPassword("");
      setNewPassword("");
      setShowPasswordChange(false);
    } catch (err) {
      console.error(err);
      toast.show({ type: "error", text1: "Failed to change password." });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 Staff Profile</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Staff ID</Text>
          <Text>{staff.staffId}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff?.fullName}
              onChangeText={(text) => handleChange("fullName", text)}
            />
          ) : (
            <Text>{staff.fullName}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff?.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          ) : (
            <Text>{staff.email}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Role</Text>
          <Text>{staff.role}</Text>
        </View>

        <View style={styles.buttonRow}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditedStaff(staff);
                  setIsEditing(false);
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
              <Text style={styles.btnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {!showPasswordChange ? (
          <TouchableOpacity onPress={() => setShowPasswordChange(true)}>
            <Text style={styles.link}>🔐 Change Password</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Old Password</Text>
              <TextInput
                style={styles.input}
                value={oldPassword}
                secureTextEntry={!showOld}
                onChangeText={setOldPassword}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                secureTextEntry={!showNew}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleChangePassword} style={styles.saveBtn}>
                <Text style={styles.btnText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordChange(false);
                  setOldPassword("");
                  setNewPassword("");
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    width: "100%",
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  saveBtn: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  cancelBtn: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  editBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 16,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
});

export default StaffProfile;
