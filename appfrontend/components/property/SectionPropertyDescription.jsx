import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export const PropertyDescriptionSection = ({ property }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Description</Text>
    <View style={styles.descriptionContainer}>
      {property.availabilityStatus && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{property.availabilityStatus}</Text>
        </View>
      )}
      <View style={styles.propertyStats}>
        {property.balconies !== undefined && (
          <View style={styles.statItem}>
            <FontAwesome5 name="tree" size={16} color="#059669" />
            <Text style={styles.statText}>
              {property.balconies} {property.balconies === 1 ? "Balcony" : "Balconies"}
            </Text>
          </View>
        )}
        {property.bathrooms !== undefined && (
          <View style={styles.statItem}>
            <FontAwesome5 name="bath" size={16} color="#0ea5e9" />
            <Text style={styles.statText}>
              {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </Text>
          </View>
        )}
        {property.floors && (
          <View style={styles.statItem}>
            <FontAwesome5 name="building" size={16} color="#8b5cf6" />
            <Text style={styles.statText}>
              {property.floors} {+property.floors === 1 ? "Floor" : "Floors"}
            </Text>
          </View>
        )}
      </View>
      {property.price !== undefined && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>
            ₹{property.price.toLocaleString("en-IN")}
          </Text>
        </View>
      )}
      <Text style={styles.descriptionText}>{property.description}</Text>
    </View>
  </View>
);

export const styles = StyleSheet.create({
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
  descriptionContainer: {
    gap: 7,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
  },
  propertyStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statText: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 8,
    fontWeight: "500",
  },
  priceContainer: {
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  priceLabel: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#15803d",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
});
