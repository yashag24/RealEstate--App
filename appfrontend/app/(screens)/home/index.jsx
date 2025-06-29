import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";

// Import components
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import CustomerReviewCard from "@/components/home/CustomerReviewCard";
import LoginPopup from "@/components/home/LoginPopup";
import PropertyCard from "@/components/home/PropertyCard";
import BuilderCard from "@/components/home/BuilderCard";
import CardLayout from "@/components/home/Insights";
import CityWiseReviews from "@/components/home/CityWiseReviews";
import Upcoming from "@/components/home/upcoming";
import EmergingLocalities from "@/components/home/EmergingLocalities";
import Articles from "@/components/home/Articles";
import PropertyTypeCarousel from "@/components/home/PropertyTypeCarousel";
import SearchBar from "@/components/home/SearchBar";
import AppointmentForm from "@/components/home/AppointmentForm";
import BankingPartnersSection from "@/components/home/BankingPartnersSection";
import RecentSearch from "@/components/home/RecentSearch";
import StaffPerformanceCategories from "@/components/home/StaffPerformanceCategories";

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const router = useRouter();
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const fetchProperties = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/allproperty`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const result = await response.json();
      setProperties(result);
    } catch (error) {
      console.log("Error fetching property cards:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyPress = (propertyId) => {
    router.push(`/property-details/${propertyId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.pageContainer, isLoginPopupVisible && styles.blur]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Navbar
          onLoginClick={() => setIsLoginPopupVisible(true)}
          onSearch={fetchProperties}
        />

        <View style={styles.heroContainer}>
          <ImageBackground 
            source={require('@/assets/images/bg.jpg')}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay}>
              <View style={styles.searchWrapper}>
                <SearchBar />
              </View>
            </View>
          </ImageBackground>
        </View>

        <RecentSearch />
        <PropertyTypeCarousel />

        <View style={styles.popularProperties}>
          <Text style={styles.heading}>POPULAR PROPERTIES</Text>
          <View style={styles.listings}>
            {properties.slice(0, 4).map((property) => (
              <TouchableOpacity
                key={property._id}
                onPress={() => handlePropertyPress(property._id)}
                style={styles.propertyCardWrapper}
                activeOpacity={0.7}
              >
                <PropertyCard
                  title={property.title}
                  bhk={property.Bhk}
                  city={property.city}
                  price={property.price?.toString()}
                  area={property.area?.toString()}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <BankingPartnersSection />

        <View style={styles.popularBuilders}>
          <Text style={styles.heading}>POPULAR BUILDERS</Text>
          <View style={styles.builderListings}>
            {properties.slice(0, 1).map((builder) => (
              <View key={builder._id} style={styles.builderCardWrapper}>
                <BuilderCard
                  name="MV Kiran Sooraj"
                  properties="1500+ Properties"
                  imageUrl={properties.images}
                />
                <BuilderCard name="Raj" properties="2000+ Properties" />
              </View>
            ))}
          </View>
        </View>

        <Upcoming />
        <CityWiseReviews />
        <EmergingLocalities />

        <View style={styles.insightsContainer}>
          <CardLayout />
        </View>

        <View style={styles.happyCustomers}>
          <Text style={styles.heading}>HAPPY CUSTOMERS</Text>
          <Text style={styles.subheading}>HAPPY TRADE</Text>
          <View style={styles.reviews}>
            <CustomerReviewCard
              imageSource={require("../../../assets/images/reviewimage.png")}
              name="Raghav"
              review="I was blown away by the exceptional service I received from your website! The website was easy to navigate, and the real estate agents were knowledgeable and responsive. I found my dream home in no time, and the entire process was stress-free. I highly recommend this to anyone looking to buy or sell a property. Thanks a lot to the team of BasilAbode."
            />
            <CustomerReviewCard
              imageSource={require("../../../assets/images/reviewimage.png")}
              name="Kishore"
              review="As a first-time homebuyer, I was nervous about the process, but this made it a breeze! The website's resources and guides were incredibly helpful, and the agents were patient and understanding. I found my dream home in no time, and the entire process was stress-free. I felt supported every step of the way, and I couldn't be happier with my new home."
            />
            <CustomerReviewCard
              imageSource={require("../../../assets/images/reviewimage.png")}
              name="Ravi"
              review="I had a great experience using this real estate website. The search functionality was user-friendly, and the property listings were accurate and detailed. The customer support team was always available to assist me with any questions I had. I found the perfect property and closed the deal smoothly. I will definitely use this website again for future real estate needs!"
            />
          </View>
        </View>

        <StaffPerformanceCategories />
        <Articles />
        <Footer />
      </ScrollView>

      {isLoginPopupVisible && (
        <View style={styles.modalOverlay}>
          <LoginPopup onClose={() => setIsLoginPopupVisible(false)} />
        </View>
      )}

      {isFormVisible && (
        <View style={styles.modalOverlay}>
          <AppointmentForm onClose={() => setIsFormVisible(false)} />
        </View>
      )}

      <TouchableOpacity
        style={styles.fixedIcon}
        onPress={() => setIsFormVisible(!isFormVisible)}
        activeOpacity={0.8}
      >
        <Text style={styles.fixedIconText}>Book an{"\n"}Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  blur: {
    opacity: 0.5,
  },
  heroContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  heroBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: "center",
  },
  popularProperties: {
    padding: 20,
  },
  popularBuilders: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  listings: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  builderListings: {
    alignItems: 'center',
  },
  propertyCardWrapper: {
    width: (width - 50) / 2,
    marginBottom: 15,
  },
  builderCardWrapper: {
    width: "100%",
    marginBottom: 15,
    gap: 10,
  },
  insightsContainer: {
    marginVertical: 10,
  },
  happyCustomers: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  reviews: {
    gap: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fixedIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedIconText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default HomePage;