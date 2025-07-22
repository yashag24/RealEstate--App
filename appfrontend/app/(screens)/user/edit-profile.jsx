// app/UserProfile.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Stub components for mobile UI
const Navbar_local = () => {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#784dc6",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 12, padding: 4 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      {/* <Text
        style={{ color: "#fff", fontWeight: "bold", fontSize: 20, flex: 1 }}
      >
        My Appointments
      </Text> */}
    </View>
  );
};

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const placeholderImg = require("@/assets/images/profile-placeholder.png");

const UserProfile = () => {
  const router = useRouter();

  const [isEditable, setIsEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inputValues, setInputValues] = useState({
    role: "",
    name: "",
    phoneNumber: "",
    mail: "",
    state: "",
    city: "",
    address: "",
    landlineNumber: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // URI
  const [removeImage, setRemoveImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRequiredFilled, setIsRequiredFilled] = useState(true);
  const [userId, setUserId] = useState(null);

  // Load from token or AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return router.replace("/");
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded._id || decoded.id);
        setInputValues({
          role: decoded.role || "User",
          name: `${decoded.firstname || ""} ${decoded.lastname || ""}`.trim(),
          phoneNumber: decoded.phoneNumber || "",
          mail: decoded.email || "",
          state: decoded.state || "",
          city: decoded.city || "",
          address: decoded.address || "",
          landlineNumber: decoded.landlineNumber || "",
        });
        setSelectedImage(decoded.image || null);
      } catch {
        Alert.alert("Session Invalid", "Please log in again.");
        router.replace("/");
      }
    })();
  }, []);

  // Validate fields on every change
  useEffect(() => {
    const errors = {};
    if (!inputValues.name) errors.name = "Required";
    if (!inputValues.phoneNumber) errors.phoneNumber = "Required";
    if (!inputValues.mail) errors.mail = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValues.mail))
      errors.mail = "Invalid email format";
    if (!inputValues.state) errors.state = "Required";
    if (!inputValues.city) errors.city = "Required";
    if (!inputValues.address) errors.address = "Required";
    if (inputValues.landlineNumber && !/^\d+$/.test(inputValues.landlineNumber))
      errors.landlineNumber = "Must be numeric";
    setValidationErrors(errors);
    setIsRequiredFilled(Object.keys(errors).length === 0);
  }, [inputValues]);

  // Pick image from gallery
  const handleChangeProfileImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Grant media permissions to pick images."
      );
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setSelectedImage(pickerResult.assets[0].uri);
      setRemoveImage(false);
    }
  };

  const handleRemoveProfileImage = () => {
    setSelectedImage(null);
    setRemoveImage(true);
  };

  const handleInputChange = (field, value) =>
    setInputValues((old) => ({ ...old, [field]: value }));

  // Upload profile and (new) image
  const handleSave = async () => {
    if (!isRequiredFilled) {
      Alert.alert("Incomplete", "Please check the highlighted errors.");
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("authToken");

      const formData = new FormData();
      Object.entries(inputValues).forEach(([k, v]) => formData.append(k, v));
      if (selectedImage && !removeImage) {
        // get file extension
        const ext = selectedImage.split(".").pop();
        formData.append("image", {
          uri: selectedImage,
          name: `profile.${ext || "jpg"}`,
          type: "image/jpeg",
        });
      }
      if (removeImage) formData.append("removeImage", "true");

      const response = await fetch(`${API_URL}/api/user-update/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: DO NOT add 'Content-Type'; fetch sets it correctly for FormData
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Profile Saved", "Your profile was updated.");
        // Save latest to AsyncStorage, update token if returned
        await AsyncStorage.setItem("userProfile", JSON.stringify(inputValues));
        if (data.token) await AsyncStorage.setItem("authToken", data.token);
        setIsEditable(false);
      } else {
        Alert.alert("Failed", data.message || "Profile update failed.");
      }
    } catch (error) {
      Alert.alert("Failed", "There was a problem saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    await AsyncStorage.clear();
    setShowDeleteModal(false);
    router.replace("/login");
  };

  if (!userId) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator color="#7e45b8" size="large" />
        <Text style={{ marginTop: 7 }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      {/* Navbar Component */}
      <Navbar_local />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.profileHeader}>
            <Image
              source={selectedImage ? { uri: selectedImage } : placeholderImg}
              style={styles.profileImage}
            />
            {isEditable && (
              <TouchableOpacity
                style={styles.editImgBtn}
                onPress={handleChangeProfileImage}
              >
                <Text style={styles.editImgBtnText}>Change Photo</Text>
              </TouchableOpacity>
            )}
            {isEditable && selectedImage && (
              <TouchableOpacity
                style={styles.removeImgBtn}
                onPress={handleRemoveProfileImage}
              >
                <Text style={styles.removeImgBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.card}>
            {/* Render Profile Fields */}
            {[
              { label: "Role", key: "role", editable: false },
              { label: "Name *", key: "name" },
              { label: "Phone Number *", key: "phoneNumber" },
              { label: "Landline Number", key: "landlineNumber" },
              { label: "Email *", key: "mail" },
              { label: "State *", key: "state" },
              { label: "City *", key: "city" },
              { label: "Address *", key: "address" },
            ].map((field) => (
              <View style={styles.inputBlock} key={field.key}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    field.editable === false || !isEditable
                      ? styles.inputReadonly
                      : {},
                    validationErrors[field.key] ? styles.inputError : {},
                  ]}
                  editable={field.editable !== false && isEditable}
                  value={inputValues[field.key]}
                  onChangeText={(v) => handleInputChange(field.key, v)}
                  keyboardType={
                    field.key === "phoneNumber" ||
                    field.key === "landlineNumber"
                      ? "phone-pad"
                      : "default"
                  }
                  autoCapitalize="none"
                />
                {validationErrors[field.key] && (
                  <Text style={styles.error}>
                    {validationErrors[field.key]}
                  </Text>
                )}
              </View>
            ))}
            {isEditable && (
              <TouchableOpacity
                style={
                  isRequiredFilled && !saving
                    ? styles.saveBtnActive
                    : styles.saveBtnInactive
                }
                disabled={!isRequiredFilled || saving}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? "Saving..." : "Save Profile"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditable((prev) => !prev)}
            >
              <Text style={styles.editBtnText}>
                {isEditable ? "Cancel Edit" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
            <View style={styles.extraLinks}>
              <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                <Text style={styles.deleteLink}>Delete My Account</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Delete modal */}
          <Modal visible={showDeleteModal} transparent animationType="fade">
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 19,
                    color: "#be0a30",
                    marginBottom: 10,
                  }}
                >
                  Delete Account?
                </Text>
                <Text style={{ marginBottom: 18 }}>
                  Are you sure you want to delete your account? This cannot be
                  undone.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    style={styles.modalDeleteBtn}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Yes, Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={{ color: "#7e45b8", fontWeight: "bold" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 60,
    paddingHorizontal: 18,
    backgroundColor: "#f6f5fa",
    alignItems: "center",
    flexGrow: 1,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f5fa",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#773ac1",
    marginBottom: 14,
    alignSelf: "center",
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ececf5",
    marginBottom: 9,
  },
  editImgBtn: {
    backgroundColor: "#7126b6",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  editImgBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  removeImgBtn: {
    backgroundColor: "#fff",
    borderColor: "#be0a30",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  removeImgBtnText: {
    color: "#be0a30",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    elevation: 2,
    marginBottom: 40,
  },
  inputBlock: {
    marginBottom: 13,
  },
  label: {
    fontWeight: "bold",
    color: "#773ac1",
    marginBottom: 2,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f6f5fa",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 11,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ecebed",
    color: "#453a49",
  },
  inputReadonly: {
    backgroundColor: "#f0eef5",
    color: "#aba9ae",
  },
  inputError: {
    borderColor: "#cf2323",
  },
  error: {
    color: "#cf2323",
    fontSize: 12,
    marginTop: 2,
  },
  saveBtnActive: {
    backgroundColor: "#7e45b8",
    marginTop: 11,
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: "center",
  },
  saveBtnInactive: {
    backgroundColor: "#d7cbe1",
    marginTop: 11,
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  editBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#7e45b8",
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  editBtnText: {
    color: "#7e45b8",
    fontWeight: "bold",
    fontSize: 15,
  },
  extraLinks: {
    marginTop: 30,
    alignItems: "center",
  },
  deleteLink: {
    color: "#be0a30",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(13,1,34,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 27,
    borderRadius: 14,
    width: 295,
    alignItems: "center",
    shadowColor: "#713bb8",
    shadowOpacity: 0.17,
    shadowRadius: 18,
    elevation: 12,
  },
  modalDeleteBtn: {
    backgroundColor: "#be0a30",
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 7,
    marginTop: 5,
  },
  modalCancelBtn: {
    backgroundColor: "#f3eafd",
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 7,
    marginTop: 5,
  },
});
