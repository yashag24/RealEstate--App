import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

const PropertiesListCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const imageProperty =
    "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  if (!property) return null;

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
    Propreiter_contact,
    Propreiter_email,
    Propreiter_name,
  } = property;

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(1)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)} L`;
    }
    return `₹${numPrice.toLocaleString()}`;
  };

  const formatArea = (area) => {
    if (!area) return "";
    return `${area} sq ft`;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    router.push(`/propertyDetails/${property._id}`);
  };

  const handleViewPhoneNumber = () => {
    if (!phoneRevealed) {
      // Show phone number after user clicks
      setPhoneRevealed(true);

      // Optional: Show alert with phone number
      const phoneNumber = Propreiter_contact || "+91 9876543210"; // Fallback phone
      Alert.alert("Phone Number", `Contact: ${phoneNumber}`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call Now",
          onPress: () => {
            const phoneUrl = `tel:${phoneNumber}`;
            Linking.canOpenURL(phoneUrl)
              .then((supported) => {
                if (supported) {
                  Linking.openURL(phoneUrl);
                } else {
                  Alert.alert(
                    "Error",
                    "Phone calls are not supported on this device"
                  );
                }
              })
              .catch((err) => console.error("Error opening phone:", err));
          },
        },
      ]);
    } else {
      // If already revealed, directly call
      const phoneNumber = Propreiter_contact || "+91 9876543210";
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.canOpenURL(phoneUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(phoneUrl);
          } else {
            Alert.alert(
              "Error",
              "Phone calls are not supported on this device"
            );
          }
        })
        .catch((err) => console.error("Error opening phone:", err));
    }
  };

  const handleContactOwner = () => {
    const Propreiter_nameDisplay = Propreiter_name || "Property Owner";
    const phoneNumber = Propreiter_contact || "+91 9876543210";
    const emailAddress = Propreiter_email || "owner@example.com";

    Alert.alert("Contact Options", `Contact ${Propreiter_nameDisplay}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          const phoneUrl = `tel:${phoneNumber}`;
          Linking.openURL(phoneUrl).catch((err) =>
            console.error("Error opening phone:", err)
          );
        },
      },
      {
        text: "WhatsApp",
        onPress: () => {
          const message = `Hi, I'm interested in your ${Bhk} BHK property in ${city}. Is it still available?`;
          const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
            message
          )}`;

          Linking.canOpenURL(whatsappUrl)
            .then((supported) => {
              if (supported) {
                Linking.openURL(whatsappUrl);
              } else {
                // Fallback to web WhatsApp
                const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`;
                Linking.openURL(webWhatsappUrl);
              }
            })
            .catch((err) => console.error("Error opening WhatsApp:", err));
        },
      },
      {
        text: "Email",
        onPress: () => {
          const subject = `Inquiry about ${Bhk} BHK property in ${city}`;
          const body = `Hi ${Propreiter_nameDisplay},\n\nI'm interested in your ${Bhk} BHK ${type} property in ${city}. Could you please provide more details?\n\nThank you.`;
          const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(body)}`;

          Linking.canOpenURL(emailUrl)
            .then((supported) => {
              if (supported) {
                Linking.openURL(emailUrl);
              } else {
                Alert.alert("Error", "Email is not configured on this device");
              }
            })
            .catch((err) => console.error("Error opening email:", err));
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: images && images.length > 0 ? images[0] : imageProperty,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(price)}</Text>
          <Text style={styles.priceSubtext}>/month</Text>
        </View>

        {/* Verified Badge */}
        {verification === "verified" && (
          <Image
            source={require("../../../assets/images/verifiedPro.png")}
            style={styles.verifiedBadge}
          />
        )}

        {/* Favorite Button */}
        <Pressable
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#fff"}
          />
        </Pressable>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCardClick}
        style={styles.content}
      >
        <Text style={styles.title} numberOfLines={2}>
          {title || "Beautiful Property"}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {Bhk} BHK Serviced {propertyType} for {propertyOptions} in {city}
        </Text>

        {/* Combined Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{Bhk || "2"} BHK</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{city || "City"}</Text>
          </View>

          {area && (
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{formatArea(area)}</Text>
            </View>
          )}
        </View>

        {/* Enhanced Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {`Amazing ${Bhk}-bedroom ${type} with ${
              amenities.length > 0
                ? amenities.slice(0, 3).join(", ")
                : "basic utilities"
            }`}
            {balconies
              ? `, ${balconies} balcony${balconies > 1 ? "ies" : ""}`
              : ""}
            {
              ". This property offers comfortable living with modern amenities and excellent connectivity."
            }
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <LinearGradient
          colors={["#3B82F6", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleViewPhoneNumber}
          >
            <Ionicons
              name={phoneRevealed ? "call" : "call-outline"}
              size={16}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {phoneRevealed ? "Call Now" : "View Phone"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={["#10B981", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity style={styles.button} onPress={handleContactOwner}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    marginHorizontal: screenWidth * 0.025,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    position: "relative",
    height: screenWidth * 0.5,
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceTag: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(44, 146, 255, 0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  priceSubtext: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 2,
    opacity: 0.9,
  },
  verifiedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 60,
    height: 60,
    transform: [{ rotate: "15deg" }],
    zIndex: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  subtitle: {
    fontSize: 14,
    color: "#42526E",
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    minWidth: 80,
  },
  detailText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  areaSubtext: {
    fontSize: 11,
    color: "#666",
    fontWeight: "400",
    opacity: 0.7,
    marginLeft: 4,
  },
  descriptionContainer: {
    backgroundColor: "rgba(44, 146, 255, 0.04)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 0,
    borderLeft: 3,
    borderLeftColor: "#2C92FF",
    paddingBottom:0
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C92FF",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#091E42",
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.3,
  },
});

export default PropertiesListCard;
