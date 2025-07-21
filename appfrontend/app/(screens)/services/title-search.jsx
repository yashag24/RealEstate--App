// app/title-search-services.jsx
import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import { StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import Navbar from "@/components/home/Navbar";


// If you have Navbar/Footer as native components, import. Otherwise, omit for now.

export default function TitleSearchServices() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState(null);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    PropertyCity: "",
    PropertyState: "",
    propertyType: "",
    PropertyRegistrationNumber: "",
    ContactFullName: "",
    ContactEmail: "",
    ContactPhone: "",
    ContactNotes: "",
    Documents: [],
  });

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.Documents];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, Documents: updatedFiles });
  };

  const handlePickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: Platform.OS === "ios" ? ["public.data", "public.image"] : "*/*"
      });
      if (!result.canceled) {
        // result.assets is an array of files
        const newFiles = result.assets.filter(
          (file) =>
            !formData.Documents.some(
              (existingFile) =>
                existingFile.name === file.name && existingFile.size === file.size
            )
        );
        setFormData({
          ...formData,
          Documents: [...formData.Documents, ...newFiles],
        });
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Documents") {
          value.forEach((file) => {
            data.append("Documents", {
              uri: file.uri,
              name: file.name,
              type: file.mimeType || "application/octet-stream",
            });
          });
        } else {
          data.append(key, value);
        }
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/title-search/create-request`,
        {
          method: "POST",
          body: data,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Something went wrong.");
      }

      const result = await response.json();
      Alert.alert("Success", "Request submitted successfully!");
      setSubmittedRequestId(result.requestId);
      setShowModal(false);
      setFormData({
        propertyAddress: "",
        PropertyCity: "",
        PropertyState: "",
        propertyType: "",
        PropertyRegistrationNumber: "",
        ContactFullName: "",
        ContactEmail: "",
        ContactPhone: "",
        ContactNotes: "",
        Documents: [],
      });
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Navbar here if you have one */}
      <Navbar/>
      {submittedRequestId && (
        <View style={styles.requestIdBox}>
          <Text style={{ fontWeight: "bold" }}>
            ✅ Your Request ID: {submittedRequestId}
          </Text>
          <Text>Please save this for future reference.</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSubmittedRequestId(null)}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>🔍 Property Title Search Services</Text>
        <Text style={styles.subtitle}>
          Ensure your next property deal is legally sound and secure with our trusted verification service.
        </Text>
      </View>

      {/* Service grid */}
      <View style={styles.gridSection}>
        <View style={styles.card}>
          <MaterialIcons name="description" size={30} color="#4285f4" />
          <Text style={styles.cardTitle}>What’s Included</Text>
          <Text>✅ Title Ownership History</Text>
          <Text>✅ Encumbrance & Mortgage Check</Text>
          <Text>✅ Dispute & Litigation Check</Text>
          <Text>✅ Chain of Title Verification</Text>
          <Text>✅ Final Legal Opinion Report</Text>
        </View>
        <View style={styles.card}>
          <FontAwesome name="balance-scale" size={30} color="#4285f4" />
          <Text style={styles.cardTitle}>Why Choose Us</Text>
          <Text>✔ Experienced Real Estate Lawyers</Text>
          <Text>✔ Pan-India Coverage</Text>
          <Text>✔ 100% Confidentiality</Text>
          <Text>✔ Fast Turnaround – 5 Days</Text>
          <Text>✔ 24/7 Support</Text>
        </View>
        <View style={styles.card}>
          <FontAwesome name="star" size={30} color="#E57300" />
          <Text style={styles.cardTitle}>Service Plans</Text>
          <Text>🏠 Residential Property – ₹1999</Text>
          <Text>🏢 Commercial Property – ₹2999</Text>
          <Text>🌳 Land/Plot – ₹3499</Text>
          <Text>🧾 Custom Legal Opinion – On Request</Text>
        </View>
      </View>

      <View style={styles.testimonials}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          💬 What Our Clients Say
        </Text>
        <Text>
          “Saved me from a disputed property. Very professional.” –{" "}
          <Text style={{ fontStyle: "italic" }}>Arjun P., Mumbai</Text>
        </Text>
        <Text>
          “Fast, reliable, and accurate. Worth every rupee!” –{" "}
          <Text style={{ fontStyle: "italic" }}>Sneha R., Bangalore</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Get Title Search Now
        </Text>
      </TouchableOpacity>
      <Text style={styles.note}>
        * All services include a downloadable report. Additional charges apply{" "}
        for physical copies.
      </Text>

      {/* Modal Form */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>🔐 Request Title Search</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ fontSize: 16 }}>&times;</Text>
            </TouchableOpacity>
            <View style={styles.formTwoColumn}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.formSectionTitle}>Property Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Property Address"
                  value={formData.propertyAddress}
                  onChangeText={(text) => handleChange("propertyAddress", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={formData.PropertyCity}
                  onChangeText={(text) => handleChange("PropertyCity", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={formData.PropertyState}
                  onChangeText={(text) => handleChange("PropertyState", text)}
                />
                {/* You could use a picker for state/propertyType */}
                <TextInput
                  style={styles.input}
                  placeholder="Property Type (Residential, Commercial, Land)"
                  value={formData.propertyType}
                  onChangeText={(text) => handleChange("propertyType", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Registration Number (Optional)"
                  value={formData.PropertyRegistrationNumber}
                  onChangeText={(text) => handleChange("PropertyRegistrationNumber", text)}
                />
                <TouchableOpacity style={styles.filePicker} onPress={handlePickDocuments}>
                  <Text>
                    {formData.Documents.length === 0
                      ? "📁 Tap to upload documents"
                      : formData.Documents.map((file, idx) => (
                          <Text key={file.name}>
                            {file.name}
                            <Text
                              style={{ color: "red" }}
                              onPress={() => handleRemoveFile(idx)}
                            > {" x "}</Text>
                          </Text>
                        ))}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.formSectionTitle}>Your Contact Info</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.ContactFullName}
                  onChangeText={(text) => handleChange("ContactFullName", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={formData.ContactEmail}
                  onChangeText={(text) => handleChange("ContactEmail", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={formData.ContactPhone}
                  onChangeText={(text) => handleChange("ContactPhone", text)}
                />
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Any additional notes"
                  multiline
                  value={formData.ContactNotes}
                  onChangeText={(text) => handleChange("ContactNotes", text)}
                />
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit Request</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      {/* Footer here if you have one */}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
  },
  gridSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 10,
    marginHorizontal: 3,
    backgroundColor: "#f2f6fa",
    borderRadius: 8,
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  testimonials: {
    backgroundColor: "#efefef",
    borderRadius: 6,
    padding: 14,
    marginVertical: 16,
  },
  ctaButton: {
    backgroundColor: "#4285f4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  note: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 6,
  },
  modalOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    width: "96%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 12,
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },
  formTwoColumn: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  formSectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 7,
    marginVertical: 4,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  submitBtn: {
    backgroundColor: "#4285f4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginTop: 10,
  },
  requestIdBox: {
    backgroundColor: "#e5ffe5",
    borderRadius: 8,
    marginBottom: 12,
    padding: 14,
    marginHorizontal: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filePicker: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 6,
    alignItems: "center",
  },
});
