import React, { useEffect, useState } from 'react';
import PriceHistoryChart from './PriceHistoryChart'
import { 
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet,Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';



export const PropertyDetails = ({property}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loanOffers, setLoanOffers] = useState([]);
  const [loadingLoanOffers, setLoadingLoanOffers] = useState(false);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [showAllOffers, setShowAllOffers] = useState(false);

  const toTitleCase = (str = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

 const handleSaveProperty = async () => {
    try {
      if (!userId) {
        Alert.alert("Please log in to save properties");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/user-update/save-property",
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

      if (response.ok) {
        if (data.message === "Property unsaved successfully") {
          Alert.alert("Property removed from saved list");
          setIsSaved(false);
        } else if (data.message === "Property saved successfully") {
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
   const getAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  const averageRating = getAverageRating(reviews);


 return (
  <View>
    <View style={styles.details}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View style={styles.name}>
            <View style={styles.propertyName}>
              {property.verification && (
                <Image
                  source={require('../assets/verified.png')}
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
      <View style={styles.left}>
        <View style={styles.Description}>
          <Text style={styles.heading}>Description</Text>
          <Text style={styles.describe}>
            {property.availabilityStatus && (
              <Text>
                - {property.availabilityStatus}{"\n"}
              </Text>
            )}

            <Text>
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
          </Text>
        </View>
      </View>
    </View>
     <View style={styles.FacilitiesAmenities}>
      <Text style={styles.heading}>Facilities and Amenities</Text>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-5@2x.png')}
          />
          <Text style={styles.facilityamenity}>Elevator</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-61@2x.png')}
          />
          <Text style={styles.facilityamenity}>Library</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-8@2x.png')}
          />
          <Text style={styles.facilityamenity}>Laundry Room</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-11@2x.png')}
          />
          <Text style={styles.facilityamenity}>24/7 CCTV Surveillance</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-7@2x.png')}
          />
          <Text style={styles.facilityamenity}>Reception</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-8@2x.png')}
          />
          <Text style={styles.facilityamenity}>Lorem, ipsum dolor.</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-9@2x.png')}
          />
          <Text style={styles.facilityamenity}>Wifi Connectivity</Text>
        </View>

        <View style={styles.gridItem}>
          <Image
            style={styles.img}
            source={require('../assets/image-10@2x.png')}
          />
          <Text style={styles.facilityamenity}>Basketball Court</Text>
        </View>
      </View>
       <PriceHistoryChart />
    </View>
    
    
   
    
  </View>

);



}
const styles=StyleSheet.create({
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

