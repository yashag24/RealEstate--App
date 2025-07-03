import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

const StaffPrePurchaseProVer = ({ prePurchaseRequest }) => {
  const [searchId, setSearchId] = useState('');

  const filteredRequests = prePurchaseRequest.filter((request) =>
    searchId.trim() === '' ? true : request._id.includes(searchId.trim())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item._id}</Text>
      <Text style={styles.cell}>{item.FullName}</Text>
      <Text style={styles.cell}>{item.Phone}</Text>
      <Text style={styles.cell}>{item.Email}</Text>
      <Text style={styles.cell}>{item.Address}</Text>
      <Text style={styles.cell}>
        {item.MessageOrPropertyDetails || '-'}
      </Text>
      <Text style={styles.cell}>
        {new Date(item.createdAt).toLocaleDateString()} {'\n'}
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Pre-Purchase Verification Requests</Text>

      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Request ID"
          value={searchId}
          onChangeText={setSearchId}
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Request ID</Text>
        <Text style={styles.headerCell}>Full Name</Text>
        <Text style={styles.headerCell}>Phone</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>Address</Text>
        <Text style={styles.headerCell}>Message/Details</Text>
        <Text style={styles.headerCell}>Requested On</Text>
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#f4f7fb',
    minHeight: '100%',
    marginTop: 90,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },

  controls: {
    marginBottom: 20,
    alignItems: 'center',
  },

  searchInput: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  tableWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#003366',
    paddingVertical: 12,
  },

  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 15,
    textAlign: 'left',
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 12,
  },

  rowHover: {
    backgroundColor: '#f1f5f9', // for touch feedback if using TouchableOpacity
  },

  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 15,
    color: '#333',
    textAlign: 'center',
  },
});


export default StaffPrePurchaseProVer;
