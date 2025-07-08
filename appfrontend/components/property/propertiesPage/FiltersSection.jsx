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
      >
        <MaterialIcons
          name={isSelected ? "done" : "add"}
          size={16}
          color={isSelected ? "#0078db" : "#42526E"}
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
          size={24}
          color="#091E42"
        />
      </TouchableOpacity>

      {isPanelExpanded("panel1") && (
        <View style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.filterItem}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Verified Properties</Text>
              <Switch
                value={verifiedProperties}
                onValueChange={() => dispatch(handleVerifiedProperties())}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={verifiedProperties ? "#2895DF" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterTitle}>City</Text>
            <CityDropdown
              selectedCity={city}
              onCityChange={handleCityChange}
            />
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
                color="#091E42"
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
                color="#091E42"
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
                color="#091E42"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel4") && (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>
                  ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={20000000}
                  step={1000}
                  minimumTrackTintColor="#2895DF"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#2895DF"
                  value={budgetRange[1]}
                  onSlidingComplete={(value) => handleSliderChange("budgetRange", [budgetRange[0], value])}
                />
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
                color="#091E42"
              />
            </TouchableOpacity>
            {isPanelExpanded("panel5") && (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>
                  {area[0].toLocaleString()} - {area[1].toLocaleString()} sq.ft.
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={4000}
                  step={10}
                  minimumTrackTintColor="#2895DF"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#2895DF"
                  value={area[1]}
                  onSlidingComplete={(value) => handleSliderChange("area", [area[0], value])}
                />
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
                color="#091E42"
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
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={amenities.includes(amenity) ? "#2895DF" : "#f4f3f4"}
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
                color="#091E42"
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
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={availabilityStatus.includes(status) ? "#2895DF" : "#f4f3f4"}
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
                color="#091E42"
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
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={postedBy.includes(poster) ? "#2895DF" : "#f4f3f4"}
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
                color="#091E42"
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
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={furnitureType.includes(furniture) ? "#2895DF" : "#f4f3f4"}
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
                color="#091E42"
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
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={purchaseType.includes(type) ? "#2895DF" : "#f4f3f4"}
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
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={withPhotos ? "#2895DF" : "#f4f3f4"}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>RERA Approved</Text>
              <Switch
                value={reraApproved}
                onValueChange={() => dispatch(handleReraApproved())}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={reraApproved ? "#2895DF" : "#f4f3f4"}
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
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#091E42',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    maxHeight:'100%',
    paddingHorizontal: 16,
  },
  filterItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#091E42',
    fontFamily: 'Montserrat-SemiBold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#a3daff',
  },
  chipUnselected: {
    backgroundColor: '#fff',
    borderColor: '#42526E',
  },
  chipText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  chipTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: '#42526E',
    fontWeight: '400',
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderValue: {
    fontSize:14,
    color: '#42526E',
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
  },
  amenitiesContainer: {
    gap: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: '#091E42',
    fontFamily: 'Montserrat-Regular',
  },
});
export default FiltersSection;
