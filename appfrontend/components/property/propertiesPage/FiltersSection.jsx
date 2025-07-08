

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import CityDropdown from '../../../redux/SearchBox/CityDropDown';
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
  handleCity,
} from '../../../redux/SearchBox/SearchSlice';

const noOfBedroomsList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
    city,
  } = useSelector((store) => store.search);
  const dispatch = useDispatch();

  const handleSliderChange = (name, value) => {
    if (name === "budgetRange") {
      dispatch(handleBudgetRange([Math.floor(value[0]), Math.floor(value[1])]));
    } else if (name === "area") {
      dispatch(handleArea([Math.floor(value[0]), Math.floor(value[1])]));
    }
  };

  const handleCityChange = (selectedCity) => {
    dispatch(handleCity(selectedCity));
  };

  const toggleAccordion = (panel) => {
    dispatch(handleChange(panel));
  };

  const isPanelExpanded = (panel) => expanded.includes(panel);

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
          color={isSelected ? "#3b82f6" : "#64748b"}
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
      <TouchableOpacity
        style={styles.header}
        onPress={() => toggleAccordion("panel1")}
        activeOpacity={0.8}
      >
        <Text style={styles.headerText}>Filters</Text>
        <MaterialIcons
          name={isPanelExpanded("panel1") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={28}
          color="#1e293b"
        />
      </TouchableOpacity>

      {isPanelExpanded("panel1") && (
        <View style={styles.content}>
          {/* Verified Properties */}
          <View style={styles.filterItem}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Verified Properties</Text>
              <Switch
                value={verifiedProperties}
                onValueChange={() => dispatch(handleVerifiedProperties())}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={verifiedProperties ? "#3b82f6" : "#ffffff"}
                ios_backgroundColor="#e2e8f0"
                style={styles.switch}
              />
            </View>
          </View>

          {/* City */}
          <View style={styles.filterItem}>
            <Text style={styles.filterTitle}>City</Text>
            <View style={styles.dropdownContainer}>
              <CityDropdown
                selectedCity={city}
                onCityChange={handleCityChange}
              />
            </View>
          </View>

          {/* No. of Bedrooms */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel2")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>No. of Bedrooms</Text>
              <MaterialIcons
                name={isPanelExpanded("panel2") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel2") && (
              <View style={styles.chipContainer}>
                {noOfBedroomsList.map((room) => renderChip(
                  `${room} BHK`,
                  room,
                  noOfBedrooms,
                  handleNoOfBedrooms
                ))}
              </View>
            )}
          </View>

          {/* Type of Property */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel3")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Type of Property</Text>
              <MaterialIcons
                name={isPanelExpanded("panel3") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel3") && (
              <View style={styles.chipContainer}>
                {propertyTypeList.map((type) => renderChip(
                  type,
                  type,
                  propertyType,
                  handlePropertyType
                ))}
              </View>
            )}
          </View>

          {/* Budget Range */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel4")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Budget Range</Text>
              <MaterialIcons
                name={isPanelExpanded("panel4") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel4") && (
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
            )}
          </View>

          {/* Area */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel5")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Area</Text>
              <MaterialIcons
                name={isPanelExpanded("panel5") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel5") && (
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
            )}
          </View>

          {/* Amenities */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel6")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Amenities</Text>
              <MaterialIcons
                name={isPanelExpanded("panel6") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel6") && (
              <View style={styles.amenitiesContainer}>
                {amenitiesList.map((amenity, idx) => (
                  <View key={idx} style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>{amenity}</Text>
                    <Switch
                      value={amenities.includes(amenity)}
                      onValueChange={() => dispatch(handleAmenities(amenity))}
                      trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                      thumbColor={amenities.includes(amenity) ? "#3b82f6" : "#ffffff"}
                      ios_backgroundColor="#e2e8f0"
                      style={styles.switch}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Construction Status */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel7")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Construction Status</Text>
              <MaterialIcons
                name={isPanelExpanded("panel7") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel7") && (
              <View style={styles.amenitiesContainer}>
                {availabilityStatusList.map((status, idx) => (
                  <View key={idx} style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>{status}</Text>
                    <Switch
                      value={availabilityStatus.includes(status)}
                      onValueChange={() => dispatch(handleAvailabilityStatus(status))}
                      trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                      thumbColor={availabilityStatus.includes(status) ? "#3b82f6" : "#ffffff"}
                      ios_backgroundColor="#e2e8f0"
                      style={styles.switch}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Posted By */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel8")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Posted By</Text>
              <MaterialIcons
                name={isPanelExpanded("panel8") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel8") && (
              <View style={styles.amenitiesContainer}>
                {postedByList.map((poster, idx) => (
                  <View key={idx} style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>{poster}</Text>
                    <Switch
                      value={postedBy.includes(poster)}
                      onValueChange={() => dispatch(handlePostedBy(poster))}
                      trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                      thumbColor={postedBy.includes(poster) ? "#3b82f6" : "#ffffff"}
                      ios_backgroundColor="#e2e8f0"
                      style={styles.switch}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Furniture Type */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel9")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Furniture Type</Text>
              <MaterialIcons
                name={isPanelExpanded("panel9") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel9") && (
              <View style={styles.amenitiesContainer}>
                {furnitureTypeList.map((furniture, idx) => (
                  <View key={idx} style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>{furniture}</Text>
                    <Switch
                      value={furnitureType.includes(furniture)}
                      onValueChange={() => dispatch(handleFurnitureType(furniture))}
                      trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                      thumbColor={furnitureType.includes(furniture) ? "#3b82f6" : "#ffffff"}
                      ios_backgroundColor="#e2e8f0"
                      style={styles.switch}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Purchase Type */}
          <View style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleAccordion("panel10")}
              activeOpacity={0.8}
            >
              <Text style={styles.filterTitle}>Purchase Type</Text>
              <MaterialIcons
                name={isPanelExpanded("panel10") ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#1e293b"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel10") && (
              <View style={styles.amenitiesContainer}>
                {purchaseTypeList.map((type, idx) => (
                  <View key={idx} style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>{type}</Text>
                    <Switch
                      value={purchaseType.includes(type)}
                      onValueChange={() => dispatch(handlePurchaseType(type))}
                      trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                      thumbColor={purchaseType.includes(type) ? "#3b82f6" : "#ffffff"}
                      ios_backgroundColor="#e2e8f0"
                      style={styles.switch}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Additional Switches */}
          <View style={styles.filterItem}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>With Photos</Text>
              <Switch
                value={withPhotos}
                onValueChange={() => dispatch(handleWithPhotos())}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={withPhotos ? "#3b82f6" : "#ffffff"}
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
                thumbColor={reraApproved ? "#3b82f6" : "#ffffff"}
                ios_backgroundColor="#e2e8f0"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.3,
  },
  dropdownContainer: {
    marginTop: 12,
    padding: 4,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  chipUnselected: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  chipText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.2,
  },
  chipTextSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: '#64748b',
    fontWeight: '500',
  },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 48,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    letterSpacing: 0.2,
    flex: 1,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 1.1 }, { scaleY: 1.1 }] : [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

export default FiltersSection;
