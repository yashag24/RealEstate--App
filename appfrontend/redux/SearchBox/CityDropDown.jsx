// components/CityDropdown.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { handleSearchCity, updateFilters } from '../redux/SearchBox/SearchSlice';
import cityList from './cityList'; // Same list as before

const CityDropdown = () => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.search.city);

  const handleChange = (city) => {
    dispatch(handleSearchCity(city));
    dispatch(updateFilters({ city: city === 'All' ? '' : city }));
    // If you're using React Navigation, you can navigate here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>City</Text>
      <Picker
        selectedValue={selectedCity}
        onValueChange={(value) => handleChange(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select City" value="" />
        {cityList.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>
    </View>
  );
};

export default CityDropdown;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
  },
});
