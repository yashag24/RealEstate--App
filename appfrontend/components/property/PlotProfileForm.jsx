import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PlotProfileForm = ({ formData, handleInputChange, nextStep, prevStep }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={prevStep}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Plot Profile</Text>

      {/* Plot Area */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Plot Area</Text>
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={formData.plotArea || ''}
            onChangeText={(val) => handleInputChange('plotArea', val)}
            placeholder="Enter Area"
            keyboardType="numeric"
          />
          <Picker
            selectedValue={formData.areaUnit || 'sq ft'}
            style={styles.picker}
            onValueChange={(val) => handleInputChange('areaUnit', val)}
          >
            <Picker.Item label="Sq Ft" value="sq ft" />
            <Picker.Item label="Sq Yard" value="sq yard" />
            <Picker.Item label="Sq M" value="sq m" />
            <Picker.Item label="Acres" value="acres" />
            <Picker.Item label="Marla" value="marla" />
            <Picker.Item label="Cents" value="cents" />
          </Picker>
        </View>
      </View>

      {/* Floors */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Floors Allowed for Construction</Text>
        <TextInput
          style={styles.input}
          value={formData.noOfFloorsConst || ''}
          onChangeText={(val) => handleInputChange('noOfFloorsConst', val)}
          placeholder="No. of floors"
          keyboardType="numeric"
        />
      </View>

      {/* Boundary Wall */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Is there a Boundary Wall around the property?</Text>
        <View style={styles.radioGroup}>
          {['Yes', 'No'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.radioRow}
              onPress={() => handleInputChange('boundary', opt)}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.boundary === opt && styles.radioSelected,
                ]}
              />
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Construction */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Any construction on the property?</Text>
        <View style={styles.radioGroup}>
          {['Yes', 'No'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.radioRow}
              onPress={() => handleInputChange('construction', opt)}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.construction === opt && styles.radioSelected,
                ]}
              />
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Possession Date */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Expected Possession By</Text>
        <TextInput
          style={styles.input}
          value={formData.possessionDate || ''}
          onChangeText={(val) => handleInputChange('possessionDate', val)}
          placeholder="Month and Year"
        />
      </View>

      {/* Ownership Type */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ownership Type</Text>
        <View style={styles.radioGroup}>
          {[
            'Freehold',
            'Leasehold',
            'Co-operative Society',
            'Power of Attorney',
          ].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              onPress={() => handleInputChange('ownership', option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  formData.ownership === option && styles.radioSelected,
                ]}
              />
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 800,
    alignSelf: 'center',
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    height: 44,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 180 : 44,
    color: '#000',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2895DF',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#2895DF',
  },
  backButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#764EC6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




export default PlotProfileForm;
