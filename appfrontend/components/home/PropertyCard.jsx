import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const PropertyCard = ({
  id,
  title,
  bhk,
  city,
  price,
  area,
  images,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const handleViewPress = () => {
    router.push(`/propertyDetails/${id}`);
  };

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            images && images.length > 0
              ? { uri: images[0] }
              : require('../../assets/images/try3.jpg')
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
          <Pressable
            style={styles.favoriteButton}
            onPress={toggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF6B6B' : '#999'}
            />
          </Pressable>

          <Pressable
            onPress={handleViewPress}
            style={({ pressed }) => [
              styles.viewButton,
              pressed && styles.viewButtonActive,
            ]}
          >
            <Ionicons
              name="eye-outline"
              size={16}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    marginHorizontal: 5,
    overflow: 'hidden',
    width: width * 0.8,
    alignSelf: 'center',
    borderWidth: 1,
    height: 350,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(44, 146, 255, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  priceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
    lineHeight: 19,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 0,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 146, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
  areaText: {
    fontSize: 13,
    color: '#2C92FF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 5,
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  viewButton: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 110,
    borderWidth: 0,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    // Gradient simulation with solid color + overlay effects
    backgroundColor: '#667eea',
    position: 'relative',
    overflow: 'hidden',
  },
  viewButtonActive: {
    backgroundColor: '#5a67d8',
    transform: [{ scale: 0.95 }],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    elevation: 12,
  },
  buttonIcon: {
    marginRight: 8,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default PropertyCard;