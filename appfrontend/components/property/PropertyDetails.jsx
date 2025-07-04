import React, { useEffect, useState } from "react";
import PriceHistoryChart from "./SectionPriceHistoryChart";
import  ContactForm  from "./ContactForm";
import ReviewForm from "./ReviewForm";
import { ReviewSection } from "./SectionReview";
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
import { useRouter } from "expo-router"; // Add this import
const { width: screenWidth } = Dimensions.get("window");
import { LocationSection } from "./SectionLocation";
import { LoanSection } from "./SectionLoan";
import { ImageGallery } from "./SectionImageGallery";
import { PropertyHeaderSection } from "./SectionPropertyHeader";
import { PropertyDescriptionSection } from "./SectionPropertyDescription";
export const PropertyDetails = ({ property }) => {
 const router = useRouter(); // Use Expo Router's hook
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
       router.back();
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
      <PropertyHeaderSection
        property={property}
        reviews={reviews}
        averageRating={averageRating}
        isSaved={isSaved}
        handleGoBack={handleGoBack}
        handleSaveProperty={handleSaveProperty}
        toTitleCase={toTitleCase}
      />
      {/* Image Gallery */}
      <ImageGallery images={property.images} />

      {/* Property Description */}
      <PropertyDescriptionSection property={property} />
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
      </View>
      <View style={styles.section}>
        <PriceHistoryChart />
      </View>
      <LoanSection
        showLoanOffers={showLoanOffers}
        setShowLoanOffers={setShowLoanOffers}
        selectedLoanAmount={selectedLoanAmount}
        setSelectedLoanAmount={setSelectedLoanAmount}
        monthlyIncome={monthlyIncome}
        setMonthlyIncome={setMonthlyIncome}
        handleLoanFilterChange={handleLoanFilterChange}
        loadingLoanOffers={loadingLoanOffers}
        loanOffers={loanOffers}
        formatCurrency={formatCurrency}
      />

      <ReviewSection
        reviews={reviews}
        showReviewForm={showReviewForm}
        setShowReviewForm={setShowReviewForm}
        propertyId={property._id}
      />
      {/* <View style={styles.contactFormContainer}> */}
        <ContactForm
          userId={userId}
          phone={property.Propreiter_contact}
          propertyId={property._id}
        />
      {/* </View> */}
      {/* Location Section */}

      <LocationSection
        property={property}
        showNearby={showNearby}
        setShowNearby={setShowNearby}
        toTitleCase={toTitleCase}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
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
});
