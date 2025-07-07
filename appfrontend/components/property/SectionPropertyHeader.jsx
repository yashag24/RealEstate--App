import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import TopBar from "./SectionTopBar";

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
    {/* Top Bar: Back Button + Property Name */}


    {/* Gap between topBar and headerSection */}
    <View style={styles.headerGap} />

    {/* Section: Verified Badge (left), Subtitle */}
    <View style={styles.headerSection}>
      <View style={styles.verifiedRow}>
        {property.verification && (
          <View style={styles.verifiedBadge}>
            <FontAwesome5 name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        <Text style={styles.propertySubtitle}>
          {toTitleCase(property.type)} &bull; {toTitleCase(property.city)}
        </Text>
      </View>

      {/* Property Details */}
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

      {/* Ratings and Save Button */}
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
  // Gap between top bar and header section
  headerGap: {
    height: 12,
    backgroundColor: "transparent",
  },

  // Section below top bar
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0fce6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
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

export default PropertyHeaderSection;
