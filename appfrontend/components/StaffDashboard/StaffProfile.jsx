import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const StaffProfile = ({ staff, updateToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(staff);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const token = 'yourTokenHere'; // Replace with SecureStore/AsyncStorage for real apps

  useEffect(() => {
    if (staff) {
      setEditedStaff(staff);
    }
  }, [staff]);

  if (!staff) return <Text style={styles.loading}>Loading profile...</Text>;

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/staff/update-detail/${staff._id}`,
        {
          fullName: editedStaff?.fullName,
          email: editedStaff?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      updateToken();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return alert('Please fill both password fields.');
    }
    try {
      await axios.put(
        `${BASE_URL}/api/staff/${staff._id}/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordChange(false);
    } catch (err) {
      console.error(err);
      alert('Failed to change password.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.profileContainerStaff}>
      <View style={styles.profileCardStaff}>
        <Text style={styles.titleStaff}>👤 Staff Profile</Text>

        <View style={styles.fieldGroupStaff}>
          <Text style={styles.label}>Staff ID</Text>
          <Text>{staff.staffId}</Text>
        </View>

        <View style={styles.fieldGroupStaff}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff?.fullName}
              onChangeText={(text) =>
                setEditedStaff({ ...editedStaff, fullName: text })
              }
            />
          ) : (
            <Text>{staff.fullName}</Text>
          )}
        </View>

        <View style={styles.fieldGroupStaff}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedStaff?.email}
              onChangeText={(text) =>
                setEditedStaff({ ...editedStaff, email: text })
              }
            />
          ) : (
            <Text>{staff.email}</Text>
          )}
        </View>

        <View style={styles.fieldGroupStaff}>
          <Text style={styles.label}>Role</Text>
          <Text>{staff.role}</Text>
        </View>

        <View style={styles.actionRowStaff}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveBtnStaff}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditedStaff(staff);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelBtnStaff}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnStaff}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {!showPasswordChange ? (
          <TouchableOpacity onPress={() => setShowPasswordChange(true)}>
            <Text style={styles.changePasswordLinkStaff}>🔐 Change Password</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.fieldGroupStaff}>
              <Text style={styles.label}>Old Password</Text>
              <View style={styles.passwordInputWrapperStaff}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showOld}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                  <Icon name={showOld ? 'eye-slash' : 'eye'} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroupStaff}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordInputWrapperStaff}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Icon name={showNew ? 'eye-slash' : 'eye'} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionRowStaff}>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={styles.saveBtnStaff}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordChange(false);
                  setOldPassword('');
                  setNewPassword('');
                }}
              >
                <Text style={styles.cancelBtnStaff}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainerStaff: {
    marginTop: 90,
    marginHorizontal: 'auto', // not directly supported — use alignSelf or centering parent
    padding: 20,
    backgroundColor: '#fefefe',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  profileCardStaff: {
    flexDirection: 'column',
  },

  titleStaff: {
    fontSize: 28, // 1.8rem ~ 28.8px
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },

  fieldGroupStaff: {
    marginBottom: 16,
  },

  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },

  textValue: {
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  input: {
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  actionRowStaff: {
    flexDirection: 'row',
    gap: 10, // may not be supported; use marginRight or spacing between buttons
    justifyContent: 'center',
    marginTop: 12,
  },

  editBtnStaff: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#0077ff',
    borderRadius: 6,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  saveBtnStaff: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#28a745',
    borderRadius: 6,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  cancelBtnStaff: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  divider: {
    marginVertical: 24,
    height: 1,
    backgroundColor: '#ddd',
  },

  changePasswordLinkStaff: {
    color: '#0077ff',
    textDecorationLine: 'underline',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },

  passwordSectionStaff: {
    marginTop: 16,
  },

  passwordInputWrapperStaff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // not supported, use marginRight
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
  },

  iconWrapper: {
    paddingLeft: 8,
    fontSize: 18,
    color: '#333',
  },

  loading: {
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 18,
  },
});


export default StaffProfile;
