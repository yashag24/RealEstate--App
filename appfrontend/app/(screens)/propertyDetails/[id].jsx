// app/(screens)/propertyDetails/[id].jsx
// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// const PropertyDetailsScreen = () => {
//   const { id } = useLocalSearchParams();

//   // Dummy data to simulate property details
//   const dummyProperty = {
//     title: 'Elegant 3BHK Apartment',
//     city: 'Mumbai',
//     price: '12500000',
//     area: '1450',
//     image: require('@/assets/images/try3.jpg'),
//     description:
//       'This stunning 3BHK apartment features spacious interiors, modern finishes, and a beautiful city view. Located in a prime area with easy access to schools, hospitals, and shopping centers.',
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Image source={dummyProperty.image} style={styles.image} />
//       <Text style={styles.title}>{dummyProperty.title}</Text>
//       <Text style={styles.city}>City: {dummyProperty.city}</Text>
//       <Text style={styles.price}>Price: ₹{(+dummyProperty.price).toLocaleString()}</Text>
//       <Text style={styles.area}>Area: {dummyProperty.area} sq ft</Text>
//       <Text style={styles.description}>{dummyProperty.description}</Text>
//       <Text style={styles.propertyId}>Property ID: {id}</Text>
//     </ScrollView>
//   );
// };

import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator,StyleSheet } from 'react-native';
import { PropertyDetails } from '../../../components/property/PropertyDetails'; // adjust import path if needed

const PropertyDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/property/${id}`);
        const data = await res.json();
        setProperty(data.property || null);
      } catch (err) {
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!property) return <Text style={{ padding: 20 }}>Property not found.</Text>;

  return <PropertyDetails property={property} />;
};



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  city: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2C92FF',
    fontWeight: '600',
  },
  area: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 20,
  },
  propertyId: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#999',
  },
});

export default PropertyDetailsScreen;
