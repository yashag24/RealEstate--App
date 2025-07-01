import React, { useEffect, useState } from 'react';
import PriceHistoryChart from './PriceHistoryChart';
import { ContactForm } from './ContactForm';
import ReviewForm from '../home/ReviewForm';
import { ReviewPage } from './ReviewPage';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { jwtDecode } from "jwt-decode"

export const PropertyDetails = ({ property }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loanOffers, setLoanOffers] = useState([]);
  const [loadingLoanOffers, setLoadingLoanOffers] = useState(false);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [showAllOffers, setShowAllOffers] = useState(false);
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
    console.log(decoded, "token");
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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.details}>
        <View style={styles.header}>
          <View style={styles.title}>
            <View style={styles.propertyName}>
              {property.verification && (
                <Image
                  source={require('@/assets/images/verified.png')}
                  style={styles.verify}
                />
              )}
              <Text style={styles.propertyTitle}>{property.title}</Text>
            </View>

            <View style={styles.detailsRow}>
              <FontAwesome5 name="ruler-combined" size={16} />
              <Text> {property.area} Sqft. | </Text>
              <FontAwesome5 name="bed" size={16} />
              <Text> {property.Bhk} BHK | </Text>
              <FontAwesome5 name="rupee-sign" size={16} />
              <Text> {property.price} | </Text>
              <FontAwesome5 name="home" size={16} />
              <Text> {property.type} | {toTitleCase(property.status)} | {property.purpose}</Text>
            </View>
          </View>

          <View style={styles.ratingAndSave}>
            <View style={styles.ratings}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>
                    {averageRating >= star ? '★' : '☆'}
                  </Text>
                ))}
              </View>
              <Text style={styles.reviews}>({reviews.length} Reviews)</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProperty}>
              <Text style={styles.saveBtnText}>
                {isSaved ? "Unsave Property" : "Save Property"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.Gallery}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.images}
        >
          {property.images.map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: url }}
              style={styles.image}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.PropertyDetails}>
        <View style={styles.Description}>
          <Text style={styles.heading}>Description</Text>
          <Text style={styles.describe}>
            {property.availabilityStatus && `- ${property.availabilityStatus}\n`}
            -
            {property.balconies !== undefined &&
              ` ${property.balconies} ${property.balconies === 1 ? "Balcony" : "Balconies"} `}
            {property.bathrooms !== undefined &&
              `| ${property.bathrooms} ${property.bathrooms === 1 ? "Bathroom" : "Bathrooms"} `}
            {property.floors &&
              `| ${property.floors} ${+property.floors === 1 ? "Floor" : "Floors"}`}
            {property.price !== undefined &&
              ` | ₹${property.price.toLocaleString("en-IN")}`}
            {"\n"}- {property.description}
          </Text>
        </View>
      </View>

      <View style={styles.FacilitiesAmenities}>
        <Text style={styles.heading}>Facilities and Amenities</Text>
        <View style={styles.gridContainer}>
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
            <View key={idx} style={styles.gridItem}>
              <Image style={styles.img} source={item.src} />
              <Text style={styles.facilityamenity}>{item.label}</Text>
            </View>
          ))}
        </View>
        <PriceHistoryChart />
      </View>

      <View style={[
        styles.bankingSection,
        {
          marginBottom: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          marginTop: 20,
          minHeight: 900,
        },
      ]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          🏦 Loan Options Available
        </Text>
        {/* Loan Filter Inputs */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <TextInput
              placeholder="Desired loan amount"
              value={selectedLoanAmount}
              onChangeText={(text) => setSelectedLoanAmount(text)}
              keyboardType="numeric"
              style={{
                flex: 1,
                padding: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
            <TextInput
              placeholder="Monthly income"
              value={monthlyIncome}
              onChangeText={(text) => setMonthlyIncome(text)}
              keyboardType="numeric"
              style={{
                flex: 1,
                padding: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleLoanFilterChange}
            style={{
              width: '100%',
              padding: 8,
              backgroundColor: '#007bff',
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
            }}>
              Get Personalized Offers
            </Text>
          </TouchableOpacity>
          {
            loadingLoanOffers ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text>Loading loan offers...</Text>
              </View>
            ) : loanOffers.length > 0 ? (
              <View>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  marginBottom: 10,
                }}>
                  {loanOffers.length} loan offers available
                </Text>
                {/* Scrollable container for loan offers */}
                <View style={{
                  maxHeight: 800,
                  overflowY: 'auto',
                  paddingRight: 5,
                }}>
                  {
                    loanOffers.map((offer, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 15,
                          padding: 15,
                          borderWidth: 1,
                          borderColor: '#e0e0e0',
                          borderRadius: 6,
                          backgroundColor: 'white',
                        }}>
                        <View style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}>
                          <View style={{
                            fontWeight: 'bold',
                            fontSize: 16
                          }}>
                            {offer.bankName}

                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#ffa500' }}>★</Text>
                            <Text style={{ fontSize: 14, marginLeft: 5 }}>
                              {offer.bankRating}/5
                            </Text>
                          </View>

                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#666',
                            marginBottom: 8,
                          }}
                        >
                          {offer.productName} - {offer.productType.replace("_", " ").toUpperCase()}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginBottom: 10,
                          }}
                        >
                          <View>
                            <View style={{
                              fontSize: 12,
                              color: '#888'
                            }}>
                              Max Loan Amount
                            </View>
                            <Text style={{ fontWeight: 'bold', color: '#28a745' }}>
                              {formatCurrency(offer.maxLoanAmount)}
                            </Text>

                          </View>
                          <View>
                            <Text style={{ fontSize: 12, color: '#888' }}>
                              Interest Rate
                            </Text>
                            <Text style={{ fontWeight: 'bold', color: '#007bff' }}>
                              {offer.interestRate}% p.a.
                            </Text>

                          </View>
                        </View>

                        {
                          offer.emiOptions && offer.emiOptions.length > 0 && (
                            <View style={{ marginBottom: 10 }}>
                              <Text style={{ fontSize: 12, color: '#888', marginBottom: 5, }}>
                                EMI Options
                              </Text>
                              <View>
                                {
                                  offer.emiOptions.slice(0, 3).map((emi, emiIndex) => (
                                    <View
                                      key={emiIndex}
                                      style={{
                                        paddingVertical: 4,
                                        paddingHorizontal: 8,
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#cce7ff',
                                      }}
                                    >
                                      <Text style={{ fontSize: 12 }}>
                                        {emi.tenure}yr: {formatCurrency(emi.emi)}/mo
                                      </Text>
                                    </View>
                                  ))
                                }

                              </View>

                            </View>
                          )
                        }
                        {offer.processingFee > 0 && (
                          <Text style={{ fontSize: 12, color: '#666' }}>
                            Processing Fee: {formatCurrency(offer.processingFee)}
                          </Text>
                        )}

                        {
                          offer.specialOffers && offer.specialOffers.length > 0 && (
                            <View style={{
                              marginTop: 8,
                              paddingVertical: 6,
                              paddingHorizontal: 8,
                              backgroundColor: '#fff3cd',
                              borderRadius: 4,
                            }}>
                              <Text style={{ fontSize: 12, color: '#856404' }}>
                                🎉 {offer.specialOffers[0].offerName}:{" "}
                                {offer.specialOffers[0].description}
                              </Text>

                            </View>
                          )
                        }




                      </View>

                    ))
                  }

                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24 }}>🏦</Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                  No loan offers available for this property at the moment.
                </Text>
              </View>
            )
          }

        </View>
      </View>

      {/* // Review and Contact Sections side by side */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          marginVertical: 30,
          marginHorizontal: 60,
          paddingVertical: 50,
          paddingHorizontal: 60,
          borderRadius: 12,
          backgroundColor: 'white',

          // shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.16,
          shadowRadius: 6,

          // elevation for Android
          elevation: 3,
        }}
      >
        <View>
          <ReviewForm propertyId={property._id} />
        </View>
        <View>
          <ContactForm
            userId={userId}
            phone={property.Propreiter_contact}
            propertyId={property._id}
          />
        </View>
      </View>
      <View style={styles.ReviewPage}>
        <ReviewPage reviewsProperty={reviews} />
      </View>
      <View style={styles.Location}>
        <Text style={styles.heading}>Location</Text>

        <View style={styles.address}>
          <Image
            source={require('@/assets/images/image13.png')}
            style={styles.mapicon}
          />
          <View style={styles.location}>
            <Text>
              Address : {toTitleCase(property.address)}
              {"\n"}City : {toTitleCase(property.city)}
              {"\n"}Landmark : {toTitleCase(property.landmark || "")}
            </Text>
          </View>
        </View>

        <WebView
          style={styles.map}
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


    </ScrollView>






  );
};

