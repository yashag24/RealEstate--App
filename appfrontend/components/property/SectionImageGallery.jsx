// ImageGallery.js
import React from "react";
import { View, ScrollView, Image, Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const ImageGallery = ({ images }) => (
  <View style={styles.gallerySection}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      contentContainerStyle={styles.galleryContainer}
    >
      {images.map((url, idx) => (
        <View key={idx} style={styles.imageContainer}>
          <Image
            source={{ uri: url }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  </View>
);

// Styles for the image gallery
const styles = StyleSheet.create({
  gallerySection: {
    marginBottom: 8,
  },
  galleryContainer: {
    paddingLeft: 20,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyImage: {
    width: screenWidth - 60,
    height: 240,
  },
});
