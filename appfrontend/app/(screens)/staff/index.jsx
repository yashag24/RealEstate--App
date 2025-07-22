import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Platform,
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  SafeAreaView,
  Animated,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, performLogout } from '@/redux/Auth/AuthSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import jwtDecode from 'jwt-decode';

import StaffSideBar from '@/components/StaffDashboard/SidebarStaff';
import StaffProfile from '@/components/StaffDashboard/StaffProfile';
import StaffManagedUsers from '@/components/StaffDashboard/StaffManagedUsers';
import StaffManagedAppointments from '@/components/StaffDashboard/StaffManagedAppointments';
import StaffVerifyProperties from '@/components/StaffDashboard/StaffVerifyProperties';
import StaffTitleSearch from '@/components/StaffDashboard/StaffTitleSearch';
import StaffPrePurchaseProVer from '@/components/StaffDashboard/StaffPrePurchaseProVer';
import StaffSalesTargetManagement from '@/components/StaffDashboard/StaffSalesTargetManagement';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [staffData, setStaffData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [titleSearchRequest, setTitleSearchRequest] = useState([]);
  const [prePurchaseRequest, setPrePurchaseRequest] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salesTargets, setSalesTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerAnimation] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  const router = useRouter();
  const { authUser, userType } = useSelector((state) => state.auth);
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Header animation
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Get section display info with enhanced details
  const getSectionInfo = () => {
    const sectionMap = {
      'profile': { 
        title: 'Staff Profile',
        subtitle: 'Manage your profile settings',
        icon: 'user-circle',
        color: '#10b981',
        stats: null
      },
      'usersDetails': { 
        title: 'Users Details',
        subtitle: 'View and manage user information',
        icon: 'users',
        color: '#3b82f6',
        stats: userData.length,
      },
      'appointments': { 
        title: 'Appointments',
        subtitle: 'Manage customer appointments',
        icon: 'calendar-check',
        color: '#8b5cf6',
        stats: appointments.length
      },
      'properties': { 
        title: 'Property Verification',
        subtitle: 'Review and verify properties',
        icon: 'home',
        color: '#f59e0b',
        stats: properties.length
      },
      'title-search': { 
        title: 'Title Search',
        subtitle: 'Manage title search requests',
        icon: 'search',
        color: '#ef4444',
        stats: titleSearchRequest.length,
      },
      'pre-purchase-property-verification': { 
        title: 'Pre-Purchase',
        subtitle: 'Handle property verification requests',
        icon: 'file-signature',
        stats: prePurchaseRequest.length,
        color: '#06b6d4',
      },
      'sales-target-management': { 
        title: 'Sales Targets',
        subtitle: 'Track and manage sales performance',
        icon: 'chart-line',
        stats: salesTargets.length,
        color: '#dc2626',
      },
    };
    return sectionMap[activeSection] || { 
      title: 'Staff Dashboard', 
      subtitle: 'Welcome back',
      icon: 'tachometer-alt',
      color: '#6366f1',
      stats: null
    };
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (userType !== 'staff' || !authUser) {
      router.replace('/(screens)');
    }
  }, [authUser, router, userType]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (authUser && userType === 'staff') {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) return router.replace('/(screens)/staff');

          const decoded = jwtDecode(token);
          setStaffData(decoded);

          await Promise.all([
            fetchUserDetails(token),
            fetchSalesData(token),
            fetchData(token),
          ]);

          const savedSection = await AsyncStorage.getItem('activeSection') || 'profile';
          setActiveSection(savedSection);
        } catch (err) {
          console.error('Init error:', err);
          setError(err.message);
          Toast.show({
            type: 'error',
            text1: 'Failed to load dashboard',
            text2: err.message,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllData();
  }, [authUser, userType, router]);

  const fetchUserDetails = async (token) => {
    const res = await fetch(`${BASE_URL}/api/staff/users-details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setUserData(data.usersData);
    else throw new Error(data.error || 'User fetch failed');
  };

  const fetchSalesData = async (token) => {
    const [empRes, salesRes] = await Promise.all([
      fetch(`${BASE_URL}/api/staff/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/api/staff/sales-targets`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const empData = await empRes.json();
    const salesData = await salesRes.json();
    if (empData.success) setEmployees(empData.employees);
    if (salesData.success) setSalesTargets(salesData.salesTargets);
  };

  const fetchData = async (token) => {
    const [appointmentsRes, propertiesRes, titleSearchRes, prePurchaseRes] = await Promise.all([
      fetch(`${BASE_URL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BASE_URL}/api/property/verification`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BASE_URL}/api/title-search/list`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BASE_URL}/api/Pre-Purchase-Property-Verification/list`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const appointmentsData = await appointmentsRes.json();
    const propertiesData = await propertiesRes.json();
    const titleSearchData = await titleSearchRes.json();
    const prePurchaseData = await prePurchaseRes.json();

    if (appointmentsData.success) setAppointments(appointmentsData.appointments);
    if (propertiesData.success) setProperties(propertiesData.property_verify);
    if (titleSearchData.success) setTitleSearchRequest(titleSearchData.allRequests);
    if (prePurchaseData.success) setPrePurchaseRequest(prePurchaseData.allRequests);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        dispatch(performLogout());
        router.replace('/(screens)');
      }
      return;
    }

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

  const handleSectionChange = async (section) => {
    setActiveSection(section);
    await AsyncStorage.setItem('activeSection', section);
    if (!isTablet) setSidebarVisible(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    const sectionInfo = getSectionInfo();

    switch (activeSection) {
      case 'profile':
        return <StaffProfile staff={staffData} />;
      case 'usersDetails':
        return <StaffManagedUsers userDetails={userData} />;
      case 'appointments':
        return <StaffManagedAppointments appointments={appointments} />;
      case 'properties':
        return <StaffVerifyProperties properties={properties} />;
      case 'title-search':
        return <StaffTitleSearch titleSearchRequest={titleSearchRequest} />;
      case 'pre-purchase-property-verification':
        return <StaffPrePurchaseProVer prePurchaseRequest={prePurchaseRequest} />;
      case 'sales-target-management':
        return <StaffSalesTargetManagement employees={employees} salesTargets={salesTargets} />;
      default:
        return <Text>Select an option</Text>;
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <View style={styles.wrapper}>
      {/* Enhanced Header */}
      <Animated.View 
        style={[
          styles.headerSection,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerGradient} />
        
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Left Section - Menu & User Info */}
          <View style={styles.headerLeft}>
            {!isTablet && (
              <Pressable 
                style={styles.menuButton} 
                onPress={() => setSidebarVisible(!sidebarVisible)}
              >
                <FontAwesome5 name="bars" size={18} color="#ffffff" />
              </Pressable>
            )}
            
            <View style={styles.userWelcome}>
              <Text style={styles.greetingText}>
                {getGreeting()}, {staffData?.name || 'Staff'}!
              </Text>
              <Text style={styles.dateTimeText}>
                {currentTime.toLocaleDateString()} • {formatTime(currentTime)}
              </Text>
            </View>
          </View>

          {/* Right Section - Actions */}
          <View style={styles.headerRight}>
            <Pressable 
              style={styles.headerActionButton} 
              onPress={handleLogout}
            >
              <FontAwesome5 name="sign-out-alt" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Section Info */}
        <View style={styles.sectionInfoContainer}>
          <View style={styles.sectionIconContainer}>
            <FontAwesome5 
              name={sectionInfo.icon} 
              size={20} 
              color={sectionInfo.color} 
            />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{sectionInfo.title}</Text>
            <Text style={styles.headerSubtitle}>{sectionInfo.subtitle}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Dashboard Content */}
      <View style={styles.dashboardContainer}>
        <StaffSideBar
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
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
          {renderContent()}
        </ScrollView>
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
  
  // Header Styles
  headerSection: {
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 35 : (StatusBar.currentHeight || 0) + 5,
    paddingBottom: 15,
    backgroundColor: '#475569',
    overflow: 'hidden',
    zIndex: 1000,
    minHeight: width <= 480 ? 140 : 100,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#334155',
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 50,
  },
  
  // Header Left Section
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userWelcome: {
    marginLeft: 8,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  dateTimeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginTop: 1,
  },

  // Header Right Section
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Section Info
  sectionInfoContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '400',
  },

  // Dashboard Layout
  dashboardContainer: {
    flex: 1,
    flexDirection: isTablet ? 'row' : 'column',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: isTablet ? 16 : 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#64748b',
  },
});

export default StaffDashboard;