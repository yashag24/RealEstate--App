import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LocalityCard from '../components/LocalityCard'; 

interface Locality {
  id: number;
  name: string;
  rating: number;
  projects: number;
  imageUrl: string;
}

const EmergingLocalities: React.FC = () => {
  const [localities, setLocalities] = useState<Locality[]>([]);

  useEffect(() => {
    const response: Locality[] = [
      {
        id: 1,
        name: 'Madhurawada',
        rating: 4.3,
        projects: 17,
        imageUrl: 'image.png',
      },
      {
        id: 2,
        name: 'Banjara Hills',
        rating: 4.5,
        projects: 12,
        imageUrl: 'image.png',
      },
      {
        id: 3,
        name: 'Gachibowli',
        rating: 4.2,
        projects: 8,
        imageUrl: 'image.png',
      },
      {
        id: 4,
        name: 'Kukatpally',
        rating: 4.0,
        projects: 10,
        imageUrl: 'image.png',
      },
      {
        id: 5,
        name: 'Jubilee Hills',
        rating: 4.6,
        projects: 15,
        imageUrl: 'image.png',
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
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },

  subheading: {
    color: '#777',
    fontSize: 14,
  },
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width < 480 ? '100%' : width < 768 ? '95%' : '80%',
    marginBottom: width < 480 ? 32 : 16,
    alignSelf: 'center',
  },
  carouselViewport: {
    width: '100%',
    paddingVertical: 12,
  },
  carousel: {
    flexDirection: 'row',
    gap: width < 480 ? 8 : width < 768 ? 12 : 16,
  },
});


export default EmergingLocalities;
