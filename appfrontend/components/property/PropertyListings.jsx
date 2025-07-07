import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropertyCard from '../home/PropertyCard';
import FiltersSection from './FiltersSection';
import Footer from '../home/Footer';

const { width: screenWidth } = Dimensions.get('window');

const PropertyListings = ({ cityParam = "", queryParam = "" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    noOfBedrooms = [],
    budgetRange = [0, 20000000],
    propertyType = [],
    area = [0, 4000],
    verifiedProperties = false,
  } = useSelector((store) => store.search) || {};

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchProperties = useCallback(
    async (city = "", query = "") => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (query) params.append("query", query);
        if (noOfBedrooms?.length) {
          params.append("bedrooms", noOfBedrooms.join(","));
        }
        if (budgetRange?.length === 2) {
          params.append("minBudget", budgetRange[0].toString());
          params.append("maxBudget", budgetRange[1].toString());
        }
        if (area?.length === 2) {
          params.append("minArea", area[0].toString());
          params.append("maxArea", area[1].toString());
        }
        if (propertyType?.length) {
          params.append("propertyType", propertyType.join(","));
        }
        if (verifiedProperties) {
          params.append("verified", "true");
        }

        const response = await fetch(
          `${BASE_URL}/api/property?${params.toString()}`,
          { 
            method: "GET", 
            headers: { "Content-Type": "application/json" },
            timeout: 10000, // 10 second timeout
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setProperties(result);
          if (result.length === 0) {
            setError("No properties found matching your criteria.");
          }
        } else {
          setProperties([]);
          setError("Invalid response format from server.");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message || "Error fetching properties. Please try again later.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [noOfBedrooms, budgetRange, area, propertyType, verifiedProperties, BASE_URL]
  );

  useEffect(() => {
    fetchProperties(cityParam, queryParam);
  }, [cityParam, queryParam, fetchProperties]);

  const filteredProperties = properties.filter((property) => {
    const price = parseFloat(property.price) || 0;
    const bhk = parseInt(property.Bhk || property.bhk) || 0;
    const propArea = parseFloat(property.area) || 0;
    const type = property.type || "";

    // Budget filter
    const isBudgetValid = price >= (budgetRange[0] || 0) && price <= (budgetRange[1] || 20000000);
    
    // Area filter
    const isAreaValid = propArea >= (area[0] || 0) && propArea <= (area[1] || 4000);
    
    // Bedroom filter
    const isBedroomValid = !noOfBedrooms?.length || noOfBedrooms.includes(bhk);
    
    // Property type filter
    const isTypeValid = !propertyType?.length || propertyType.includes(type);
    
    // City filter
    const isCityValid = !cityParam || 
      (property.city && property.city.toLowerCase().includes(cityParam.toLowerCase()));

    return isBudgetValid && isAreaValid && isBedroomValid && isTypeValid && isCityValid;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2C92FF" />
          <Text style={styles.loadingText}>Loading Properties...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={() => fetchProperties(cityParam, queryParam)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.headDetail}>
          {filteredProperties.length} results | Property from {cityParam || "All Cities"} India
        </Text>
        
        <View style={styles.propertyContainer}>
          {filteredProperties.map((property) => (
            <View key={property._id} style={styles.propertyCardWrapper}>
              <Pressable
                style={styles.linkWrapper}
                onPress={() => {
                  // Navigate to property details
                  console.log('Navigate to details of', property._id);
                }}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              >
                <PropertyCard
                  id={property._id}
                  title={property.title}
                  city={property.city}
                  price={(property.price || 0).toString()}
                  area={(property.area || 0).toString()}
                  bhk={property.Bhk || property.bhk || 0}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <FiltersSection />
        {renderContent()}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2C92FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headDetail: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: "#091E42",
    marginBottom: 16,
  },
  propertyContainer: {
    flexDirection: "column",
  },
  propertyCardWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkWrapper: {
    width: '100%',
  },
});

export default PropertyListings;