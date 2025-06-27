import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Image } from 'react-native';

// BankCard Component
const BankCard = ({ bankName, logo, rating, loanProducts, interestRate }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {logo.startsWith('http') ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : (
          <Text style={styles.logoPlaceholder}>{logo}</Text>
        )}
        <Text style={styles.bankName}>{bankName}</Text>
        <Text style={styles.rating}>Rating: {rating.toFixed(1)}</Text>
        <Text style={styles.loanProducts}>Products: {loanProducts}</Text>
        <Text style={styles.interestRate}>Interest: {interestRate}%</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // 75% of screen width for each card
const CARDS_PER_VIEW = 1; // One card visible at a time on mobile

const BankingPartnersSection = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchBankingPartners = async () => {
    setLoading(true);
    try {
      // Mock data for demo (replace with actual API call)
      const mockData = [
        {
          _id: '1',
          bankName: 'HDFC Bank',
          logo: '🏦',
          rating: 4.5,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'personal_loan' }],
          interestRate: 8.5,
        },
        {
          _id: '2',
          bankName: 'ICICI Bank',
          logo: 'https://logos-world.net/wp-content/uploads/2021/02/ICICI-Bank-Logo.png',
          rating: 4.3,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'car_loan' }],
          interestRate: 8.7,
        },
        {
          _id: '3',
          bankName: 'State Bank of India',
          logo: 'https://www.sbi.co.in/documents/16012/1400784/logo.png',
          rating: 4.2,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.4,
        },
        {
          _id: '4',
          bankName: 'Axis Bank',
          logo: 'https://www.axisbank.com/images/default-source/revamp_new/bank-logos/axis-bank-logo.png',
          rating: 4.4,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'personal_loan' }],
          interestRate: 8.6,
        },
        {
          _id: '5',
          bankName: 'Kotak Mahindra Bank',
          logo: 'https://www.kotak.com/content/dam/Kotak/investor-relation/Financial-result/Kotak-logo.png',
          rating: 4.3,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.8,
        },
        {
          _id: '6',
          bankName: 'Punjab National Bank',
          logo: 'https://www.pnbindia.in/images/logos/pnb-logo.png',
          rating: 4.1,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.3,
        },
        {
          _id: '7',
          bankName: 'Bank of Baroda',
          logo: 'https://www.bankofbaroda.in/-/media/Project/BOB/CountryWebsites/India/Bob-Logo-Tagline.png',
          rating: 4.0,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.2,
        },
        {
          _id: '8',
          bankName: 'Canara Bank',
          logo: 'https://canarabank.com/images/canara-bank-logo.png',
          rating: 4.1,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.1,
        },
      ];
      setBanks(mockData);
    } catch (error) {
      console.error('Error fetching banking partners:', error);
      // Fallback mock data
      setBanks([
        {
          _id: '1',
          bankName: 'HDFC Bank',
          logo: 'https://logos-world.net/wp-content/uploads/2020/12/HDFC-Bank-Logo.png',
          rating: 4.5,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'personal_loan' }],
          interestRate: 8.5,
        },
        {
          _id: '2',
          bankName: 'ICICI Bank',
          logo: 'https://logos-world.net/wp-content/uploads/2021/02/ICICI-Bank-Logo.png',
          rating: 4.3,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'car_loan' }],
          interestRate: 8.7,
        },
        {
          _id: '3',
          bankName: 'State Bank of India',
          logo: 'https://www.sbi.co.in/documents/16012/1400784/logo.png',
          rating: 4.2,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.4,
        },
        {
          _id: '4',
          bankName: 'Axis Bank',
          logo: 'https://www.axisbank.com/images/default-source/revamp_new/bank-logos/axis-bank-logo.png',
          rating: 4.4,
          loanProducts: [{ productType: 'home_loan' }, { productType: 'personal_loan' }],
          interestRate: 8.6,
        },
        {
          _id: '5',
          bankName: 'Kotak Mahindra Bank',
          logo: 'https://www.kotak.com/content/dam/Kotak/investor-relation/Financial-result/Kotak-logo.png',
          rating: 4.3,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.8,
        },
        {
          _id: '6',
          bankName: 'Punjab National Bank',
          logo: 'https://www.pnbindia.in/images/logos/pnb-logo.png',
          rating: 4.1,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.3,
        },
        {
          _id: '7',
          bankName: 'Bank of Baroda',
          logo: 'https://www.bankofbaroda.in/-/media/Project/BOB/CountryWebsites/India/Bob-Logo-Tagline.png',
          rating: 4.0,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.2,
        },
        {
          _id: '8',
          bankName: 'Canara Bank',
          logo: 'https://canarabank.com/images/canara-bank-logo.png',
          rating: 4.1,
          loanProducts: [{ productType: 'home_loan' }],
          interestRate: 8.1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankingPartners();
  }, []);

  const handleNext = () => {
    if (currentIndex + CARDS_PER_VIEW < banks.length) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const getMinInterestRate = (loanProducts) => {
    if (!loanProducts || loanProducts.length === 0) return 8.5;
    return (Math.random() * (9.5 - 8.0) + 8.0).toFixed(1);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <BankCard
        bankName={item.bankName}
        logo={item.logo}
        rating={item.rating || 4.0}
        loanProducts={item.loanProducts?.length || 0}
        interestRate={getMinInterestRate(item.loanProducts)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.bankingPartnersSection}>
        <Text style={styles.heading}>BANKING PARTNERS</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading banking partners...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bankingPartnersSection}>
      <Text style={styles.heading}>BANKING PARTNERS</Text>
      <View style={styles.carouselContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={banks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20} // Card width + gap
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20));
            setCurrentIndex(newIndex);
          }}
        />

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, currentIndex + CARDS_PER_VIEW >= banks.length && styles.disabledButton]}
          onPress={handleNext}
          disabled={currentIndex + CARDS_PER_VIEW >= banks.length}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.indicators}>
        {Array.from({ length: Math.max(0, banks.length - CARDS_PER_VIEW + 1) }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.indicator, index === currentIndex && styles.activeIndicator]}
            onPress={() => {
              setCurrentIndex(index);
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bankingPartnersSection: {
    paddingVertical: 40,
    backgroundColor: '#f8fafc',
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 10,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  carousel: {
    paddingHorizontal: 5,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  disabledButton: {
    opacity: 0.4,
  },
  prevButton: {
    marginRight: 5,
  },
  nextButton: {
    marginLeft: 5,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
  },
  activeIndicator: {
    backgroundColor: '#667eea',
    transform: [{ scale: 1.2 }],
  },
  // BankCard styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  logoPlaceholder: {
    fontSize: 40,
    marginBottom: 10,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  loanProducts: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  interestRate: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default BankingPartnersSection;