import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const AdminSideBar = ({
  activeSection,
  handleSectionChange,
  handleLogout,
}) => {
  const menuItems = [
    { label: "Admin Profile", key: "adminProfile" },
    { label: "Users Detail", key: "adminDashUserDetails" },
    { label: "Appointments Management", key: "appointments" },
    { label: "Property Verification", key: "propertyVerification" },
    { label: "Reviews Management", key: "reviews" },
    { label: "Enquiries Management", key: "enquiries" },
    { label: "Admins", key: "adminsList" },
    { label: "Staff Management", key: "staffManagement" },
  ];

  return (
    <ScrollView style={styles.sidebar}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => handleSectionChange(item.key)}
          style={[
            styles.sidebarText,
            activeSection === item.key && styles.activeSidebarText,
          ]}
        >
          <Text
            style={[
              styles.text,
              activeSection === item.key && styles.activeText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#f0f4f8",
  },
  sidebarText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeSidebarText: {
    backgroundColor: "#2563eb",
  },
  text: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  activeText: {
    color: "#ffffff",
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AdminSideBar;
