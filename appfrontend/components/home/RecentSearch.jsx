import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 350;

const RecentSearch = ({ onCitySelect }) => {
  const recentSearchCities = useSelector((state) => state.search.recentSearchCities);
  const sentSearchesRef = useRef(new Set());

  const token = null; // Replace with async storage retrieval if necessary

  const getUserSearchHistory = async (search_text, userId) => {
    try {
      await axios.post('http://localhost:8000/api/user-update/search-history', {
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
        <Ionicons name="time-outline" size={20} color="#007bff" />
        <Text style={styles.label}>Recent Searches</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {recentSearchCities && recentSearchCities.length > 0 ? (
          recentSearchCities.map((city, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleCityPress(city)}
              activeOpacity={0.7}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="location" size={14} color="#007bff" />
              <Text style={styles.chipText} numberOfLines={1}>
                {city}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyChip}>
            <Ionicons name="search-outline" size={14} color="#999" />
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
    borderRadius: 25,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: isSmallScreen ? 16 : 17,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.3,
  },
  scroll: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingRight: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 12 : 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    gap: 6,
    maxWidth: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  emptyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 12 : 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    gap: 6,
    opacity: 0.7,
  },
  emptyChipText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#999',
    fontWeight: '400',
    fontStyle: 'italic',
  },
});