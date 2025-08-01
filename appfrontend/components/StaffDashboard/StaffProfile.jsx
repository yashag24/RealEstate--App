import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StaffProfile = ({ staff: initialStaff, updateToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (initialStaff) {
      setEditedStaff(initialStaff);
      setLoading(false);
    } else {
      fetchStaffProfile();
    }
  }, [initialStaff]);

  const fetchStaffProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(
        `${BASE_URL}/api/staff/my-profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch profile');
      }

      setEditedStaff(response.data.staff);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load profile',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setEditedStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editedStaff) return;
    
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.put(
        `${BASE_URL}/api/staff/update-detail/${editedStaff._id}`,
        {
          fullName: editedStaff.fullName,
          email: editedStaff.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully!',
      });
      
      // Update token if a new one was returned
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        if (updateToken) updateToken();
      }

      // Refresh profile data
      await fetchStaffProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update profile',
        text2: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill both password fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token || !editedStaff) throw new Error('Authentication error');

      await axios.put(
        `${BASE_URL}/api/staff/${editedStaff._id}/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Password changed successfully',
      });
      
      setOldPassword("");
      setNewPassword("");
      setShowPasswordChange(false);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 
                         'Failed to change password. Please check your old password.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !editedStaff) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Profile information not available'}
        </Text>
        <Pressable 
          style={styles.retryButton}
          onPress={fetchStaffProfile}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 Staff Profile</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Staff ID</Text>
          <Text style={styles.value}>{editedStaff.staffId}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />
          ) : (
            <Text style={styles.value}>{editedStaff.fullName}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{editedStaff.email}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{editedStaff.role}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome5 name="home" size={16} color="#10b981" />
            <Text style={styles.statText}>
              Verified Properties: {editedStaff.verifiedProperties?.length || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="calendar-check" size={16} color="#3b82f6" />
            <Text style={styles.statText}>
              Appointments: {editedStaff.appointmentsHandled?.length || 0}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {isEditing ? (
            <>
              <Pressable 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditedStaff(initialStaff || editedStaff);
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <Pressable 
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.divider} />

        {!showPasswordChange ? (
          <Pressable
            style={styles.changePasswordButton}
            onPress={() => setShowPasswordChange(true)}
          >
            <FontAwesome5 name="lock" size={16} color="#3b82f6" />
            <Text style={styles.changePasswordText}> Change Password</Text>
          </Pressable>
        ) : (
          <View style={styles.passwordSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Old Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showOld}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter current password"
                />
                <Pressable 
                  style={styles.eyeIcon}
                  onPress={() => setShowOld(!showOld)}
                >
                  <FontAwesome5 
                    name={showOld ? 'eye-slash' : 'eye'} 
                    size={18} 
                    color="#64748b" 
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                />
                <Pressable 
                  style={styles.eyeIcon}
                  onPress={() => setShowNew(!showNew)}
                >
                  <FontAwesome5 
                    name={showNew ? 'eye-slash' : 'eye'} 
                    size={18} 
                    color="#64748b" 
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable 
                style={[styles.button, styles.saveButton]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordChange(false);
                  setOldPassword("");
                  setNewPassword("");
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1e293b',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  input: {
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  changePasswordText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  passwordSection: {
    marginTop: 10,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  eyeIcon: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1e293b',
  },
});

export default StaffProfile;