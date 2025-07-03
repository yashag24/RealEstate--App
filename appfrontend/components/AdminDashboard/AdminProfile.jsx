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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phoneNumber' ? Number(value) : value,
    }));
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
          <FontAwesome name="user-circle" size={60} color="#444" />
          <Text style={styles.profileTitle}>Admin Profile</Text>
        </View>

        <View style={styles.profileGrid}>
          <View style={styles.profileField}>
            <Text style={styles.label}>Admin ID</Text>
            <Text style={styles.readonly}>{formData.adminId}</Text>
          </View>

          <View style={styles.profileField}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(value) => handleChange('fullName', value)}
              />
            ) : (
              <Text style={styles.readonly}>{formData.fullName}</Text>
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
              />
            ) : (
              <Text style={styles.readonly}>{formData.email}</Text>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={styles.label}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={String(formData.phoneNumber)}
                keyboardType="phone-pad"
                onChangeText={(value) => handleChange('phoneNumber', value)}
              />
            ) : (
              <Text style={styles.readonly}>{formData.phoneNumber}</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.profileActions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={handleUpdate}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleDiscard}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
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
    backgroundColor: '#f7f9fc',
    flex: 1,
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 35,
    maxWidth: 850,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    fontSize: 60,
    color: '#2980b9',
    marginBottom: 8,
  },

  profileTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
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
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 15,
    backgroundColor: '#fdfdfd',
    height: 40,
  },

  readonly: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f0f3f7',
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
    justifyContent: 'center',
  },

  divider: {
    marginVertical: 25,
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  profileActions: {
    flexDirection: screenWidth < 700 ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },

  actionButton: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: screenWidth < 700 ? 10 : 0,
    width: screenWidth < 700 ? '100%' : 'auto',
  },

  editBtn: {
    backgroundColor: '#2980b9',
  },

  updateBtn: {
    backgroundColor: '#27ae60',
  },

  cancelBtn: {
    backgroundColor: '#e74c3c',
  },

  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AdminProfile;
