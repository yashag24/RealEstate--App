import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";


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

const Settings = () => {
  const [isDark, setIsDark] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // For web
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        console.log("Logging out...");
        dispatch(performLogout());
        router.replace("/(screens)");
      }
      return;
    }

    // For mobile (iOS/Android)
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Logging out...");
            await dispatch(performLogout()).unwrap();
            router.replace("/(screens)");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar_local />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/user/edit-profile")}
          >
            <Text style={styles.rowLabel}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/change-password")}
          >
            <Text style={styles.rowLabel}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={setIsDark} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/privacy-settings")}
          >
            <Text style={styles.rowLabel}>Privacy Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/data-download")}
          >
            <Text style={styles.rowLabel}>Download My Data</Text>
          </TouchableOpacity>
        </View>

        {/* Help & About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & About</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/support")}
          >
            <Text style={styles.rowLabel}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/about")}
          >
            <Text style={styles.rowLabel}>About This App</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f6fa",
    padding: 22,
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#713ac2",
    marginBottom: 24,
    alignSelf: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 13,
    color: "#653bba",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomColor: "#ece9f6",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 15,
    color: "#2e234b",
  },
  logoutBtn: {
    backgroundColor: "#f2e2ec",
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 16,
  },
  logoutText: {
    color: "#c02453",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
