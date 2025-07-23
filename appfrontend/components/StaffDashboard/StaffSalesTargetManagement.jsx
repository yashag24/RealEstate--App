import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import Toast from 'react-native-toast-message';

// const Employee = {
//   _id: "",
//   name: "",
//   email: "",
//   department: "",
//   joinDate: "",
// };


// const SalesTarget = {
//   _id: "",
//   employeeId: "",
//   employeeName: "",
//   month: "",
//   year: "",
//   targetAmount: "",
//   achievedAmount: "",
//   targetProperties: "",
//   achievedProperties: "",
//   targetLeads: "",
//   achievedLeads: "",
//   performancePercentage: "",
//   status: "Pending" | "In Progress" | "Achieved" | "Failed",
//   createdAt: "",
//   updatedAt: "",
// };

// Dummy data for employees
const dummyEmployees = [
  {
    _id: "emp001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    department: "Sales",
    joinDate: "2023-01-15",
  },
  {
    _id: "emp002",
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    department: "Sales",
    joinDate: "2023-03-10",
  },
  {
    _id: "emp003",
    name: "Amit Singh",
    email: "amit.singh@company.com",
    department: "Marketing",
    joinDate: "2022-11-20",
  },
  {
    _id: "emp004",
    name: "Neha Gupta",
    email: "neha.gupta@company.com",
    department: "Sales",
    joinDate: "2023-05-08",
  },
  {
    _id: "emp005",
    name: "Vikram Patel",
    email: "vikram.patel@company.com",
    department: "Sales",
    joinDate: "2022-09-12",
  },
];

// Dummy data for sales targets
const dummySalesTargets = [
  {
    _id: "target001",
    employeeId: "emp001",
    employeeName: "Rajesh Kumar",
    month: "June",
    year: 2025,
    targetAmount: 500000,
    achievedAmount: 420000,
    targetProperties: 8,
    achievedProperties: 7,
    targetLeads: 50,
    achievedLeads: 45,
    performancePercentage: 84.0,
    status: "In Progress",
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-10T00:00:00.000Z",
  },
  {
    _id: "target002",
    employeeId: "emp002",
    employeeName: "Priya Sharma",
    month: "June",
    year: 2025,
    targetAmount: 400000,
    achievedAmount: 450000,
    targetProperties: 6,
    achievedProperties: 8,
    targetLeads: 40,
    achievedLeads: 42,
    performancePercentage: 112.5,
    status: "Achieved",
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-08T00:00:00.000Z",
  },
  {
    _id: "target003",
    employeeId: "emp003",
    employeeName: "Amit Singh",
    month: "May",
    year: 2025,
    targetAmount: 300000,
    achievedAmount: 280000,
    targetProperties: 5,
    achievedProperties: 4,
    targetLeads: 35,
    achievedLeads: 38,
    performancePercentage: 93.3,
    status: "In Progress",
    createdAt: "2025-05-01T00:00:00.000Z",
    updatedAt: "2025-05-30T00:00:00.000Z",
  },
  {
    _id: "target004",
    employeeId: "emp004",
    employeeName: "Neha Gupta",
    month: "June",
    year: 2025,
    targetAmount: 350000,
    achievedAmount: 180000,
    targetProperties: 7,
    achievedProperties: 3,
    targetLeads: 45,
    achievedLeads: 22,
    performancePercentage: 51.4,
    status: "In Progress",
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-10T00:00:00.000Z",
  },
  {
    _id: "target005",
    employeeId: "emp005",
    employeeName: "Vikram Patel",
    month: "May",
    year: 2025,
    targetAmount: 600000,
    achievedAmount: 650000,
    targetProperties: 10,
    achievedProperties: 12,
    targetLeads: 60,
    achievedLeads: 58,
    performancePercentage: 108.3,
    status: "Achieved",
    createdAt: "2025-05-01T00:00:00.000Z",
    updatedAt: "2025-05-28T00:00:00.000Z",
  },
  {
    _id: "target006",
    employeeId: "emp001",
    employeeName: "Rajesh Kumar",
    month: "May",
    year: 2025,
    targetAmount: 450000,
    achievedAmount: 320000,
    targetProperties: 8,
    achievedProperties: 5,
    targetLeads: 50,
    achievedLeads: 35,
    performancePercentage: 71.1,
    status: "Failed",
    createdAt: "2025-05-01T00:00:00.000Z",
    updatedAt: "2025-05-31T00:00:00.000Z",
  },
  {
    _id: "target007",
    employeeId: "emp002",
    employeeName: "Priya Sharma",
    month: "April",
    year: 2025,
    targetAmount: 380000,
    achievedAmount: 395000,
    targetProperties: 6,
    achievedProperties: 7,
    targetLeads: 38,
    achievedLeads: 40,
    performancePercentage: 103.9,
    status: "Achieved",
    createdAt: "2025-04-01T00:00:00.000Z",
    updatedAt: "2025-04-30T00:00:00.000Z",
  },
  {
    _id: "target008",
    employeeId: "emp003",
    employeeName: "Amit Singh",
    month: "June",
    year: 2025,
    targetAmount: 320000,
    achievedAmount: 125000,
    targetProperties: 5,
    achievedProperties: 2,
    targetLeads: 35,
    achievedLeads: 18,
    performancePercentage: 39.1,
    status: "In Progress",
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-10T00:00:00.000Z",
  },
];

