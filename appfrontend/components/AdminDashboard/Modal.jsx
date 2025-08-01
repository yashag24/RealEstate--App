import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const CustomModal = ({ show, handleClose, onAdminAdded }) => {
  const [addAdmin, setAddAdmin] = useState({ adminId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Animation values
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [modalScale] = useState(new Animated.Value(0.8));
  const [modalTranslateY] = useState(new Animated.Value(50));

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const baseUrl = `${BASE_URL}/api/admin/signup`;

  useEffect(() => {
    if (show) {
      // Reset form when modal opens
      setAddAdmin({ adminId: "", password: "" });
      setErrors({});
      setShowPassword(false);
      
      // Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      overlayOpacity.setValue(0);
      modalScale.setValue(0.8);
      modalTranslateY.setValue(50);
    }
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!addAdmin.adminId.trim()) {
      newErrors.adminId = "Admin ID is required";
    } else if (addAdmin.adminId.length < 3) {
      newErrors.adminId = "Admin ID must be at least 3 characters";
    }
    
    if (!addAdmin.password.trim()) {
      newErrors.password = "Password is required";
    } else if (addAdmin.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateToken = async (token) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }

      // Basic token validation for JWT tokens
      if (token.includes('.')) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new Error('Token expired');
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      // Enhanced token validation
      const isValidToken = await validateToken(token);
      if (!isValidToken) {
        Toast.show({ 
          type: "error", 
          text1: "Authentication Error",
          text2: "Session expired. Please log in again." 
        });
        return;
      }

      console.log('Submitting admin data:', { 
        adminId: addAdmin.adminId, 
        passwordLength: addAdmin.password.length 
      });

      const response = await axios.post(baseUrl, addAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('API Response:', response.status, response.data);

      // Check for successful response
      if (response.status === 200 || response.status === 201) {
        Toast.show({ 
          type: "success", 
          text1: "Success!",
          text2: "Admin added successfully" 
        });
        
        // Notify parent component to refresh the admin list
        if (onAdminAdded && typeof onAdminAdded === 'function') {
          onAdminAdded(response.data); // Pass the new admin data if available
        }
        
        // Close modal after successful submission
        handleClose();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Add Admin Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Message:', error.message);
      
      let errorMessage = "Adding Admin failed";
      
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        "Invalid admin data provided";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage = "Permission denied. You don't have admin privileges.";
        } else if (error.response.status === 409) {
          errorMessage = "Admin ID already exists. Please choose a different ID.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout
        errorMessage = "Request timeout. Please try again.";
      } else {
        // Something else happened
        errorMessage = error.message || "Adding Admin failed";
      }
      
      Toast.show({ 
        type: "error", 
        text1: "Error",
        text2: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAddAdmin({ ...addAdmin, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const closeModal = () => {
    if (loading) return; // Prevent closing while loading
    
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleClose();
    });
  };

  return (
    <Modal visible={show} transparent animationType="none" onRequestClose={closeModal}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View 
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Pressable 
            style={styles.overlayPress} 
            onPress={closeModal}
            disabled={loading}
          />
          
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              style={[
                styles.modalContainer,
                {
                  transform: [
                    { scale: modalScale },
                    { translateY: modalTranslateY },
                  ],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerGradient} />
                <View style={styles.headerContent}>
                  <View style={styles.headerIconContainer}>
                    <FontAwesome5 name="user-plus" size={20} color="#ffffff" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Add New Admin</Text>
                    <Text style={styles.headerSubtitle}>Create administrator account</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={closeModal} 
                    style={styles.closeButton}
                    disabled={loading}
                  >
                    <FontAwesome5 name="times" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Content */}
              <View style={styles.formContainer}>
                {/* Admin ID Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="user" size={14} color="#475569" /> Admin ID
                  </Text>
                  <View style={[styles.inputContainer, errors.adminId && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      value={addAdmin.adminId}
                      onChangeText={(text) => handleChange("adminId", text)}
                      placeholder="Enter unique admin ID"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <FontAwesome5 name="id-card" size={16} color="#94a3b8" />
                  </View>
                  {errors.adminId && (
                    <Text style={styles.errorText}>{errors.adminId}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="lock" size={14} color="#475569" /> Password
                  </Text>
                  <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      value={addAdmin.password}
                      secureTextEntry={!showPassword}
                      onChangeText={(text) => handleChange("password", text)}
                      placeholder="Enter secure password"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      disabled={loading}
                    >
                      <FontAwesome5 
                        name={showPassword ? "eye-slash" : "eye"} 
                        size={16} 
                        color="#94a3b8" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Security Note */}
                <View style={styles.securityNote}>
                  <FontAwesome5 name="shield-alt" size={14} color="#059669" />
                  <Text style={styles.securityNoteText}>
                    Password must be at least 6 characters long
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={closeModal} 
                    style={[styles.button, styles.cancelButton]}
                    disabled={loading}
                  >
                    <Text style={[styles.cancelButtonText, loading && styles.disabledText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={onSubmit} 
                    style={[
                      styles.button, 
                      styles.submitButton,
                      loading && styles.disabledButton
                    ]}
                    disabled={loading}
                  >
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <FontAwesome5 name="spinner" size={16} color="#ffffff" />
                        <Text style={styles.submitButtonText}>Adding...</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <FontAwesome5 name="plus" size={16} color="#ffffff" />
                        <Text style={styles.submitButtonText}>Add Admin</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: isTablet ? Math.min(500, width * 0.8) : width * 0.9,
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  // Header Styles
  header: {
    position: 'relative',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#475569',
    overflow: 'hidden',
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
    zIndex: 1,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTextContainer: {
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Form Styles
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#166534',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
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
  cancelButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#475569',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default CustomModal;