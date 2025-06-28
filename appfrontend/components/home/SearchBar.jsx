import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  Keyboard,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { handleCity } from '../../redux/SearchBox/SearchSlice';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isIOS = Platform.OS === 'ios';

const locations = [
  'Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Surat', 'Noida', 'Gurgaon', 
  'Faridabad', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Indore', 'Bhopal'
];

const popularLocalities = {
  'Delhi': ['Connaught Place', 'Khan Market', 'Lajpat Nagar', 'Saket', 'Dwarka'],
  'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Worli', 'Malad'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout'],
  'Pune': ['Koregaon Park', 'Baner', 'Wakad', 'Kothrud', 'Viman Nagar'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
};

const capitalizeCity = (city) =>
  city
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const SearchBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedOpt, setSelectedOpt] = useState('Buy');
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Animation values
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (searchCity.length > 0) {
      const cityLocalities = popularLocalities[city] || [];
      const allSuggestions = [...cityLocalities, ...locations];
      
      const filtered = allSuggestions.filter(item =>
        item.toLowerCase().includes(searchCity.toLowerCase())
      ).slice(0, 5);
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      
      Animated.timing(fadeAnim, {
        toValue: filtered.length > 0 ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [searchCity, city, fadeAnim]);

  // Tab options with navigation paths
  const tabOptions = [
    { label: "Buy", path: "/properties/sell" },
    { label: "Rent", path: "/properties/rent" },
  ];

  // Enhanced tab switching with haptic feedback and navigation
  const switchTab = (option) => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setSelectedOpt(option.label);
    
    // Navigate to the selected tab's path
    router.push(option.path);
  };

  // Modal animation
  useEffect(() => {
    if (showCityModal) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCityModal, slideAnim, fadeAnim]);

  // Search animation
  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.setValue(0);
  };

  const handleSearch = async () => {
    if (!city && !searchCity.trim()) {
      if (Platform.OS === 'ios') {
        Vibration.vibrate([100, 50, 100]);
      }
      return;
    }

    setIsSearching(true);
    startRotation();
    
    setTimeout(() => {
      const cityToSearch = city === 'All' ? '' : city || searchCity;
      const capitalizedCity = capitalizeCity(cityToSearch);

      dispatch(handleCity(capitalizedCity));

      const cityQuery = `city=${encodeURIComponent(capitalizedCity)}&query=${encodeURIComponent(searchCity)}`;
      const fullQuery = `${cityQuery}&type=${encodeURIComponent(selectedOpt)}`;

      router.push(`/property-listings-page?${fullQuery}`);
      setIsSearching(false);
      stopRotation();
      setShowSuggestions(false);
      Keyboard.dismiss();
    }, 1500);
  };

  const selectSuggestion = (suggestion) => {
    setSearchCity(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const clearSearch = () => {
    setSearchCity('');
    setShowSuggestions(false);
  };

  const closeModal = () => {
    setShowCityModal(false);
    Keyboard.dismiss();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Enhanced Buy / Rent tabs with navigation */}
        <Animated.View style={[styles.tabRow, { transform: [{ scale: scaleAnim }] }]}>
          {tabOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.tab,
                selectedOpt === option.label && styles.tabActive
              ]}
              onPress={() => switchTab(option)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedOpt === option.label && styles.tabTextActive
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Search container */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            {/* City Dropdown */}
            <TouchableOpacity
              style={[styles.dropdown, city && styles.dropdownSelected]}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons 
                name="location-outline" 
                size={isSmallScreen ? 18 : 20} 
                color={city ? "#007bff" : "#666"} 
              />
              <Text 
                style={[styles.dropdownText, !city && styles.placeholder]}
                numberOfLines={1}
              >
                {city || 'City'}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>

            {/* Text Input */}
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Search locality..."
                placeholderTextColor="#999"
                value={searchCity}
                onChangeText={setSearchCity}
                onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                autoCorrect={false}
                autoCapitalize="words"
                clearButtonMode="while-editing"
              />
              {searchCity.length > 0 && Platform.OS === 'android' && (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={clearSearch}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Button */}
            <TouchableOpacity 
              style={[styles.searchButton, isSearching && styles.searchButtonLoading]} 
              onPress={handleSearch}
              disabled={isSearching}
              activeOpacity={0.7}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              {isSearching ? (
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <Ionicons name="refresh" size={isSmallScreen ? 18 : 20} color="#fff" />
                </Animated.View>
              ) : (
                <Ionicons name="search" size={isSmallScreen ? 18 : 20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <Animated.View 
              style={[
                styles.suggestionsContainer,
                { 
                  opacity: fadeAnim,
                  bottom: keyboardHeight > 0 ? keyboardHeight - 50 : 'auto',
                  top: keyboardHeight > 0 ? 'auto' : 85,
                }
              ]}
            >
              <ScrollView 
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={`${suggestion}-${index}`}
                    style={[
                      styles.suggestionItem,
                      index === filteredSuggestions.length - 1 && styles.lastSuggestionItem
                    ]}
                    onPress={() => selectSuggestion(suggestion)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="location" size={16} color="#007bff" />
                    <Text style={styles.suggestionText} numberOfLines={1}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* City Modal */}
        <Modal 
          visible={showCityModal} 
          transparent 
          animationType="none"
          statusBarTranslucent={true}
          onRequestClose={closeModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={closeModal}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0],
                    })
                  }]
                }
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <Ionicons name="location" size={24} color="#007bff" />
                  <Text style={styles.modalTitle}>Select City</Text>
                </View>
                <TouchableOpacity 
                  onPress={closeModal}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {/* Popular cities */}
                <Text style={styles.sectionTitle}>Popular Cities</Text>
                {['All', ...locations.slice(0, 6)].map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.modalItem,
                      city === loc && styles.selectedItem
                    ]}
                    onPress={() => {
                      setCity(loc);
                      setSearchCity('');
                      closeModal();
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={styles.modalItemContent}>
                      <Text
                        style={[
                          styles.modalItemText,
                          city === loc && styles.selectedItemText
                        ]}
                      >
                        {loc}
                      </Text>
                      {city === loc && (
                        <Ionicons name="checkmark-circle" size={20} color="#007bff" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                
                {/* All cities */}
                <Text style={styles.sectionTitle}>Other Cities</Text>
                {locations.slice(6).map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.modalItem,
                      city === loc && styles.selectedItem
                    ]}
                    onPress={() => {
                      setCity(loc);
                      setSearchCity('');
                      closeModal();
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={styles.modalItemContent}>
                      <Text
                        style={[
                          styles.modalItemText,
                          city === loc && styles.selectedItemText
                        ]}
                      >
                        {loc}
                      </Text>
                      {city === loc && (
                        <Ionicons name="checkmark-circle" size={20} color="#007bff" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                
                {/* Bottom padding for safe area */}
                <View style={{ height: 50 }} />
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 30, // Main container rounded corners
    marginHorizontal: 12, // Add margin to show the rounded effect
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 35,
    padding: 4,
    width: '70%',
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 14,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#007bff',
    ...Platform.select({
      ios: {
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabText: {
    fontSize: isSmallScreen ? 15 : 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  searchWrapper: {
    width: '100%',
    position: 'relative',
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: isSmallScreen ? 14 : 16,
    gap: 6,
    minHeight: 52,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  dropdownSelected: {
    borderColor: '#007bff',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dropdownText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
    color: '#333',
    fontWeight: '500',
  },
  placeholder: {
    color: '#999',
    fontWeight: '400',
  },
  textInputContainer: {
    flex: 2,
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingRight: Platform.OS === 'android' ? 45 : 15,
    fontSize: isSmallScreen ? 14 : 15,
    color: '#333',
    minHeight: 52,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingHorizontal: isSmallScreen ? 16 : 18,
    paddingVertical: isSmallScreen ? 14 : 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchButtonLoading: {
    backgroundColor: '#6c757d',
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: 250,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    maxHeight: height * 0.8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
  },
  modalBody: {
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    marginVertical: 2,
    paddingHorizontal: 12,
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedItemText: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default SearchBar;