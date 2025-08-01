import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Navbar from "@/components/home/Navbar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Navbar_local = () => {
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#784dc6" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 12, padding: 4 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, flex: 1 }}>
        My Previously Contacted
      </Text>
    </View>
  );
};


const UserPreviouslyContacted = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
        {/* <Navbar /> */}
        <Navbar_local />
      <View style={styles.container}>
        <View style={styles.emptyStateWrapper}>
          <View style={styles.emptyState}>
            <View style={styles.imageWrapper}>
              {/* Use your own asset here if available */}
              <Image
                style={styles.image}
                source={
                  // If you have local: require("../assets/image6.png")
                  {
                    // uri: "https://via.placeholder.com/200x160?text=No+Contacted",
                    uri : "https://cdn-icons-png.flaticon.com/512/13207/13207284.png"
                  }
                }
                resizeMode="contain"
              />
            </View>
            <Text style={styles.messageTitle}>
              You haven’t contacted anyone lately!
            </Text>
            <Text style={styles.messageSubtitle}>
              You will see the list of properties / projects here, where you
              have contacted the advertiser.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserPreviouslyContacted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 38,
    paddingHorizontal: 24,
    elevation: 2,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#ececec",
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#793dd1",
    textAlign: "center",
    marginBottom: 10,
  },
  messageSubtitle: {
    fontSize: 15,
    color: "#373444",
    textAlign: "center",
    lineHeight: 21,
  },
});
