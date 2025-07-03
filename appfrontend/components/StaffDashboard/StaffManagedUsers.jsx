import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  FlatList,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';

const StaffManagedUsers = ({ userDetails }) => {
  const [filteredRole, setFilteredRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (userDetails) {
      let result = [...userDetails];

      if (filteredRole !== 'All') {
        result = result.filter((user) => user.role === filteredRole);
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (user) =>
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phoneNumber?.includes(query)
        );
      }

      setFilteredUsers(result);
    }
  }, [userDetails, filteredRole, searchQuery]);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>
        {item.city === 'City' ? 'N/A' : item.city}
      </Text>
      <Text style={styles.cell}>
        {item.state === 'State' ? 'N/A' : item.state}
      </Text>
      <Text style={styles.roleTag}>{item.role}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>User Management</Text>
        <View style={styles.controls}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <View style={styles.dropdownWrapper}>
            <Picker
              selectedValue={filteredRole}
              style={styles.dropdown}
              onValueChange={(itemValue) => setFilteredRole(itemValue)}
            >
              <Picker.Item label="All Roles" value="All" />
              <Picker.Item label="Builder" value="builder" />
              <Picker.Item label="Agent" value="agent" />
              <Picker.Item label="User" value="user" />
            </Picker>
          </View>
        </View>
      </View>

      {filteredUsers.length > 0 ? (
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Sr. No</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Email</Text>
            <Text style={styles.headerCell}>Phone</Text>
            <Text style={styles.headerCell}>City</Text>
            <Text style={styles.headerCell}>State</Text>
            <Text style={styles.headerCell}>Role</Text>
          </View>
          <FlatList
            data={[...filteredUsers].reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        </View>
      ) : (
        <Text style={styles.noData}>No users found for selected criteria.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 90,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1200,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 10, // may not work on older React Native versions; use margin manually if needed
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },

  searchInput: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 250,
  },

  dropdown: {
    height: 48,
    width: 160,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fc',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50',
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  profileImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  roleTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#eef2f7',
    borderRadius: 6,
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#2c3e50',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },

  noData: {
    textAlign: 'center',
    fontSize: 17,
    color: '#888',
    marginTop: 20,
  },
});


export default StaffManagedUsers;
