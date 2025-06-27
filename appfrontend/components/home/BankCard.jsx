import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BankCard = ({ bankName, logo, rating, loanProducts, interestRate }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<MaterialIcons key={`full-${i}`} name="star" size={16} color="#FFD700" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<MaterialIcons key={`empty-${i}`} name="star-border" size={16} color="#FFD700" />);
    }

    return stars;
  };

  return (
    <View style={styles.bankCard}>
      <View style={styles.bankLogo}>
        {logo ? (
          logo.startsWith('http') ? (
            <Image source={{ uri: logo }} style={styles.logoImage} />
          ) : (
            <Text style={styles.emojiLogo}>{logo}</Text>
          )
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>{bankName.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.bankInfo}>
        <Text style={styles.bankName}>{bankName}</Text>
        <View style={styles.rating}>
          <View style={styles.stars}>{renderStars()}</View>
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>
        <View style={styles.loanInfo}>
          <Text style={styles.products}>{loanProducts}+ Loan Products</Text>
          <Text style={styles.interestRate}>Starting from {interestRate}%</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Offers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  bankLogo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  emojiLogo: {
    fontSize: 48,
  },
  placeholderLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  bankInfo: {
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    color: '#666',
  },
  loanInfo: {
    marginBottom: 12,
    alignItems: 'center',
  },
  products: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  interestRate: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',
  },
  viewButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BankCard;