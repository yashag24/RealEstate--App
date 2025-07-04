import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropertyCard from '../home/PropertyCard';
import SortandFilter from './SortandFilter';
import Footer from '../home/Footer';

const PropertyListings = ({ cityParam = "", queryParam = "" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    noOfBedrooms,
    budgetRange,
    propertyType,
    area,
    verifiedProperties,
  } = useSelector((store) => store.search);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchProperties = useCallback(
    async (city = "", query = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (query) params.append("query", query);
        if (noOfBedrooms.length) {
          params.append("bedrooms", noOfBedrooms.join(","));
        }
        if (budgetRange.length === 2) {
          params.append("minBudget", budgetRange[0].toString());
          params.append("maxBudget", budgetRange[1].toString());
        }
        if (area.length === 2) {
          params.append("minArea", area[0].toString());
          params.append("maxArea", area[1].toString());
        }
        if (propertyType.length) {
          params.append("propertyType", propertyType.join(","));
        }
        if (verifiedProperties) {
          params.append("verified", "true");
        }

        const response = await fetch(
          `${BASE_URL}/api/property?${params.toString()}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }

        const result = await response.json();

        if (Array.isArray(result) && result.length === 0) {
          Alert.alert("No properties found", "Try another city.");
        } else {
          setProperties(result);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        Alert.alert("Error", "Error fetching properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [noOfBedrooms, budgetRange, area, propertyType, verifiedProperties]
  );

  useEffect(() => {
    fetchProperties(cityParam, queryParam);
  }, [cityParam, queryParam, fetchProperties]);

  return (
    <View style={styles.propertyListingsPage}>
      <View style={styles.sortAndFilterParent}>
        <SortandFilter />

        {loading ? (
          <Text>Loading Properties...</Text>
        ) : (
          <View style={{ width: '100%' }}>
            <Text style={styles.headDetail}>
              {properties.length} results | Property from {cityParam || "All Cities"} India
            </Text>
            <View style={styles.propertyContainer}>
              {properties.slice().reverse().map((property) => {
                const price = property.price ?? 0;
                const bhk = property.Bhk ?? property.bhk ?? 0;
                const propArea = property.area ?? 0;
                const type = property.type ?? "";

                // Redux filters
                const filters = {
                  minBudget: budgetRange[0],
                  maxBudget: budgetRange[1],
                  minArea: area[0],
                  maxArea: area[1],
                  bedrooms: noOfBedrooms,
                  types: propertyType,
                  city: cityParam,
                };

                // Validation
                const isBudgetValid = price >= filters.minBudget && price <= filters.maxBudget;
                const isAreaValid = propArea >= filters.minArea && propArea <= filters.maxArea;
                const isBedroomValid = filters.bedrooms.length === 0 || filters.bedrooms.includes(bhk);
                const isTypeValid = filters.types.length === 0 || filters.types.includes(type);
                const isCityValid =
                  !filters.city ||
                  (typeof filters.city === "string" &&
                    property.city?.toLowerCase() === filters.city.toLowerCase());

                if (!(isBudgetValid && isAreaValid && isBedroomValid && isTypeValid && isCityValid)) {
                  return null;
                }

                return (
                  <View key={property._id} style={styles.propertyCardWrapper}>
                    <Pressable
                      style={styles.linkWrapper}
                      onPress={() =>
                        /* adjust this to your navigation or router.push call */
                        console.log('Navigate to details of', property._id)
                      }
                    >
                      <PropertyCard
                      id={property._id}
                        title={property.title}
                        city={property.city}
                        price={price.toString()}
                        area={propArea.toString()}
                        bhk={bhk}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  sortAndFilterParent: {
    marginTop: 90,
    paddingHorizontal: 90,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  propertyCardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  linkWrapper: {
    width: '100%',
  },
  propertyListingsPage: {
    flex: 1,
    padding: 16,
  },
  headDetail: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#091E42",
    fontFamily: "Open Sans",
    marginVertical: 22,
  },
  propertyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
  },
});

export default PropertyListings;