const styles = StyleSheet.create({
  breadcrumb: {
    fontFamily: 'Montserrat', // must load this font via expo-font
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingANDsave: {
    flexDirection: 'column',
    gap: 15,
  },
  saveProBtn: {
    padding: 10,
  },
  Description: {
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '4%',
    flexDirection: 'column',
    gap: 40,
  },
  FacilitiesAmenities: {
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '4%',
    flexDirection: 'column',
    gap: 40,
  },
  Location: {
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '4%',
    flexDirection: 'column',
    gap: 40,
  },
  heading: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontSize: 30,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Details: {
    width: '100%',
    paddingTop: '8%',
    paddingHorizontal: '8%',
    flexDirection: 'column',
    gap: 40,
  },
  verify: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  title: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyname: {
    fontSize: 30,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    fontSize: 18,
    lineHeight: 20,
    gap: 5,
  },
  ratings: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 40,
  },
  stars: {
    fontSize: 25,
    color: 'yellow',
    textShadowColor: 'black',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    paddingHorizontal: 5,
  },
  reviews: {
    fontSize: 20,
  },
  Gallery: {
    width: '100%',
    paddingTop: '2%',
    paddingHorizontal: '8%',
    flexDirection: 'column',
    gap: 40,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'scroll',
    gap: 5,
    paddingVertical: 10,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  PropertyDetails: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  describe: {
    fontSize: 18,
    lineHeight: 30,
  },
  gridContainer: {
    fontSize: 18,
    lineHeight: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridItem: {
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
    width: '48%',
  },
  img: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    gap: 20,
  },
  mapicon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  map: {
    height: 500,
    width: '100%',
  },
  bankingSection: {
    maxHeight: 400,
  },
  formContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});

