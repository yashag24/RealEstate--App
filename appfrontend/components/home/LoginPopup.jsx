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
  StatusBar,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Vibration,
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animations
  const slideAnim = useState(new Animated.Value(screenHeight))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { authUser, userType, isLoading, error: authError } = useSelector((state) => state.auth);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
      setFocusedInput(null);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(screenHeight);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  // Enhanced form validation with real-time feedback
  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (!isLogin && !validatePassword(value)) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (!validateName(value)) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Invalid phone number format';
        }
        break;
      case 'role':
        if (!value.trim()) {
          error = 'Role is required';
        } else if (!['admin', 'user', 'staff'].includes(value.toLowerCase())) {
          error = 'Role must be admin, user, or staff';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = 'Please confirm your password';
        } else if (password !== value) {
          error = 'Passwords do not match';
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return !error;
  };

  // Real-time validation
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        if (errors.email) validateField('email', value);
        break;
      case 'password':
        setPassword(value);
        if (errors.password) validateField('password', value);
        if (confirmPassword && errors.confirmPassword) {
          validateField('confirmPassword', confirmPassword);
        }
        break;
      case 'name':
        setName(value);
        if (errors.name) validateField('name', value);
        break;
      case 'phone':
        setPhone(value);
        if (errors.phone) validateField('phone', value);
        break;
      case 'role':
        setRole(value);
        if (errors.role) validateField('role', value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (errors.confirmPassword) validateField('confirmPassword', value);
        break;
    }
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
    setFocusedInput(null);
  }, []);

  // Handle authentication initialization
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Handle authentication state changes
  useEffect(() => {
    if (authUser && userType && visible && !isLoading) {
      setLoading(false);
      
      // Haptic feedback for success
      Vibration.vibrate(100);
      
      const navigateToScreen = () => {
        if (userType === "admin") {
          router.push("/(screens)/admin");
        } else if (userType === "staff") {
          router.push("/(screens)/staff");
        } else if (userType === "user") {
          router.push("/(screens)/user");
        }
      };

      navigateToScreen();
      onClose?.();

      Alert.alert(
        '🎉 Welcome!',
        `Hello ${authUser.name || authUser.email}!`,
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
    
    if (authError && visible && loading) {
      setLoading(false);
      Vibration.vibrate([100, 50, 100]); // Error vibration pattern
      
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (typeof authError === 'string') {
        errorMessage = authError;
      } else if (authError.message) {
        errorMessage = authError.message;
      } else if (authError.error) {
        errorMessage = authError.error;
      }

      Alert.alert(
        '❌ Authentication Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  }, [authUser, userType, visible, isLoading, authError, loading, onClose, router, clearForm]);

  // Sync loading state
  useEffect(() => {
    if (isLoading && !loading) {
      setLoading(true);
    } else if (!isLoading && loading && !authUser) {
      setLoading(false);
    }
  }, [isLoading, loading, authUser]);

  // Validate entire form
  const validateForm = () => {
    const fields = ['email', 'password'];
    
    if (!isLogin) {
      fields.push('name', 'phone', 'role', 'confirmPassword');
    }
    
    let isValid = true;
    
    fields.forEach(field => {
      const value = {
        email,
        password,
        name,
        phone,
        role,
        confirmPassword
      }[field];
      
      if (!validateField(field, value)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      Vibration.vibrate(200);
      Alert.alert('⚠️ Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setLoading(true);
    
    try {
      let credentials;
      
      if (isLogin) {
        credentials = { email: email.trim(), password };
        dispatch(login(credentials));
      } else {
        credentials = {
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          role: role.toLowerCase().trim()
        };
        dispatch(signup(credentials));
      }
    } catch (error) {
      setLoading(false);
      Vibration.vibrate([100, 50, 100]);
      console.error('Authentication error:', error);
    }
  };

  // Toggle between login and signup
  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsLogin(!isLogin);
    clearForm();
  };

  // Handle modal close
  const handleClose = () => {
    if (loading) {
      Alert.alert(
        '⏳ Please Wait',
        'Authentication in progress. Please wait...',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Keyboard.dismiss();
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearForm();
      onClose?.();
    });
  };

  // Render enhanced input field
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
      onToggle,
      maxLength,
      autoComplete,
      textContentType
    } = props;

    const hasError = errors[errorKey];
    const isFocused = focusedInput === errorKey;

    return (
      <View style={styles.fieldContainer}>
        <Animated.View style={[
          styles.inputContainer,
          hasError && styles.inputContainerError,
          isFocused && styles.inputContainerFocused,
          isFocused && { transform: [{ scale: 1.02 }] }
        ]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={hasError ? "#e74c3c" : isFocused ? "#007bff" : "#666"} 
          />
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            editable={!loading}
            placeholderTextColor="#999"
            maxLength={maxLength}
            autoComplete={autoComplete}
            textContentType={textContentType}
            returnKeyType={isLogin ? "done" : "next"}
            blurOnSubmit={false}
            onFocus={() => setFocusedInput(errorKey)}
            onBlur={() => {
              setFocusedInput(null);
              validateField(errorKey, value);
            }}
            onSubmitEditing={() => {
              if (errorKey === 'password' && isLogin) {
                handleSubmit();
              }
            }}
          />
          {showToggle && (
            <TouchableOpacity
              onPress={onToggle}
              style={styles.eyeButton}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons
                name={toggleValue ? 'eye-off' : 'eye'}
                size={20}
                color={hasError ? "#e74c3c" : isFocused ? "#007bff" : "#666"}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
        {hasError && (
          <Animated.View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color="#e74c3c" />
            <Text style={styles.errorText}>{hasError}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  // Role selector component
  const renderRoleSelector = () => {
    const roles = [
      { id: 'user', label: 'User', icon: 'person' },
      { id: 'staff', label: 'Staff', icon: 'people' },
      { id: 'admin', label: 'Admin', icon: 'shield' }
    ];

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Select Role</Text>
        <View style={styles.roleContainer}>
          {roles.map((roleItem) => (
            <TouchableOpacity
              key={roleItem.id}
              style={[
                styles.roleButton,
                role === roleItem.id && styles.roleButtonActive,
                errors.role && styles.roleButtonError
              ]}
              onPress={() => handleInputChange('role', roleItem.id)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons
                name={roleItem.icon}
                size={18}
                color={role === roleItem.id ? "#007bff" : "#666"}
              />
              <Text style={[
                styles.roleButtonText,
                role === roleItem.id && styles.roleButtonTextActive
              ]}>
                {roleItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.role && (
          <Animated.View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color="#e74c3c" />
            <Text style={styles.errorText}>{errors.role}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <Animated.View style={[
                styles.container,
                {
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                },
                isKeyboardVisible && { marginBottom: keyboardHeight / 2 }
              ]}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <Text style={styles.title}>
                      {isLogin ? '👋 Welcome Back' : '🚀 Create Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                      {isLogin ? 'Sign in to continue' : 'Join us today'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={handleClose} 
                    style={styles.closeButton}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView 
                  style={styles.scrollView} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.scrollViewContent,
                    isKeyboardVisible && { paddingBottom: 50 }
                  ]}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <View style={styles.form}>
                    {!isLogin && renderInputField({
                      icon: "person-outline",
                      placeholder: "Full Name",
                      value: name,
                      onChangeText: (text) => handleInputChange('name', text),
                      autoCapitalize: "words",
                      errorKey: "name",
                      maxLength: 50,
                      autoComplete: "name",
                      textContentType: "name"
                    })}

                    {renderInputField({
                      icon: "mail-outline",
                      placeholder: "Email Address",
                      value: email,
                      onChangeText: (text) => handleInputChange('email', text),
                      keyboardType: "email-address",
                      autoCapitalize: "none",
                      errorKey: "email",
                      maxLength: 100,
                      autoComplete: "email",
                      textContentType: "emailAddress"
                    })}

                    {!isLogin && renderInputField({
                      icon: "call-outline",
                      placeholder: "Phone Number",
                      value: phone,
                      onChangeText: (text) => handleInputChange('phone', text),
                      keyboardType: "phone-pad",
                      errorKey: "phone",
                      maxLength: 20,
                      autoComplete: "tel",
                      textContentType: "telephoneNumber"
                    })}

                    {!isLogin && renderRoleSelector()}

                    {renderInputField({
                      icon: "lock-closed-outline",
                      placeholder: "Password",
                      value: password,
                      onChangeText: (text) => handleInputChange('password', text),
                      autoCapitalize: "none",
                      secureTextEntry: !showPassword,
                      errorKey: "password",
                      showToggle: true,
                      toggleValue: showPassword,
                      onToggle: () => setShowPassword(!showPassword),
                      maxLength: 50,
                      autoComplete: isLogin ? "current-password" : "new-password",
                      textContentType: isLogin ? "password" : "newPassword"
                    })}

                    {!isLogin && renderInputField({
                      icon: "lock-closed-outline",
                      placeholder: "Confirm Password",
                      value: confirmPassword,
                      onChangeText: (text) => handleInputChange('confirmPassword', text),
                      autoCapitalize: "none",
                      secureTextEntry: !showConfirmPassword,
                      errorKey: "confirmPassword",
                      showToggle: true,
                      toggleValue: showConfirmPassword,
                      onToggle: () => setShowConfirmPassword(!showConfirmPassword),
                      maxLength: 50,
                      autoComplete: "new-password",
                      textContentType: "newPassword"
                    })}

                    {isLogin && (
                      <TouchableOpacity 
                        style={styles.forgotPassword}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                      </TouchableOpacity>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                      style={[
                        styles.submitButton, 
                        loading && styles.submitButtonDisabled
                      ]}
                      onPress={handleSubmit}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator color="#fff" size="small" />
                          <Text style={styles.submitButtonText}>
                            {isLogin ? 'Signing in...' : 'Creating account...'}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.submitButtonText}>
                          {isLogin ? '🔐 Sign In' : '✨ Create Account'}
                        </Text>
                      )}
                    </TouchableOpacity>

                    {/* Social Login */}
                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>OR</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtons}>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="logo-google" size={20} color="#db4437" />
                        <Text style={styles.socialButtonText}>Google</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="logo-apple" size={20} color="#000" />
                        <Text style={styles.socialButtonText}>Apple</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                      <Text style={styles.footerText}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                      </Text>
                      <TouchableOpacity 
                        onPress={toggleMode}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.footerLink,
                          loading && styles.disabledText
                        ]}>
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    minHeight: 56,
    transition: 'all 0.2s ease',
  },
  inputContainerFocused: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
    elevation: 2,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainerError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fef5f5',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  inputFocused: {
    color: '#1a1a1a',
  },
  eyeButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    gap: 8,
  },
  roleButtonActive: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  roleButtonError: {
    borderColor: '#e74c3c',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#007bff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 8,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 56,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
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
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    minHeight: 56,
    backgroundColor: '#fafafa',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '400',
  },
  footerLink: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LoginPopup;