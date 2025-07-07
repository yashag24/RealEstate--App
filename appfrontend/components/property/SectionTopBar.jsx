import React from "react";
import { View, Text, Pressable, Platform, StatusBar, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const HEADER_TOP = Platform.OS === 'ios'
  ? 50
  : (StatusBar.currentHeight || 24) - 8;

const TopBar = ({ propertyTitle, handleGoBack }) => (
  <View style={styles.topBar}>
    <View style={styles.topBarGradient} />
    <View style={styles.topBarContent}>
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <FontAwesome5 name="chevron-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.topBarTitle} numberOfLines={2}>
          {propertyTitle}
        </Text>
        <Text style={styles.topBarSubtitle} numberOfLines={1}>
         Discover your slice of paradise
        </Text>
      </View>
      <View style={{ width: 44 }} /> {/* For alignment */}
    </View>
  </View>
);

const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    backgroundColor: "#475569",
    paddingTop: HEADER_TOP,
    paddingBottom: 12,
    overflow: "hidden",
  },
  topBarGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#475569",
    opacity: 0.95,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  topBarSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 2,
    fontWeight: "400",
  },
});

export default TopBar;
