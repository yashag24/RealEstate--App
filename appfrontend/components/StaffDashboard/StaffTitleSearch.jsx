import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const StaffTitleSearch = ({ titleSearchRequest }) => {
  const [modalType, setModalType] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [searchId, setSearchId] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const filteredRequests = titleSearchRequest
    .filter((r) => (filterType === 'All' ? true : r.propertyType === filterType))
    .filter((r) => (searchId.trim() === '' ? true : r._id.includes(searchId.trim())));

  const openModal = (type, request) => {
    setSelectedContact(request);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedContact(null);
    setModalType(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item._id}</Text>
      <Text style={styles.cell}>{item.propertyType}</Text>
      <Text style={styles.cell}>{item.PropertyCity}</Text>
      <Text style={styles.cell}>{item.PropertyState}</Text>
      <Text style={styles.cell}>{item.propertyAddress}</Text>
      <Text style={styles.cell}>{item.PropertyRegistrationNumber || '-'}</Text>
      <Text style={styles.cell}>
        {new Date(item.createdAt).toLocaleDateString()} {'\n'}
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
      <TouchableOpacity onPress={() => openModal('contact', item)}>
        <Text style={styles.viewBtn}>View Contact</Text>
      </TouchableOpacity>
      {item.propertyDocuments?.length > 0 ? (
        <TouchableOpacity onPress={() => openModal('documents', item)}>
          <Text style={styles.viewBtn}>View Documents</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.cell}>-</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Title Search Requests</Text>

      <View style={styles.controls}>
        <Picker
          selectedValue={filterType}
          style={styles.dropdown}
          onValueChange={(itemValue) => setFilterType(itemValue)}
        >
          <Picker.Item label="All Types" value="All" />
          <Picker.Item label="Residential" value="Residential" />
          <Picker.Item label="Commercial" value="Commercial" />
          <Picker.Item label="Land" value="Land" />
        </Picker>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by Request ID"
          value={searchId}
          onChangeText={setSearchId}
        />
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.noData}>No matching requests.</Text>}
      />

      {/* Contact Modal */}
      <Modal visible={modalType === 'contact'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Text style={{ fontSize: 22 }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Details</Text>
            <Text><Text style={styles.bold}>Full Name:</Text> {selectedContact?.ContactFullName}</Text>
            <Text><Text style={styles.bold}>Email:</Text> {selectedContact?.ContactEmail}</Text>
            <Text><Text style={styles.bold}>Phone:</Text> {selectedContact?.ContactPhone}</Text>
            {selectedContact?.ContactNotes && (
              <Text><Text style={styles.bold}>Notes:</Text> {selectedContact.ContactNotes}</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Documents Modal */}
      <Modal visible={modalType === 'documents'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Text style={{ fontSize: 22 }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>📂 Uploaded Documents</Text>
            {selectedContact?.propertyDocuments.map((doc, index) => (
              <TouchableOpacity
                key={doc.public_id}
                onPress={() => Linking.openURL(doc.url)}
              >
                <Text style={styles.viewLink}>Document {index + 1} 🔍</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 90,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    width: '100%',
    flexWrap: 'wrap',
  },
  dropdown: {
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    flex: 1,
    minWidth: 120,
  },
  searchInput: {
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    flex: 2,
    minWidth: 150,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 13,
    color: '#333',
  },
  viewBtn: {
    backgroundColor: '#0056b3',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 13,
    overflow: 'hidden',
  },
  viewBtnHover: {
    backgroundColor: '#004093',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    width: 340,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  modalText: {
    fontSize: 15,
    marginBottom: 10,
    color: '#444',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 24,
    color: '#333',
  },
  closeBtnText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },

  // Document Section
  documentFlex: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  documentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 6,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewLink: {
    backgroundColor: '#007bff',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 14,
    overflow: 'hidden',
  },
  downloadLink: {
    backgroundColor: '#28a745',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 14,
    overflow: 'hidden',
  },
});

export default StaffTitleSearch;
