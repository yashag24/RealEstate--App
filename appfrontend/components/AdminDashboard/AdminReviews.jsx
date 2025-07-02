import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminReviews = ({ reviews }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        color={index < rating ? "#facc15" : "#d1d5db"}
        style={styles.star}
      />
    ));

  const flattenedReviews =
    reviews?.flatMap((propertyReview) =>
      propertyReview.reviews.map((review) => ({
        ...review,
        property: propertyReview.propertyId,
      }))
    ) || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reviews</Text>
      <View style={styles.reviewTable}>
        {flattenedReviews.reverse().map((review) => (
          <View key={review._id} style={styles.reviewRow}>
            <View style={styles.reviewer}>
              <Icon1 style={styles.icon} />
              <Text>{review.name}</Text>
            </View>
            <Text style={styles.comment}>{review.comment}</Text>
            <View style={styles.stars}>{renderStars(review.rating)}</View>
            <TouchableOpacity
              onPress={() => setSelectedProperty(review.property)}
            >
              <Text style={styles.propertyLink}>{review.property.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        visible={!!selectedProperty}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProperty(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeBtn}
            >
              <Ionicons size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{selectedProperty?.title}</Text>

            <View style={styles.detailsGrid}>
              <Text>
                <Text style={styles.bold}>BHK:</Text> {selectedProperty?.Bhk}
              </Text>
              <Text>
                <Text style={styles.bold}>Area:</Text> {selectedProperty?.area} sq.ft
              </Text>
              <Text>
                <Text style={styles.bold}>Address:</Text> {selectedProperty?.address}
              </Text>
              <Text>
                <Text style={styles.bold}>Price:</Text> ₹{selectedProperty?.price}
              </Text>
              <Text>
                <Text style={styles.bold}>Status:</Text> {selectedProperty?.status}
              </Text>
              <Text>
                <Text style={styles.bold}>Owner:</Text>{" "}
                {selectedProperty?.Propreiter_name}
              </Text>
              <Text>
                <Text style={styles.bold}>Email:</Text>{" "}
                {selectedProperty?.Propreiter_email}
              </Text>
              <Text>
                <Text style={styles.bold}>Contact:</Text>{" "}
                {selectedProperty?.Propreiter_contact}
              </Text>
            </View>

            {selectedProperty?.images?.length > 0 && (
              <ScrollView horizontal style={styles.imageGrid}>
                {selectedProperty.images.map((url, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: url }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  tableWrapper: {
    padding: 32,
    backgroundColor: '#f9fafb',
    minHeight: '100%',
    boxSizing: 'border-box', // This is default in RN, can omit
  },
  table: {
    width: '100%',
  },
  tableHead: {
    backgroundColor: 'transparent',
  },
  tableHeadCell: {
    textAlign: 'left',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#4b5563',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  tableCell: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#374151',
  },
  reviewer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Use margin on children if gap unsupported
    fontWeight: '500',
    color: '#1f2937',
  },
  avatar: {
    fontSize: 24,
    color: '#6b7280',
  },
  propertyLink: {
    color: '#2563eb',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    width: '90%',
    maxWidth: 650,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: '#111827',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 24,
    color: '#6b7280',
  },
  closeBtnHover: {
    color: 'red', // Not applicable unless using gesture detection
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Replace with marginRight/bottom on children
    justifyContent: 'space-between',
  },
  detailText: {
    width: '48%',
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
  },
  imageGrid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Use margin
  },
  image: {
    width: 100,
    height: 75,
    borderRadius: 8,
    objectFit: 'cover', // React Native alternative is `resizeMode`
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
    marginBottom: 10,
  },
});

export default AdminReviews;
