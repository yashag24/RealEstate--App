import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const RealEstateApp = () => {
  const [selectedTab, setSelectedTab] = useState('Buy');
  const [selectedCity, setSelectedCity] = useState('Select a City');
  const [searchText, setSearchText] = useState('');

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>BasilAbode</Text>
          <Text style={styles.logoSubtext}>real estate</Text>
        </View>
      </View>
      
      <View style={styles.headerCenter}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Sonipat</Text>
        </View>
        <TextInput
          style={styles.headerSearchInput}
          placeholder="Enter City / Type / No. of Bhk needed.."
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>For Buyers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>For Tenants</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Post Property</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HeroSection = () => (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80' }}
      style={styles.heroBackground}
      imageStyle={styles.heroBackgroundImage}
    >
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          {/* Search Card */}
          <View style={styles.searchCard}>
            {/* Buy/Rent Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'Buy' && styles.activeTab]}
                onPress={() => setSelectedTab('Buy')}
              >
                <Text style={[styles.tabText, selectedTab === 'Buy' && styles.activeTabText]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'Rent' && styles.activeTab]}
                onPress={() => setSelectedTab('Rent')}
              >
                <Text style={[styles.tabText, selectedTab === 'Rent' && styles.activeTabText]}>
                  Rent
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Form */}
            <View style={styles.searchForm}>
              <View style={styles.searchRow}>
                <TouchableOpacity style={styles.citySelector}>
                  <Text style={styles.citySelectorText}>{selectedCity}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search properties in City"
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>🔍 Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Searches */}
            <View style={styles.recentSearches}>
              <Text style={styles.recentSearchesLabel}>Recent Searches:</Text>
              <Text style={styles.noRecentSearches}>🔍 No recent searches</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );

  const PropertySection = () => (
    <View style={styles.propertySection}>
      <Text style={styles.sectionTitle}>APARTMENTS, VILLAS AND MORE</Text>
      
      <TouchableOpacity style={styles.bookAppointmentButton}>
        <Text style={styles.bookAppointmentText}>Book an Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a4c93" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header />
        <HeroSection />
        <PropertySection />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(106, 76, 147, 0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    alignItems: 'flex-start',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  locationIcon: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  locationText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  headerSearchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navItem: {
    marginHorizontal: 8,
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  profileText: {
    fontSize: 18,
  },

  // Hero Section Styles
  heroBackground: {
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBackgroundImage: {
    opacity: 0.8,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(106, 76, 147, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 80,
  },
  heroContent: {
    width: '90%',
    maxWidth: 600,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4285f4',
    fontWeight: '600',
  },
  searchForm: {
    marginBottom: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 120,
  },
  citySelectorText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchButton: {
    backgroundColor: '#4285f4',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recentSearches: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recentSearchesLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  noRecentSearches: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },

  // Property Section Styles
  propertySection: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  bookAppointmentButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#4285f4',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookAppointmentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RealEstateApp;