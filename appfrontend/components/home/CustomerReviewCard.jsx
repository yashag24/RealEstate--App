import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomerReviewCard = ({ 
  imageSource,     // Pass in either require(...) or { uri: ... }
  name, 
  review, 
  rating = 5,
  location 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i < rating ? "star" : "star-outline"} 
          size={16} 
          color="#ffc107" 
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={ imageSource ?? require('../../assets/images/react-logo.png') }
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.userDetails}>
            <Text style={styles.name}>{name || 'Anonymous'}</Text>
            {location && <Text style={styles.location}>{location}</Text>}
          </View>
        </View>
        
        <View style={styles.rating}>
          <View style={styles.stars}>{renderStars(rating)}</View>
          <Text style={styles.ratingText}>{rating}.0</Text>
        </View>
      </View>
      
      <Text style={styles.review}>
        {review || 'Great experience with BasilAbode!'}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#28a745" />
          <Text style={styles.verifiedText}>Verified Purchase</Text>
        </View>
        <Text style={styles.date}>2 weeks ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    // Cross-platform shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    alignItems: 'flex-end',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  review: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default CustomerReviewCard;