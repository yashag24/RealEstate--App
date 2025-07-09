import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import PropertiesListCard from "./PropertiesListCard";
import { getFilteredProperties } from "../../../redux/SearchBox/SearchSlice";

const { width: screenWidth } = Dimensions.get("window");

const PropertiesListSection = ({ searchQuery, filterproperty }) => {
  const {
    noOfBedrooms,
    propertyType,
    withPhotos,
    expanded,
    amenities,
    availabilityStatus,
    budgetRange,
    area,
    reraApproved,
    verifiedProperties,
    postedBy,
    furnitureType,
    purchaseType,
    city,
    properties,
    isPropertyLoading,
  } = useSelector((store) => store.search);

  const dispatch = useDispatch();

  const minPrice = budgetRange[0];
  const maxPrice = budgetRange[1];
  const minArea = area[0];
  const maxArea = area[1];

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Fix to avoid mutating props
  let propertyTypeQuery = searchQuery.type;
  if (propertyTypeQuery === "Apartments") {
    propertyTypeQuery = "Apartment";
  }
  if (
    propertyTypeQuery === "Independent House" ||
    propertyTypeQuery === "Independent Builder Floor"
  ) {
    propertyTypeQuery = "House";
  }

  useEffect(() => {
    const filters = {
      noOfBedrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      city,
      propertyType,
      verifiedProperties,
      withPhotos,
      amenities,
      availabilityStatus,
      postedBy,
      furnitureType,
      purchaseType,
      searchproperties: filterproperty,
      url: `${BASE_URL}/api/propertyPurpose?query=${propertyTypeQuery}`,
      reraApproved,
    };

    dispatch(getFilteredProperties(filters));
  }, [
    verifiedProperties,
    noOfBedrooms,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    city,
    propertyType,
    withPhotos,
    amenities,
    availabilityStatus,
    postedBy,
    furnitureType,
    purchaseType,
    reraApproved,
    dispatch,
    propertyTypeQuery,
    filterproperty,
  ]);

  const propertiesReverse = [...properties].reverse();

  const getLocationText = () => {
    return city?.address || "India";
  };

  const getResultsText = () => {
    const count = propertiesReverse.length;
    const propertyText = count === 1 ? "result" : "results";
    return `${count} ${propertyText} | Property for ${
      searchQuery.type
    } in ${getLocationText()}`;
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <View style={styles.loadingSpinner}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
      <Text style={styles.loadingText}>Discovering Properties...</Text>
      <Text style={styles.loadingSubText}>
        Finding the perfect match for you
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="search" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Properties Found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your filters or search criteria
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.resultHeader}>
        <View style={styles.resultIconContainer}>
          <FontAwesome5 name="home" size={24} color="#7c3aed" />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultCount}>
            {propertiesReverse.length} Properties Found
          </Text>
          <Text style={styles.locationText}>📍 {getLocationText()}</Text>
        </View>
      </View>
    </View>
  );

  const renderPropertyList = () => (
    <View style={styles.propertyContainer}>
      {propertiesReverse.map((property, index) => (
        <View key={property._id} style={styles.propertyCardWrapper}>
          <View style={styles.cardRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <View style={styles.rankLine} />
          </View>
          <Pressable
            style={styles.linkWrapper}
            onPress={() => {
              console.log("Navigate to details of", property._id);
            }}
            android_ripple={{ color: "rgba(124, 58, 237, 0.1)" }}
          >
            <PropertiesListCard property={property} />
          </Pressable>
        </View>
      ))}
    </View>
  );

  if (isPropertyLoading) {
    return <View style={styles.container}>{renderLoadingState()}</View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderHeader()}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {propertiesReverse.length === 0
            ? renderEmptyState()
            : renderPropertyList()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8fafc",
    width: "100%", // Ensure full width
  },

  // Loading States
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  loadingSpinner: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 12,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7c3aed",
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.9,
  },
  loadingText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  loadingSubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "400",
  },

  // Header Container - Reduced horizontal margins for wider appearance
  headerContainer: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0, // No horizontal margins
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
    width: "100%", // Full width
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultCount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Scroll Content - Reduced padding for wider appearance
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Content Container - Full width with no horizontal padding
  contentContainer: {
    paddingHorizontal: 0, // Removed all horizontal padding for 100% width
    paddingTop: 2,
    width: "100%", // Full width
  },

  // Property Container - Full width with minimal padding
  propertyContainer: {
    paddingHorizontal: 0, // No horizontal padding
    gap: 20,
    width: "100%", // Full width
  },
  propertyCardWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: "100%", // Full width
    // elevation: 4,
  },
  cardRank: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    alignItems: "center",
  },
  rankNumber: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderBottomRightRadius: 12,
    minWidth: 36,
    textAlign: "center",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  rankLine: {
    width: 3,
    height: 40,
    backgroundColor: "rgba(124, 58, 237, 0.3)",
    marginTop: -2,
  },
  linkWrapper: {
    width: "100%",
    minHeight: 44,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PropertiesListSection;