import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';

// Use a React Native Icon instead of react-icons
import { FontAwesome } from '@expo/vector-icons'; // or use react-native-vector-icons

const AdminProfile = ({ adminProfile }) => {
  const [formData, setFormData] = useState(adminProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === 'phoneNumber' ? Number(value) : value,
      };
      
      // Update fullName when firstName or lastName changes
      if (name === 'firstName' || name === 'lastName') {
        const firstName = name === 'firstName' ? value : prev.firstName || '';
        const lastName = name === 'lastName' ? value : prev.lastName || '';
        updatedData.fullName = `${firstName} ${lastName}`.trim();
      }
      
      return updatedData;
    });
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/admin/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', result.token);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setFormData(adminProfile);
    setIsEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.profileWrapper}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={80} color="#3498db" />
          </View>
          <Text style={styles.profileTitle}>Admin Profile</Text>
          <Text style={styles.profileSubtitle}>Manage your account information</Text>
        </View>

        <View style={styles.profileGrid}>
          <View style={styles.profileField}>
            <Text style={styles.label}>Admin ID</Text>
            <View style={styles.readonlyContainer}>
              <Text style={styles.readonly}>{formData.adminId}</Text>
            </View>
          </View>

          <View style={styles.profileField}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  value={formData.firstName || ''}
                  onChangeText={(value) => handleChange('firstName', value)}
                  placeholder="First Name"
                />
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  value={formData.lastName || ''}
                  onChangeText={(value) => handleChange('lastName', value)}
                  placeholder="Last Name"
                />
              </View>
            ) : (
              <View style={styles.readonlyContainer}>
                <Text style={styles.readonly}>{formData.fullName}</Text>
              </View>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Enter your email"
              />
            ) : (
              <View style={styles.readonlyContainer}>
                <Text style={styles.readonly}>{formData.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={styles.label}>Phone Number</Text>
            {isEditing ? (
              <View style={styles.phoneInputContainer}>
                <TextInput
                  style={[styles.input, styles.countryCodeInput]}
                  value={formData.countryCode || '+1'}
                  onChangeText={(value) => handleChange('countryCode', value)}
                  placeholder="+1"
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.input, styles.phoneNumberInput]}
                  value={formData.phoneNumber ? String(formData.phoneNumber) : ''}
                  keyboardType="phone-pad"
                  onChangeText={(value) => handleChange('phoneNumber', value)}
                  placeholder="Enter phone number"
                />
              </View>
            ) : (
              <View style={styles.readonlyContainer}>
                <Text style={styles.readonly}>
                  {formData.countryCode || '+1'} {formData.phoneNumber}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.profileActions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateBtn]}
                onPress={handleUpdate}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
                ) : (
                  <FontAwesome name="save" size={16} color="#fff" style={styles.buttonIcon} />
                )}
                <Text style={styles.buttonText}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelBtn]} 
                onPress={handleDiscard}
                activeOpacity={0.8}
              >
                <FontAwesome name="times" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.editBtn]}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <FontAwesome name="edit" size={16} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  profileWrapper: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },

  avatarContainer: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  profileTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },

  profileSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '400',
  },

  profileGrid: {
    flexDirection: screenWidth < 700 ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },

  profileField: {
    flexDirection: 'column',
    flexBasis: screenWidth < 700 ? '100%' : '48%',
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left',
  },

  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  readonlyContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
  },

  readonly: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },

  divider: {
    marginVertical: 30,
    height: 1,
    backgroundColor: '#e2e8f0',
  },

  profileActions: {
    flexDirection: screenWidth < 700 ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1 }],
  },

  editBtn: {
    backgroundColor: '#3498db',
    borderWidth: 2,
    borderColor: '#2980b9',
  },

  updateBtn: {
    backgroundColor: '#27ae60',
    borderWidth: 2,
    borderColor: '#229954',
  },

  cancelBtn: {
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: '#c0392b',
  },

  buttonIcon: {
    marginRight: 8,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  loadingIndicator: {
    marginRight: 8,
  },

  // Name input container styles
  nameInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  nameInput: {
    flex: 1,
  },

  // Phone input container styles
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  countryCodeInput: {
    flex: 0.3,
    minWidth: 80,
  },

  phoneNumberInput: {
    flex: 0.7,
  },
});

export default AdminProfile;