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
const CARDS_PER_VIEW = 1;

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

  const handleNext = () => {
    if (!banks.length) return;
    const nextIndex = (currentIndex + 1) % banks.length;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handlePrev = () => {
    if (!banks.length) return;
    const prevIndex = (currentIndex - 1 + banks.length) % banks.length;
    setCurrentIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const renderItem = ({ item }) => {
    const loanCount = item.loanProducts?.length || 0;
    const firstRate =
      loanCount > 0
        ? item.loanProducts[0].interestRate.min.toFixed(1) + "%"
        : "N/A";

    return (
      <View style={styles.cardWrapper}>
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
    const index = Math.round(nativeEvent.contentOffset.x / (CARD_WIDTH + 20));
    setCurrentIndex(index);
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
        <TouchableOpacity style={[styles.navButton]} onPress={handlePrev}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={banks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.$oid || item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />

        <TouchableOpacity style={[styles.navButton]} onPress={handleNext}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
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
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
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
