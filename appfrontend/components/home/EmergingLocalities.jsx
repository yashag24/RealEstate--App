import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LocalityCard from './LocalityCard';
import localImage from '@/assets/images/image.png'; // Import your local image

const EmergingLocalities = () => {
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    const response = [
      {
        id: 1,
        name: 'Madhurawada',
        rating: 4.3,
        projects: 17,
        imageUrl: localImage, // Use the imported image
      },
      {
        id: 2,
        name: 'Banjara Hills',
        rating: 4.5,
        projects: 12,
        imageUrl: localImage,
      },
      {
        id: 3,
        name: 'Gachibowli',
        rating: 4.2,
        projects: 8,
        imageUrl: localImage,
      },
      {
        id: 4,
        name: 'Kukatpally',
        rating: 4.0,
        projects: 10,
        imageUrl: localImage,
      },
      {
        id: 5,
        name: 'Jubilee Hills',
        rating: 4.6,
        projects: 15,
        imageUrl: localImage,
      },
    ];
    setLocalities(response);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.heading}>Emerging Localities</Text>
        <Text style={styles.subheading}>
          Localities with recent development in this city
        </Text>
      </View>

      <FlatList
        data={localities}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        renderItem={({ item }) => (
          <LocalityCard
            name={item.name}
            rating={item.rating}
            projects={item.projects}
            imageUrl={item.imageUrl}
          />
        )}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  head: {
    width: '100%',
    maxWidth: width * 0.8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheading: {
    color: '#777',
    fontSize: 14,
  },
  carousel: {
    flexDirection: 'row',
    gap: width < 480 ? 8 : width < 768 ? 12 : 16,
  },
});

export default EmergingLocalities;