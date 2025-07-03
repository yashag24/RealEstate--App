import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

const ContactForm = ({ userId, phone, propertyId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "", // Changed from "+91" to empty string for placeholder
    message: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validation: Check if country code is selected
      if (!formData.countryCode) {
        Alert.alert("Error", "Please select a country code");
        return;
      }

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: `${formData.countryCode}${formData.phone}`,
        messageEn: formData.message,
        userId: userId || null,
        isGuest: !userId,
        propertyId,
      };

      const response = await fetch(`${BASE_URL}/api/enquiry/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success", "Enquiry submitted successfully!");
        setFormData({ fullName: "", email: "", phone: "", countryCode: "", message: "" });
        setIsFormVisible(false);
      } else {
        Alert.alert("Error", data.message || "Failed to submit enquiry.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Contact & Enquiry</Text>
        <View style={styles.titleAccent} />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {/* WhatsApp Contact Card */}
        <View style={styles.whatsappCard}>
          <View style={styles.whatsappIconContainer}>
            <FontAwesome name="whatsapp" size={24} color="#ffffff" />
          </View>
          <Text style={styles.whatsappTitle}>WhatsApp</Text>
          <Text style={styles.whatsappSubtitle}>Quick Response</Text>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => Linking.openURL(`https://wa.me/+91${phone}`)}
          >
            <Text style={styles.whatsappButtonText}>Chat Now</Text>
          </TouchableOpacity>
        </View>

        {/* Enquiry Form Toggle Card */}
        <Pressable 
          style={[styles.toggleCard, isFormVisible && styles.toggleCardActive]} 
          onPress={() => setIsFormVisible(!isFormVisible)}
        >
          <View style={styles.toggleIconContainer}>
            <Text style={styles.toggleIcon}>
              {isFormVisible ? '📝' : '✉️'}
            </Text>
          </View>
          <Text style={styles.toggleTitle}>
            {isFormVisible ? 'Hide Form' : 'Send Enquiry'}
          </Text>
          <Text style={styles.toggleSubtitle}>
            {isFormVisible ? 'Close form' : 'Fill details'}
          </Text>
        </Pressable>

        {/* Form Card - Only visible when toggled */}
        {isFormVisible && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Get in Touch</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsFormVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                placeholder="Full Name"
                placeholderTextColor="#94a3b8"
              />
              
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Email Address"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
              />

              <View style={styles.phoneContainer}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeLabel}>
                    {formData.countryCode || 'Code'}
                  </Text>
                  <Picker
                    selectedValue={formData.countryCode}
                    style={styles.countryCodePicker}
                    onValueChange={(value) => handleChange('countryCode', value)}
                    dropdownIconColor="#64748b"
                  >
                    <Picker.Item 
                      label="Select Country Code" 
                      value="" 
                      color="#94a3b8"
                      enabled={false}
                    />
                    <Picker.Item label="+91 India" value="+91" />
                    <Picker.Item label="+1 United States" value="+1" />
                    <Picker.Item label="+44 United Kingdom" value="+44" />
                    <Picker.Item label="+61 Australia" value="+61" />
                    <Picker.Item label="+86 China" value="+86" />
                    <Picker.Item label="+81 Japan" value="+81" />
                    <Picker.Item label="+49 Germany" value="+49" />
                    <Picker.Item label="+33 France" value="+33" />
                    <Picker.Item label="+39 Italy" value="+39" />
                    <Picker.Item label="+34 Spain" value="+34" />
                  </Picker>
                </View>

                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  placeholder="Phone Number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                />
              </View>

              <TextInput
                style={[styles.input, styles.messageInput]}
                value={formData.message}
                onChangeText={(text) => handleChange('message', text)}
                placeholder="Your message (optional)"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Send Enquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#25d366',
    borderRadius: 2,
    marginLeft: 12,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 24,
    alignItems: 'flex-start',
  },

  // WhatsApp Card
  whatsappCard: {
    width: 140,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#25d366',
    shadowColor: '#25d366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  whatsappIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#25d366',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#25d366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  whatsappSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 12,
  },
  whatsappButton: {
    backgroundColor: '#25d366',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#25d366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Toggle Card
  toggleCard: {
    width: 140,
    height: 160,
    backgroundColor: '#fafafa',
    borderRadius: 32,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  toggleCardActive: {
    backgroundColor: '#ffffff',
    borderColor: '#8b5cf6',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  toggleIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toggleIcon: {
    fontSize: 24,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    width: 320,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 20,
    paddingTop: 10,
    marginBottom:8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    width: 28,
    height: 28,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    backgroundColor: '#fafafa',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    height: 48,
    justifyContent: 'center',
    minWidth: 80,
    position: 'relative',
  },
  countryCodeLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
  countryCodePicker: {
    width: 80,
    height: 48,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  messageInput: {
    height: 80,
    paddingTop: 14,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 2,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactForm;