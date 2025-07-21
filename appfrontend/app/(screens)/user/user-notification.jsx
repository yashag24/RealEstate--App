import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Navbar from "@/components/home/Navbar";

const UserNotifications = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.emptyStateWrapper}>
          <View style={styles.emptyState}>
            <View style={styles.imageWrapper}>
              <Image
                style={styles.image}
                source={require("@/assets/images/notification-img.jpg")}
                // resizeMode="contain"
                alt="No notifications yet"
              />
            </View>
            <Text style={styles.messageTitle}>
              You haven’t received any notifications!
            </Text>
            <Text style={styles.messageSubtitle}>
              You will see your notifications here when we have something for
              you.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserNotifications;

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
    height: 110,
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
