import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { handlePropertyType } from "../../redux/SearchBox/SearchSlice";

const PropertyTypeCard = ({ title, description, imageSrc }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(handlePropertyType(title === "Plots" ? "Plot" : title));
    navigation.navigate("Properties");
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleClick}>
      <Image source={imageSrc} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const PropertyTypeCarousel = () => {
  const propertyTypes = [
    {
      title: "Independent House",
      description: "1,400+ Properties",
      imageSrc: require("../../assets/images/villa_image.png"),
    },
    {
      title: "Independent Builder Floor",
      description: "210+ Properties",
      imageSrc: require("../../assets/images/builder1.jpg"),
    },
    {
      title: "Plots",
      description: "800+ Properties",
      imageSrc: require("../../assets/images/istockphoto.png"),
    },
    {
      title: "Apartments",
      description: "300+ Properties",
      imageSrc: require("../../assets/images/Delhi.png"),
    },
    {
      title: "Studio Apartments",
      description: "150+ Properties",
      imageSrc: require("../../assets/images/Delhi.png"),
    },
    {
      title: "Luxury Villas",
      description: "70+ Properties",
      imageSrc: require("../../assets/images/villa_image.png"),
    },
  ];

  return (
    <View style={styles.carousel}>
      <Text style={styles.carouselTitle}>APARTMENTS, VILLAS AND MORE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsContainer}
      >
        {propertyTypes.map((property, index) => (
          <PropertyTypeCard
            key={index}
            title={property.title}
            description={property.description}
            imageSrc={property.imageSrc}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PropertyTypeCarousel;

const styles = StyleSheet.create({
  carousel: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
  },
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    height: 100,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    paddingHorizontal: 5,
  },
  description: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 5,
  },
});
// import { View, Text } from 'react-native'
// import React from 'react'

// const PropertyTypeCarousel = () => {
//   return (
//     <View>
//       <Text>PropertyTypeCarousel</Text>
//     </View>
//   )
// }

// export default PropertyTypeCarousel