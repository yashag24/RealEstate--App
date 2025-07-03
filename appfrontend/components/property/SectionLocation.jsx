// LocationSection.js
import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");

export const LocationSection = ({
  property,
  showNearby,
  setShowNearby,

  toTitleCase,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>📍 Location & Connectivity</Text>
    {/* Address Card */}
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressIconContainer}>
          <FontAwesome5 name="map-marker-alt" size={20} color="#ef4444" />
        </View>
        <View style={styles.addressHeaderText}>
          <Text style={styles.addressTitle}>Property Address</Text>
          <Text style={styles.addressSubtitle}>Exact location details</Text>
        </View>
      </View>
      <View style={styles.addressDetails}>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>Address:</Text>
          <Text style={styles.addressValue}>
            {toTitleCase(property.address)}
          </Text>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>City:</Text>
          <Text style={styles.addressValue}>
            {toTitleCase(property.city)}
          </Text>
        </View>
        {property.landmark && (
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Landmark:</Text>
            <Text style={styles.addressValue}>
              {toTitleCase(property.landmark)}
            </Text>
          </View>
        )}
        {property.pincode && (
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>PIN Code:</Text>
            <Text style={styles.addressValue}>{property.pincode}</Text>
          </View>
        )}
      </View>
    </View>

    {/* Nearby Places and Transportation */}
    {/* Uncomment toggle if needed */}
    {/* <Pressable
      style={styles.showClickButton}
      onPress={() => setShowNearby((prev) => !prev)}
    >
      <Text style={styles.showClickButtonText}>
        {showNearby ? "Hide Nearby & Transport" : "Click for more"}
      </Text>
    </Pressable> */}

    {showNearby && (
      <>
        {/* Nearby Places */}
        <View style={styles.nearbySection}>
          <Text style={styles.nearbyTitle}>🎯 Nearby Places</Text>
          <View style={styles.nearbyGrid}>
            {[
              {
                icon: "hospital",
                label: "Hospitals",
                distance: "2.5 km",
                color: "#ef4444",
              },
              {
                icon: "graduation-cap",
                label: "Schools",
                distance: "1.8 km",
                color: "#3b82f6",
              },
              {
                icon: "shopping-cart",
                label: "Shopping",
                distance: "3.2 km",
                color: "#f59e0b",
              },
              {
                icon: "subway",
                label: "Metro/Bus",
                distance: "1.5 km",
                color: "#10b981",
              },
              {
                icon: "utensils",
                label: "Restaurants",
                distance: "0.8 km",
                color: "#8b5cf6",
              },
              {
                icon: "gas-pump",
                label: "Fuel Station",
                distance: "2.1 km",
                color: "#f97316",
              },
            ].map((place, index) => (
              <View key={index} style={styles.nearbyItem}>
                <View
                  style={[
                    styles.nearbyIconContainer,
                    { backgroundColor: `${place.color}15` },
                  ]}
                >
                  <FontAwesome5
                    name={place.icon}
                    size={16}
                    color={place.color}
                  />
                </View>
                <View style={styles.nearbyInfo}>
                  <Text style={styles.nearbyLabel}>{place.label}</Text>
                  {/* <Text style={styles.nearbyDistance}>{place.distance}</Text> */}
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* Transportation */}
        <View style={styles.transportSection}>
          <Text style={styles.transportTitle}>🚗 Transportation</Text>
          <View style={styles.transportGrid}>
            <View style={styles.transportItem}>
              <View style={styles.transportIconContainer}>
                <FontAwesome5 name="car" size={18} color="#3b82f6" />
              </View>
              <View style={styles.transportInfo}>
                <Text style={styles.transportLabel}>Parking</Text>
                <Text style={styles.transportValue}>Available</Text>
              </View>
            </View>
            <View style={styles.transportItem}>
              <View style={styles.transportIconContainer}>
                <FontAwesome5 name="road" size={18} color="#10b981" />
              </View>
              <View style={styles.transportInfo}>
                <Text style={styles.transportLabel}>Road Access</Text>
                <Text style={styles.transportValue}>Main Road</Text>
              </View>
            </View>
            <View style={styles.transportItem}>
              <View style={styles.transportIconContainer}>
                <FontAwesome5 name="bus" size={18} color="#f59e0b" />
              </View>
              <View style={styles.transportInfo}>
                <Text style={styles.transportLabel}>Public Transport</Text>
                <Text style={styles.transportValue}>Excellent</Text>
              </View>
            </View>
            <View style={styles.transportItem}>
              <View style={styles.transportIconContainer}>
                <FontAwesome5 name="plane" size={18} color="#8b5cf6" />
              </View>
              <View style={styles.transportInfo}>
                <Text style={styles.transportLabel}>Airport</Text>
                <Text style={styles.transportValue}>45 min</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 10,
  },

  // Address Card
  addressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#fef2f2",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressHeaderText: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  addressSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  addressDetails: {
    gap: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    minWidth: 80,
    marginRight: 12,
  },
  addressValue: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
    lineHeight: 20,
  },

  // Nearby Places
  nearbySection: {
    marginBottom: 24,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  nearbyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nearbyItem: {
    width: (screenWidth - 64) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  nearbyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  nearbyDistance: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Transportation
  transportSection: {
    marginBottom: 24,
  },
  transportTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  transportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  transportItem: {
    width: (screenWidth - 64) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transportIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f9ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transportInfo: {
    flex: 1,
  },
  transportLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  transportValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },

  // Toggle Button (if used)
  showClickButton: {
    backgroundColor: "rgb(238, 46, 32)",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    minWidth: 200,
    alignSelf: "center",
  },
  showClickButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
