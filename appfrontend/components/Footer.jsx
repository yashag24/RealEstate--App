import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@basilabode.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>BasilAbode</Text>
          <Text style={styles.description}>
            Your trusted partner in finding the perfect home. We connect you with the best properties and builders.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Properties</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Builders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>About Us</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
            <Ionicons name="mail" size={16} color="#666" />
            <Text style={styles.contactText}>info@basilabode.com</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePhonePress} style={styles.contactItem}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.contactText}>+91 12345 67890</Text>
          </TouchableOpacity>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.contactText}>Jaipur, Rajasthan, India</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialMedia}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://facebook.com')}
            >
              <Ionicons name="logo-facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://twitter.com')}
            >
              <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://instagram.com')}
            >
              <Ionicons name="logo-instagram" size={24} color="#e4405f" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://linkedin.com')}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © 2024 BasilAbode. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#2c3e50',
    paddingTop: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  description: {
    color: '#bdc3c7',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    color: '#bdc3c7',
    marginLeft: 8,
    fontSize: 14,
  },
  socialMedia: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    padding: 5,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#34495e',
    paddingVertical: 15,
    alignItems: 'center',
  },
  copyright: {
    color: '#95a5a6',
    fontSize: 12,
  },
});

export default Footer;