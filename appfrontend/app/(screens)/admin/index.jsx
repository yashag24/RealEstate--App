import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, performLogout } from '@/redux/Auth/AuthSlice';
 
import Navbar from '@/components/home/Navbar';
import AdminSideBar from '@/components/AdminDashboard/AdminSideBar';
import AdminProfile from '@/components/AdminDashboard/AdminProfile';
import AdminDashUserDetails from '@/components/AdminDashboard/AdminDashUserDetails';
import AdminAppointment from '@/components/AdminDashboard/AdminAppointment';
import AdminPropertyVerification from '@/components/AdminDashboard/AdminPropertyVerification';
import AdminReviews from '@/components/AdminDashboard/AdminReviews';
import AdminEnquiries from '@/components/AdminDashboard/AdminEnquiries';
import AdminList from '@/components/AdminDashboard/AdminList';
import StaffManagement from '@/components/StaffDashboard/StaffManagement';
import StaffPerformanceCategories from '@/components/AdminDashboard/StaffPerformanceCategories';
import AdminContractorVerification from '@/components/AdminDashboard/AdminContractorVerification';
import CustomModal from '@/components/AdminDashboard/Modal';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
 
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, authUser, userType } = useSelector((state) => state.auth);
 
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Initialize authentication on component mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (userType !== 'admin' || !authUser) {
      requestAnimationFrame(() => {
        router.replace('/(screens)');
      });
    }
  }, [authUser, router, userType]);
 
  useEffect(() => {
    const loadInitialData = async () => {
      const savedSection = await AsyncStorage.getItem('activeSection') || 'adminProfile';
      setActiveSection(savedSection);
      fetchData();
    };
 
    if (authUser && userType === 'admin') {
      loadInitialData();
    }
  }, [authUser, userType]);
 
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
 
      const [
        appointmentsRes,
        propertiesRes,
        reviewsRes,
        enquiriesRes,
        adminsRes,
        contractorsRes
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/property/verification`),
        fetch(`${BASE_URL}/api/reviews/get-all-reviews`),
        fetch(`${BASE_URL}/api/enquiry/get-all-enquiry`),
        fetch(`${BASE_URL}/api/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/contractor/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
 
      const [appointmentsData, propertiesData, reviewsData, enquiriesData, adminsData, contractorsData] = await Promise.all([
        appointmentsRes.json(),
        propertiesRes.json(),
        reviewsRes.json(),
        enquiriesRes.json(),
        adminsRes.json(),
        contractorsRes.json()
      ]);
 
      if (appointmentsData.success) setAppointments(appointmentsData.appointments);
      if (propertiesData.success) setProperties(propertiesData.property_verify);
      if (adminsData.success) setAdmins(adminsData.data);
      if (reviewsData.success) setReviews(reviewsData.reviews);
      if (enquiriesData.success) setEnquiries(enquiriesData.enquiries);
 
      if (Array.isArray(contractorsData)) {
        setContractors(contractorsData);
      } else if (contractorsData.success) {
        setContractors(contractorsData.contractors);
      } else if (contractorsData.data) {
        setContractors(contractorsData.data);
      } else {
        setContractors([]);
      }
    } catch (err) {
      setError(err.message);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch data.' });
    } finally {
      setLoading(false);
    }
  };
 
  const handleRemoveAppointment = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      Toast.show({ type: 'success', text1: 'Appointment deleted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: error.message });
    }
  };
 
  const handleAcceptProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/accept`, { method: 'PUT' });
      const result = await response.json();
      if (!result.success || !response.ok) throw new Error('Accepting property failed');
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: 'success', text1: 'Property accepted' });
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleRejectProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/reject`, { method: 'PUT' });
      const result = await response.json();
      if (!result.success || !response.ok) throw new Error('Rejecting property failed');
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: 'success', text1: 'Property rejected' });
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleLogout = () => {
    // For web
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        console.log("Logging out...");
        dispatch(performLogout());
        router.replace('/(screens)');
      }
      return;
    }

    // For mobile (iOS/Android)
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log("Logging out...");
              await dispatch(performLogout()).unwrap();
              router.replace('/(screens)');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };
 
  const handleRemoveAdmin = async (adminId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/admin/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      Toast.show({ type: 'success', text1: 'Admin deleted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: error.message });
    }
  };
 
  const handleSectionChange = async (section) => {
    setActiveSection(section);
    await AsyncStorage.setItem('activeSection', section);
    // Close sidebar on mobile after selection
    if (!isTablet) {
      setSidebarVisible(false);
    }
  };
 
  const handleDeleteEnquiry = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/enquiry/${id}/delete`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok && data.success) {
        Toast.show({ type: 'success', text1: 'Enquiry deleted' });
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } else {
        Toast.show({ type: 'error', text1: data.message });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to delete enquiry' });
    }
  };
 
  const handleAcceptContractor = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/contractor/verify/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: 'success', text1: 'Contractor verified' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to verify contractor' });
    }
  };
 
  const handleRejectContractor = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/contractor/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: 'success', text1: 'Contractor rejected' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to reject contractor' });
    }
  };
 
  return (
    <View style={styles.wrapper}>
      <Navbar />
      <View style={styles.dashboardContainer}>
        <AdminSideBar
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
          handleShowModal={() => setShowModal(true)}
          handleLogout={handleLogout}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          isTablet={isTablet}
        />
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeSection === 'adminProfile' && <AdminProfile adminProfile={userData} />}
          {activeSection === 'adminDashUserDetails' && <AdminDashUserDetails adminProfile={userData} />}
          {activeSection === 'appointments' && (
            <AdminAppointment appointments={appointments} loading={loading} error={error} handleRemoveAppointment={handleRemoveAppointment} />
          )}
          {activeSection === 'propertyVerification' && (
            <AdminPropertyVerification
              properties={properties}
              loading={loading}
              error={error}
              handleAcceptProperty={handleAcceptProperty}
              handleRejectProperty={handleRejectProperty}
            />
          )}
          {activeSection === 'reviews' && (
            <AdminReviews reviews={reviews || []} adminId={userData?.adminId} />
          )}
          {activeSection === 'enquiries' && (
            <AdminEnquiries enquiries={enquiries} onDeleteEnquiry={handleDeleteEnquiry} />
          )}
          {activeSection === 'adminsList' && (
            <AdminList
              admins={admins}
              onAddAdminClick={() => setShowModal(true)}
              handleRemoveAdmin={handleRemoveAdmin}
              loading={loading}
              error={error}
            />
          )}
          {activeSection === 'staffManagement' && <StaffManagement />}
          {activeSection === 'staffPerformance' && <StaffPerformanceCategories />} 
          {activeSection === 'contractorVerification' && (
            <AdminContractorVerification
              contractors={contractors}
              loading={loading}
              error={error}
              handleAcceptContractor={handleAcceptContractor}
              handleRejectContractor={handleRejectContractor}
            />
          )}
        </ScrollView>
        <CustomModal show={showModal} handleClose={() => setShowModal(false)} />
      </View>
      <Toast />
    </View>
  );
};
 
const styles = StyleSheet.create({
  wrapper: { 
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  dashboardContainer: {
    flex: 1,
    flexDirection: isTablet ? 'row' : 'column',
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === 'web' ? 72 : 0,
  },
  content: { 
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  contentContainer: {
    padding: isTablet ? 16 : 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for home indicator on iOS
    minHeight: '100%'
  }
});
 
export default AdminDashboard;