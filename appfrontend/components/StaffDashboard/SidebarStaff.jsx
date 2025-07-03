import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//import { FaHome, FaUsers, FaBell, FaSignOutAlt } from 'react-icons/fa';

const SidebarStaff = ({ onSelect, selectedOption, menuOptions }) => {
  return (
    <View style={styles.sidebarContainerStaff}>
      <View style={styles.sidebarMenuStaff}>
        {menuOptions.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.sidebarOptionStaff,
              selectedOption === item.key && styles.sidebarActiveStaff,
            ]}
            onPress={() => onSelect(item.key)}
          >
            <View style={styles.sidebarIconStaff}>{item.icon}</View>
            <Text style={styles.sidebarLabelStaff}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainerStaff: {
    width: 250,
    minHeight: '100%',
    marginTop: 90,
    backgroundColor: '#1d3557', // Use gradient alternative with libraries (see note)
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5, // Android shadow
    zIndex: 100,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  sidebarMenuStaff: {
    flexDirection: 'column',
    gap: 24, // You may need to add marginBottom manually per item instead of gap
    flex: 1,
    paddingTop: 20,
  },

  sidebarOptionStaff: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 15.5,
    marginBottom: 10,
  },

  sidebarActiveStaff: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
  },

  sidebarIconStaff: {
    fontSize: 18,
    marginRight: 12,
  },

  sidebarLabelStaff: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15.5,
  },
});


export default SidebarStaff;