import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

import Footer from '../home/Footer';


const { width, height } = Dimensions.get('window');

const PrePurchaseServices = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submittedEnquiryId, setSubmittedEnquiryId] = useState(null);
    const [formData, setFormData] = useState({
        FullName: "",
        Email: "",
        Phone: "",
        Address: "",
        MessageOrPropertyDetails: "",
    });
    const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;





    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/api/Pre-Purchase-Property-Verification/create-enquiry`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Enquiry submitted successfully!',
                });
                setFormData({
                    FullName: "",
                    Email: "",
                    Phone: "",
                    Address: "",
                    MessageOrPropertyDetails: "",
                });
                setSubmittedEnquiryId(data.requestId);
                setIsModalOpen(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            console.error("Submit error:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Server error. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const services = [
        {
            icon: "clipboard",
            title: "Document Verification",
            items: [
                "Sale & Mother Deed Validation",
                "Encumbrance & Liabilities Check",
                "Title & Possession Documentation",
                "Urban Planning Compliance"
            ]
        },
        {
            icon: "gavel",
            title: "Legal Assessment",
            items: [
                "Ownership & Title Chain Review",
                "Dispute & Govt Acquisition Check",
                "Legal Heirship Verification",
                "Local Approvals Examination"
            ]
        },
        {
            icon: "shield",
            title: "Technical Due Diligence",
            items: [
                "Site Visit & Measurement Verification",
                "Structural Stability Check",
                "Utility & Drainage Access",
                "Encroachment & Environmental Check"
            ]
        }
    ];

    const highlights = [
        "Handled by expert legal and engineering professionals",
        "End-to-end risk mitigation for smart investment",
        "Detailed verification reports within 5-7 days",
        "Full transparency, confidentiality, and reliability"
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* <Navbar navigation={navigation} /> */}

            {submittedEnquiryId && (
                <View style={styles.successBox}>
                    <Text style={styles.successText}>
                        ✅ <Text style={styles.successBold}>Your Request ID:</Text> {submittedEnquiryId}
                    </Text>
                    <Text style={styles.successNote}>Please save this for future reference.</Text>
                    <TouchableOpacity
                        style={styles.successCloseBtn}
                        onPress={() => setSubmittedEnquiryId(null)}
                        activeOpacity={0.7}
                    >

                        <Ionicons name="close" size={16} color="#dc2626" />
                    </TouchableOpacity>
                </View>
            )}
            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Section */}
                <LinearGradient
                    colors={['#2563eb', '#1d4ed8']}
                    style={styles.heroSection}
                >
                    <View style={styles.heroOverlay}>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>Pre-Purchase Property Verification</Text>
                            <Text style={styles.heroText}>
                                Comprehensive legal and technical checks to safeguard your property investment before you buy.
                            </Text>
                            <TouchableOpacity
                                style={styles.heroButton}
                                onPress={() => setIsModalOpen(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.heroButtonText}>Enquire Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>


                {/* Services Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Our Core Services</Text>

                    <View style={styles.servicesList}>
                        {services.map((service, index) => (
                            <View key={index} style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <FontAwesome name={service.icon} size={32} color="#2563eb" />
                                </View>
                                <Text style={styles.serviceTitle}>{service.title}</Text>
                                <View style={styles.serviceItems}>
                                    {service.items.map((item, itemIndex) => (
                                        <View key={itemIndex} style={styles.serviceItem}>
                                            <FontAwesome name="check" size={16} color="#22c55e" />
                                            <Text style={styles.serviceItemText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Why Choose Us Section */}
                <View style={styles.highlightsSection}>
                    <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                    <View style={styles.highlightsList}>
                        {highlights.map((highlight, index) => (
                            <View key={index} style={styles.highlightItem}>
                                <FontAwesome name="check-circle" size={20} color="#22c55e" />
                                <Text style={styles.highlightText}>{highlight}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >


                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Request a Service</Text>
                                <TouchableOpacity
                                    style={styles.modalCloseBtn}
                                    onPress={() => setIsModalOpen(false)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={styles.modalForm}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>
                                        <MaterialIcons name="person" size={16} color="#374151" /> Full Name *
                                    </Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.FullName}
                                        onChangeText={(text) => setFormData({ ...formData, FullName: text })}
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#9ca3af"
                                        autoCapitalize="words"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>
                                        <MaterialIcons name="email" size={16} color="#374151" /> Email Address *
                                    </Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.Email}
                                        onChangeText={(text) => setFormData({ ...formData, Email: text })}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>
                                        <MaterialIcons name="phone" size={16} color="#374151" /> Phone Number *
                                    </Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.Phone}
                                        onChangeText={(text) => setFormData({ ...formData, Phone: text })}
                                        placeholder="Enter your phone number"
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>
                                        <MaterialIcons name="location-on" size={16} color="#374151" /> Address *
                                    </Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.Address}
                                        onChangeText={(text) => setFormData({ ...formData, Address: text })}
                                        placeholder="Enter your address"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Message / Property Details</Text>
                                    <TextInput
                                        style={[styles.formInput, styles.textArea]}
                                        value={formData.MessageOrPropertyDetails}
                                        onChangeText={(text) => setFormData({ ...formData, MessageOrPropertyDetails: text })}
                                        placeholder="Enter property details or message"
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {loading ? "Submitting..." : "Submit Request"}
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    successBox: {
        backgroundColor: '#f0fdf4',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        margin: 16,
        position: 'relative',
    },
    successText: {
        color: '#15803d',
        fontSize: 16,
        marginBottom: 8,
    },
    successBold: {
        fontWeight: 'bold',
    },
    successNote: {
        color: '#15803d',
        fontSize: 14,
        opacity: 0.8,
    },
    successCloseBtn: {
        position: 'absolute',
        top: 8,
        right: 12,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        height: 320,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 350,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
    },
    heroText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
        opacity: 0.9,
    },
    heroButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    heroButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    servicesSection: {
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#1f2937',
    },
    servicesList: {
        gap: 20,
    },
    serviceCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    serviceIconContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#1f2937',
    },
    serviceItems: {
        gap: 12,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 4,
    },
    serviceItemText: {
        fontSize: 14,
        marginLeft: 12,
        color: '#4b5563',
        flex: 1,
        lineHeight: 20,
    },
    highlightsSection: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    highlightsList: {
        gap: 16,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
    },
    highlightText: {
        fontSize: 16,
        marginLeft: 16,
        color: '#4b5563',
        flex: 1,
        lineHeight: 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    modalCloseBtn: {
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalForm: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    formGroup: {
        marginBottom: 18,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#93c5fd',
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PrePurchaseServices;