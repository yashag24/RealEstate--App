import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const locations = [
    'Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Ahmedabad', 'Surat'
  ];

  const propertyTypes = [
    '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Plot', 'Office', 'Shop'
  ];

  const budgetRanges = [
    'Under ₹25 Lakh', '₹25L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1 Cr',
    '₹1 Cr - ₹2 Cr', '₹2 Cr - ₹5 Cr', 'Above ₹5 Cr'
  ];

  const handleSearch = () => {
    const searchQuery = {
      location,
      propertyType,
      budget,
    };
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const DropdownModal = ({ visible, onClose, title, data, onSelect, selectedValue }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  selectedValue === item && styles.selectedItem
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item && styles.selectedItemText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Dream Home</Text>
      <Text style={styles.subtitle}>Search from thousands of properties</Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowLocationModal(true)}
          >
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={[styles.dropdownText, !location && styles.placeholder]}>
              {location || 'Select Location'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowPropertyModal(true)}
          >
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text style={[styles.dropdownText, !propertyType && styles.placeholder]}>
              {propertyType || 'Property Type'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowBudgetModal(true)}
          >
            <Ionicons name="cash-outline" size={20} color="#666" />
            <Text style={[styles.dropdownText, !budget && styles.placeholder]}>
              {budget || 'Budget Range'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DropdownModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Select Location"
        data={locations}
        onSelect={setLocation}
        selectedValue={location}
      />

      <DropdownModal
        visible={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        title="Select Property Type"
        data={propertyTypes}
        onSelect={setPropertyType}
        selectedValue={propertyType}
      />

      <DropdownModal
        visible={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Select Budget Range"
        data={budgetRanges}
        onSelect={setBudget}
        selectedValue={budget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default SearchBar;