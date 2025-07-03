import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Picker,
  Alert
} from "react-native";

// Dummy data
const employees = [
  { id: "emp001", name: "Rajesh Kumar", department: "Sales" },
  { id: "emp002", name: "Priya Sharma", department: "Sales" },
  { id: "emp003", name: "Amit Singh", department: "Marketing" }
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const StaffSalesTargetManagement = () => {
  const [activeTab, setActiveTab] = useState("targets");
  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    year: currentYear,
    targetAmount: "",
    targetProperties: "",
    targetLeads: ""
  });

  const handleCreate = () => {
    const { employeeId, month, targetAmount, targetProperties, targetLeads } = form;
    if (!employeeId || !month || !targetAmount || !targetProperties || !targetLeads) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    Alert.alert("Success", "Target created successfully.");
    setForm({ employeeId: "", month: "", year: currentYear, targetAmount: "", targetProperties: "", targetLeads: "" });
    setActiveTab("targets");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Sales & Target Management</Text>

      <View style={styles.tabContainer}>
        {['targets', 'performance', 'create'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "create" && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Employee</Text>
          <Picker
            selectedValue={form.employeeId}
            onValueChange={(value) => setForm({ ...form, employeeId: value })}
          >
            <Picker.Item label="Choose Employee" value="" />
            {employees.map(emp => (
              <Picker.Item
                key={emp.id}
                label={`${emp.name} - ${emp.department}`}
                value={emp.id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Month</Text>
          <Picker
            selectedValue={form.month}
            onValueChange={(value) => setForm({ ...form, month: value })}
          >
            <Picker.Item label="Select Month" value="" />
            {months.map(m => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>

          <Text style={styles.label}>Year</Text>
          <Picker
            selectedValue={form.year}
            onValueChange={(value) => setForm({ ...form, year: value })}
          >
            {years.map(y => (
              <Picker.Item key={y} label={y.toString()} value={y} />
            ))}
          </Picker>

          <Text style={styles.label}>Sales Target (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.targetAmount}
            onChangeText={(text) => setForm({ ...form, targetAmount: text })}
          />

          <Text style={styles.label}>Properties Target</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.targetProperties}
            onChangeText={(text) => setForm({ ...form, targetProperties: text })}
          />

          <Text style={styles.label}>Leads Target</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.targetLeads}
            onChangeText={(text) => setForm({ ...form, targetLeads: text })}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Target</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab !== "create" && (
        <Text style={styles.infoText}>"{activeTab.toUpperCase()}" tab content goes here.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Container and Heading
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  heading: {
    color: '#2c3e50',
    marginBottom: 25,
    fontSize: 28,
    fontWeight: '700',
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
    paddingBottom: 10,
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontWeight: '600',
    color: '#6c757d',
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#007bff',
    color: '#ffffff',
  },

  // Tab Content
  tabContent: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Search and Filter Controls
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 25,
    alignItems: 'center',
  },
  searchInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    fontSize: 14,
    minWidth: 200,
    flexGrow: 1,
  },
  filterSelect: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    fontSize: 14,
    minWidth: 120,
  },

  // Table (ListView Alternative)
  tableWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#495057',
  },

  // Status Badge
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'white',
    alignSelf: 'flex-start',
  },

  // Performance
  performanceCell: {
    width: '100%',
    maxWidth: 100,
    flexDirection: 'column',
  },
  performanceBar: {
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },

  // Buttons
  editBtn: {
    backgroundColor: '#ffc107',
    color: '#212529',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '500',
    marginVertical: 2,
  },
  viewBtn: {
    backgroundColor: '#17a2b8',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '500',
    marginVertical: 2,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    flex: 1,
    minWidth: 150,
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
  },

  // Top Performers
  topPerformers: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 12,
  },
  performerCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  performerRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: '700',
    marginRight: 15,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  performerStats: {
    fontSize: 14,
    color: '#6c757d',
  },

  // Create Form
  createForm: {
    width: '100%',
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 30,
  },
  formGroup: {
    flexBasis: '48%',
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
    color: '#495057',
  },
  formInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    fontSize: 14,
  },
  formActions: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  createBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});


export default StaffSalesTargetManagement;
