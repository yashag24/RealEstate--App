import React, { useState, useEffect, useRef } from "react";
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
  SafeAreaView,
  Keyboard,
  Vibration,
  StatusBar,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { handleCity } from "../../redux/SearchBox/SearchSlice";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 350;
const isIOS = Platform.OS === "ios";

const locations = [
  "Jaipur", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Ahmedabad", "Surat", "Noida", "Gurgaon", "Faridabad",
  "Ghaziabad", "Lucknow", "Kanpur", "Indore", "Bhopal",
];

const popularLocalities = {
  Delhi: ["Connaught Place", "Khan Market", "Lajpat Nagar", "Saket", "Dwarka"],
  Mumbai: ["Bandra", "Andheri", "Powai", "Worli", "Malad"],
  Bangalore: ["Koramangala", "Indiranagar", "Whitefield", "Electronic City", "HSR Layout"],
  Pune: ["Koregaon Park", "Baner", "Wakad", "Kothrud", "Viman Nagar"],
  Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR"],
};

const capitalizeCity = (city) =>
  city
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const SearchBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedOpt, setSelectedOpt] = useState("Buy");
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [modalClosing, setModalClosing] = useState(false);
  const [searchContainerLayout, setSearchContainerLayout] = useState({ y: 0, height: 0 });

  // Enhanced animation values
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [backdropAnim] = useState(new Animated.Value(0));
  const [modalContentAnim] = useState(new Animated.Value(0));
  const [chevronRotateAnim] = useState(new Animated.Value(0));
  const [dropdownScaleAnim] = useState(new Animated.Value(1));

  // Refs for animation control
  const modalAnimationRef = useRef(null);
  const chevronAnimationRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (searchCity.length > 0) {
      const cityLocalities = popularLocalities[city] || [];
      const allSuggestions = [...cityLocalities, ...locations];
      const filtered = allSuggestions
        .filter((item) => item.toLowerCase().includes(searchCity.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      Animated.timing(fadeAnim, {
        toValue: filtered.length > 0 ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [searchCity, city, fadeAnim]);

  // Measure search container layout
  const onSearchContainerLayout = (event) => {
    const { y, height } = event.nativeEvent.layout;
    setSearchContainerLayout({ y, height });
  };

  // Calculate suggestions container position
  const getSuggestionsPosition = () => {
    if (keyboardHeight > 0) {
      // When keyboard is up, position suggestions above the search bar
      const availableSpaceAbove = searchContainerLayout.y;
      const suggestionsHeight = Math.min(180, filteredSuggestions.length * 44); // 44 is approximate item height
      
      if (availableSpaceAbove >= suggestionsHeight + 10) {
        // Enough space above, show suggestions above the search bar
        return {
          top: undefined,
          bottom: height - searchContainerLayout.y + 5,
          maxHeight: Math.min(180, availableSpaceAbove - 10),
        };
      } else {
        // Not enough space above, show below but limit height to available space
        const availableSpaceBelow = height - keyboardHeight - (searchContainerLayout.y + searchContainerLayout.height);
        return {
          top: searchContainerLayout.height + 5,
          bottom: undefined,
          maxHeight: Math.min(180, availableSpaceBelow - 10),
        };
      }
    } else {
      // When keyboard is down, show suggestions below the search bar
      return {
        top: searchContainerLayout.height + 5,
        bottom: undefined,
        maxHeight: 180,
      };
    }
  };

  const suggestionsPosition = getSuggestionsPosition();

  const tabOptions = [
    { label: "Buy", path: "/properties/sell" },
    { label: "Rent", path: "/properties/rent" },
  ];

  const switchTab = (option) => {
    if (Platform.OS === "ios") {
      Vibration.vibrate(10);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
    setSelectedOpt(option.label);
    router.push(option.path);
  };

  // Enhanced modal animation
  useEffect(() => {
    if (showCityModal) {
      setModalClosing(false);
      // Animate chevron rotation
      Animated.timing(chevronRotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();

      // Animate dropdown scale
      Animated.timing(dropdownScaleAnim, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start(() => {
        Animated.timing(dropdownScaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }).start();
      });

      // Enhanced modal opening animation
      modalAnimationRef.current = Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
        }),
        Animated.timing(modalContentAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]);
      modalAnimationRef.current.start();
    } else {
      setModalClosing(true);
      // Animate chevron back
      Animated.timing(chevronRotateAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();

      // Enhanced modal closing animation
      modalAnimationRef.current = Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.bezier(0.55, 0.06, 0.68, 0.19)),
        }),
        Animated.timing(modalContentAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]);
      modalAnimationRef.current.start(() => {
        setModalClosing(false);
      });
    }
  }, [showCityModal]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.setValue(0);
  };

  const handleSearch = async () => {
    if (!city && !searchCity.trim()) {
      if (Platform.OS === "ios") {
        Vibration.vibrate([100, 50, 100]);
      }
      return;
    }
    setIsSearching(true);
    startRotation();
    setTimeout(() => {
      const cityToSearch = city === "All" ? "" : city || searchCity;
      const capitalizedCity = capitalizeCity(cityToSearch);
      dispatch(handleCity(capitalizedCity));
      const cityQuery = `city=${encodeURIComponent(capitalizedCity)}&query=${encodeURIComponent(searchCity)}`;
      const fullQuery = `${cityQuery}&type=${encodeURIComponent(selectedOpt)}`;
      router.push(`/propertyListing?${fullQuery}`);
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
    setSearchCity("");
    setShowSuggestions(false);
  };

  const closeModal = () => {
    setShowCityModal(false);
    Keyboard.dismiss();
  };

  const selectCity = (selectedCity) => {
    // Add selection feedback animation
    Animated.sequence([
      Animated.timing(dropdownScaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(dropdownScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    setCity(selectedCity);
    setSearchCity("");
    closeModal();
    
    if (Platform.OS === "ios") {
      Vibration.vibrate(10);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const chevronRotation = chevronRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.75, 0],
  });

  const modalScale = modalContentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.94],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tabRow, { transform: [{ scale: scaleAnim }] }]}>
        {tabOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[styles.tab, selectedOpt === option.label && styles.tabActive]}
            onPress={() => switchTab(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, selectedOpt === option.label && styles.tabTextActive]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <View style={styles.searchWrapper}>
        <View 
          style={styles.searchContainer}
          ref={searchContainerRef}
          onLayout={onSearchContainerLayout}
        >
          <Animated.View style={{ transform: [{ scale: dropdownScaleAnim }] }}>
            <TouchableOpacity
              style={[styles.dropdown, city && styles.dropdownSelected]}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={city ? "#007bff" : "#666"}
              />
              <Text style={[styles.dropdownText, !city && styles.placeholder]}>
                {city || "City"}
              </Text>
              <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

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
            {searchCity.length > 0 && Platform.OS === "android" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchButtonLoading]}
            onPress={handleSearch}
            disabled={isSearching}
            activeOpacity={0.7}
          >
            {isSearching ? (
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Ionicons name="refresh" size={16} color="#fff" />
              </Animated.View>
            ) : (
              <Ionicons name="search" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {showSuggestions && (
          <Animated.View
            style={[
              styles.suggestionsContainer,
              {
                opacity: fadeAnim,
                top: suggestionsPosition.top,
                bottom: suggestionsPosition.bottom,
                maxHeight: suggestionsPosition.maxHeight,
              },
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
                    index === filteredSuggestions.length - 1 && styles.lastSuggestionItem,
                  ]}
                  onPress={() => selectSuggestion(suggestion)}
                  activeOpacity={0.6}
                >
                  <Ionicons name="location" size={14} color="#007bff" />
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      <Modal
        visible={showCityModal}
        transparent
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  { translateY: modalTranslateY },
                  { scale: modalScale },
                ],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Ionicons name="location" size={20} color="#007bff" />
                <Text style={styles.modalTitle}>Select City</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.modalBody} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              <Text style={styles.sectionTitle}>Popular Cities</Text>
              {["All", ...locations.slice(0, 6)].map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.modalItem, city === loc && styles.selectedItem]}
                  onPress={() => selectCity(loc)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemContent}>
                    <Text
                      style={[
                        styles.modalItemText,
                        city === loc && styles.selectedItemText,
                      ]}
                    >
                      {loc}
                    </Text>
                    {city === loc && (
                      <Ionicons name="checkmark-circle" size={16} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <Text style={styles.sectionTitle}>Other Cities</Text>
              {locations.slice(6).map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.modalItem, city === loc && styles.selectedItem]}
                  onPress={() => selectCity(loc)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemContent}>
                    <Text
                      style={[
                        styles.modalItemText,
                        city === loc && styles.selectedItemText,
                      ]}
                    >
                      {loc}
                    </Text>
                    {city === loc && (
                      <Ionicons name="checkmark-circle" size={16} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{ height: 30 }} />
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 6,
    width: "97%",
    maxWidth: 350,
    height: "auto",
    minHeight: 100,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 2,
    width: "80%",
    maxWidth: 320,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#007bff",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  searchWrapper: {
    width: "100%",
    position: "relative",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dropdown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
    minHeight: 36,
    minWidth: 110,
  },
  dropdownSelected: {
    borderColor: "#007bff",
    borderWidth: 1.5,
  },
  dropdownText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  placeholder: {
    color: "#999",
    fontWeight: "400",
  },
  textInputContainer: {
    flex: 2,
    position: "relative",
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingRight: Platform.OS === "android" ? 30 : 10,
    fontSize: 13,
    color: "#333",
    minHeight: 36,
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
  searchButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  searchButtonLoading: {
    backgroundColor: "#6c757d",
  },
  suggestionsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 44,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.75,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalHandle: {
    width: 32,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  modalBody: {
    paddingHorizontal: 14,
    flex: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginTop: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    minHeight: 45,
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    marginVertical: 1,
    paddingHorizontal: 8,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalItemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    lineHeight: 20,
  },
  selectedItemText: {
    color: "#007bff",
    fontWeight: "600",
  },
});

export default SearchBar;