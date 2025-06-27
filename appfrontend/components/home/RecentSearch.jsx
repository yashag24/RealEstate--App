import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesome } from '@expo/vector-icons';

const RecentSearch = () => {
  const recentSearchCities = useSelector((state) => state.search.recentSearchCities);
  const sentSearchesRef = useRef(new Set());

  const token = null; // Replace with async storage retrieval if necessary

  const getUserSearchHistory = async (search_text, userId) => {
    try {
      await axios.post('http://192.168.56.1:8000/api/user-update/search-history', {
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recent Searches :</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {recentSearchCities && recentSearchCities.length > 0 ? (
          recentSearchCities.map((city, index) => (
            <View key={index} style={styles.chip}>
              <FontAwesome name="clock-o" size={16} color="#555" />
              <Text style={styles.chipText}>{city}</Text>
            </View>
          ))
        ) : (
          <View style={styles.chip}>
            <FontAwesome name="clock-o" size={16} color="#555" />
            <Text style={styles.chipText}>No recent searches</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RecentSearch;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  scroll: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    fontSize: 14,
    marginLeft: 6,
  },
});
// import { View, Text } from 'react-native'
// import React from 'react'

// const RecentSearch = () => {
//   return (
//     <View>
//       <Text>RecentSearch</Text>
//     </View>
//   )
// }

// export default RecentSearch