import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
 
/**
* Props shape matching TitleSearchRequest[]
*/
const StaffTitleSearch = ({ titleSearchRequest }) => {
  const [filterType, setFilterType] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [modalType, setModalType] = useState(null); // "contact" | "documents"
  const [selectedItem, setSelectedItem] = useState(null);
 
  // Use passed-in prop array
  const data = titleSearchRequest || [];
 
  // Filter by propertyType and Request ID
  const filteredData = data
    .filter((item) =>
      filterType === "All" ? true : item.propertyType === filterType
    )
    .filter((item) =>
      searchId.trim() === "" ? true : item._id.includes(searchId.trim())
    );
 
  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };
 
  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };
 
  const viewDocument = (url) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };
 
  return (
<ScrollView contentContainerStyle={styles.container}>
<Text style={styles.heading}>🔍 Title Search Requests</Text>
 
      <View style={styles.controls}>
<Picker
          selectedValue={filterType}
          onValueChange={(val) => setFilterType(val)}
          style={styles.picker}
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
 
      <View style={styles.table}>
<View style={styles.tableHeader}>
<Text style={[styles.cell, styles.headerCell]}>Req ID</Text>
<Text style={[styles.cell, styles.headerCell]}>Type</Text>
<Text style={[styles.cell, styles.headerCell]}>City</Text>
<Text style={[styles.cell, styles.headerCell]}>State</Text>
<Text style={[styles.cell, styles.headerCell]}>Address</Text>
<Text style={[styles.cell, styles.headerCell]}>Reg No</Text>
<Text style={[styles.cell, styles.headerCell]}>Requested On</Text>
<Text style={[styles.cell, styles.headerCell]}>Contact</Text>
<Text style={[styles.cell, styles.headerCell]}>Docs</Text>
</View>
 
        {filteredData.map((item) => (
<View key={item._id} style={styles.tableRow}>
<Text style={styles.cell}>{item._id}</Text>
<Text style={styles.cell}>{item.propertyType}</Text>
<Text style={styles.cell}>{item.PropertyCity}</Text>
<Text style={styles.cell}>{item.PropertyState}</Text>
<Text style={styles.cell}>{item.propertyAddress}</Text>
<Text style={styles.cell}>
              {item.PropertyRegistrationNumber || "-"}
</Text>
<Text style={styles.cell}>
              {new Date(item.createdAt).toLocaleString()}
</Text>
<TouchableOpacity
              style={styles.viewBtn}
              onPress={() => openModal(item, 'contact')}
>
<Text style={styles.viewBtnText}>View</Text>
</TouchableOpacity>
<TouchableOpacity
              style={styles.viewBtn}
              onPress={() => openModal(item, 'documents')}
              disabled={!(item.propertyDocuments && item.propertyDocuments.length)}
>
<Text style={styles.viewBtnText}>
                {item.propertyDocuments && item.propertyDocuments.length
                  ? 'View'
                  : '-'}
</Text>
</TouchableOpacity>
</View>
        ))}
</View>
 
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
>
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
<Text style={styles.closeBtnText}>×</Text>
</TouchableOpacity>
            {modalType === 'contact' && selectedItem && (
<>
<Text style={styles.modalTitle}>Contact Details</Text>
<Text style={styles.modalText}>
                  Name: {selectedItem.ContactFullName}
</Text>
<Text style={styles.modalText}>
                  Email: {selectedItem.ContactEmail}
</Text>
<Text style={styles.modalText}>
                  Phone: {selectedItem.ContactPhone}
</Text>
                {selectedItem.ContactNotes && (
<Text style={styles.modalText}>
                    Notes: {selectedItem.ContactNotes}
</Text>
                )}
</>
            )}
            {modalType === 'documents' && selectedItem && (
<>
<Text style={styles.modalTitle}>📂 Documents</Text>
<ScrollView>
                  {selectedItem.propertyDocuments.map((doc, idx) => (
<View key={idx} style={styles.documentItem}>
<Text style={styles.cell}>Doc {idx + 1}</Text>
<TouchableOpacity
                        onPress={() => viewDocument(doc.url)}
                        style={styles.linkBtn}
>
<Text style={styles.linkText}>🔍 View</Text>
</TouchableOpacity>
</View>
                  ))}
</ScrollView>
</>
            )}
</View>
</View>
</Modal>
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
    alignItems: 'center',
    gap: 10,
  },
  picker: {
    flex: 1,
    height: 40,
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
  linkBtn: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  linkText: {
    color: "white",
    fontSize: 14,
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
    maxHeight: '80%',
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
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
 
export default StaffTitleSearch;