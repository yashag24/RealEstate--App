import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { initializeAuth, login, signup } from '@/redux/Auth/AuthSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginPopup = ({ visible = true, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { authUser, userType, isLoading, error: authError } = useSelector((state) => state.auth);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (basic validation)
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  // Clear form data
  const clearForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setRole('');
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
  }, []);

  // Handle authentication check and navigation
  useEffect(() => {
    dispatch(initializeAuth());
    console.log('Initializing authentication...');
  }, [dispatch]);

  // Handle authentication state changes
  useEffect(() => {
    // If we have an authenticated user and the popup is visible
    if (authUser && userType && visible && !isLoading) {
      setLoading(false);
      
      // Show success message
      if (userType === "admin") {
        router.push("/(screens)/admin");
      } else if (userType === "staff") {
        router.push("/(screens)/staff");
      } else if (userType === "user") {
        router.push("/(screens)/user");
      }

      onClose?.();

      Alert.alert(
        'Success!',
        `Welcome ${authUser.name || authUser.email}!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              clearForm();
              onClose?.();
            }
          }
        ],
        { cancelable: false }
      );
    }
    
    // Handle authentication errors from Redux state
    if (authError && visible && loading) {
      setLoading(false);
      
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (typeof authError === 'string') {
        errorMessage = authError;
      } else if (authError.message) {
        errorMessage = authError.message;
      } else if (authError.error) {
        errorMessage = authError.error;
      }

      Alert.alert(
        'Authentication Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  }, [authUser, userType, visible, isLoading, authError, loading, onClose, router, clearForm]);

  // Sync loading state with Redux loading state
  useEffect(() => {
    if (isLoading && !loading) {
      setLoading(true);
    } else if (!isLoading && loading && !authUser) {
      // Only stop loading if not authenticated (to prevent premature stop)
      setLoading(false);
    }
  }, [isLoading, loading, authUser]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && !validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Signup specific validations
    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      }

      if (!phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (!role.trim()) {
        newErrors.role = 'Role is required';
      } else if (!['admin', 'user', 'staff'].includes(role.toLowerCase())) {
        newErrors.role = 'Role must be admin, user, or staff';
      }

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setLoading(true);
    
    let credentials;
    
    if (isLogin) {
      credentials = { email, password };
      dispatch(login(credentials));
    } else {
      credentials = {
        email,
        password,
        name,
        role
      };
      dispatch(signup(credentials));
    }
  };

  // Toggle between login and signup modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  // Handle modal close
  const handleClose = () => {
    if (loading) {
      Alert.alert(
        'Please Wait',
        'Authentication in progress. Please wait...',
        [{ text: 'OK' }]
      );
      return;
    }
    
    clearForm();
    onClose?.();
  };

  // Render input field with error handling
  const renderInputField = (props) => {
    const { 
      icon, 
      placeholder, 
      value, 
      onChangeText, 
      keyboardType, 
      autoCapitalize, 
      secureTextEntry, 
      errorKey,
      showToggle,
      toggleValue,
      onToggle
    } = props;

    return (
      <View style={styles.fieldContainer}>
        <View style={[
          styles.inputContainer,
          errors[errorKey] && styles.inputContainerError
        ]}>
          <Ionicons name={icon} size={20} color={errors[errorKey] ? "#e74c3c" : "#666"} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            editable={!loading}
          />
          {showToggle && (
            <TouchableOpacity
              onPress={onToggle}
              style={styles.eyeButton}
              disabled={loading}
            >
              <Ionicons
                name={toggleValue ? 'eye-off' : 'eye'}
                size={20}
                color={errors[errorKey] ? "#e74c3c" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>
        {errors[errorKey] && (
          <Text style={styles.errorText}>{errors[errorKey]}</Text>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <TouchableOpacity 
                onPress={handleClose} 
                style={styles.closeButton}
                disabled={loading}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.form}>
                {!isLogin && renderInputField({
                  icon: "person-outline",
                  placeholder: "Full Name",
                  value: name,
                  onChangeText: setName,
                  autoCapitalize: "words",
                  errorKey: "name"
                })}

                {renderInputField({
                  icon: "mail-outline",
                  placeholder: "Email Address",
                  value: email,
                  onChangeText: setEmail,
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  errorKey: "email"
                })}

                {!isLogin && renderInputField({
                  icon: "call-outline",
                  placeholder: "Phone Number",
                  value: phone,
                  onChangeText: setPhone,
                  keyboardType: "phone-pad",
                  errorKey: "phone"
                })}

                {!isLogin && renderInputField({
                  icon: "briefcase-outline",
                  placeholder: "Role (admin, user, or staff)",
                  value: role,
                  onChangeText: setRole,
                  autoCapitalize: "none",
                  errorKey: "role"
                })}

                {renderInputField({
                  icon: "lock-closed-outline",
                  placeholder: "Password",
                  value: password,
                  onChangeText: setPassword,
                  autoCapitalize: "none",
                  secureTextEntry: !showPassword,
                  errorKey: "password",
                  showToggle: true,
                  toggleValue: showPassword,
                  onToggle: () => setShowPassword(!showPassword)
                })}

                {!isLogin && renderInputField({
                  icon: "lock-closed-outline",
                  placeholder: "Confirm Password",
                  value: confirmPassword,
                  onChangeText: setConfirmPassword,
                  autoCapitalize: "none",
                  secureTextEntry: !showConfirmPassword,
                  errorKey: "confirmPassword",
                  showToggle: true,
                  toggleValue: showConfirmPassword,
                  onToggle: () => setShowConfirmPassword(!showConfirmPassword)
                })}

                {isLogin && (
                  <TouchableOpacity 
                    style={styles.forgotPassword}
                    disabled={loading}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.submitButton, 
                    loading && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.submitButtonText}>
                        {isLogin ? 'Logging in...' : 'Creating account...'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isLogin ? 'Login' : 'Sign Up'}
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity 
                    style={styles.socialButton}
                    disabled={loading}
                  >
                    <Ionicons name="logo-google" size={20} color="#db4437" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.socialButton}
                    disabled={loading}
                  >
                    <Ionicons name="logo-facebook" size={20} color="#3b5998" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity 
                    onPress={toggleMode}
                    disabled={loading}
                  >
                    <Text style={[
                      styles.footerLink,
                      loading && styles.disabledText
                    ]}>
                      {isLogin ? 'Sign Up' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: screenWidth > 400 ? 400 : screenWidth - 32,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 56,
  },
  inputContainerError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
    borderRadius: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 56,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#666',
    fontSize: 14,
    backgroundColor: '#fff',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    minHeight: 50,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#ccc',
  },
});

export default LoginPopup;