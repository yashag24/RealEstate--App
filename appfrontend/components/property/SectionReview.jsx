// ReviewSection.js
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Pressable } from "react-native";
import { ReviewPage } from "./ReviewPage";
import ReviewForm from "./ReviewForm";

export const ReviewSection = ({
  reviews,
  showReviewForm,
  setShowReviewForm,
  propertyId,
 
}) => (
  <View style={styles.section}>
    {/* Reviews List */}
    <ReviewPage reviewsProperty={reviews} />

    {/* Add Review Button / Form */}
    <View style={styles.reviewFormContainer}>
      {!showReviewForm ? (
        <Pressable
          style={styles.addReviewButton}
          onPress={() => setShowReviewForm(true)}
        >
          <Text style={styles.addReviewButtonText}>Add Review</Text>
        </Pressable>
      ) : (
        <ReviewForm
          propertyId={propertyId}
          onClose={() => setShowReviewForm(false)}
        />
      )}
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
  reviewFormContainer: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center", // Center horizontally
    justifyContent: "center",
  },
  addReviewButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    minWidth: 180,
  },
  addReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
