
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';


const PropertiesListCard = ({ property }) => {
  const navigation = useNavigation();
  const imageProperty = "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const {
    Bhk,
    type,
    title,
    address,
    city,
    bathrooms,
    balconies,
    amenities = [],
    other_rooms = {},
    verification,
    propertyType,
    propertyOptions,
    price,
    area,
    images,
  } = property;

  const amenityList = amenities.length > 0 ? amenities.join(", ") : "basic utilities";
  const otherRooms = Object.entries(other_rooms)
    .filter(([_, value]) => value)
    .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase())
    .join(", ");

  const handleCardClick = () => {
    // navigation.navigate('PropertyDetails', { property });
     router.push(`/propertyDetails/${property._id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleCardClick}
      style={styles.cardContainer}
    >
      {verification === "verified" && (
        <Image
          // source={require('./verifiedPro.png')}
          source={require('../../../assets/images/verifiedPro.png')}
          style={styles.verifiedBadge}
        />
      )}

      <Image
        source={{ uri: images.length < 1 ? imageProperty : images[0] }}
        style={styles.propertyImage}
        resizeMode='cover'
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {Bhk} BHK Serviced {propertyType} for {propertyOptions} in {" "}{address}, {city}
        </Text>

        <View style={styles.priceAreaContainer}>
          <View style={styles.infoBox}>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>
                ₹{price >= 1000000
                  ? (price / 1000000).toFixed(1) + 'L'
                  : price >= 1000
                    ? (price / 1000).toFixed(1) + 'K'
                    : price.toString()}
              </Text>
              <Text style={styles.unitText}>/month</Text>
            </View>
            <Text style={styles.smallText}>Desposit 2 month(s) rent</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{area}</Text>
              <Text style={styles.unitText}>sq.ft.</Text>
            </View>
            <Text style={styles.smallText}>({(area * 0.092903).toFixed(1)} sq.m.) Super built-up Area</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{Bhk} BHK</Text>
            </View>
            <Text style={styles.smallText}>{Bhk > 3 ? (Bhk > 5 ? Bhk - 2 : Bhk - 1) : Bhk} Baths</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {`Amazing ${Bhk}-bedroom, ${bathrooms}-bathroom ${type} in ${title}, located at ${address}, ${city}.`}
          {` This property offers essential utilities such as ${amenityList}, electricity, water tank, and complete power backup.`}
          {` It features ${balconies} balcony${balconies > 1 ? 'ies' : ''}${Bhk ? `, ${Bhk} wardrobe${Bhk > 1 ? 's' : ''}` : ''
            }, all within a pet-friendly society.`}
          {otherRooms ? ` Additional rooms include: ${otherRooms}.` : ''}
          {` All rooms are spacious and well-ventilated. The construction quality is high-end with premium fittings.`}
        </Text>

        <View style={styles.divider} />

        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']} // Blue to Purple
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Phone Number</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={['#10B981', '#14B8A6']} // Green to Teal
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Contact Owner</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({


 cardContainer: {
    marginVertical: 8,
    marginHorizontal: screenWidth * 0.025,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#006ac2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  verifiedBadge: {
    width: screenWidth < 380 ? 70 : 80,
    height: screenWidth < 380 ? 70 : 80,
    transform: [{ rotate: '15deg' }],
  },
  propertyImage: {
    width: '100%',
    height: screenHeight * 0.25,
    minHeight: 180,
    maxHeight: 220,
  },
  detailsContainer: {
    padding: screenWidth * 0.04,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 16 : 18,
    fontWeight: '700',
    lineHeight: screenWidth < 380 ? 22 : 24,
    color: '#091E42',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 13 : 14,
    lineHeight: screenWidth < 380 ? 18 : 20,
    color: '#42526E',
    marginBottom: 16,
  },
  priceAreaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 2,
    minWidth: screenWidth < 380 ? 90 : 100,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  valueText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 16 : 18,
    fontWeight: '600',
    lineHeight: screenWidth < 380 ? 22 : 24,
    color: '#091E42',
  },
  unitText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 11 : 12,
    lineHeight: screenWidth < 380 ? 14 : 16,
    color: '#42526E',
    marginLeft: 2,
  },
  smallText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 9 : 10,
    lineHeight: screenWidth < 380 ? 11 : 12,
    color: '#8993A4',
  },
  description: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: screenWidth < 380 ? 13 : 14,
    lineHeight: screenWidth < 380 ? 18 : 20,
    color: '#091E42',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: screenWidth < 380 ? 'column' : 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    gap: 8,
  },
  gradientButton: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: screenWidth < 380 ? 1 : 0,
    minWidth: screenWidth < 380 ? '100%' : 140,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: screenWidth < 380 ? 12 : 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default PropertiesListCard;