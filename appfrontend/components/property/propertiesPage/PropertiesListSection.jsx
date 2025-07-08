import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropertiesListCard from './PropertiesListCard';
import { getFilteredProperties } from '../../../redux/SearchBox/SearchSlice';

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
  if (propertyTypeQuery === "Independent House" || propertyTypeQuery === "Independent Builder Floor") {
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
    const propertyText = count === 1 ? 'result' : 'results';
    return `${count} ${propertyText} | Property for ${searchQuery.type} in ${getLocationText()}`;
  };


 return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.resultsText}>
          {getResultsText()}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.propertiesContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {propertiesReverse.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No properties found matching your criteria
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your filters or search in a different location
            </Text>
          </View>
        ) : (
          propertiesReverse.map((property) => (
            <PropertiesListCard key={property._id} property={property} />
          ))
        )}
      </ScrollView>
    </View>
  );
};
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resultsText: {
    fontSize: screenWidth < 380 ? 14 : 16,
    lineHeight: screenWidth < 380 ? 20 : 24,
    fontWeight: '600',
    color: '#091E42',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  propertiesContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: screenWidth * 0.025,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default PropertiesListSection;