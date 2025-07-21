// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
//   SafeAreaView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { toastConfig } from '../../toastConfig.js'; // Adjust the path as necessary
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { initializeAuth, login, signup } from '@/redux/Auth/AuthSlice';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const LoginPopup = ({ visible = true, onClose }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState('');
//   const [errors, setErrors] = useState({});
  
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { authUser, userType, isLoading, error: authError } = useSelector((state) => state.auth);

//   // Validate email format
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   // Validate phone number (basic validation)
//   const validatePhone = (phone) => {
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   // Validate password strength
//   const validatePassword = (password) => {
//     return password.length >= 6; // Minimum 6 characters
//   };

//   // Clear form data
//   const clearForm = useCallback(() => {
//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//     setName('');
//     setPhone('');
//     setRole('');
//     setErrors({});
//     setShowPassword(false);
//     setShowConfirmPassword(false);
//     setLoading(false);
//   }, []);

//   // Handle authentication check and navigation
//   useEffect(() => {
//     dispatch(initializeAuth());
//     console.log('Initializing authentication...');
//   }, [dispatch]);

//   // Handle authentication state changes
//   useEffect(() => {
//     // If we have an authenticated user and the popup is visible
//     if (authUser && userType && visible && !isLoading) {
//       setLoading(false);
      
//       // Show success message
//       if (userType === "admin") {
//         requestAnimationFrame(() => {
//           router.push("/(screens)/admin");
//       });
//       } else if (userType === "staff") {
//         requestAnimationFrame(() => {
//           router.push("/(screens)/staff");
//       });
//       } else if (userType === "user") {
//         requestAnimationFrame(() => {
//           router.push("/(screens)/user");
//       });
//       }

//       onClose?.();

//       Alert.alert(
//         'Success!',
//         `Welcome ${authUser.name || authUser.email}!`,
//         [
//           {
//             text: 'Continue',
//             onPress: () => {
//               clearForm();
//               onClose?.();
//             }
//           }
//         ],
//         { cancelable: false }
//       );
//     }
    
//     // Handle authentication errors from Redux state
//     if (authError && visible && loading) {
//       setLoading(false);
      
//       let errorMessage = 'Authentication failed. Please try again.';
      
//       if (typeof authError === 'string') {
//         errorMessage = authError;
//       } else if (authError.message) {
//         errorMessage = authError.message;
//       } else if (authError.error) {
//         errorMessage = authError.error;
//       }

//       Alert.alert(
//         'Authentication Failed',
//         errorMessage,
//         [{ text: 'OK' }]
//       );
//     }
//   }, [authUser, userType, visible, isLoading, authError, loading, onClose, router, clearForm]);

//   // Sync loading state with Redux loading state
//   useEffect(() => {
//     if (isLoading && !loading) {
//       setLoading(true);
//     } else if (!isLoading && loading && !authUser) {
//       // Only stop loading if not authenticated (to prevent premature stop)
//       setLoading(false);
//     }
//   }, [isLoading, loading, authUser]);

//   // Validate form inputs
//   const validateForm = () => {
//     const newErrors = {};

//     // Email validation
//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (!isLogin && !validatePassword(password)) {
//       newErrors.password = 'Password must be at least 6 characters long';
//     }

//     // Signup specific validations
//     if (!isLogin) {
//       if (!name.trim()) {
//         newErrors.name = 'Full name is required';
//       }

//       if (!phone.trim()) {
//         newErrors.phone = 'Phone number is required';
//       } else if (!validatePhone(phone)) {
//         newErrors.phone = 'Please enter a valid phone number';
//       }

//       if (!role.trim()) {
//         newErrors.role = 'Role is required';
//       } else if (!['admin', 'user', 'staff'].includes(role.toLowerCase())) {
//         newErrors.role = 'Role must be admin, user, or staff';
//       }

//       if (!confirmPassword.trim()) {
//         newErrors.confirmPassword = 'Please confirm your password';
//       } else if (password !== confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// const handleSubmit = async () => {
//   if (!validateForm()) {
//     Toast.show({
//       type: 'error',
//       text1: 'Validation Error',
//       text2: 'Please fix the errors and try again.',
//     });
//     return;
//   }

//   setLoading(true);

//   let credentials;

//  try {
//   if (isLogin) {
//     credentials = { email, password };
//     const res =  await dispatch(login(credentials));

//     if (res?.error || res?.payload?.error) {
//       const errorMessage =
//         res?.error?.message ||
//         res?.payload?.error ||
//         res?.payload?.message ||
//         'Invalid credentials';

//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: errorMessage,
//       });

//       return;
//     }

//     Toast.show({
//       type: 'success',
//       text1: 'Login Successful',
//     });

//   } else {
//     credentials = { email, password, name, role };
//     const res =  await dispatch(signup(credentials));

//     if (res?.error || res?.payload?.error) {
//       const errorMessage =
//         res?.error?.message ||
//         res?.payload?.error ||
//         res?.payload?.message ||
//         'Signup failed. Try again.';

//       Toast.show({
//         type: 'error',
//         text1: 'Signup Failed',
//         text2: errorMessage,
//       });

//       return;
//     }

//     Toast.show({
//       type: 'success',
//       text1: 'Signup Successful',
//     });
//   }
// } catch (err) {
//   // Catches truly unexpected errors
//   Toast.show({
//     type: 'error',
//     text1: 'Unexpected Error',
//     text2: err.message || 'Something went wrong.',
//   });
// } finally {
//     setLoading(false);
//   }
// };

//   // Toggle between login and signup modes
//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     clearForm();
//   };

//   // Handle modal close
//   const handleClose = () => {
//     if (loading) {
//       Alert.alert(
//         'Please Wait',
//         'Authentication in progress. Please wait...',
//         [{ text: 'OK' }]
//       );
//       return;
//     }
    
//     clearForm();
//     onClose?.();
//   };

//   // Render input field with error handling
//   const renderInputField = (props) => {
//     const { 
//       icon, 
//       placeholder, 
//       value, 
//       onChangeText, 
//       keyboardType, 
//       autoCapitalize, 
//       secureTextEntry, 
//       errorKey,
//       showToggle,
//       toggleValue,
//       onToggle
//     } = props;

//     return (
//       <View style={styles.fieldContainer}>
//         <View style={[
//           styles.inputContainer,
//           errors[errorKey] && styles.inputContainerError
//         ]}>
//           <Ionicons name={icon} size={20} color={errors[errorKey] ? "#e74c3c" : "#666"} />
//           <TextInput
//             style={styles.input}
//             placeholder={placeholder}
//             value={value}
//             onChangeText={onChangeText}
//             keyboardType={keyboardType}
//             autoCapitalize={autoCapitalize}
//             secureTextEntry={secureTextEntry}
//             editable={!loading}
//           />
//           {showToggle && (
//             <TouchableOpacity
//               onPress={onToggle}
//               style={styles.eyeButton}
//               disabled={loading}
//             >
//               <Ionicons
//                 name={toggleValue ? 'eye-off' : 'eye'}
//                 size={20}
//                 color={errors[errorKey] ? "#e74c3c" : "#666"}
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//         {errors[errorKey] && (
//           <Text style={styles.errorText}>{errors[errorKey]}</Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={handleClose}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           style={styles.overlay}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <View style={styles.container}>
//             <View style={styles.header}>
//               <Text style={styles.title}>
//                 {isLogin ? 'Welcome Back' : 'Create Account'}
//               </Text>
//               <TouchableOpacity 
//                 onPress={handleClose} 
//                 style={styles.closeButton}
//                 disabled={loading}
//               >
//                 <Ionicons name="close" size={24} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView 
//               style={styles.scrollView} 
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >
//               <View style={styles.form}>
//                 {!isLogin && renderInputField({
//                   icon: "person-outline",
//                   placeholder: "Full Name",
//                   value: name,
//                   onChangeText: setName,
//                   autoCapitalize: "words",
//                   errorKey: "name"
//                 })}

//                 {renderInputField({
//                   icon: "mail-outline",
//                   placeholder: "Email Address",
//                   value: email,
//                   onChangeText: setEmail,
//                   keyboardType: "email-address",
//                   autoCapitalize: "none",
//                   errorKey: "email"
//                 })}

//                 {!isLogin && renderInputField({
//                   icon: "call-outline",
//                   placeholder: "Phone Number",
//                   value: phone,
//                   onChangeText: setPhone,
//                   keyboardType: "phone-pad",
//                   errorKey: "phone"
//                 })}

//                 {!isLogin && renderInputField({
//                   icon: "briefcase-outline",
//                   placeholder: "Role (admin, user, or staff)",
//                   value: role,
//                   onChangeText: setRole,
//                   autoCapitalize: "none",
//                   errorKey: "role"
//                 })}

//                 {renderInputField({
//                   icon: "lock-closed-outline",
//                   placeholder: "Password",
//                   value: password,
//                   onChangeText: setPassword,
//                   autoCapitalize: "none",
//                   secureTextEntry: !showPassword,
//                   errorKey: "password",
//                   showToggle: true,
//                   toggleValue: showPassword,
//                   onToggle: () => setShowPassword(!showPassword)
//                 })}

//                 {!isLogin && renderInputField({
//                   icon: "lock-closed-outline",
//                   placeholder: "Confirm Password",
//                   value: confirmPassword,
//                   onChangeText: setConfirmPassword,
//                   autoCapitalize: "none",
//                   secureTextEntry: !showConfirmPassword,
//                   errorKey: "confirmPassword",
//                   showToggle: true,
//                   toggleValue: showConfirmPassword,
//                   onToggle: () => setShowConfirmPassword(!showConfirmPassword)
//                 })}

//                 {isLogin && (
//                   <TouchableOpacity 
//                     style={styles.forgotPassword}
//                     disabled={loading}
//                   >
//                     <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//                   </TouchableOpacity>
//                 )}

//                 <TouchableOpacity
//                   style={[
//                     styles.submitButton, 
//                     loading && styles.submitButtonDisabled
//                   ]}
//                   onPress={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <View style={styles.loadingContainer}>
//                       <ActivityIndicator color="#fff" size="small" />
//                       <Text style={styles.submitButtonText}>
//                         {isLogin ? 'Logging in...' : 'Creating account...'}
//                       </Text>
//                     </View>
//                   ) : (
//                     <Text style={styles.submitButtonText}>
//                       {isLogin ? 'Login' : 'Sign Up'}
//                     </Text>
//                   )}
//                 </TouchableOpacity>

//                 <View style={styles.divider}>
//                   <View style={styles.dividerLine} />
//                   <Text style={styles.dividerText}>OR</Text>
//                   <View style={styles.dividerLine} />
//                 </View>

//                 <View style={styles.socialButtons}>
//                   <TouchableOpacity 
//                     style={styles.socialButton}
//                     disabled={loading}
//                   >
//                     <Ionicons name="logo-google" size={20} color="#db4437" />
//                     <Text style={styles.socialButtonText}>Google</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     style={styles.socialButton}
//                     disabled={loading}
//                   >
//                     <Ionicons name="logo-facebook" size={20} color="#3b5998" />
//                     <Text style={styles.socialButtonText}>Facebook</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.footer}>
//                   <Text style={styles.footerText}>
//                     {isLogin ? "Don't have an account? " : "Already have an account? "}
//                   </Text>
//                   <TouchableOpacity 
//                     onPress={toggleMode}
//                     disabled={loading}
//                   >
//                     <Text style={[
//                       styles.footerLink,
//                       loading && styles.disabledText
//                     ]}>
//                       {isLogin ? 'Sign Up' : 'Login'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//             <Toast config={toastConfig} topOffset={50} style={{ zIndex: 9999, elevation: 9999, position: 'absolute' }} />
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: '100%',
//     maxWidth: screenWidth > 400 ? 400 : screenWidth - 32,
//     maxHeight: screenHeight * 0.9,
//     minHeight: screenHeight * 0.6,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   form: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   fieldContainer: {
//     marginBottom: 16,
//     zIndex: -1, // Ensure fields are above the background
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f9f9f9',
//     minHeight: 56,
//   },
//   inputContainerError: {
//     borderColor: '#e74c3c',
//     backgroundColor: '#fdf2f2',
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   eyeButton: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 12,
//     marginTop: 6,
//     marginLeft: 16,
//   },
//   forgotPassword: {
//     alignSelf: 'flex-end',
//     marginBottom: 24,
//     padding: 4,
//   },
//   forgotPasswordText: {
//     color: '#007bff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//     minHeight: 56,
//     justifyContent: 'center',
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   dividerText: {
//     paddingHorizontal: 16,
//     color: '#666',
//     fontSize: 14,
//     backgroundColor: '#fff',
//   },
//   socialButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 24,
//   },
//   socialButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     paddingVertical: 14,
//     gap: 8,
//     minHeight: 50,
//   },
//   socialButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   footerText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   footerLink: {
//     color: '#007bff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   disabledText: {
//     color: '#ccc',
//   },
// });

// export default LoginPopup;






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
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { initializeAuth, login, signup } from '@/redux/Auth/AuthSlice';
// import your BasilRealestate logo asset
import BasilLogo from '../../assets/images/logo.png'; // <= update with your logo path

const THEME = {
  primary: '#005035',       // Basil Green (example)
  accent: '#14a66c',        // Basil Accent
  error: '#e74c3c',
  gray: '#f3f3f3',
  textDark: '#263238',
  textLight: '#fff',
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginPopup({ visible = true, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
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

  // For animated tab indicator
  const tabIndicator = useState(new Animated.Value(0))[0];

  const dispatch = useDispatch();
  const router = useRouter();
  const { authUser, userType, isLoading, error: authError } = useSelector((state) => state.auth);

  // --- Validation functions same as before ---
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = phone => /^[\+]?[1-9][\d]{6,15}$/.test(phone.replace(/\s/g, ''));
  const validatePassword = password => password.length >= 6;

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

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (authUser && userType && visible && !isLoading) {
      setLoading(false);

      // Navigate by user type
      if (userType === "admin") {
        requestAnimationFrame(() => router.push("/(screens)/admin"));
      } else if (userType === "staff") {
        requestAnimationFrame(() => router.push("/(screens)/staff"));
      } else if (userType === "user") {
        requestAnimationFrame(() => router.push("/(screens)/user"));
      }

      onClose?.();

      Alert.alert(
        'Success!',
        `Welcome ${authUser.name || authUser.email}!`,
        [{
          text: 'Continue',
          onPress: () => {
            clearForm();
            onClose?.();
          }
        }],
        { cancelable: false }
      );
    }

    if (authError && visible && loading) {
      setLoading(false);
      let errMsg = typeof authError === 'string'
        ? authError
        : (authError.message || authError.error || "Authentication failed");
      Alert.alert('Authentication Failed', errMsg, [{ text: 'OK' }]);
    }
  }, [authUser, userType, visible, isLoading, authError, loading, onClose, router, clearForm]);

  useEffect(() => {
    if (isLoading && !loading) setLoading(true);
    else if (!isLoading && loading && !authUser) setLoading(false);
  }, [isLoading, loading, authUser]);

  function validateForm() {
    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Valid email required';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (activeTab === 'signup' && !validatePassword(password)) newErrors.password = 'Min 6 characters';

    if (activeTab === 'signup') {
      if (!name.trim()) newErrors.name = 'Full name is required';
      if (!phone.trim()) newErrors.phone = 'Phone required';
      else if (!validatePhone(phone)) newErrors.phone = 'Invalid phone';
      if (!role.trim()) newErrors.role = 'Role required';
      else if (!['admin', 'user', 'staff'].includes(role.toLowerCase())) newErrors.role = 'Role must be admin, user, or staff';
      if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fix form errors.' });
      return;
    }
    setLoading(true);

    let credentials, res;
    try {
      if (activeTab === "login") {
        credentials = { email, password };
        res = await dispatch(login(credentials));
        if (res?.error || res?.payload?.error) {
          const errorMessage =
              res?.error?.message ||
              res?.payload?.error ||
              res?.payload?.message ||
              'Invalid credentials';
          Toast.show({ type: 'error', text1: 'Login Failed', text2: errorMessage });
          return;
        }
        Toast.show({ type: 'success', text1: 'Welcome Back!' });
      } else {
        credentials = { email, password, name, role };
        res = await dispatch(signup(credentials));
        if (res?.error || res?.payload?.error) {
          const errorMessage =
              res?.error?.message ||
              res?.payload?.error ||
              res?.payload?.message ||
              'Signup failed. Try again.';
          Toast.show({ type: 'error', text1: 'Signup Failed', text2: errorMessage });
          return;
        }
        Toast.show({ type: 'success', text1: 'Account Created 🎉' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unexpected Error', text2: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  /** Animated tab indicator handler */
  const animateTab = direction => {
    Animated.timing(tabIndicator, {
      toValue: direction,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  /** Tab switching: login/signup */
  const changeTab = t => {
    setActiveTab(t);
    clearForm();
    animateTab(t === 'login' ? 0 : 1);
  };

  const renderInputField = props => {
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
    } = props;
    return (
      <View style={styles.fieldContainer}>
        <View style={[
          styles.inputContainer,
          errors[errorKey] && { borderColor: THEME.error, backgroundColor: '#fdf2f2' }
        ]}>
          <Ionicons name={icon} size={19} color={errors[errorKey] ? THEME.error : THEME.primary} style={{ marginRight: 6 }} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            editable={!loading}
          />
          {showToggle && (
            <TouchableOpacity onPress={onToggle} style={styles.eyeButton} disabled={loading}>
              <Ionicons name={toggleValue ? 'eye-off' : 'eye'} size={19} color={errors[errorKey] ? THEME.error : '#888'} />
            </TouchableOpacity>
          )}
        </View>
        {!!errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
      </View>
    );
  };

  // --- Main Render ---
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose?.()}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
          <View style={styles.container}>

            {/** Logo and welcome */}
            <View style={styles.brandBlock}>
              <Image source={BasilLogo} style={styles.logo} />
              <Text style={styles.brandName}>Basil Realestate</Text>
              <Text style={styles.welcome}>{activeTab === 'login' ? 'Welcome Back' : 'Let\'s Get You Started'}</Text>
            </View>

            {/** Tabs for Login / Sign Up */}
            <View style={styles.tabsRow}>
              <TouchableOpacity style={styles.tabButton} onPress={() => changeTab('login')} disabled={loading}>
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabButton} onPress={() => changeTab('signup')} disabled={loading}>
                <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.tabIndicator,
                  {
                    left: tabIndicator.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, screenWidth / 2 - 18 - 63], // adjust based on width, label width
                    })
                  }
                ]}
              />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.form}>
                {activeTab === 'signup' && renderInputField({
                  icon: 'person-outline',
                  placeholder: 'Full Name',
                  value: name,
                  onChangeText: setName,
                  autoCapitalize: "words",
                  errorKey: "name"
                })}
                {renderInputField({
                  icon: 'mail-outline',
                  placeholder: 'Email Address',
                  value: email,
                  onChangeText: setEmail,
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  errorKey: "email"
                })}
                {activeTab === 'signup' && renderInputField({
                  icon: 'call-outline',
                  placeholder: 'Phone Number',
                  value: phone,
                  onChangeText: setPhone,
                  keyboardType: "phone-pad",
                  errorKey: "phone"
                })}
                {activeTab === 'signup' && renderInputField({
                  icon: 'briefcase-outline',
                  placeholder: 'Role (admin, user, staff)',
                  value: role,
                  onChangeText: setRole,
                  autoCapitalize: "none",
                  errorKey: "role"
                })}
                {renderInputField({
                  icon: 'lock-closed-outline',
                  placeholder: 'Password',
                  value: password,
                  onChangeText: setPassword,
                  autoCapitalize: "none",
                  secureTextEntry: !showPassword,
                  errorKey: "password",
                  showToggle: true,
                  toggleValue: showPassword,
                  onToggle: () => setShowPassword(!showPassword)
                })}
                {activeTab === 'signup' && renderInputField({
                  icon: 'lock-closed-outline',
                  placeholder: 'Confirm Password',
                  value: confirmPassword,
                  onChangeText: setConfirmPassword,
                  autoCapitalize: "none",
                  secureTextEntry: !showConfirmPassword,
                  errorKey: "confirmPassword",
                  showToggle: true,
                  toggleValue: showConfirmPassword,
                  onToggle: () => setShowConfirmPassword(!showConfirmPassword)
                })}

                {activeTab === 'login' && (
                  <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.submitButton, loading && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading
                    ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#fff" size="small" />
                        <Text style={styles.submitButtonText}>
                          {activeTab === 'login' ? 'Logging in...' : 'Signing Up...'}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {activeTab === 'login' ? 'Login to Basil' : 'Join Basil Now'}
                      </Text>
                    )
                  }
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton} disabled={loading}>
                    <Ionicons name="logo-google" size={22} color="#db4437" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton} disabled={loading}>
                    <Ionicons name="logo-facebook" size={22} color="#1976d2" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {activeTab === 'login' ? `Don't have an account? ` : 'Already signed up? '}
                  </Text>
                  <TouchableOpacity onPress={() => changeTab(activeTab === 'login' ? 'signup' : 'login')} disabled={loading}>
                    <Text style={[
                      styles.footerLink,
                      loading && styles.disabledText
                    ]}>
                      {activeTab === 'login' ? 'Sign Up' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={loading}>
              <Ionicons name="close" size={27} color="#7b7b7b" />
            </TouchableOpacity>
          </View>
          <Toast topOffset={50} style={{ zIndex: 9999, elevation: 9999 }} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// --- Gorgeous NEW Basil Styles ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 8,
  },
  container: {
    width: '100%',
    maxWidth: screenWidth > 410 ? 410 : screenWidth - 18,
    minHeight: screenHeight * 0.70,
    backgroundColor: '#fff',
    borderRadius: 21,
    overflow: 'hidden',
    paddingBottom: 8,
    elevation: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 2, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  brandBlock: {
    alignItems: 'center', marginTop: 25,
  },
  logo: {
    width: 56, height: 56, resizeMode: 'contain', marginBottom: 6,
    borderRadius: 16, backgroundColor: THEME.accent,
  },
  brandName: {
    fontSize: 19, fontWeight: '700', letterSpacing: 1,
    color: THEME.primary, marginBottom: 0, marginTop: 6,
  },
  welcome: {
    fontSize: 17, color: '#444', marginTop: 7, marginBottom: 7, fontWeight: '500'
  },
  tabsRow: {
    flexDirection: 'row', marginTop: 14,
    position: 'relative', borderBottomWidth: 1, borderColor: '#ebebeb', marginHorizontal: 18,
  },
  tabButton: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
  },
  tabText: {
    fontSize: 16, color: '#999', fontWeight: "600"
  },
  activeTabText: {
    color: THEME.primary, fontWeight: "bold", letterSpacing: 1
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 90,
    height: 3.7,
    backgroundColor: THEME.primary,
    borderRadius: 2,
    // Use Animated left
  },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center', paddingBottom: 10
  },
  form: {
    marginTop: 10, paddingHorizontal: 24, alignItems: 'stretch',
  },
  fieldContainer: {
    marginBottom: 11,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: '#f8fffa',
    minHeight: 50,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    fontSize: 15.3,
    color: '#233',
    fontWeight: "500"
  },
  eyeButton: {
    padding: 4,
    borderRadius: 20,
  },
  errorText: {
    color: THEME.error,
    fontSize: 12.4,
    marginTop: 3,
    marginLeft: 6,
    fontWeight: "600"
  },
  forgotPassword: {
    alignSelf: 'flex-end', marginBottom: 8,
    padding: 5, marginTop: -2
  },
  forgotPasswordText: {
    color: THEME.primary, fontSize: 14, fontWeight: 'bold', opacity: 0.94,
  },
  submitButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 5,
    minHeight: 50,
    justifyContent: 'center',
    shadowColor: THEME.primary, shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.08, shadowRadius: 3,
  },
  submitButtonDisabled: { backgroundColor: '#cfd8dc' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center', gap: 12,
  },
  submitButtonText: {
    color: '#fff', fontSize: 15.7, fontWeight: '900', letterSpacing: 0.4,
  },
  divider: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 19
  },
  dividerLine: {
    flex: 1, height: 1.5, backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: 11, color: '#aaa', fontSize: 14, fontWeight: '600', backgroundColor: 'white'
  },
  socialButtons: {
    flexDirection: 'row', gap: 12, marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    minHeight: 44, backgroundColor: '#f7fdf9'
  },
  socialButtonText: {
    fontSize: 15, fontWeight: '700', color: THEME.primary
  },
  footer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10
  },
  footerText: {
    color: '#777', fontSize: 14
  },
  footerLink: {
    color: THEME.accent, fontSize: 15, fontWeight: 'bold', textDecorationLine: 'underline'
  },
  disabledText: {
    color: '#ccc',
  },
  closeButton: {
    position: 'absolute', top: 18, right: 13, padding: 6, borderRadius: 100, backgroundColor: '#f8f8f8',
    zIndex: 20,
  },
});
