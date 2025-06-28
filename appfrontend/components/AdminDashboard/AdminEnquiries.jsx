import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  StyleSheet,
} from 'react-native';


const AdminEnquiries = ({ enquiries, onDeleteEnquiry }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const renderEnquiryItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fullName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>{item.messageEn}</Text>

      <TouchableOpacity
        onPress={() => setSelectedProperty(item.propertyId)}>
        <Text style={[styles.cell, styles.link]}>
          {item.propertyId?.title || 'N/A'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedEnquiry(item)}>
        <Text style={styles.cell}>{item.isGuest ? 'Guest' : 'User'}</Text>
      </TouchableOpacity>

      <Text style={styles.cell}>
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : 'N/A'}
      </Text>

      <TouchableOpacity onPress={() => onDeleteEnquiry?.(item._id)}>
        <Text style={[styles.cell, styles.deleteBtn]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Enquiries</Text>

      {enquiries.length === 0 ? (
        <Text>No enquiries found.</Text>
      ) : (
        <FlatList
          data={enquiries}
          renderItem={renderEnquiryItem}
          keyExtractor={(item) => item._id}
        />
      )}

      {/* Property Modal */}
      <Modal visible={!!selectedProperty} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedProperty?.title}</Text>
            {selectedProperty && (
              <View>
                <Text>City: {selectedProperty.city}</Text>
                <Text>Address: {selectedProperty.address}</Text>
                <Text>Owner: {selectedProperty.Propreiter_name}</Text>
                <Text>Contact: {selectedProperty.Propreiter_contact}</Text>
                <Text>Email: {selectedProperty.Propreiter_email}</Text>
                <Text>Purpose: {selectedProperty.purpose}</Text>
                <Text>Type: {selectedProperty.type}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Enquiry Modal */}
      <Modal visible={!!selectedEnquiry} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setSelectedEnquiry(null)}
              style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            {selectedEnquiry?.userId && !selectedEnquiry.isGuest && (
              <View>
                <Text style={styles.modalTitle}>User Information</Text>
                <Text>
                  Name: {selectedEnquiry.userId.firstName}{' '}
                  {selectedEnquiry.userId.lastName}
                </Text>
                <Text>Email: {selectedEnquiry.userId.email}</Text>
                <Text>Phone: {selectedEnquiry.userId.phoneNumber}</Text>
                <Text>City: {selectedEnquiry.userId.city}</Text>
                <Text>Address: {selectedEnquiry.userId.address}</Text>
                <Text>State: {selectedEnquiry.userId.state}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  enquiryContainer: {
    padding: 20,
  },

  table: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },

  tableHeaderCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
  },

  guestUser: {
    textDecorationLine: 'underline',
    color: '#007bff',
  },

  propertyLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
    padding: 0,
    margin: 0,
  },

  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    textAlign: 'center',
  },

  deleteBtnHover: {
    backgroundColor: '#c0392b',
  },

  popupOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },

  popupContainer: {
    width: '90%', // Use 90% for mobile responsiveness
    height: '60%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    overflow: 'scroll',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },

  closeButton: {
    backgroundColor: '#666',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 90,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  closeButtonHover: {
    backgroundColor: '#444',
  },

  detailTable: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3b3b3b',
  },

  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#3b3b3b',
  },

  detailCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#3b3b3b',
    textAlignVertical: 'top',
  },

  detailCellLabel: {
    fontWeight: 'bold',
    width: '40%',
    color: '#333',
  },
});
export default AdminEnquiries;
