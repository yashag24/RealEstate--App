import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PropertyCard = ({ 
  title, 
  bhk, 
  city, 
  price, 
  area, 
  imageUrl,
  onPress 
}) => {
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(1)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)} L`;
    }
    return `₹${numPrice.toLocaleString()}`;
  };

  const formatArea = (area) => {
    if (!area) return '';
    return `${area} sq ft`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image
          source={
            imageUrl 
              ? { uri: imageUrl }
              : require('../../assets/images//try3.jpg')
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(price)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title || 'Beautiful Property'}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{bhk || '2'} BHK</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{city || 'Jaipur'}</Text>
          </View>
        </View>
        
        {area && (
          <View style={styles.areaContainer}>
            <Ionicons name="resize-outline" size={16} color="#666" />
            <Text style={styles.areaText}>{formatArea(area)}</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#007bff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.contactText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,123,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
  },
  areaText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 5,
  },
  contactText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PropertyCard;