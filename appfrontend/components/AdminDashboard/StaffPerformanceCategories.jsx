import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

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
      benefits: ['Highest bonus tier', 'Priority training', 'Leadership opportunities']
    },
    {
      id: 'platinum',
      name: 'Platinum',
      color: '#E5E4E2',
      icon: '🏆',
      description: 'Outstanding performance - Top 15% of staff',
      criteria: ['Exceeds targets by 15-25%', 'Mentors others', 'Consistent excellence'],
      benefits: ['Premium bonus', 'Advanced training', 'Project leadership']
    },
    {
      id: 'gold',
      name: 'Gold',
      color: '#FFD700',
      icon: '🥇',
      description: 'Excellent performance - Top 35% of staff',
      criteria: ['Meets all targets', 'Team collaboration', 'Quality work delivery'],
      benefits: ['Standard bonus', 'Skill development', 'Recognition awards']
    },
    {
      id: 'silver',
      name: 'Silver',
      color: '#C0C0C0',
      icon: '🥈',
      description: 'Good performance - Meets expectations',
      criteria: ['Meets most targets', 'Reliable performance', 'Team participation'],
      benefits: ['Base bonus', 'Training opportunities', 'Performance support']
    }
  ];

  const handleTierPress = (tierId) => {
    setSelectedTier(selectedTier === tierId ? null : tierId);
  };

  const renderTierCard = (tier) => (
    <TouchableOpacity
      key={tier.id}
      style={[
        styles.tierCard,
        { borderColor: tier.color },
        selectedTier === tier.id && styles.selectedTierCard
      ]}
      onPress={() => handleTierPress(tier.id)}
      activeOpacity={0.9}
    >
      <View style={[styles.tierHeader, { backgroundColor: tier.color }]}>
        <Text style={styles.tierIcon}>{tier.icon}</Text>
        <Text style={styles.tierName}>{tier.name}</Text>
      </View>

      <View style={styles.tierContent}>
        <Text style={styles.tierDescription}>{tier.description}</Text>

        {selectedTier === tier.id && (
          <View style={styles.tierDetails}>
            <View style={styles.criteriaSection}>
              <Text style={styles.sectionTitle}>Performance Criteria:</Text>
              {tier.criteria.map((criterion, index) => (
                <View key={index} style={styles.listItemContainer}>
                  <Text style={styles.criteriaIcon}>✓</Text>
                  <Text style={styles.listItem}>{criterion}</Text>
                </View>
              ))}
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Benefits & Rewards:</Text>
              {tier.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItemContainer}>
                  <Text style={styles.benefitIcon}>★</Text>
                  <Text style={styles.listItem}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.performanceHeader}>
        <Text style={styles.headerTitle}>Staff Performance Categories</Text>
        <Text style={styles.headerSubtitle}>Recognition tiers based on performance excellence</Text>
      </View>

      <View style={styles.tiersGrid}>
        {performanceTiers.map(renderTierCard)}
      </View>

      <View style={styles.performanceStats}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Staff Evaluated</Text>
          <Text style={styles.statNumber}>1,247</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Average Performance Score</Text>
          <Text style={styles.statNumber}>8.2/10</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Top Performers</Text>
          <Text style={styles.statNumber}>248</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: width < 768 ? 16 : 32,
    paddingVertical: 32,
  },
  performanceHeader: {
    alignItems: 'center',
    marginBottom: 48,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: width < 768 ? 32 : 40,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  headerSubtitle: {
    fontSize: width < 768 ? 16 : 19,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  tiersGrid: {
    marginBottom: 48,
  },
  tierCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    marginBottom: width < 768 ? 16 : 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  selectedTierCard: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ translateY: -5 }],
  },
  tierHeader: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tierIcon: {
    fontSize: 40,
    marginBottom: 8,
    textAlign: 'center',
  },
  tierName: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Arial',
  },
  tierContent: {
    padding: 24,
  },
  tierDescription: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Arial',
  },
  tierDetails: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  criteriaSection: {
    marginBottom: 24,
  },
  benefitsSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: 'Arial',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  listItem: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 20,
    flex: 1,
    paddingLeft: 8,
    fontFamily: 'Arial',
  },
  criteriaIcon: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
    width: 20,
  },
  benefitIcon: {
    fontSize: 16,
    color: '#ffc107',
    fontWeight: 'bold',
    width: 20,
  },
  performanceStats: {
    flexDirection: width < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    marginTop: 48,
    gap: 24,
  },
  statCard: {
    backgroundColor: '#667eea',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flex: width < 768 ? 0 : 1,
    minWidth: 200,
  },
  statTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Arial',
  },
  statNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
});

export default StaffPerformanceCategories;