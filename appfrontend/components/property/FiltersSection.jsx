import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import CityDropdown from '@/redux/SearchBox/CityDropDown';
import {
  handleChange,
  handleBudgetRange,
  handleArea,
  handleNoOfBedrooms,
  handleCity,
} from '@/redux/SearchBox/SearchSlice';


const noOfBedroomsList = [1, 2, 3, 4];

const FiltersSection = () => {
  const { noOfBedrooms, budgetRange, area, selectedCity, expanded } =
    useSelector((store) => store.search);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSliderChange = (name, newValue) => {
    if (name === 'budgetRange') {
      dispatch(handleBudgetRange(newValue));
    } else if (name === 'area') {
      dispatch(handleArea(newValue));
    }
  };

  const handleCityChange = (city) => {
    dispatch(handleCity(city));
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  const formatArea = (value) => {
    return `${value.toLocaleString()} acres`;
  };

  const AccordionItem = ({ title, children, panelKey }) => {
    const isExpanded = expanded.includes(panelKey);
    
    return (
      <View style={styles.accordionItem}>
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => dispatch(handleChange(panelKey))}
        >
          <Text style={styles.accordionTitle}>{title}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#42526E"
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.accordionContent}>
            {children}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color="#fff" />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#42526E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* City Dropdown */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>City</Text>
                <CityDropdown
                  selectedCity={selectedCity}
                  onCityChange={handleCityChange}
                />
              </View>

              {/* No. of Bedrooms */}
              <AccordionItem title="No. of Bedrooms" panelKey="panel1">
                <View style={styles.chipContainer}>
                  {noOfBedroomsList.map((room, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.chip,
                        noOfBedrooms.includes(room) && styles.chipSelected,
                      ]}
                      onPress={() => dispatch(handleNoOfBedrooms(room))}
                    >
                      <Ionicons
                        name={noOfBedrooms.includes(room) ? 'checkmark' : 'add'}
                        size={16}
                        color={noOfBedrooms.includes(room) ? '#000' : '#42526E'}
                        style={styles.chipIcon}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          noOfBedrooms.includes(room) && styles.chipTextSelected,
                        ]}
                      >
                        {room} BHK
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </AccordionItem>

              {/* Budget Range */}
              <AccordionItem title="Budget Range" panelKey="panel3">
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>
                    {formatCurrency(budgetRange[0])} - {formatCurrency(budgetRange[1])}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={20000000}
                    step={1000}
                    value={budgetRange[0]}
                    onValueChange={(value) =>
                      handleSliderChange('budgetRange', [value, budgetRange[1]])
                    }
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#E1E1E1"
                    thumbStyle={styles.sliderThumb}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>₹0</Text>
                    <Text style={styles.sliderLabelText}>₹2,00,00,000</Text>
                  </View>
                </View>
              </AccordionItem>

              {/* Area */}
              <AccordionItem title="Area" panelKey="panel4">
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>
                    {formatArea(area[0])} - {formatArea(area[1])}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={4000}
                    step={10}
                    value={area[0]}
                    onValueChange={(value) =>
                      handleSliderChange('area', [value, area[1]])
                    }
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#E1E1E1"
                    thumbStyle={styles.sliderThumb}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>0 acres</Text>
                    <Text style={styles.sliderLabelText}>4,000 acres</Text>
                  </View>
                </View>
              </AccordionItem>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#091E42',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#091E42',
    marginBottom: 12,
  },
  accordionItem: {
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#091E42',
  },
  accordionContent: {
    paddingTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#42526E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  chipSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#a3daff',
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
    color: '#42526E',
  },
  chipTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#091E42',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#42526E',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FiltersSection;