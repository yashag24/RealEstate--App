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
import { router } from 'expo-router';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';



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

     const handleGoHome = () => {
        router.back();
      };





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
           
            
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleGoHome}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pre-Purchase Services</Text>
                <View style={styles.headerRight} />
            </View>

            {submittedEnquiryId && (
                <View style={styles.successBox}>
                    <View style={styles.successContent}>
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        <View style={styles.successTextContainer}>
                            <Text style={styles.successText}>
                                <Text style={styles.successBold}>Request ID:</Text> {submittedEnquiryId}
                            </Text>
                            <Text style={styles.successNote}>Please save this for future reference.</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.successCloseBtn}
                        onPress={() => setSubmittedEnquiryId(null)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={18} color="#6b7280" />
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
                    colors={['#1e40af', '#3b82f6', '#60a5fa']}
                    style={styles.heroSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.heroOverlay}>
                        <View style={styles.heroContent}>
                            <View style={styles.heroIconContainer}>
                                <FontAwesome name="shield" size={40} color="#ffffff" />
                            </View>
                            <Text style={styles.heroTitle}>Pre-Purchase Property Verification</Text>
                            <Text style={styles.heroText}>
                                Comprehensive legal and technical checks to safeguard your property investment before you buy.
                            </Text>
                           
                        </View>
                    </View>
                </LinearGradient>

                {/* Services Section */}
                <View style={styles.servicesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Our Core Services</Text>
                        <Text style={styles.sectionSubtitle}>Comprehensive property verification solutions</Text>
                    </View>

                    <View style={styles.servicesList}>
                        {services.map((service, index) => (
                            <View key={index} style={styles.serviceCard}>
                                <View style={styles.serviceHeader}>
                                    <View style={styles.serviceIconContainer}>
                                        <FontAwesome name={service.icon} size={28} color="#2563eb" />
                                    </View>
                                    <Text style={styles.serviceTitle}>{service.title}</Text>
                                </View>
                                <View style={styles.serviceItems}>
                                    {service.items.map((item, itemIndex) => (
                                        <View key={itemIndex} style={styles.serviceItem}>
                                            <View style={styles.checkIconContainer}>
                                                <Ionicons name="checkmark" size={16} color="#10b981" />
                                            </View>
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
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                        <Text style={styles.sectionSubtitle}>Your trusted partner in property investment</Text>
                    </View>
                    <View style={styles.highlightsList}>
                        {highlights.map((highlight, index) => (
                            <View key={index} style={styles.highlightItem}>
                                <View style={styles.highlightIconContainer}>
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                                </View>
                                <Text style={styles.highlightText}>{highlight}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <LinearGradient
                        colors={['#f8fafc', '#f1f5f9']}
                        style={styles.ctaCard}
                    >
                        <Text style={styles.ctaTitle}>Ready to Secure Your Investment?</Text>
                        <Text style={styles.ctaText}>
                            Get professional property verification services from our expert team.
                        </Text>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => setIsModalOpen(true)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.ctaButtonText}>Request Service</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>

            {/* Enhanced Modal */}
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
                            <LinearGradient
                                colors={['#2563eb', '#3b82f6']}
                                style={styles.modalHeader}
                            >
                                <Text style={styles.modalTitle}>Request a Service</Text>
                                <TouchableOpacity
                                    style={styles.modalCloseBtn}
                                    onPress={() => setIsModalOpen(false)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </LinearGradient>

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
                                    {!loading && <Ionicons name="send" size={16} color="#ffffff" style={styles.submitButtonIcon} />}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#8a8676ff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerRight: {
        width: 40,
    },
    successBox: {
        backgroundColor: '#f0fdf4',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    successContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    successTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    successText: {
        color: '#065f46',
        fontSize: 16,
        marginBottom: 4,
    },
    successBold: {
        fontWeight: '700',
    },
    successNote: {
        color: '#047857',
        fontSize: 14,
        opacity: 0.8,
    },
    successCloseBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        width: 28,
        height: 28,
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
        height: 360,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    heroIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 50,
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
    },
    heroText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        opacity: 0.95,
    },
    heroButton: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    heroButtonText: {
        color: '#1e40af',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    heroButtonIcon: {
        marginLeft: 4,
    },
    servicesSection: {
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1f2937',
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
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
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    serviceHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    serviceIconContainer: {
        backgroundColor: '#eff6ff',
        padding: 16,
        borderRadius: 50,
        marginBottom: 12,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1f2937',
    },
    serviceItems: {
        gap: 14,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkIconContainer: {
        backgroundColor: '#f0fdf4',
        padding: 4,
        borderRadius: 12,
        marginRight: 12,
        marginTop: 2,
    },
    serviceItemText: {
        fontSize: 15,
        color: '#4b5563',
        flex: 1,
        lineHeight: 22,
    },
    highlightsSection: {
        padding: 24,
        backgroundColor: '#ffffff',
    },
    highlightsList: {
        gap: 16,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    highlightIconContainer: {
        marginRight: 16,
        marginTop: 2,
    },
    highlightText: {
        fontSize: 16,
        color: '#374151',
        flex: 1,
        lineHeight: 24,
        fontWeight: '500',
    },
    ctaSection: {
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    ctaCard: {
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    ctaText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    ctaButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    ctaButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
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
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    modalCloseBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
        marginBottom: 20,
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
        padding: 14,
        fontSize: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        shadowColor: '#2563eb',
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
        marginRight: 8,
    },
    submitButtonIcon: {
        marginLeft: 4,
    },
});

export default PrePurchaseServices;