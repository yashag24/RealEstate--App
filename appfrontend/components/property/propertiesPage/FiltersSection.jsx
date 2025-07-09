import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import {
  handleChange,
  handleWithPhotos,
  handleAmenities,
  handleAvailabilityStatus,
  handleArea,
  handleBudgetRange,
  handleNoOfBedrooms,
  handlePropertyType,
  handleReraApproved,
  handleVerifiedProperties,
  handlePostedBy,
  handleFurnitureType,
  handlePurchaseType,
  clearSearchState,
} from '../../../redux/SearchBox/SearchSlice';

const { width: screenWidth } = Dimensions.get('window');

const propertyTypeList = ["House", "Apartment", "Plot"];
const amenitiesList = ["Gym", "Swimming Pool", "Garden", "Play Area"];
const availabilityStatusList = ["Under Construction", "Ready to Move"];
const postedByList = ["Owner", "Agent", "Builder"];
const furnitureTypeList = ["Furnished", "Semi-Furnished", "Unfurnished"];
const purchaseTypeList = ["New", "Resale"];

const FiltersSection = () => {
  const {
    noOfBedrooms,
    propertyType,
    withPhotos,
    expanded,
    amenities,
    availabilityStatus,
    budgetRange,
    area,
    reraApproved,
    verifiedProperties,
    postedBy,
    furnitureType,
    purchaseType,
  } = useSelector((store) => store.search);
  const dispatch = useDispatch();

  const [showFilters, setShowFilters] = useState(true);
  const [bedroomInput, setBedroomInput] = useState("");

  const handleSliderChange = (name, value) => {
    if (name === "budgetRange") {
      dispatch(handleBudgetRange([Math.floor(value[0]), Math.floor(value[1])]));
    } else if (name === "area") {
      dispatch(handleArea([Math.floor(value[0]), Math.floor(value[1])]));
    }
  };

  const toggleAccordion = (panel) => {
    dispatch(handleChange(panel));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const isPanelExpanded = (panel) => expanded.includes(panel);

  // Handle bedroom input change
  const handleBedroomInputChange = (text) => {
    setBedroomInput(text);
    
    // If input is empty, clear the filter
    if (text === "") {
      dispatch(handleNoOfBedrooms(null));
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
    dispatch(handleNoOfBedrooms(null));
  };

  // Count active filters for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (noOfBedrooms !== null && noOfBedrooms !== undefined) count++;
    if (propertyType && propertyType.length > 0) count++;
    if (budgetRange && (budgetRange[0] > 0 || budgetRange[1] < 20000000)) count++;
    if (area && (area[0] > 0 || area[1] < 4000)) count++;
    if (amenities && amenities.length > 0) count++;
    if (availabilityStatus && availabilityStatus.length > 0) count++;
    if (postedBy && postedBy.length > 0) count++;
    if (furnitureType && furnitureType.length > 0) count++;
    if (purchaseType && purchaseType.length > 0) count++;
    if (withPhotos) count++;
    if (reraApproved) count++;
    if (verifiedProperties) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Enhanced Clear All functionality
  const handleClearAll = () => {
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
            
            console.log("All filters cleared successfully");
          }
        }
      ]
    );
  };

  const renderChip = (label, value, list, action) => {
    const isSelected = list.includes(value);
    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.chip,
          isSelected ? styles.chipSelected : styles.chipUnselected
        ]}
        onPress={() => dispatch(action(value))}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={isSelected ? "check" : "add"}
          size={18}
          color={isSelected ? "#2C92FF" : "#64748b"}
        />
        <Text style={[
          styles.chipText,
          isSelected ? styles.chipTextSelected : styles.chipTextUnselected
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filters Content */}
      {showFilters && (
        <View style={styles.filtersContent}>
          {/* Enhanced Clear All Button - only show when there are active filters */}
          {activeFiltersCount > 0 && (
            <View style={styles.clearAllContainer}>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <MaterialIcons name="clear-all" size={20} color="#FF4444" />
                <Text style={styles.clearAllText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            nestedScrollEnabled={true}
          >
            {/* Verified Properties */}
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Verified Properties</Text>
                <Switch
                  value={verifiedProperties}
                  onValueChange={() => dispatch(handleVerifiedProperties())}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={verifiedProperties ? "#2C92FF" : "#ffffff"}
                  ios_backgroundColor="#e2e8f0"
                  style={styles.switch}
                />
              </View>
            </View>

            {/* No. of Bedrooms */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel2")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>No. of Bedrooms</Text>
                <MaterialIcons
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
                        <MaterialIcons name="clear" size={20} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.inputHint}>
                    Leave empty to show all properties
                  </Text>
                </View>
              )}
            </View>

            {/* Type of Property */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel3")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Type of Property</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel3") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel3") && (
                <View style={styles.sectionContent}>
                  <View style={styles.chipContainer}>
                    {propertyTypeList.map((type) => renderChip(
                      type,
                      type,
                      propertyType,
                      handlePropertyType
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Budget Range */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel4")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Budget Range</Text>
                <MaterialIcons
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
                        ₹{budgetRange[0].toLocaleString()}
                      </Text>
                      <Text style={styles.sliderSeparator}>-</Text>
                      <Text style={styles.sliderValue}>
                        ₹{budgetRange[1].toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.sliderWrapper}>
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={20000000}
                        step={1000}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#e2e8f0"
                        thumbTintColor="#3b82f6"
                        value={budgetRange[1]}
                        onSlidingComplete={(value) => handleSliderChange("budgetRange", [budgetRange[0], value])}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Area */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel5")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Area</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel5") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel5") && (
                <View style={styles.sectionContent}>
                  <View style={styles.sliderContainer}>
                    <View style={styles.sliderValueContainer}>
                      <Text style={styles.sliderValue}>
                        {area[0].toLocaleString()} sq.ft.
                      </Text>
                      <Text style={styles.sliderSeparator}>-</Text>
                      <Text style={styles.sliderValue}>
                        {area[1].toLocaleString()} sq.ft.
                      </Text>
                    </View>
                    <View style={styles.sliderWrapper}>
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={4000}
                        step={10}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#e2e8f0"
                        thumbTintColor="#3b82f6"
                        value={area[1]}
                        onSlidingComplete={(value) => handleSliderChange("area", [area[0], value])}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel6")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Amenities</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel6") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel6") && (
                <View style={styles.sectionContent}>
                  <View style={styles.amenitiesContainer}>
                    {amenitiesList.map((amenity, idx) => (
                      <View key={idx} style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{amenity}</Text>
                        <Switch
                          value={amenities.includes(amenity)}
                          onValueChange={() => dispatch(handleAmenities(amenity))}
                          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                          thumbColor={amenities.includes(amenity) ? "#2C92FF" : "#ffffff"}
                          ios_backgroundColor="#e2e8f0"
                          style={styles.switch}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Construction Status */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel7")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Construction Status</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel7") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel7") && (
                <View style={styles.sectionContent}>
                  <View style={styles.amenitiesContainer}>
                    {availabilityStatusList.map((status, idx) => (
                      <View key={idx} style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{status}</Text>
                        <Switch
                          value={availabilityStatus.includes(status)}
                          onValueChange={() => dispatch(handleAvailabilityStatus(status))}
                          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                          thumbColor={availabilityStatus.includes(status) ? "#2C92FF" : "#ffffff"}
                          ios_backgroundColor="#e2e8f0"
                          style={styles.switch}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Posted By */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel8")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Posted By</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel8") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel8") && (
                <View style={styles.sectionContent}>
                  <View style={styles.amenitiesContainer}>
                    {postedByList.map((poster, idx) => (
                      <View key={idx} style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{poster}</Text>
                        <Switch
                          value={postedBy.includes(poster)}
                          onValueChange={() => dispatch(handlePostedBy(poster))}
                          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                          thumbColor={postedBy.includes(poster) ? "#2C92FF" : "#ffffff"}
                          ios_backgroundColor="#e2e8f0"
                          style={styles.switch}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Furniture Type */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel9")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Furniture Type</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel9") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel9") && (
                <View style={styles.sectionContent}>
                  <View style={styles.amenitiesContainer}>
                    {furnitureTypeList.map((furniture, idx) => (
                      <View key={idx} style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{furniture}</Text>
                        <Switch
                          value={furnitureType.includes(furniture)}
                          onValueChange={() => dispatch(handleFurnitureType(furniture))}
                          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                          thumbColor={furnitureType.includes(furniture) ? "#2C92FF" : "#ffffff"}
                          ios_backgroundColor="#e2e8f0"
                          style={styles.switch}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Purchase Type */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleAccordion("panel10")}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Purchase Type</Text>
                <MaterialIcons
                  name={isPanelExpanded("panel10") ? "expand-less" : "expand-more"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {isPanelExpanded("panel10") && (
                <View style={styles.sectionContent}>
                  <View style={styles.amenitiesContainer}>
                    {purchaseTypeList.map((type, idx) => (
                      <View key={idx} style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{type}</Text>
                        <Switch
                          value={purchaseType.includes(type)}
                          onValueChange={() => dispatch(handlePurchaseType(type))}
                          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                          thumbColor={purchaseType.includes(type) ? "#2C92FF" : "#ffffff"}
                          ios_backgroundColor="#e2e8f0"
                          style={styles.switch}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Additional Switches */}
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>With Photos</Text>
                <Switch
                  value={withPhotos}
                  onValueChange={() => dispatch(handleWithPhotos())}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={withPhotos ? "#2C92FF" : "#ffffff"}
                  ios_backgroundColor="#e2e8f0"
                  style={styles.switch}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>RERA Approved</Text>
                <Switch
                  value={reraApproved}
                  onValueChange={() => dispatch(handleReraApproved())}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={reraApproved ? "#2C92FF" : "#ffffff"}
                  ios_backgroundColor="#e2e8f0"
                  style={styles.switch}
                />
              </View>
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
    width: screenWidth * 0.99,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
  },
  chipSelected: {
    backgroundColor: '#e6f3ff',
    borderColor: '#2C92FF',
  },
  chipUnselected: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#2C92FF',
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: '#64748b',
    fontWeight: '500',
  },
  // Updated slider styles to match first code
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
    fontFamily: 'Montserrat-SemiBold',
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
  amenitiesContainer: {
    gap: 16,
    marginTop: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 48,
  },
  switchLabel: {
    fontSize: 16,
    color: "#091E42",
    fontWeight: "500",
    flex: 1,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 1.1 }, { scaleY: 1.1 }] : [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
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
  },
});

export default FiltersSection;