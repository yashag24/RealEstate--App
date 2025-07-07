import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import PropertyCard from '../home/PropertyCard';
import FiltersSection from './FiltersSection';
import Footer from '../home/Footer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PropertyListings = ({ cityParam = "", queryParam = "" }) => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    noOfBedrooms = [],
    budgetRange = [0, 20000000],
    propertyType = [],
    area = [0, 4000],
    verifiedProperties = false,
  } = useSelector((store) => store.search) || {};

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleGoBack = () => {
    router.back();
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

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
            timeout: 10000,
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

    const isBudgetValid = price >= (budgetRange[0] || 0) && price <= (budgetRange[1] || 20000000);
    const isAreaValid = propArea >= (area[0] || 0) && propArea <= (area[1] || 4000);
    const isBedroomValid = !noOfBedrooms?.length || noOfBedrooms.includes(bhk);
    const isTypeValid = !propertyType?.length || propertyType.includes(type);
    const isCityValid = !cityParam || 
      (property.city && property.city.toLowerCase().includes(cityParam.toLowerCase()));

    return isBudgetValid && isAreaValid && isBedroomValid && isTypeValid && isCityValid;
  });

  const renderContent = () => {
    if (loading) {
      return (
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
          <Text style={styles.loadingSubText}>Finding the perfect match for you</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-triangle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable 
              style={styles.retryButton}
              onPress={() => fetchProperties(cityParam, queryParam)}
            >
              <FontAwesome5 name="redo" size={16} color="#fff" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.resultHeader}>
            <View style={styles.resultIconContainer}>
              <FontAwesome5 name="home" size={24} color="#7c3aed" />
            </View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultCount}>
                {filteredProperties.length} Properties Found
              </Text>
              <Text style={styles.locationText}>
                📍 {cityParam || "All Cities"}, India
              </Text>
            </View>
          </View>
          {/* {filteredProperties.length > 0 && (
            <View style={styles.sortContainer}>
              <Text style={styles.sortText}>Sorted by relevance</Text>
              <FontAwesome5 name="sort-amount-down" size={12} color="#9ca3af" />
            </View>
          )} */}
        </View>
        
        <View style={styles.propertyContainer}>
          {filteredProperties.map((property, index) => (
            <View key={property._id} style={styles.propertyCardWrapper}>
              <View style={styles.cardRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
                <View style={styles.rankLine} />
              </View>
              <Pressable
                style={styles.linkWrapper}
                onPress={() => {
                  console.log('Navigate to details of', property._id);
                }}
                android_ripple={{ color: 'rgba(124, 58, 237, 0.1)' }}
              >
                <PropertyCard
                  id={property._id}
                  title={property.title}
                  city={property.city}
                  price={(property.price || 0).toString()}
                  area={(property.area || 0).toString()}
                  bhk={property.Bhk || property.bhk || 0}
                  images={property.images}
                />
              </Pressable>
            </View>
          ))}
        </View>
        
        {filteredProperties.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="search" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or search criteria
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient */}
      <View style={styles.headerSection}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <FontAwesome5 name="chevron-left" size={18} color="#ffffff" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Discover Properties</Text>
            <Text style={styles.headerSubtitle}>Find your perfect home</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerActionButton} onPress={handleFilterToggle}>
              <FontAwesome5 name="sliders-h" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderContent()}
        <Footer />
      </ScrollView>

      {/* Improved Mobile Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
        hardwareAccelerated={true}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowFilters(false)}
          />
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalDragHandle} />
                <View style={styles.modalHeaderContent}>
                  <Text style={styles.modalTitle}>Filters & Search</Text>
                  <Pressable 
                    style={styles.modalCloseButton}
                    onPress={() => setShowFilters(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <FontAwesome5 name="times" size={20} color="#6b7280" />
                  </Pressable>
                </View>
              </View>

              {/* Modal Content */}
              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <FiltersSection />
                
                {/* Additional spacing for better mobile UX */}
                <View style={styles.modalContentSpacer} />
              </ScrollView>

              {/* Modal Footer */}
              {/* <View style={styles.modalFooter}>
                <View style={styles.modalFooterButtons}>
                  <Pressable 
                    style={styles.clearFiltersButton}
                    onPress={() => {
                      // Clear all filters logic here
                      console.log('Clear filters');
                    }}
                  >
                    <Text style={styles.clearFiltersText}>Clear All</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.applyFiltersButton}
                    onPress={() => {
                      setShowFilters(false);
                      // Apply filters and refresh results
                      fetchProperties(cityParam, queryParam);
                    }}
                  >
                    <Text style={styles.applyFiltersText}>
                      Apply Filters ({filteredProperties.length})
                    </Text>
                  </Pressable>
                </View>
              </View> */}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Modern Header Styles
  headerSection: {
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight -8,
    paddingBottom: 20,
    backgroundColor: '#475569',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  // Loading States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: screenHeight * 0.4,
  },
  loadingSpinner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
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
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '400',
  },
  // Error State
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Header Container
  headerContainer: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  sortText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  // Property Container
  propertyContainer: {
    gap: 20,
  },
  propertyCardWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardRank: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  rankNumber: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderBottomRightRadius: 12,
    minWidth: 36,
    textAlign: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  rankLine: {
    width: 3,
    height: 40,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    marginTop: -2,
  },
  linkWrapper: {
    width: '100%',
    minHeight: 44,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Improved Modal Styles for Mobile
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalContentSpacer: {
    height: 20,
  },
  modalFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalFooterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyFiltersText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyListings;