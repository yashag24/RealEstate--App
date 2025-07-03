import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";

export const PropertyHeaderSection = ({
  property,
  reviews,
  averageRating,
  isSaved,
  handleGoBack,
  handleSaveProperty,
  toTitleCase,
  showBackButton = true,

}) => (
  <>
    {/* Back Button */}
    {showBackButton && (
      <View style={styles.backButtonContainer}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <FontAwesome5 name="arrow-left" size={18} color="#374151" />
        </Pressable>
      </View>
    )}

    {/* Property Header */}
    <View style={styles.headerSection}>
      <View style={styles.headerRow}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.title}
        </Text>
        {property.verification && (
          <View style={styles.verifiedBadge}>
            <FontAwesome5 name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <Text style={styles.propertySubtitle}>
        {toTitleCase(property.type)} &bull; {toTitleCase(property.city)}
      </Text>

      <View style={styles.propertyDetailsRow}>
        <View style={styles.detailItem}>
          <FontAwesome5 name="ruler-combined" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{property.area} Sqft</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="bed" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{property.Bhk} BHK</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="rupee-sign" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{property.price}</Text>
        </View>
      </View>

      <View style={styles.headerBottomRow}>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={styles.starIcon}>
                {averageRating >= star ? "★" : "☆"}
              </Text>
            ))}
          </View>
          <Text style={styles.reviewsText}>({reviews.length} Reviews)</Text>
        </View>
        <Pressable
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={handleSaveProperty}
        >
          <FontAwesome5
            name="heart"
            size={16}
            color={isSaved ? "#fff" : "#ef4444"}
            solid={isSaved}
          />
          <Text
            style={[
              styles.saveButtonText,
              isSaved && styles.saveButtonTextActive,
            ]}
          >
            {isSaved ? "Saved" : "Save"}
          </Text>
        </Pressable>
      </View>
    </View>
  </>
);
const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    left: 20,
    marginTop:4,
    zIndex: 1000,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.3)",
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },
  propertyTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#22223b",
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0fce6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "700",
    marginLeft: 4,
  },
  propertySubtitle: {
    fontSize: 15,
    color: "#6c757d",
    fontWeight: "600",
    marginBottom: 8,
  },
  propertyDetailsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 18,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginLeft: 4,
  },
  headerBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  starIcon: {
    fontSize: 18,
    color: "#fbbf24",
  },
  reviewsText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#ef4444",
    backgroundColor: "#fff",
  },
  saveButtonActive: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 6,
  },
  saveButtonTextActive: {
    color: "#fff",
  },
});
