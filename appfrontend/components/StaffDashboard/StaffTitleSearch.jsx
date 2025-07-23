import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const StaffTitleSearch = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Replace with your actual API
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/some-data`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📊 Staff Table</Text>

      <View style={styles.controls}>
        {/* Replace dropdown with Picker or custom dropdown if needed */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={filterText}
          onChangeText={setFilterText}
        />
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Email</Text>
          <Text style={[styles.cell, styles.headerCell]}>Action</Text>
        </View>

        {filteredData.map((item) => (
          <View key={item._id} style={styles.tableRow}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.email}</Text>
            <TouchableOpacity
              onPress={() => openModal(item)}
              style={styles.viewBtn}
            >
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Details</Text>
            {selectedItem && (
              <>
                <Text style={styles.modalText}>Name: {selectedItem.name}</Text>
                <Text style={styles.modalText}>Email: {selectedItem.email}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Documents section */}
      <View style={styles.documentFlex}>
        {filteredData.map((doc) => (
          <View key={doc._id} style={styles.documentItem}>
            <Text>{doc.name}</Text>
            <TouchableOpacity style={styles.viewLink}>
              <Text style={styles.linkText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadLink}>
              <Text style={styles.linkText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 90,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  controls: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: 12,
  },
  headerCell: {
    fontWeight: "bold",
  },
  viewBtn: {
    backgroundColor: "#0056b3",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  viewBtnText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: 300,
    padding: 20,
    borderRadius: 10,
    position: "relative",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  closeBtnText: {
    fontSize: 26,
    color: "#333",
    fontWeight: "bold",
  },
  documentFlex: {
    marginTop: 20,
    alignItems: "center",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fafafa",
    gap: 10,
  },
  viewLink: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  downloadLink: {
    backgroundColor: "#28a745",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  linkText: {
    color: "white",
    fontSize: 14,
  },
});

export default StaffTitleSearch;
