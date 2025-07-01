import React, { useEffect, useState } from 'react';
import PriceHistoryChart from './PriceHistoryChart';
import { ContactForm } from './ContactForm';
import ReviewForm from '../home/ReviewForm';
import { ReviewPage } from './ReviewPage';
import {
  View, Text, ScrollView, Image, StyleSheet, Alert, TextInput,
  Pressable, Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { jwtDecode } from "jwt-decode"

const { width: screenWidth } = Dimensions.get('window');

export const PropertyDetails = ({ property }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loanOffers, setLoanOffers] = useState([]);
  const [loadingLoanOffers, setLoadingLoanOffers] = useState(false);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const toTitleCase = (str = "") => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSaveProperty = async () => {
    try {
      if (!userId) {
        Alert.alert("Please log in to save properties");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/user-update/save-property`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          propertyId: property._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message.includes("unsaved")) {
          Alert.alert("Property removed from saved list");
          setIsSaved(false);
        } else {
          Alert.alert("Property saved successfully");
          setIsSaved(true);
        }
      } else {
        throw new Error(data.message || "Failed to update saved property");
      }
    } catch (error) {
      console.error("Error saving property", error);
      Alert.alert("Failed to save property");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/reviews/single-property-reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property?._id,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetch reviews of property", error);
      Alert.alert("Failed")
    }
  };

  const fetchLoanOffers = async () => {
    if (!property._id) return
    setLoadingLoanOffers(true)
    try {
      let url = `${BASE_URL}/api/banking-partners/loan-options/${property._id}`;
      const params = new URLSearchParams();
      if (selectedLoanAmount) {
        params.append("loanAmount", selectedLoanAmount);
      }
      if (monthlyIncome) {
        params.append("monthlyIncome", monthlyIncome);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setLoanOffers(data.loanOffers || []);
      } else {
        console.error("Error fetching loan offers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching loan offers", error);
    } finally {
      setLoadingLoanOffers(false);
    }
  }

  const getAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };
  const averageRating = getAverageRating(reviews);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded._id);
    }
    fetchReviews();
    fetchLoanOffers();
  }, [token, property._id]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!userId || !property?._id) return;
      try {
        const response = await fetch(
          `${BASE_URL}/api/user-update/is-property-saved`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              propertyId: property._id,
            }),
          }
        );
        const data = await response.json();
        setIsSaved(data.isSaved);
      } catch (error) {
        console.error('Failed to check saved status', error);
      }
    };
    checkIfSaved();
  }, [userId, property._id]);

  const handleLoanFilterChange = () => {
    fetchLoanOffers()
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Property Header */}
      <View style={styles.headerSection}>
        <View style={styles.propertyHeader}>
          {/* ENHANCED PROPERTY NAME BLOCK */}
          <View style={styles.propertyTitleBlock}>
            <Text style={styles.propertyTitle} numberOfLines={2}>
              {property.title}
            </Text>
            <Text style={styles.propertySubtitle}>
              {toTitleCase(property.type)} &bull; {toTitleCase(property.city)}
            </Text>
            {property.verification && (
              <View style={styles.verifiedBadge}>
                <Image
                  source={require('@/assets/images/verified.png')}
                  style={styles.verifiedIcon}
                  resizeMode="contain"
                />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          {/* END PROPERTY NAME BLOCK */}

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
          <View style={styles.propertyTypeRow}>
            <FontAwesome5 name="home" size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {property.type} | {toTitleCase(property.status)} | {property.purpose}
            </Text>
          </View>
        </View>
        <View style={styles.ratingAndSaveContainer}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.starIcon}>
                  {averageRating >= star ? '★' : '☆'}
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
              name={isSaved ? "heart" : "heart"}
              size={16}
              color={isSaved ? "#fff" : "#ef4444"}
              solid={isSaved}
            />
            <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
              {isSaved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Image Gallery */}
      <View style={styles.gallerySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={styles.galleryContainer}
        >
          {property.images.map((url, idx) => (
            <View key={idx} style={styles.imageContainer}>
              <Image
                source={{ uri: url }}
                style={styles.propertyImage}
                resizeMode='cover'
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Property Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionContainer}>
          {property.availabilityStatus && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{property.availabilityStatus}</Text>
            </View>
          )}
          <View style={styles.propertyStats}>
            {property.balconies !== undefined && (
              <View style={styles.statItem}>
                <FontAwesome5 name="tree" size={16} color="#059669" />
                <Text style={styles.statText}>
                  {property.balconies} {property.balconies === 1 ? "Balcony" : "Balconies"}
                </Text>
              </View>
            )}
            {property.bathrooms !== undefined && (
              <View style={styles.statItem}>
                <FontAwesome5 name="bath" size={16} color="#0ea5e9" />
                <Text style={styles.statText}>
                  {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                </Text>
              </View>
            )}
            {property.floors && (
              <View style={styles.statItem}>
                <FontAwesome5 name="building" size={16} color="#8b5cf6" />
                <Text style={styles.statText}>
                  {property.floors} {+property.floors === 1 ? "Floor" : "Floors"}
                </Text>
              </View>
            )}
          </View>
          {property.price !== undefined && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>₹{property.price.toLocaleString("en-IN")}</Text>
            </View>
          )}
          <Text style={styles.descriptionText}>{property.description}</Text>
        </View>
      </View>

      {/* Facilities and Amenities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facilities & Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {[
            { src: require('@/assets/images/image5.png'), label: "Elevator" },
            { src: require('@/assets/images/image6.png'), label: "Library" },
            { src: require('@/assets/images/image8.png'), label: "Laundry Room" },
            { src: require('@/assets/images/image11.png'), label: "24/7 CCTV Surveillance" },
            { src: require('@/assets/images/image7.png'), label: "Reception" },
            { src: require('@/assets/images/image8.png'), label: "Lorem, ipsum dolor." },
            { src: require('@/assets/images/image9.png'), label: "Wifi Connectivity" },
            { src: require('@/assets/images/image10.png'), label: "Basketball Court" },
          ].map((item, idx) => (
            <View key={idx} style={styles.amenityItem}>
              <View style={styles.amenityIconContainer}>
                <Image style={styles.amenityIcon} resizeMode='contain' source={item.src} />
              </View>
              <Text style={styles.amenityLabel} numberOfLines={2}>{item.label}</Text>
            </View>
          ))}
        </View>
        <PriceHistoryChart />
      </View>

      {/* Banking Section */}
      <View style={styles.section}>
        <View style={styles.bankingSectionHeader}>
          <Text style={styles.sectionTitle}>🏦 Loan Options Available</Text>
        </View>
        <View style={styles.loanFilterContainer}>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Desired loan amount"
              value={selectedLoanAmount}
              onChangeText={(text) => setSelectedLoanAmount(text)}
              keyboardType="numeric"
              style={styles.loanInput}
            />
            <TextInput
              placeholder="Monthly income"
              value={monthlyIncome}
              onChangeText={(text) => setMonthlyIncome(text)}
              keyboardType="numeric"
              style={styles.loanInput}
            />
          </View>
          <Pressable onPress={handleLoanFilterChange} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Get Personalized Offers</Text>
          </Pressable>
        </View>
        {loadingLoanOffers ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading loan offers...</Text>
          </View>
        ) : loanOffers.length > 0 ? (
          <View style={styles.loanOffersContainer}>
            <Text style={styles.offersCountText}>
              {loanOffers.length} loan offers available
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.offersScrollViewHorizontal}
              contentContainerStyle={styles.offersScrollContent}
            >
              {loanOffers.map((offer, index) => (
                <View key={index} style={styles.loanOfferCardHorizontal}>
                  <View style={styles.bankHeader}>
                    <Text style={styles.bankName}>{offer.bankName}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.starRating}>★</Text>
                      <Text style={styles.ratingText}>{offer.bankRating}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.productName}>
                    {offer.productName} - {offer.productType.replace("_", " ").toUpperCase()}
                  </Text>
                  <View style={styles.offerDetailsGrid}>
                    <View style={styles.offerDetailItem}>
                      <Text style={styles.offerDetailLabel}>Max Loan Amount</Text>
                      <Text style={styles.offerDetailValue}>
                        {formatCurrency(offer.maxLoanAmount)}
                      </Text>
                    </View>
                    <View style={styles.offerDetailItem}>
                      <Text style={styles.offerDetailLabel}>Interest Rate</Text>
                      <Text style={styles.offerDetailValue}>
                        {offer.interestRate}% p.a.
                      </Text>
                    </View>
                  </View>
                  {offer.emiOptions && offer.emiOptions.length > 0 && (
                    <View style={styles.emiOptionsContainer}>
                      <Text style={styles.emiOptionsLabel}>EMI Options</Text>
                      <View style={styles.emiOptionsGrid}>
                        {offer.emiOptions.slice(0, 3).map((emi, emiIndex) => (
                          <View key={emiIndex} style={styles.emiOption}>
                            <Text style={styles.emiText}>
                              {emi.tenure}yr: {formatCurrency(emi.emi)}/mo
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  {offer.processingFee > 0 && (
                    <Text style={styles.processingFeeText}>
                      Processing Fee: {formatCurrency(offer.processingFee)}
                    </Text>
                  )}
                  {offer.specialOffers && offer.specialOffers.length > 0 && (
                    <View style={styles.specialOfferContainer}>
                      <Text style={styles.specialOfferText}>
                        🎉 {offer.specialOffers[0].offerName}: {offer.specialOffers[0].description}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.noOffersContainer}>
            <Text style={styles.noOffersIcon}>🏦</Text>
            <Text style={styles.noOffersText}>
              No loan offers available for this property at the moment.
            </Text>
          </View>
        )}
      </View>

      {/* Review and Contact Section */}
      <View style={styles.reviewContactSection}>
        <View style={styles.reviewFormContainer}>
          <ReviewForm propertyId={property._id} />
        </View>
        {/* Uncomment when ContactForm is ready */}
        {/* <View style={styles.contactFormContainer}>
          <ContactForm
            userId={userId}
            phone={property.Propreiter_contact}
            propertyId={property._id}
          />
        </View> */}
      </View>

      {/* Reviews Section */}
      <View style={styles.section}>
        <ReviewPage reviewsProperty={reviews} />
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.addressContainer}>
          <View style={styles.addressIconContainer}>
            <Image
              source={require('@/assets/images/image13.png')}
              style={styles.mapIcon}
              resizeMode='contain'
            />
          </View>
          <View style={styles.addressDetails}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Address:</Text>
              <Text style={styles.addressValue}>{toTitleCase(property.address)}</Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>City:</Text>
              <Text style={styles.addressValue}>{toTitleCase(property.city)}</Text>
            </View>
            {property.landmark && (
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Landmark:</Text>
                <Text style={styles.addressValue}>{toTitleCase(property.landmark)}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.mapContainer}>
          <WebView
            style={styles.webMap}
            source={{
              uri: `https://www.google.com/maps?q=${encodeURIComponent(
                `${property.landmark || ""} ${property.city}`
              )}&output=embed`,
            }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header Section
  headerSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  propertyHeader: {
    marginBottom: 20,
  },
  // Enhanced property name block
  propertyTitleBlock: {
    marginBottom: 18,
    paddingTop: 10,
  },
  propertyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#22223b',
    letterSpacing: 0.3,
    fontFamily: 'System',
    marginBottom: 4,
  },
  propertySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '700',
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  ratingAndSaveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  starIcon: {
    fontSize: 18,
    color: '#fbbf24',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  reviewsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    backgroundColor: '#ffffff',
  },
  saveButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 6,
  },
  saveButtonTextActive: {
    color: '#ffffff',
  },
  // Gallery Section
  gallerySection: {
    marginBottom: 8,
  },
  galleryContainer: {
    paddingLeft: 20,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyImage: {
    width: screenWidth - 60,
    height: 240,
  },
  // Section Styling
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  // Description Section
  descriptionContainer: {
    gap: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  propertyStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    fontWeight: '500',
  },
  priceContainer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15803d',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  // Amenities Section
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  amenityItem: {
    width: (screenWidth - 64) / 2,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amenityIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amenityIcon: {
    height: 24,
    width: 24,
  },
  amenityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  // Banking Section
  bankingSectionHeader: {
    marginBottom: 20,
  },
  loanFilterContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  loanInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  filterButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  loanOffersContainer: {
    flex: 1,
  },
  offersCountText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  offersScrollViewHorizontal: {
    paddingVertical: 8,
  },
  offersScrollContent: {
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  loanOfferCardHorizontal: {
    width: screenWidth * 0.75,
    marginRight: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starRating: {
    color: '#f59e0b',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#92400e',
    fontWeight: '600',
  },
  productName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  offerDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  offerDetailItem: {
    flex: 1,
  },
  offerDetailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '500',
  },
  offerDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  emiOptionsContainer: {
    marginBottom: 12,
  },
  emiOptionsLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    fontWeight: '500',
  },
  emiOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emiOption: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  emiText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  processingFeeText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  specialOfferContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  specialOfferText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  noOffersContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noOffersIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOffersText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Review and Contact Section
  reviewContactSection: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewFormContainer: {
    flex: 1,
    marginRight: 10,
  },
  contactFormContainer: {
    flex: 1,
    marginLeft: 10,
  },
  // Location Section
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressIconContainer: {
    marginRight: 16,
    alignSelf: 'flex-start',
  },
  mapIcon: {
    height: 32,
    width: 32,
  },
  addressDetails: {
    flex: 1,
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    minWidth: 80,
  },
  addressValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webMap: {
    height: 300,
    width: '100%',
  },
});
