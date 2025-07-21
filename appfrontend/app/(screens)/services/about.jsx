import React from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
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

const About = () => (
  <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
    {/* Navbar Component */}
    <Navbar_local />

    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")} // Place your logo in assets and update the path
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.appName}>Basil RealEstate</Text>
      <Text style={styles.slogan}>Find Your Dream Home with Ease.</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Who We Are</Text>
        <Text style={styles.body}>
          Basil RealEstate is a modern platform dedicated to making property
          search, buying, and renting seamless and secure. Built with the latest
          technology, our app connects buyers, renters, and agents in an
          intuitive and user-friendly experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Key Features</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Advanced property search and filters
          </Text>
          <Text style={styles.listItem}>
            • Save and revisit your favorite listings
          </Text>
          <Text style={styles.listItem}>
            • Direct and secure messaging with agents and landlords
          </Text>
          <Text style={styles.listItem}>
            • Real-time notifications for new properties
          </Text>
          <Text style={styles.listItem}>
            • Beautiful photo galleries and virtual tours
          </Text>
          <Text style={styles.listItem}>
            • Trusted reviews and verified property status
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Our Mission</Text>
        <Text style={styles.body}>
          At Basil RealEstate, we believe finding a new home should be exciting,
          transparent, and stress-free. We are committed to empowering users by
          providing honest listings, easy communication, and helpful guidance
          every step of the way.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Contact & Support</Text>
        <Text style={styles.body}>
          Have questions or feedback? Our support team is here to help!
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@basilrealestate.com")}
          style={styles.emailBtn}
        >
          <Text style={styles.emailBtnText}>
            Email support@basilrealestate.com
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Basil RealEstate. All rights reserved.
      </Text>
    </ScrollView>
  </View>
);

export default About;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f5fa",
    padding: 26,
    alignItems: "center",
    flexGrow: 1,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#ece9f8",
  },
  appName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#773ac1",
    marginBottom: 3,
    textAlign: "center",
  },
  slogan: {
    fontSize: 15,
    color: "#5a4780",
    marginBottom: 22,
    textAlign: "center",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  section: {
    width: "100%",
    marginBottom: 22,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 1,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#703fc6",
    marginBottom: 8,
  },
  body: {
    color: "#45415e",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 3,
  },
  list: {
    marginTop: 2,
    paddingLeft: 6,
  },
  listItem: {
    fontSize: 15,
    color: "#333",
    marginBottom: 3,
  },
  emailBtn: {
    backgroundColor: "#f7e6ff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  emailBtnText: {
    color: "#703fc6",
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 22,
    color: "#b0adc2",
    fontSize: 13,
    textAlign: "center",
  },
});
