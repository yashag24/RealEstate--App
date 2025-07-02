import React, { useEffect, useState } from "react";
import PriceHistoryChart from "./PriceHistoryChart";
import { ContactForm } from "./ContactForm";
import ReviewForm from "./ReviewForm";
import { ReviewPage } from "./ReviewPage";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
const { width: screenWidth } = Dimensions.get("window");

export const PropertyDetails = ({ property }) => {
  const navigation = useNavigation(); // Add this hook
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loanOffers, setLoanOffers] = useState([]);
  const [loadingLoanOffers, setLoadingLoanOffers] = useState(false);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLoanOffers, setShowLoanOffers] = useState(false);
  const [showNearby, setShowNearby] = useState(true);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const toTitleCase = (str = "") => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  // Add back button handler
  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSaveProperty = async () => {
    try {
      if (!userId) {
        Alert.alert("Please log in to save properties");
        return;
      }
      const response = await fetch(
        `${BASE_URL}/api/user-update/save-property`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            propertyId: property._id,
          }),
        }
      );
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
      Alert.alert("Failed");
    }
  };

  const fetchLoanOffers = async () => {
    if (!property._id) return;
    setLoadingLoanOffers(true);
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
  };

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
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
        console.error("Failed to check saved status", error);
      }
    };
    checkIfSaved();
  }, [userId, property._id]);

  const handleLoanFilterChange = () => {
    fetchLoanOffers();
  };

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
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <FontAwesome5 name="arrow-left" size={18} color="#374151" />
        </Pressable>
      </View>
      {/* Property Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {property.title}
          </Text>
          {property.verification && (
            <View style={styles.verifiedBadge}>
              <FontAwesome5 name="check-circle" size={16} color="#22c55e" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.propertySubtitle}>
          {toTitleCase(property.type)} &bull; {toTitleCase(property.city)}
        </Text>

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
                resizeMode="cover"
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
              <Text style={styles.statusText}>
                {property.availabilityStatus}
              </Text>
            </View>
          )}
          <View style={styles.propertyStats}>
            {property.balconies !== undefined && (
              <View style={styles.statItem}>
                <FontAwesome5 name="tree" size={16} color="#059669" />
                <Text style={styles.statText}>
                  {property.balconies}{" "}
                  {property.balconies === 1 ? "Balcony" : "Balconies"}
                </Text>
              </View>
            )}
            {property.bathrooms !== undefined && (
              <View style={styles.statItem}>
                <FontAwesome5 name="bath" size={16} color="#0ea5e9" />
                <Text style={styles.statText}>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                </Text>
              </View>
            )}
            {property.floors && (
              <View style={styles.statItem}>
                <FontAwesome5 name="building" size={16} color="#8b5cf6" />
                <Text style={styles.statText}>
                  {property.floors}{" "}
                  {+property.floors === 1 ? "Floor" : "Floors"}
                </Text>
              </View>
            )}
          </View>
          {property.price !== undefined && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>
                ₹{property.price.toLocaleString("en-IN")}
              </Text>
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
            { src: require("@/assets/images/image5.png"), label: "Elevator" },
            { src: require("@/assets/images/image6.png"), label: "Library" },
            {
              src: require("@/assets/images/image8.png"),
              label: "Laundry Room",
            },
            {
              src: require("@/assets/images/image11.png"),
              label: "24/7 CCTV Surveillance",
            },
            { src: require("@/assets/images/image7.png"), label: "Reception" },
            {
              src: require("@/assets/images/image8.png"),
              label: "Lorem, ipsum dolor.",
            },
            {
              src: require("@/assets/images/image9.png"),
              label: "Wifi Connectivity",
            },
            {
              src: require("@/assets/images/image10.png"),
              label: "Basketball Court",
            },
          ].map((item, idx) => (
            <View key={idx} style={styles.amenityItem}>
              <View style={styles.amenityIconContainer}>
                <Image
                  style={styles.amenityIcon}
                  resizeMode="contain"
                  source={item.src}
                />
              </View>
              <Text style={styles.amenityLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
        <PriceHistoryChart />
      </View>

      {/* Banking Section */}
      <View style={styles.section}>
        <View style={styles.bankingSectionHeader}>
          <Text style={styles.sectionTitle}>🏦 Loan Options Available</Text>
          {showLoanOffers && (
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowLoanOffers(false)}
            >
              <View style={styles.closeButtonCircle}>
                <Text style={styles.closeButtonText}>×</Text>
              </View>
            </Pressable>
          )}
        </View>
        {!showLoanOffers ? (
          <Pressable
            style={styles.showLoanOffersButton}
            onPress={() => setShowLoanOffers(true)}
          >
            <Text style={styles.showLoanOffersButtonText}>
              Show Loan Offers
            </Text>
          </Pressable>
        ) : (
          <View style={{ position: "relative" }}>
            {/* Loan Offers Content */}
            <View>
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
                <Pressable
                  onPress={handleLoanFilterChange}
                  style={styles.filterButton}
                >
                  <Text style={styles.filterButtonText}>
                    Get Personalized Offers
                  </Text>
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
                            <Text style={styles.ratingText}>
                              {offer.bankRating}/5
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.productName}>
                          {offer.productName} -{" "}
                          {offer.productType.replace("_", " ").toUpperCase()}
                        </Text>
                        <View style={styles.offerDetailsGrid}>
                          <View style={styles.offerDetailItem}>
                            <Text style={styles.offerDetailLabel}>
                              Max Loan Amount
                            </Text>
                            <Text style={styles.offerDetailValue}>
                              {formatCurrency(offer.maxLoanAmount)}
                            </Text>
                          </View>
                          <View style={styles.offerDetailItem}>
                            <Text style={styles.offerDetailLabel}>
                              Interest Rate
                            </Text>
                            <Text style={styles.offerDetailValue}>
                              {offer.interestRate}% p.a.
                            </Text>
                          </View>
                        </View>
                        {offer.emiOptions && offer.emiOptions.length > 0 && (
                          <View style={styles.emiOptionsContainer}>
                            <Text style={styles.emiOptionsLabel}>
                              EMI Options
                            </Text>
                            <View style={styles.emiOptionsGrid}>
                              {offer.emiOptions
                                .slice(0, 2)
                                .map((emi, emiIndex) => (
                                  <View key={emiIndex} style={styles.emiOption}>
                                    <Text style={styles.emiText}>
                                      {emi.tenure}yr: {formatCurrency(emi.emi)}
                                      /mo
                                    </Text>
                                  </View>
                                ))}
                            </View>
                          </View>
                        )}
                        {offer.processingFee > 0 && (
                          <Text style={styles.processingFeeText}>
                            Processing Fee:{" "}
                            {formatCurrency(offer.processingFee)}
                          </Text>
                        )}
                        {offer.specialOffers &&
                          offer.specialOffers.length > 0 && (
                            <View style={styles.specialOfferContainer}>
                              <Text style={styles.specialOfferText}>
                                🎉 {offer.specialOffers[0].offerName}:{" "}
                                {offer.specialOffers[0].description}
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
          </View>
        )}
      </View>

      {/* Review and Contact Section */}
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
              propertyId={property._id}
              onClose={() => setShowReviewForm(false)}
            />
          )}
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Location & Connectivity</Text>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={styles.addressIconContainer}>
              <FontAwesome5 name="map-marker-alt" size={20} color="#ef4444" />
            </View>
            <View style={styles.addressHeaderText}>
              <Text style={styles.addressTitle}>Property Address</Text>
              <Text style={styles.addressSubtitle}>Exact location details</Text>
            </View>
          </View>

          <View style={styles.addressDetails}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Address:</Text>
              <Text style={styles.addressValue}>
                {toTitleCase(property.address)}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>City:</Text>
              <Text style={styles.addressValue}>
                {toTitleCase(property.city)}
              </Text>
            </View>
            {property.landmark && (
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Landmark:</Text>
                <Text style={styles.addressValue}>
                  {toTitleCase(property.landmark)}
                </Text>
              </View>
            )}
            {property.pincode && (
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>PIN Code:</Text>
                <Text style={styles.addressValue}>{property.pincode}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Nearby Places */}
        {/* Nearby Places & Transportation Toggle */}
        {/* <Pressable
          style={styles.showClickButton}
          onPress={() => setShowNearby((prev) => !prev)}
        >
          <Text style={styles.showClickButtonText}>
            {showNearby ? "Hide Nearby & Transport" : "Click for more"}
          </Text>
        </Pressable> */}

        {showNearby && (
          <>
            {/* Nearby Places */}
            <View style={styles.nearbySection}>
              <Text style={styles.nearbyTitle}>🎯 Nearby Places</Text>
              <View style={styles.nearbyGrid}>
                {[
                  {
                    icon: "hospital",
                    label: "Hospitals",
                    distance: "2.5 km",
                    color: "#ef4444",
                  },
                  {
                    icon: "graduation-cap",
                    label: "Schools",
                    distance: "1.8 km",
                    color: "#3b82f6",
                  },
                  {
                    icon: "shopping-cart",
                    label: "Shopping",
                    distance: "3.2 km",
                    color: "#f59e0b",
                  },
                  {
                    icon: "subway",
                    label: "Metro/Bus",
                    distance: "1.5 km",
                    color: "#10b981",
                  },
                  {
                    icon: "utensils",
                    label: "Restaurants",
                    distance: "0.8 km",
                    color: "#8b5cf6",
                  },
                  {
                    icon: "gas-pump",
                    label: "Fuel Station",
                    distance: "2.1 km",
                    color: "#f97316",
                  },
                ].map((place, index) => (
                  <View key={index} style={styles.nearbyItem}>
                    <View
                      style={[
                        styles.nearbyIconContainer,
                        { backgroundColor: `${place.color}15` },
                      ]}
                    >
                      <FontAwesome5
                        name={place.icon}
                        size={16}
                        color={place.color}
                      />
                    </View>
                    <View style={styles.nearbyInfo}>
                      <Text style={styles.nearbyLabel}>{place.label}</Text>
                      {/* <Text style={styles.nearbyDistance}>{place.distance}</Text> */}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Transportation */}
            <View style={styles.transportSection}>
              <Text style={styles.transportTitle}>🚗 Transportation</Text>
              <View style={styles.transportGrid}>
                <View style={styles.transportItem}>
                  <View style={styles.transportIconContainer}>
                    <FontAwesome5 name="car" size={18} color="#3b82f6" />
                  </View>
                  <View style={styles.transportInfo}>
                    <Text style={styles.transportLabel}>Parking</Text>
                    <Text style={styles.transportValue}>Available</Text>
                  </View>
                </View>
                <View style={styles.transportItem}>
                  <View style={styles.transportIconContainer}>
                    <FontAwesome5 name="road" size={18} color="#10b981" />
                  </View>
                  <View style={styles.transportInfo}>
                    <Text style={styles.transportLabel}>Road Access</Text>
                    <Text style={styles.transportValue}>Main Road</Text>
                  </View>
                </View>
                <View style={styles.transportItem}>
                  <View style={styles.transportIconContainer}>
                    <FontAwesome5 name="bus" size={18} color="#f59e0b" />
                  </View>
                  <View style={styles.transportInfo}>
                    <Text style={styles.transportLabel}>Public Transport</Text>
                    <Text style={styles.transportValue}>Excellent</Text>
                  </View>
                </View>
                <View style={styles.transportItem}>
                  <View style={styles.transportIconContainer}>
                    <FontAwesome5 name="plane" size={18} color="#8b5cf6" />
                  </View>
                  <View style={styles.transportInfo}>
                    <Text style={styles.transportLabel}>Airport</Text>
                    <Text style={styles.transportValue}>45 min</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Location Highlights
  <View style={styles.highlightsSection}>
    <Text style={styles.highlightsTitle}>✨ Location Highlights</Text>
    <View style={styles.highlightsList}>
      <View style={styles.highlightItem}>
        <View style={styles.highlightDot} />
        <Text style={styles.highlightText}>Prime residential area</Text>
      </View>
      <View style={styles.highlightItem}>
        <View style={styles.highlightDot} />
        <Text style={styles.highlightText}>Well-connected to business districts</Text>
      </View>
      <View style={styles.highlightItem}>
        <View style={styles.highlightDot} />
        <Text style={styles.highlightText}>Peaceful neighborhood</Text>
      </View>
      <View style={styles.highlightItem}>
        <View style={styles.highlightDot} />
        <Text style={styles.highlightText}>Good investment potential</Text>
      </View>
    </View>
  </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // --- Back Button Styles ---
  backButtonContainer: {
    position: "absolute",
    // Adjust based on your status bar height
    left: 20,
    zIndex: 1000,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.3)",
  },

  // --- Modern Header Styles ---
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 45, // Increased to accommodate back button
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },
  propertyTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#22223b",
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0fce6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
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
    marginBottom: 8,
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
  // --- Rest of your styles unchanged ---
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
  showLoanOffersButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    minWidth: 180,
    alignSelf: "center",
    // marginVertical: 2,
  },
  showLoanOffersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
    showClickButton: {
    backgroundColor: "rgb(238, 46, 32)",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    minWidth: 200,
    alignSelf: "center",
    // marginVertical: 2,
  },
  showClickButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#64748b",
    fontWeight: "300",
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  // ... (keep the rest of your styles unchanged as before)
  // (Amenities, loan offers, review, location, etc.)

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
  // Section Styling
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 10,
  },
  // Description Section
  descriptionContainer: {
    gap: 7,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
  },
  propertyStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statText: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 8,
    fontWeight: "500",
  },
  priceContainer: {
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  priceLabel: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#15803d",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
  // Amenities Section
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  amenityItem: {
    width: (screenWidth - 64) / 4,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 70, // limit height
    maxHeight: 80,
  },
  amenityIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    elevation: 1,
  },
  amenityIcon: {
    height: 20,
    width: 20,
  },
  amenityLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  // Banking Section
  bankingSectionHeader: {
    marginBottom: 20,
  },
  loanFilterContainer: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  loanInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  filterButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loanOffersContainer: {
    flex: 1,
  },
  offersCountText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  offersScrollViewHorizontal: {
    paddingVertical: 8,
  },
  offersScrollContent: {
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "stretch",
  },
  loanOfferCardHorizontal: {
    width: screenWidth * 0.75,
    marginRight: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  bankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starRating: {
    color: "#f59e0b",
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#92400e",
    fontWeight: "600",
  },
  productName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  offerDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  offerDetailItem: {
    flex: 1,
  },
  offerDetailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
    fontWeight: "500",
  },
  offerDetailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  emiOptionsContainer: {
    marginBottom: 12,
  },
  emiOptionsLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8,
    fontWeight: "500",
  },
  emiOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emiOption: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  emiText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "600",
  },
  processingFeeText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  specialOfferContainer: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  specialOfferText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  noOffersContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noOffersIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOffersText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Review and Contact Section
  reviewContactSection: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewFormContainer: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center", // Center horizontally
    justifyContent: "center",
  },
  contactFormContainer: {
    flex: 1,
    marginLeft: 10,
  },
  // Location Section
  addressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#fef2f2",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressHeaderText: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  addressSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  addressDetails: {
    gap: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    minWidth: 80,
    marginRight: 12,
  },
  addressValue: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
    lineHeight: 20,
  },

  // Nearby Places
  nearbySection: {
    marginBottom: 24,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  nearbyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nearbyItem: {
    width: (screenWidth - 64) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  nearbyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  nearbyDistance: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Transportation
  transportSection: {
    marginBottom: 24,
  },
  transportTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  transportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  transportItem: {
    width: (screenWidth - 64) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transportIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f9ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transportInfo: {
    flex: 1,
  },
  transportLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  transportValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },

  // Map Section
  mapSection: {
    marginBottom: 24,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  viewMapButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    gap: 6,
  },
  viewMapText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    paddingHorizontal: 20,
  },
  mapIconLarge: {
    marginBottom: 12,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  mapPlaceholderSubtext: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },

  // Location Highlights
  highlightsSection: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  highlightsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#15803d",
    marginBottom: 12,
  },
  highlightsList: {
    gap: 8,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  highlightDot: {
    width: 6,
    height: 6,
    backgroundColor: "#22c55e",
    borderRadius: 3,
    marginRight: 12,
  },
  highlightText: {
    fontSize: 14,
    color: "#166534",
    fontWeight: "500",
    flex: 1,
  },
});
