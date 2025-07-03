import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import Navbar from '@/components/home/Navbar';
import SidebarStaff from '@/components/StaffDashboard/SidebarStaff';
import StaffProfile from '@/components/StaffDashboard/StaffProfile';
import StaffManagedAppointments from '@/components/StaffDashboard/StaffManagedAppointments';
import StaffVerifyProperties from '@/components/StaffDashboard/StaffVerifyProperties';
import StaffManagedUsers from '@/components/StaffDashboard/StaffManagedUsers';
import StaffTitleSearch from '@/components/StaffDashboard/StaffTitleSearch';
import StaffPrePurchaseProVer from '@/components/StaffDashboard/StaffPrePurchaseProVer';
import StaffSalesTargetManagement from '@/components/StaffDashboard/StaffSalesTargetManagement';

const StaffDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('profile');
  const [staffData, setStaffData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [titleSearchRequest, setTitleSearchRequest] = useState([]);
  const [prePurchaseRequest, setPrePurchaseRequest] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salesTargets, setSalesTargets] = useState([]);
  const navigation = useNavigation();
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  };

  const fetchStaffData = async () => {
    const token = await fetchToken();
    if (!token) {
      navigation.navigate('StaffLogin');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setStaffData(decoded);
    } catch (error) {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('StaffLogin');
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/staff/users-details`);
      const data = await res.json();
      if (data.success) {
        setUserData(data.usersData);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const token = await fetchToken();
      const [appointmentsRes, propertiesRes, titleSearchRes, prePurchaseRes] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/property/verification`),
        fetch(`${BASE_URL}/api/title-search/list`),
        fetch(`${BASE_URL}/api/Pre-Purchase-Property-Verification/list`),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const propertiesData = await propertiesRes.json();
      const titleSearchData = await titleSearchRes.json();
      const prePurchaseData = await prePurchaseRes.json();

      if (appointmentsData.success) setAppointments(appointmentsData.appointments);
      if (propertiesData.success) setProperties(propertiesData.property_verify);
      if (titleSearchData.success) setTitleSearchRequest(titleSearchData.allRequests);
      if (prePurchaseData.success) setPrePurchaseRequest(prePurchaseData.allRequests);
    } catch (err) {
      Alert.alert('Fetch Error', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('StaffLogin');
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return <StaffProfile staff={staffData} updateToken={fetchStaffData} />;
      case 'usersDetails':
        return <StaffManagedUsers userDetails={userData} />;
      case 'appointments':
        return (
          <StaffManagedAppointments
            staffId={staffData?.staffId}
            appointments={appointments}
            loading={loading}
            error={error}
            handleCancelAppointment={() => {}}
            handleAcceptAppointment={() => {}}
          />
        );
      case 'properties':
        return (
          <StaffVerifyProperties
            loading={loading}
            error={error}
            properties={properties}
            handleAcceptProperty={() => {}}
          />
        );
      case 'title-search':
        return <StaffTitleSearch titleSearchRequest={titleSearchRequest} />;
      case 'pre-purchase-property-verification':
        return <StaffPrePurchaseProVer prePurchaseRequest={prePurchaseRequest} />;
      case 'sales-target-management':
        return (
          <StaffSalesTargetManagement
            employees={employees}
            salesTargets={salesTargets}
            onCreateTarget={() => {}}
            onUpdateTarget={() => {}}
          />
        );
      case 'logout':
        handleLogout();
        return null;
      default:
        return <Text>Select an option</Text>;
    }
  };

  useEffect(() => {
    fetchStaffData();
    fetchUserDetails();
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.dashboardLayout}>
        <SidebarStaff
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          menuOptions={[]}
        />
        <ScrollView style={styles.content}>{renderContent()}</ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboardLayout: {
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default StaffDashboard;
