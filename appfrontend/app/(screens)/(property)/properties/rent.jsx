import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
// import Navbar from '../components/Navbar';
import Footer from '../../../../components/home/Footer'
import { useNavigation } from '@react-navigation/native';
import {FiltersSection,PropertiesListSection}  from '../../../../components/property/propertiesPage';

const PropertiesRent = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState({ type: "Rent" });
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setShowScrollTop(currentOffset > 300);
      },
      useNativeDriver: false,
    }
  );

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const breadcrumbs = [
    <TouchableOpacity
      key="1"
      // onPress={() => navigation.navigate('Home')}
      onPress={() => router.push('/')}
      style={styles.breadcrumbLink}
      activeOpacity={0.7}
    >
      <Text style={styles.breadcrumbText}>Home</Text>
    </TouchableOpacity>,
    <Text key="2" style={[styles.breadcrumbText, styles.currentBreadcrumb]}>
      Properties
    </Text>
  ];

  return (
    <View style={styles.container}>
      {/* <Navbar /> */}

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.breadcrumbsContainer}>
          <View style={styles.breadcrumbs}>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {item}
                {index < breadcrumbs.length - 1 && (
                  <MaterialIcons name="chevron-right" size={16} color="#8993A4" style={{ marginHorizontal: 2 }} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.filtersSection}>
            <FiltersSection />
          </View>
          <View style={styles.propertiesSection}>
            <PropertiesListSection searchQuery={searchQuery} />
          </View>
        </View>
      </Animated.ScrollView>

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-upward" size={24} color="#0078db" />
        </TouchableOpacity>
      )}

      {/* <Footer /> */}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  scrollContainer: {
    paddingBottom: 24,
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
  },
  breadcrumbsContainer: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingBottom: 12,
    backgroundColor: '#f4f5f7',
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    marginRight: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  breadcrumbText: {
    color: '#8993A4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans-Regular' : 'sans-serif',
  },
  currentBreadcrumb: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#0078db',
  },
  contentContainer: {
    flexDirection: windowWidth > 768 ? 'row' : 'column',
    paddingHorizontal: 12,
    gap: windowWidth > 768 ? 24 : 0,
  },
  filtersSection: {
    width: windowWidth > 768 ? '30%' : '100%',
    marginRight: windowWidth > 768 ? 18 : 0,
    marginBottom: windowWidth > 768 ? 0 : 18,
    minWidth: 0,
  },
  propertiesSection: {
    flex: 1,
    width: windowWidth > 768 ? '70%' : '100%',
    minWidth: 0,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    backgroundColor: '#D6EFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0078db',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default PropertiesRent;
