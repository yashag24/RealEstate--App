import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import BankCard from "./BankCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_MARGIN = 10; // Gap between cards
const SIDE_SPACING = (width - CARD_WIDTH) / 2; // Calculate proper centering

export default function BankingPartnersSection() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  const fetchBankingPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BASE_URL}/api/banking-partners?limit=20&isActive=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setBanks(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Error fetching banking partners:", err);
      setError("Failed to load banking partners. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankingPartners();
  }, []);



  const renderItem = ({ item, index }) => {
    const loanCount = item.loanProducts?.length || 0;
    const firstRate =
      loanCount > 0
        ? item.loanProducts[0].interestRate.min.toFixed(1) + "%"
        : "N/A";

    return (
      <View style={[
        styles.cardWrapper,
        index === 0 && { marginLeft: SIDE_SPACING }, // First item gets left margin
        index === banks.length - 1 && { marginRight: SIDE_SPACING }, // Last item gets right margin
        index > 0 && { marginLeft: CARD_MARGIN } // Add gap between cards
      ]}>
        <BankCard
          bankName={item.bankName}
          logo={item.logo}
          rating={item.rating ?? 0}
          loanProducts={loanCount}
          interestRate={firstRate}
        />
      </View>
    );
  };

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
    setCurrentIndex(Math.max(0, Math.min(index, banks.length - 1)));
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>BANKING PARTNERS</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading banking partners...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>BANKING PARTNERS</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchBankingPartners}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (banks.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>BANKING PARTNERS</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No banking partners available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>BANKING PARTNERS</Text>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={banks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.$oid || item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentContainerStyle={styles.carousel}
          pagingEnabled={false}
          snapToAlignment="start"
        />
      </View>

      <View style={styles.indicators}>
        {banks.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.indicator,
              idx === currentIndex && styles.activeIndicator,
            ]}
            onPress={() => {
              setCurrentIndex(idx);
              flatListRef.current?.scrollToIndex({
                index: idx,
                animated: true,
              });
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 40,
    backgroundColor: "#f8fafc",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 10,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  carouselContainer: {
    alignItems: "center",
  },
  carousel: {
    alignItems: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },

  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#667eea",
    transform: [{ scale: 1.2 }],
  },
});