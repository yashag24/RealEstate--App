import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const AdminDashUserDetails = ({ adminProfile }) => {
  const [users, setUsers] = useState([]);
  const [popupUser, setPopupUser] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/users-details?adminId=${adminProfile.adminId}`
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users");
      }
    };

    fetchUsers();
  }, [adminProfile.adminId]);

  const filteredUsers = [...users].reverse().filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(query);

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;

    return matchesQuery && matchesRole;
  });

  const openPopup = (user, type) => {
    setPopupUser(user);
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupUser(null);
    setPopupType(null);
  };

  const renderPopupData = () => {
    if (!popupUser || !popupType) return null;
    if (popupType === "searches") {
      return popupUser.searches?.map((s) => (
        <View style={styles.chartRow} key={s._id}>
          <Text style={styles.chartCell}>{s.search_text}</Text>
          <Text style={styles.chartCell}>{new Date(s.search_datetime).toLocaleString()}</Text>
        </View>
      ));
    }
    const dataList = popupType === "views" ? popupUser.previousView : popupUser.saveProperties;
    return dataList?.map((item) => {
      const p = item.propertyId || item;
      return (
        <View style={styles.chartRow} key={item._id}>
          <Text style={styles.chartCell}>{p.title}</Text>
          <Text style={styles.chartCell}>{p.city}</Text>
          <Text style={styles.chartCell}>₹{p.price}</Text>
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.adminContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>All Registered Users</Text>
        <Text style={styles.subtitle}>Manage and view user details</Text>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.search}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={roleFilter}
            onValueChange={(val) => setRoleFilter(val)}
            style={styles.filterDropdown}
          >
            <Picker.Item label="All Roles" value="all" />
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Agent" value="agent" />
            <Picker.Item label="Builder" value="builder" />
          </Picker>
        </View>
      </View>

      {/* Users List */}
      <View style={styles.usersContainer}>
        {filteredUsers.map((user, index) => (
          <View key={user._id} style={[
            styles.userCard,
            index === 0 && styles.firstCard,
            index === filteredUsers.length - 1 && styles.lastCard
          ]}>
            <View style={styles.userMainInfo}>
              <Image
                source={{ uri: user.image || "https://via.placeholder.com/50" }}
                style={styles.userImg}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMetaInfo}>
                  <Text style={styles.userPhone}>{user.phoneNumber}</Text>
                  <Text style={styles.userCity}>{user.city === "City" ? "Not specified" : user.city}</Text>
                </View>
                <View style={styles.roleContainer}>
                  <Text style={[styles.roleTag, styles[`role${user.role}`]]}>{user.role}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity 
                onPress={() => openPopup(user, "searches")} 
                style={[styles.BtnAdminDash, styles.searchesBtn]}
              >
                <Text style={styles.btnText}>Searches</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => openPopup(user, "views")} 
                style={[styles.BtnAdminDash, styles.viewsBtn]}
              >
                <Text style={styles.btnText}>Views</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => openPopup(user, "saved")} 
                style={[styles.BtnAdminDash, styles.savedBtn]}
              >
                <Text style={styles.btnText}>Saved</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filter criteria</Text>
          </View>
        )}
      </View>

      {/* Modal */}
      <Modal visible={popupUser !== null} transparent animationType="fade">
        <TouchableOpacity style={styles.popupOverlay} onPress={closePopup} activeOpacity={1}>
          <View style={styles.popupContent}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupHeading}>
                {popupType === "searches"
                  ? "User Searches"
                  : popupType === "views"
                  ? "User Previous Views"
                  : "User Saved Properties"}
              </Text>
              <TouchableOpacity onPress={closePopup} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.popupScrollView}>
              <View style={styles.chartContainer}>
                {renderPopupData()}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adminContainer: { 
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  
  // Header Styles
  headerContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '400',
  },
  
  // Search and Filter Styles
  searchFilterContainer: { 
    flexDirection: 'row', 
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  search: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#212529',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerWrapper: { 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    borderRadius: 12,
    backgroundColor: '#fff',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterDropdown: { 
    height: 48,
    color: '#212529',
  },
  
  // Users Container
  usersContainer: {
    flex: 1,
  },
  
  // User Card Styles
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  firstCard: {
    marginTop: 0,
  },
  lastCard: {
    marginBottom: 20,
  },
  userMainInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userImg: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  userInfo: { 
    flex: 1,
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
  },
  userMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userPhone: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  userCity: {
    fontSize: 13,
    color: '#495057',
    fontStyle: 'italic',
  },
  roleContainer: {
    alignSelf: 'flex-start',
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleuser: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  roleagent: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
  },
  rolebuilder: {
    backgroundColor: '#e8f5e8',
    color: '#388e3c',
  },
  
  // Action Buttons
  actions: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  BtnAdminDash: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  searchesBtn: {
    backgroundColor: '#007bff',
  },
  viewsBtn: {
    backgroundColor: '#28a745',
  },
  savedBtn: {
    backgroundColor: '#ffc107',
  },
  btnText: { 
    color: '#fff', 
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  
  // Modal Styles
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  popupHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  popupScrollView: {
    flex: 1,
  },
  chartContainer: {
    padding: 20,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fff',
    marginBottom: 4,
    borderRadius: 8,
  },
  chartCell: { 
    flex: 1, 
    fontSize: 13,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AdminDashUserDetails;