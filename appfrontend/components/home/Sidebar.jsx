import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Modal,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

const Sidebar = ({ visible, onClose, searchQuery, setSearchQuery, onSearch }) => {
  const [slideAnim] = useState(new Animated.Value(-280));
  const scrollViewRef = useRef(null);
  const router = useRouter();
  
  // Use a more robust approach to track sidebar state
  const sidebarState = useRef({
    isOpen: false,
    isAnimating: false,
    hasBeenOpened: false
  });

  // Memoize animation functions to prevent recreating them
  const openSidebar = useCallback(() => {
    if (sidebarState.current.isAnimating) return;
    
    sidebarState.current.isAnimating = true;
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      sidebarState.current.isAnimating = false;
      sidebarState.current.isOpen = true;
      sidebarState.current.hasBeenOpened = true;
    });
  }, [slideAnim]);

  const closeSidebar = useCallback(() => {
    if (sidebarState.current.isAnimating) return;
    
    sidebarState.current.isAnimating = true;
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      sidebarState.current.isAnimating = false;
      sidebarState.current.isOpen = false;
    });
  }, [slideAnim]);

  // Only handle actual visibility changes
  React.useEffect(() => {
    if (visible && !sidebarState.current.isOpen && !sidebarState.current.isAnimating) {
      openSidebar();
    } else if (!visible && sidebarState.current.isOpen && !sidebarState.current.isAnimating) {
      closeSidebar();
    }
  }, [visible, openSidebar, closeSidebar]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNavigation = useCallback((route) => {
    router.push(route);
    onClose();
  }, [router, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch();
    }
  }, [onSearch]);

  // Memoize the search query handler
  const handleSearchQueryChange = useCallback((text) => {
    setSearchQuery(text);
  }, [setSearchQuery]);

  // Memoize menu items to prevent recreation
  const menuItems = useMemo(() => [
    { route: '/(screens)/user', icon: 'home-outline', text: 'Home' },
    { route: '/(screens)/(property)/properties/rent', icon: 'add-circle-outline', text: 'Post Property' },
    { route: '/(screens)/services/title-search', icon: 'search-outline', text: 'Property Title Search' },
    { route: '/(screens)/services/pre-purchaseServices', icon: 'shield-checkmark-outline', text: 'Pre-Purchase Property Assistance' },
    { route: '/(screens)/services/post-purchaseServices', icon: 'checkmark-done-outline', text: 'Post-Purchase Property Services' },
    { route: '/(screens)/(services)/contractors', icon: 'hammer-outline', text: 'Contractors' },



    
    { route: '/(screens)/appointments', icon: 'calendar-outline', text: 'Appointments' },
    { route: '/(screens)/(property)/my-properties', icon: 'business-outline', text: 'My Properties' },
    { route: '/(screens)/(property)/past-searches', icon: 'time-outline', text: 'Past Searches' },
    { route: '/(screens)/(property)/previously-viewed', icon: 'eye-outline', text: 'Previously Viewed' },
    { route: '/(screens)/(property)/saved', icon: 'bookmark-outline', text: 'Saved' },
    { route: '/(screens)/(property)/contacted', icon: 'chatbubble-ellipses-outline', text: 'Contacted' },
    { route: '/(screens)/notifications', icon: 'notifications-outline', text: 'Notification' },
    { route: '/(screens)/logout', icon: 'log-out-outline', text: 'Logout' },

    // { route: '/(screens)/(services)/pre-purchaseServices', icon: 'checkmark-done-outline', text: 'Pre-Purchase Property Services' },
    // { route: '/(screens)/(profile)/profile', icon: 'person-outline', text: 'Profile' },
    // { route: '/(screens)/(help)/help', icon: 'help-circle-outline', text: 'Help' }, 
    { route: '/(screens)/(settings)/settings', icon: 'settings-outline', text: 'Settings' },
    { route: '/(screens)/(about)/about', icon: 'information-circle-outline', text: 'About' },
  ], []);

  const SidebarContent = React.memo(() => (
    <View style={styles.sidebarContent}>
      {/* Sidebar Header */}
      <View style={styles.sidebarHeader}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.sidebarLogo}
        />
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Section in Sidebar */}
      <View style={styles.sidebarSearchContainer}>
        <View style={styles.sidebarSearch}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.sidebarSearchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.sidebarSearchButton}
          >
            <Ionicons name="arrow-forward" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Navigation Menu */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollableMenuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContentContainer}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={100}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={10}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={`menu-${index}`}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons name={item.icon} size={24} color="#333" />
            <Text style={styles.menuText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fixed Sidebar Footer */}
      <View style={styles.sidebarFooter}>
        <Text style={styles.footerText}>BasilAbode v1.0</Text>
      </View>
    </View>
  ));

  // Don't render the modal if it's not visible to improve performance
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      hardwareAccelerated={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={handleClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
              zIndex: 10,
            },
          ]}
        >
          <SidebarContent />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
  },
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    width: 280,
    backgroundColor: '#fff',
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  sidebarLogo: {
    width: 100,
    height: 32,
    resizeMode: 'contain',
    tintColor: '#007bff',
  },
  closeButton: {
    padding: 4,
  },
  sidebarSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  sidebarSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  sidebarSearchButton: {
    padding: 8,
  },
  scrollableMenuContainer: {
    flex: 1,
  },
  menuContentContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default Sidebar;