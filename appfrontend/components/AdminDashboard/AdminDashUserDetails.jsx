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
      <Text style={styles.title}>All Registered Users</Text>
      <View style={styles.adminTitleSearch}>
        <TextInput
          style={styles.search}
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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

      {filteredUsers.map((user) => (
        <View key={user._id} style={styles.userCard}>
          <Image
            source={{ uri: user.image || "https://via.placeholder.com/40" }}
            style={styles.userImg}
          />
          <View style={styles.userInfo}>
            <Text>{`${user.firstName} ${user.lastName}`}</Text>
            <Text>{user.email}</Text>
            <Text>{user.phoneNumber}</Text>
            <Text>{user.city === "City" ? "-" : user.city}</Text>
            <Text>{user.role}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => openPopup(user, "searches")} style={styles.BtnAdminDash}><Text style={styles.btnText}>Searches</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => openPopup(user, "views")} style={styles.BtnAdminDash}><Text style={styles.btnText}>Views</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => openPopup(user, "saved")} style={styles.BtnAdminDash}><Text style={styles.btnText}>Saved</Text></TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={popupUser !== null} transparent animationType="fade">
        <TouchableOpacity style={styles.popupOverlay} onPress={closePopup} activeOpacity={1}>
          <View style={styles.popupContent}>
            <Text style={styles.popupHeading}>
              {popupType === "searches"
                ? "User Searches"
                : popupType === "views"
                ? "User Previous Views"
                : "User Saved Properties"}
            </Text>
            <ScrollView>{renderPopupData()}</ScrollView>
            <TouchableOpacity onPress={closePopup} style={styles.closeBtn}>
              <Text style={{ color: 'white' }}>✕</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adminContainer: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  adminTitleSearch: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flex: 1,
    marginRight: 10,
  },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6 },
  filterDropdown: { height: 40 },
  userCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  userImg: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userInfo: { flex: 2 },
  actions: { flex: 1, gap: 4 },
  BtnAdminDash: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  btnText: { color: 'white', textAlign: 'center' },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  popupHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
  },
  chartCell: { flex: 1, textAlign: 'center' },
  closeBtn: {
    marginTop: 16,
    backgroundColor: 'crimson',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default AdminDashUserDetails;