const StaffSalesTargetManagement = ({
  employees = dummyEmployees,
  salesTargets = dummySalesTargets,
  onCreateTarget,
  onUpdateTarget,
}) => {
  const [activeTab, setActiveTab] = useState('targets');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [newTarget, setNewTarget] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear(),
    targetAmount: '',
    targetProperties: '',
    targetLeads: '',
  });

  // Constants
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Filter logic
  const filteredTargets = salesTargets.filter(target => {
    return (
      (searchEmployee === '' || target.employeeName.toLowerCase().includes(searchEmployee.toLowerCase())) &&
      (filterMonth === '' || target.month === filterMonth) &&
      (filterYear === '' || target.year.toString() === filterYear) &&
      (filterStatus === '' || target.status === filterStatus)
    );
  });

  const handleCreateTarget = () => {
    // Validation and creation logic
    if (!newTarget.employeeId || !newTarget.month || !newTarget.targetAmount || 
        !newTarget.targetProperties || !newTarget.targetLeads) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    const targetData = {
      _id: `target${Date.now()}`,
      ...newTarget,
      employeeName: employees.find(e => e._id === newTarget.employeeId)?.name || '',
      targetAmount: Number(newTarget.targetAmount),
      targetProperties: Number(newTarget.targetProperties),
      targetLeads: Number(newTarget.targetLeads),
      achievedAmount: 0,
      achievedProperties: 0,
      achievedLeads: 0,
      performancePercentage: 0,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Target created successfully!',
    });
    
    setNewTarget({
      employeeId: '',
      month: '',
      year: currentYear,
      targetAmount: '',
      targetProperties: '',
      targetLeads: '',
    });
    setActiveTab('targets');
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Achieved': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'Failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    if (percentage >= 50) return '#fd7e14';
    return '#dc3545';
  };

  // Render functions for each tab
  const renderTargetsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          value={searchEmployee}
          onChangeText={setSearchEmployee}
        />
        
        <View style={styles.filterRow}>
          <Picker
            selectedValue={filterMonth}
            onValueChange={setFilterMonth}
            style={styles.picker}
          >
            <Picker.Item label="All Months" value="" />
            {months.map(month => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>

          <Picker
            selectedValue={filterYear}
            onValueChange={setFilterYear}
            style={styles.picker}
          >
            <Picker.Item label="All Years" value="" />
            {years.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year.toString()} />
            ))}
          </Picker>
        </View>

        <Picker
          selectedValue={filterStatus}
          onValueChange={setFilterStatus}
          style={styles.picker}
        >
          <Picker.Item label="All Status" value="" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Achieved" value="Achieved" />
          <Picker.Item label="Failed" value="Failed" />
        </Picker>
      </View>

      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Employee</DataTable.Title>
            <DataTable.Title>Period</DataTable.Title>
            <DataTable.Title numeric>Target</DataTable.Title>
            <DataTable.Title numeric>Achieved</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {filteredTargets.map(target => (
            <DataTable.Row key={target._id}>
              <DataTable.Cell>{target.employeeName}</DataTable.Cell>
              <DataTable.Cell>{target.month} {target.year}</DataTable.Cell>
              <DataTable.Cell numeric>₹{target.targetAmount.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell numeric>₹{target.achievedAmount.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(target.status) }]}>
                  <Text style={styles.statusText}>{target.status}</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );

  const renderPerformanceTab = () => {
    const stats = {
      total: salesTargets.length,
      achieved: salesTargets.filter(t => t.status === 'Achieved').length,
      inProgress: salesTargets.filter(t => t.status === 'In Progress').length,
      failed: salesTargets.filter(t => t.status === 'Failed').length,
      avgPerformance: salesTargets.reduce((sum, t) => sum + t.performancePercentage, 0) / salesTargets.length
    };

    return (
      <View style={styles.tabContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Targets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#28a745' }]}>{stats.achieved}</Text>
            <Text style={styles.statLabel}>Achieved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#ffc107' }]}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#dc3545' }]}>{stats.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Performers</Text>
        <FlatList
          data={salesTargets
            .filter(t => t.month === months[new Date().getMonth()] && t.year === currentYear)
            .sort((a, b) => b.performancePercentage - a.performancePercentage)
            .slice(0, 5)}
          renderItem={({ item }) => (
            <View style={styles.performerItem}>
              <Text style={styles.performerName}>{item.employeeName}</Text>
              <Text style={styles.performerStats}>
                {item.performancePercentage.toFixed(1)}% (₹{item.achievedAmount.toLocaleString()})
              </Text>
            </View>
          )}
          keyExtractor={item => item._id}
        />
      </View>
    );
  };

  const renderCreateTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.formTitle}>Create New Target</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Employee</Text>
        <Picker
          selectedValue={newTarget.employeeId}
          onValueChange={value => setNewTarget({...newTarget, employeeId: value})}
          style={styles.picker}
        >
          <Picker.Item label="Select Employee" value="" />
          {employees.map(emp => (
            <Picker.Item 
              key={emp._id} 
              label={`${emp.name} (${emp.department})`} 
              value={emp._id} 
            />
          ))}
        </Picker>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Month</Text>
          <Picker
            selectedValue={newTarget.month}
            onValueChange={value => setNewTarget({...newTarget, month: value})}
            style={styles.picker}
          >
            <Picker.Item label="Select Month" value="" />
            {months.map(month => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Year</Text>
          <Picker
            selectedValue={newTarget.year}
            onValueChange={value => setNewTarget({...newTarget, year: value})}
            style={styles.picker}
          >
            {years.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Sales Target (₹)</Text>
        <TextInput
          style={styles.input}
          value={newTarget.targetAmount}
          onChangeText={text => setNewTarget({...newTarget, targetAmount: text})}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Properties Target</Text>
        <TextInput
          style={styles.input}
          value={newTarget.targetProperties}
          onChangeText={text => setNewTarget({...newTarget, targetProperties: text})}
          keyboardType="numeric"
          placeholder="Number of properties"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Leads Target</Text>
        <TextInput
          style={styles.input}
          value={newTarget.targetLeads}
          onChangeText={text => setNewTarget({...newTarget, targetLeads: text})}
          keyboardType="numeric"
          placeholder="Number of leads"
        />
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setActiveTab('targets')}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleCreateTarget}
        >
          <Text style={styles.buttonText}>Create Target</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Target Management</Text>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'targets' && styles.activeTab]}
          onPress={() => setActiveTab('targets')}
        >
          <Text style={[styles.tabText, activeTab === 'targets' && styles.activeTabText]}>
            Targets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
          onPress={() => setActiveTab('performance')}
        >
          <Text style={[styles.tabText, activeTab === 'performance' && styles.activeTabText]}>
            Performance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'targets' && renderTargetsTab()}
      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'create' && renderCreateTab()}
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#343a40',
  },
  performerItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performerName: {
    fontWeight: '500',
    color: '#212529',
  },
  performerStats: {
    color: '#28a745',
    fontWeight: '500',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 8,
    color: '#495057',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StaffSalesTargetManagement;