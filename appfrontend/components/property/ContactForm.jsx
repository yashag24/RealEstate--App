import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

const ContactForm = ({ userId, phone, propertyId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    message: "",
  });

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
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
        setFormData({ fullName: "", email: "", phone: "", countryCode: "+91", message: "" });
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
    <ScrollView contentContainerStyle={styles.WhatsappContact}>
      <View style={styles.contactContainer}>

        <View style={styles.whatsappSection}>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => Linking.openURL(`https://wa.me/${phone}`)}
          >
            <FontAwesome name="whatsapp" size={24} style={styles.whatsappIcon} />
            <Text style={styles.whatsappNumber}>{phone}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.enquiryText}>Or Submit an enquiry</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            placeholder="Full Name"
          />
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Email"
            keyboardType="email-address"
          />

          <View style={styles.phoneContainer}>
            <Picker
              selectedValue={formData.countryCode}
              style={styles.countryCodePicker}
              onValueChange={(value) => handleChange('countryCode', value)}
            >
              <Picker.Item label="+91" value="+91" />
              <Picker.Item label="+1" value="+1" />
              <Picker.Item label="+44" value="+44" />
              <Picker.Item label="+61" value="+61" />
            </Picker>

            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Number"
              keyboardType="phone-pad"
            />
          </View>

          <TextInput
            style={styles.input}
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            placeholder="Your message (optional)"
            multiline
            numberOfLines={5}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Send Enquiry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  WhatsappContact: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contactContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.168,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  whatsappSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25d366',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 75,
  },
  whatsappIcon: {
    marginRight: 15,
  },
  whatsappNumber: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  enquiryText: {
    margin: 10,
    fontSize: 20,
    color: '#555',
  },
  form: {
    width: '100%',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryCodePicker: {
    width: 100,
    marginRight: 15,
  },
  btn: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ContactForm;
