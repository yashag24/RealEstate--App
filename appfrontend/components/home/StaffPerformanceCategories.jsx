// import { View, Text } from 'react-native'
// import React from 'react'

// const StaffPerformanceCategories = () => {
//   return (
//     <View>
//       <Text>StaffPerformanceCategories</Text>
//     </View>
//   )
// }

// export default StaffPerformanceCategories
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StaffPerformanceCategories = () => {
  const [selectedTier, setSelectedTier] = useState(null);

  const performanceTiers = [
    {
      id: 'diamond',
      name: 'Diamond',
      color: '#B9F2FF',
      icon: '💎',
      description: 'Exceptional performance - Top 5% of staff',
      criteria: ['Exceeds all targets by 25%+', 'Leadership qualities', 'Innovation contributor'],
      benefits: ['Highest bonus tier', 'Priority training', 'Leadership opportunities'],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      color: '#E5E4E2',
      icon: '🏆',
      description: 'Outstanding performance - Top 15% of staff',
      criteria: ['Exceeds targets by 15-25%', 'Mentors others', 'Consistent excellence'],
      benefits: ['Premium bonus', 'Advanced training', 'Project leadership'],
    },
    {
      id: 'gold',
      name: 'Gold',
      color: '#FFD700',
      icon: '🥇',
      description: 'Excellent performance - Top 35% of staff',
      criteria: ['Meets all targets', 'Team collaboration', 'Quality work delivery'],
      benefits: ['Standard bonus', 'Skill development', 'Recognition awards'],
    },
    {
      id: 'silver',
      name: 'Silver',
      color: '#C0C0C0',
      icon: '🥈',
      description: 'Good performance - Meets expectations',
      criteria: ['Meets most targets', 'Reliable performance', 'Team participation'],
      benefits: ['Base bonus', 'Training opportunities', 'Performance support'],
    },
  ];

  const renderTier = (tier) => {
    const isSelected = selectedTier === tier.id;

    return (
      <TouchableOpacity
        key={tier.id}
        style={[
          styles.tierCard,
          { borderColor: tier.color },
          isSelected && styles.selectedCard,
        ]}
        onPress={() => setSelectedTier(isSelected ? null : tier.id)}
      >
        <View style={[styles.tierHeader, { backgroundColor: tier.color }]}>
          <Text style={styles.tierIcon}>{tier.icon}</Text>
          <Text style={styles.tierName}>{tier.name}</Text>
        </View>

        <View style={styles.tierContent}>
          <Text style={styles.tierDescription}>{tier.description}</Text>

          {isSelected && (
            <View style={styles.tierDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Performance Criteria:</Text>
                {tier.criteria.map((item, idx) => (
                  <Text key={idx} style={styles.listItem}>✓ {item}</Text>
                ))}
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Benefits & Rewards:</Text>
                {tier.benefits.map((item, idx) => (
                  <Text key={idx} style={styles.listItem}>★ {item}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff Performance Categories</Text>
        <Text style={styles.headerSubtitle}>Recognition tiers based on performance excellence</Text>
      </View>

      <View style={styles.tiersContainer}>
        {performanceTiers.map(renderTier)}
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statCard}>
          <Text style={styles.statLabel}>Total Staff Evaluated</Text>
          <Text style={styles.statNumber}>1,247</Text>
        </LinearGradient>

        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statCard}>
          <Text style={styles.statLabel}>Average Performance Score</Text>
          <Text style={styles.statNumber}>8.2/10</Text>
        </LinearGradient>

        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statCard}>
          <Text style={styles.statLabel}>Top Performers</Text>
          <Text style={styles.statNumber}>248</Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tiersContainer: {
    gap: 20,
  },
  tierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    transform: [{ translateY: -5 }],
  },
  tierHeader: {
    padding: 16,
    alignItems: 'center',
  },
  tierIcon: {
    fontSize: 32,
  },
  tierName: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#333',
  },
  tierContent: {
    padding: 16,
  },
  tierDescription: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  tierDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
  },
  detailSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  listItem: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 10,
    color: '#444',
  },
  statsContainer: {
    marginTop: 30,
    gap: 15,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  statNumber: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default StaffPerformanceCategories;
