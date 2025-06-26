import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
// import { useSelector } from "react-redux";

// Import components (keep the same import structure)
import Navbar from '@/components/home/Navbar';
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
import ReviewForm from "@/components/home/ReviewForm";
import PropertyTypeCarousel from "@/components/home/PropertyTypeCarousel";
import SearchBar from "@/components/home/SearchBar";
import AppointmentForm from "@/components/home/AppointmentForm";
import BankingPartnersSection from "@/components/home/BankingPartnersSection";
import RecentSearch from "@/components/home/RecentSearch";
import StaffPerformanceCategories from "@/components/home//StaffPerformanceCategories";

const HomePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const router = useRouter();
  
  // const recentSearchCities = useSelector(
  //   (state) => state.search?.recentSearchCities || []
  // );

  // Commented out handleSubmit function (same as original)
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const apiUrl = "http://localhost:8000/api/appointments";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstName,
  //         lastName,
  //         email,
  //         phone,
  //       }),
  //     });
  //     if (response.ok) {
  //       Alert.alert("Success", "Appointment booked successfully!");
  //       setFirstName("");
  //       setLastName("");
  //       setEmail("");
  //       setPhone("");
  //       setIsFormVisible(false);
  //     } else {
  //       throw new Error("Failed to book appointment.");
  //     }
  //   } catch (error) {
  //     console.error("Error booking appointment:", error);
  //     Alert.alert("Error", "Failed to book appointment. Please try again.");
  //   }
  // };

  const fetchProperties = async (query = "") => {
    try {
      const response = await fetch(`http://localhost:8000/api/allproperty`, {
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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=real%20estate&apiKey=24bcf6c46b474bec8c8e6a95e67f0cbe"
        );
        const data = await response.json();
        // Note: fetchArticles is being called recursively here, might need fixing
        // fetchArticles(data.articles[7]);
      } catch (error) {
        console.error("Error fetching the articles: ", error);
      }
    };

    fetchArticles();
  }, []);

  const handlePropertyPress = (propertyId) => {
    router.push(`/property-details/${propertyId}`);
  };

  return (
    <ScrollView 
      style={[
        styles.pageContainer,
        isLoginPopupVisible && styles.blur
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <Navbar
        onLoginClick={() => setIsLoginPopupVisible(true)}
        onSearch={fetchProperties}
      />
      
      <View style={styles.hero}>
        <View style={styles.search}>
          <SearchBar />
        </View>
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
      
      {/* Banking Partners Section */}
      <BankingPartnersSection />
      
      <View style={styles.popularBuilders}>
        <Text style={styles.heading}>POPULAR BUILDERS</Text>
        <View style={styles.listings}>
          {properties.slice(0, 1).map((builder) => (
            <View key={builder._id} style={styles.builderCardWrapper}>
              <BuilderCard
                name="MV Kiran Sooraj"
                properties="1500+ Properties"
              />
              <BuilderCard 
                name="Raj" 
                properties="2000+ Properties" 
              />
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
            imageUrl="./istockphoto1476170969170667a-1@2x.png"
            name="Raghav"
            review="I was blown away by the exceptional service I received from your website! The website was easy to navigate, and the real estate agents were knowledgeable and responsive. I found my dream home in no time, and the entire process was stress-free. I highly recommend this to anyone looking to buy or sell a property. Thanks a lot to the team of BasilAbode."
          />
          <CustomerReviewCard
            imageUrl="./istockphoto1476170969170667a-1@2x.png"
            name="Kishore"
            review="As a first-time homebuyer, I was nervous about the process, but this made it a breeze! The website's resources and guides were incredibly helpful, and the agents were patient and understanding. I found my dream home in no time, and the entire process was stress-free. I felt supported every step of the way, and I couldn't be happier with my new home."
          />
          <CustomerReviewCard
            imageUrl="./istockphoto1476170969170667a-1@2x.png"
            name="Ravi"
            review="I had a great experience using this real estate website. The search functionality was user-friendly, and the property listings were accurate and detailed. The customer support team was always available to assist me with any questions I had. I found the perfect property and closed the deal smoothly. I will definitely use this website again for future real estate needs!"
          />
        </View>
      </View>
      
      {/* Uncomment if needed */}
      {/* <StaffPerformanceCategories /> */}
      
      <Articles />
      <Footer />
      
      {/* Login Popup Modal */}
      {isLoginPopupVisible && (
        <LoginPopup onClose={() => setIsLoginPopupVisible(false)} />
      )}
      
      {/* Appointment Form Modal */}
      {isFormVisible && (
        <AppointmentForm onClose={() => setIsFormVisible(false)} />
      )}
      
      {/* Fixed Appointment Button */}
      <TouchableOpacity
        style={styles.fixedIcon}
        onPress={() => setIsFormVisible(!isFormVisible)}
      >
        <Text style={styles.fixedIconText}>
          Book an{'\n'}Appointment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  blur: {
    opacity: 0.5,
  },
  hero: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  search: {
    alignItems: 'center',
  },
  popularProperties: {
    padding: 20,
  },
  popularBuilders: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  listings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyCardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  builderCardWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  insightsContainer: {
    padding: 0,
    margin: 0,
  },
  happyCustomers: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  reviews: {
    gap: 15,
  },
  fixedIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fixedIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;