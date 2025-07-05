import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isVerySmallScreen = width < 320;
const isTablet = width >= 768;

const RecentSearch = ({ onCitySelect }) => {
  const recentSearchCities = useSelector((state) => state.search.recentSearchCities);
  const sentSearchesRef = useRef(new Set());

  const token = null; // Replace with async storage retrieval if necessary
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const getUserSearchHistory = async (search_text, userId) => {
    try {
      await axios.post(`${BASE_URL}/api/user-update/search-history`, {
        search_text,
        userId,
      });
    } catch (error) {
      console.log('Error saving search:', error);
    }
  };

  useEffect(() => {
    const handleSearchUpdate = async () => {
      if (token) {
        const decoded = jwtDecode(token);

        if (decoded?._id && recentSearchCities?.length > 0) {
          const uniqueCities = [
            ...new Set(recentSearchCities.map((c) => c.toLowerCase().trim())),
          ];

          for (const city of uniqueCities) {
            if (!sentSearchesRef.current.has(city)) {
              sentSearchesRef.current.add(city);
              await getUserSearchHistory(city, decoded._id);
            }
          }
        }
      }
    };

    handleSearchUpdate();
  }, [recentSearchCities]);

  const handleCityPress = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons 
          name="time-outline" 
          size={isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22} 
          color="#007bff" 
        />
        <Text style={styles.label}>Recent Searches</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        decelerationRate="fast"
      >
        {recentSearchCities && recentSearchCities.length > 0 ? (
          recentSearchCities.map((city, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleCityPress(city)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons 
                name="location" 
                size={isVerySmallScreen ? 12 : 14} 
                color="#007bff" 
                style={styles.chipIcon}
              />
              <Text style={styles.chipText} numberOfLines={1} ellipsizeMode="tail">
                {city}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyChip}>
            <Ionicons 
              name="search-outline" 
              size={isVerySmallScreen ? 12 : 14} 
              color="#999" 
            />
            <Text style={styles.emptyChipText}>No recent searches</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RecentSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: isTablet ? 30 : isSmallScreen ? 20 : 25,
    marginHorizontal: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    marginVertical: isVerySmallScreen ? 6 : 8,
    paddingHorizontal: isVerySmallScreen ? 12 : isSmallScreen ? 16 : 20,
    paddingVertical: isVerySmallScreen ? 1 : 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    gap: isVerySmallScreen ? 6 : 8,
  },
  label: {
    fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 16 : isTablet ? 18 : 17,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  scroll: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingRight: isVerySmallScreen ? 12 : isSmallScreen ? 16 : 20,
    paddingLeft: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: isVerySmallScreen ? 0 : isSmallScreen ? 0 :0,
    paddingHorizontal: isVerySmallScreen ? 5 : isSmallScreen ? 6 : 8,
    backgroundColor: '#f8f9ff',
    borderRadius: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    marginRight: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    borderWidth: 0.5,
    borderColor: '#e1e5ee',
    gap: isVerySmallScreen ? 4 : 2,
    // Removed restrictive maxWidth and minWidth constraints
    minHeight: isVerySmallScreen ? 32 : isSmallScreen ? 36 : 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  chipIcon: {
    marginRight: isVerySmallScreen ? 2 : 4,
    flexShrink: 0, // Prevent icon from shrinking
  },
  chipText: {
    fontSize: isVerySmallScreen ? 13 : isSmallScreen ? 14 : isTablet ? 16 : 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
    lineHeight: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22,
    // Ensure text doesn't get clipped
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  emptyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    paddingHorizontal: isVerySmallScreen ? 10 : isSmallScreen ? 12 : 16,
    backgroundColor: '#f8f9fa',
    borderRadius: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    gap: isVerySmallScreen ? 6 : 8,
    opacity: 0.7,
    minWidth: isVerySmallScreen ? 140 : 160,
    minHeight: isVerySmallScreen ? 32 : isSmallScreen ? 36 : 40,
  },
  emptyChipText: {
    fontSize: isVerySmallScreen ? 13 : isSmallScreen ? 14 : isTablet ? 16 : 15,
    color: '#999',
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});