import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList
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
import { checkAuth } from "@/redux/Auth/AuthSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from "react-native";

const { width, height } = Dimensions.get('window');
const PROPERTY_CARD_WIDTH = width * 0.95;
const PROPERTY_CARD_MARGIN = 10;
const PROPERTY_SIDE_SPACING = (width - PROPERTY_CARD_WIDTH) / 2;
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

const HomePage = () => {
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const router = useRouter();
  const propertyFlatListRef = useRef(null);
  const autoScrollTimerRef = useRef(null);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { authUser, userType } = useSelector((state) => state.auth);


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

  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    autoScrollTimerRef.current = setInterval(() => {
      if (isAutoScrollEnabled && properties.length > 0) {
        setCurrentPropertyIndex((prevIndex) => {
          const maxIndex = Math.min(properties.length, 6) - 1;
          const nextIndex = prevIndex >= maxIndex ? 0 : prevIndex + 1;
          
          // Scroll to next property
          const scrollPosition = nextIndex * (PROPERTY_CARD_WIDTH + PROPERTY_CARD_MARGIN);
          propertyFlatListRef.current?.scrollToOffset({
            offset: scrollPosition,
            animated: true,
          });
          
          return nextIndex;
        });
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  // Start auto-scroll when properties are loaded
  useEffect(() => {
    if (properties.length > 0 && isAutoScrollEnabled) {
      startAutoScroll();
    }

    return () => {
      stopAutoScroll();
    };
  }, [properties, isAutoScrollEnabled]);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, []);



  const renderPropertyItem = ({ item, index }) => {
    return (
      <View style={[
        styles.propertyCardWrapper,
        index === 0 && { marginLeft: PROPERTY_SIDE_SPACING },
        index === properties.slice(0, 6).length - 1 && { marginRight: PROPERTY_SIDE_SPACING },
        index > 0 && { marginLeft: PROPERTY_CARD_MARGIN }
      ]}>
        <TouchableOpacity
          // onPress={() => handlePropertyPress(item._id)}
          activeOpacity={0.7}
        >
          <PropertyCard
            id={item._id}
            title={item.title}
            bhk={item.Bhk}
            city={item.city}
            price={item.price?.toString()}
            area={item.area?.toString()}
            images={item.images}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onPropertyMomentumScrollEnd = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / (PROPERTY_CARD_WIDTH + PROPERTY_CARD_MARGIN));
    const maxIndex = Math.min(properties.length, 6) - 1;
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentPropertyIndex(newIndex);
  };

  // Handle manual indicator press
  const handleIndicatorPress = (index) => {
    // Temporarily disable auto-scroll when user manually navigates
    setIsAutoScrollEnabled(false);
    setCurrentPropertyIndex(index);
    
    const scrollPosition = index * (PROPERTY_CARD_WIDTH + PROPERTY_CARD_MARGIN);
    propertyFlatListRef.current?.scrollToOffset({
      offset: scrollPosition,
      animated: true,
    });

    // Re-enable auto-scroll after a delay
    setTimeout(() => {
      setIsAutoScrollEnabled(true);
    }, 5000); // Resume auto-scroll after 5 seconds
  };

  // Handle touch events to pause auto-scroll during user interaction
  const handleScrollBeginDrag = () => {
    setIsAutoScrollEnabled(false);
  };

  const handleScrollEndDrag = () => {
    // Resume auto-scroll after user finishes dragging
    setTimeout(() => {
      setIsAutoScrollEnabled(true);
    }, 3000); // Resume after 3 seconds
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
          <View style={styles.propertyCarouselContainer}>
            <FlatList
              ref={propertyFlatListRef}
              data={properties.slice(0, 6)}
              renderItem={renderPropertyItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={PROPERTY_CARD_WIDTH + PROPERTY_CARD_MARGIN}
              decelerationRate="fast"
              onMomentumScrollEnd={onPropertyMomentumScrollEnd}
              onScrollBeginDrag={handleScrollBeginDrag}
              onScrollEndDrag={handleScrollEndDrag}
              contentContainerStyle={styles.propertyCarousel}
              pagingEnabled={false}
              snapToAlignment="start"
            />
          </View>

          <View style={styles.propertyIndicators}>
            {properties.slice(0, 6).map((_, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.propertyIndicator,
                  idx === currentPropertyIndex && styles.activePropertyIndicator,
                ]}
                onPress={() => handleIndicatorPress(idx)}
              />
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
              imageSource={require("@/assets/images/reviewimage.png")}
              name="Raghav"
              review="I was blown away by the exceptional service I received from your website! The website was easy to navigate, and the real estate agents were knowledgeable and responsive. I found my dream home in no time, and the entire process was stress-free. I highly recommend this to anyone looking to buy or sell a property. Thanks a lot to the team of BasilAbode."
            />
            <CustomerReviewCard
              imageSource={require("@/assets/images/reviewimage.png")}
              name="Kishore"
              review="As a first-time homebuyer, I was nervous about the process, but this made it a breeze! The website's resources and guides were incredibly helpful, and the agents were patient and understanding. I found my dream home in no time, and the entire process was stress-free. I felt supported every step of the way, and I couldn't be happier with my new home."
            />
            <CustomerReviewCard
              imageSource={require("@/assets/images/reviewimage.png")}
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
    paddingVertical: 40,
    backgroundColor: "#f8fafc",
  },
  popularBuilders: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
    letterSpacing: 1,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  propertyCarouselContainer: {
    alignItems: "center",
  },
  propertyCarousel: {
    alignItems: "center",
  },
  propertyCardWrapper: {
    width: PROPERTY_CARD_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  propertyIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  propertyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activePropertyIndicator: {
    backgroundColor: "#667eea",
    transform: [{ scale: 1.2 }],
  },
  autoScrollToggle: {
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  autoScrollToggleText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  builderListings: {
    alignItems: 'center',
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
    zIndex: 100,
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