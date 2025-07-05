import React, { useState } from "react";
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
  handleShowModal,
  handleLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Admin Profile", key: "adminProfile" },
    { label: "Users Detail", key: "adminDashUserDetails" },
    { label: "Appointments Management", key: "appointments" },
    { label: "Property Verification", key: "propertyVerification" },
    { label: "Reviews Management", key: "reviews" },
    { label: "Enquiries Management", key: "enquiries" },
    { label: "Admins", key: "adminsList" },
    { label: "Staff Management", key: "staffManagement" },
    { label: "Staff Performance", key: "staffPerformance" },
    { label: "Contractor Verification", key: "contractorVerification" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemPress = (key) => {
    handleSectionChange(key);
    setIsOpen(false); // collapse after selection
  };

  const handleLogoutPress = () => {
    handleLogout();
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "adminProfile":
        return <Text style={styles.contentTitle}>Admin Profile</Text>;
      case "adminDashUserDetails":
        return <Text style={styles.contentTitle}>Users Detail</Text>;
      case "appointments":
        return <Text style={styles.contentTitle}>Appointments Management</Text>;
      case "propertyVerification":
        return <Text style={styles.contentTitle}>Property Verification</Text>;
      case "reviews":
        return <Text style={styles.contentTitle}>Reviews Management</Text>;
      case "enquiries":
        return <Text style={styles.contentTitle}>Enquiries Management</Text>;
      case "adminsList":
        return <Text style={styles.contentTitle}>Admins</Text>;
      case "staffManagement":
        return <Text style={styles.contentTitle}>Staff Management</Text>;
      case "staffPerformance":
        return <Text style={styles.contentTitle}>Staff Performance</Text>;
      case "contractorVerification":
        return <Text style={styles.contentTitle}>Contractor Verification</Text>;
      default:
        return (
          <View style={styles.dashboardContent}>
            <Text style={styles.contentTitle}>Welcome to Admin Dashboard</Text>
            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>Quick Stats</Text>
                <Text style={styles.dashboardCardSubtitle}>Overview of your admin panel</Text>
              </View>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>Recent Activity</Text>
                <Text style={styles.dashboardCardSubtitle}>Latest updates and actions</Text>
              </View>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>System Status</Text>
                <Text style={styles.dashboardCardSubtitle}>All systems operational</Text>
              </View>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>Notifications</Text>
                <Text style={styles.dashboardCardSubtitle}>Important alerts and messages</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburgerButton} onPress={toggleSidebar}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Inline collapsible sidebar */}
      {isOpen && (
        <View style={styles.inlineSidebar}>
          <ScrollView style={styles.sidebarContent}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleMenuItemPress(item.key)}
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

            <TouchableOpacity
              onPress={handleLogoutPress}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.contentArea}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 2,
  },
  hamburgerButton: {
    width: 30,
    height: 25,
    justifyContent: "space-between",
    marginRight: 15,
  },
  hamburgerLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#2563eb",
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },

  // Inline Sidebar
  inlineSidebar: {
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sidebarContent: {
    flexGrow: 1,
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

  // Content
  contentArea: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  dashboardContent: {
    padding: 20,
  },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dashboardCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dashboardCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  dashboardCardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});

export default AdminSideBar;
