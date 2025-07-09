// FiltersSection.js
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Slider from '@react-native-community/slider'; // Changed from @miblanchard/react-native-slider
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  handleChange,
  handleBudgetRange,
  handleArea,
  handleNoOfBedrooms,
  handleCity,
  clearSearchState
} from "@/redux/SearchBox/SearchSlice";
import CityDropdown from "@/redux/SearchBox/CityDropDown";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FiltersSection = () => {
  const { noOfBedrooms, budgetRange, area, selectedCity, expanded } =
    useSelector((store) => store.search);

  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(true);
  const [bedroomInput, setBedroomInput] = useState("");

  const handleSliderChange = (name, value) => {
    if (name === "budgetRange") {
      dispatch(handleBudgetRange([Math.floor(budgetRange[0]), Math.floor(value)]));
    } else if (name === "area") {
      dispatch(handleArea([Math.floor(area[0]), Math.floor(value)]));
    }
  };

  // Fixed city change handler - now properly dispatches the action
  const handleCityChange = (city) => {
    console.log("City selected:", city); // Debug log
    dispatch(handleCity(city));
  };

  const toggleSection = (panel) => {
    dispatch(handleChange(panel));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const isPanelExpanded = (panel) => expanded?.includes(panel);

  // Handle bedroom input change
  const handleBedroomInputChange = (text) => {
    setBedroomInput(text);
    
    // If input is empty, clear the filter (show all properties)
    if (text === "") {
      dispatch(handleNoOfBedrooms(null)); // or whatever value represents "all"
      return;
    }

    // Parse the input number
    const numBedrooms = parseInt(text, 10);
    
    // Validate input (only allow positive numbers)
    if (!isNaN(numBedrooms) && numBedrooms > 0) {
      dispatch(handleNoOfBedrooms(numBedrooms));
    }
  };

  // Clear bedroom input
  const clearBedroomInput = () => {
    setBedroomInput("");
    dispatch(handleNoOfBedrooms(null)); // Clear filter to show all properties
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)} K`;
    }
    return `₹${value.toLocaleString()}`;
  };

  // Count active filters for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCity) count++;
    if (noOfBedrooms !== null && noOfBedrooms !== undefined) count++;
    if (budgetRange && (budgetRange[0] > 0 || budgetRange[1] < 100000000)) count++;
    if (area && (area[0] > 0 || area[1] < 10000)) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Enhanced Clear All functionality
  const handleClearAll = () => {
    // Show confirmation dialog for better UX
    Alert.alert(
      "Clear All Filters",
      "Are you sure you want to clear all applied filters?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            // Clear Redux state
            dispatch(clearSearchState());
            
            // Clear local component state
            setBedroomInput("");
            
            // Optional: Show success feedback
            // You could add a toast notification here
            console.log("All filters cleared successfully");
          }
        }
      ]
    );
  };

  // Quick clear without confirmation (alternative approach)
  const handleQuickClearAll = () => {
    // Clear Redux state
    dispatch(clearSearchState());
    
    // Clear local component state
    setBedroomInput("");
    
    // Optional: Collapse filters after clearing
    setShowFilters(false);
    
    console.log("All filters cleared successfully");
  };

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      {/* <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleFilters}
        activeOpacity={0.7}
      >
        <View style={styles.toggleButtonContent}>
          <Icon name="filter-list" size={24} color="#2C92FF" />
          <Text style={styles.toggleButtonText}>Filters</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filtersBadge}>
              <Text style={styles.filtersBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </View>
        <Icon
          name={showFilters ? "expand-less" : "expand-more"}
          size={24}
          color="#666"
        />
      </TouchableOpacity> */}

      {/* Filters Content */}
      {showFilters && (
        <View style={styles.filtersContent}>
          {/* Enhanced Clear All Button - only show when there are active filters */}
          {activeFiltersCount > 0 && (
            <View style={styles.clearAllContainer}>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={handleClearAll} // Use handleClearAll for confirmation dialog
                // onPress={handleQuickClearAll} // Alternative: use this for immediate clearing
                activeOpacity={0.7}
              >
                <Icon name="clear-all" size={20} color="#FF4444" />
                <Text style={styles.clearAllText}>Clear All Filters</Text>
                {/* <View style={styles.clearAllBadge}>
                  <Text style={styles.clearAllBadgeText}>{activeFiltersCount}</Text>
                </View> */}
              </TouchableOpacity>
            </View>
          )}

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            nestedScrollEnabled={true}
          >
            {/* City Dropdown */}
            {/* <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("panel1")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>City</Text>
                <Icon
                  name={isPanelExpanded("panel1") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              
              {isPanelExpanded("panel1") && (
                <View style={styles.sectionContent}>
                  <CityDropdown
                    selectedCity={selectedCity}
                    onCityChange={handleCityChange}
                  />
                  Debug info - remove in production
                  {selectedCity && (
                    <Text style={styles.debugText}>Selected: {selectedCity}</Text>
                  )}
                </View>
              )}
            </View> */}

            {/* No. of Bedrooms */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("panel2")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>No. of Bedrooms</Text>
                <Icon
                  name={isPanelExpanded("panel2") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              
              {isPanelExpanded("panel2") && (
                <View style={styles.sectionContent}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.bedroomInput}
                      value={bedroomInput}
                      onChangeText={handleBedroomInputChange}
                      placeholder="Enter number of bedrooms (e.g., 2, 3, 4)"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      returnKeyType="done"
                      maxLength={2}
                    />
                    {bedroomInput !== "" && (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearBedroomInput}
                        activeOpacity={0.7}
                      >
                        <Icon name="clear" size={20} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.inputHint}>
                    Leave empty to show all properties
                  </Text>
                </View>
              )}
            </View>

            {/* Budget Range - Enhanced with better styling */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("panel3")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Budget Range</Text>
                <Icon
                  name={isPanelExpanded("panel3") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              
              {isPanelExpanded("panel3") && (
                <View style={styles.sectionContent}>
                  <View style={styles.sliderContainer}>
                    <View style={styles.sliderValueContainer}>
                      <Text style={styles.sliderValue}>
                        {formatCurrency(budgetRange?.[0] || 0)}
                      </Text>
                      <Text style={styles.sliderSeparator}>-</Text>
                      <Text style={styles.sliderValue}>
                        {formatCurrency(budgetRange?.[1] || 100000000)}
                      </Text>
                    </View>
                    <View style={styles.sliderWrapper}>
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1000000000} // Increased to 100 Cr
                        step={10000}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#e2e8f0"
                        thumbTintColor="#3b82f6"
                        value={budgetRange?.[1] || 100000000}
                        onSlidingComplete={(value) => handleSliderChange("budgetRange", value)}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Area - Enhanced with better styling */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("panel4")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Area</Text>
                <Icon
                  name={isPanelExpanded("panel4") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              
              {isPanelExpanded("panel4") && (
                <View style={styles.sectionContent}>
                  <View style={styles.sliderContainer}>
                    <View style={styles.sliderValueContainer}>
                      <Text style={styles.sliderValue}>
                        {(area?.[0] || 0).toLocaleString()} sq ft
                      </Text>
                      <Text style={styles.sliderSeparator}>-</Text>
                      <Text style={styles.sliderValue}>
                        {(area?.[1] || 10000).toLocaleString()} sq ft
                      </Text>
                    </View>
                    <View style={styles.sliderWrapper}>
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={500000} // Increased to 50,000 sq ft
                        step={50}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#e2e8f0"
                        thumbTintColor="#3b82f6"
                        value={area?.[1] || 10000}
                        onSlidingComplete={(value) => handleSliderChange("area", value)}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: screenWidth * 0.99,  // Add this line
    alignSelf: "center",        // Center it horizontally
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  toggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 56,
  },
  toggleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091E42",
    marginLeft: 8,
  },
  filtersBadge: {
    backgroundColor: "#2C92FF",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filtersBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  scrollContainer: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    minHeight: 44,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#091E42",
  },
  sectionContent: {
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
    marginTop: 8,
  },
  bedroomInput: {
    flex: 1,
    fontSize: 16,
    color: "#091E42",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  inputHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  // Enhanced slider styles from code 2
  sliderContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sliderValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sliderValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  sliderSeparator: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  sliderWrapper: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  // Legacy styles for fallback (removed to avoid conflicts)
  // sliderContainer: {
  //   marginVertical: 12,
  //   paddingHorizontal: 8,
  // },
  // track: {
  //   height: 4,
  //   borderRadius: 2,
  // },
  // thumb: {
  //   width: 20,
  //   height: 20,
  //   backgroundColor: "#2C92FF",
  //   borderRadius: 10,
  //   borderWidth: 2,
  //   borderColor: "#fff",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },
  rangeValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rangeText: {
    fontSize: 14,
    color: "#666",
  },
  // Debug style - remove in production
  debugText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  // Enhanced Clear All Button Styles
  clearAllContainer: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD6D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#FF4444",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  clearAllText: {
    color: "#FF4444",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  clearAllBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clearAllBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default FiltersSection;