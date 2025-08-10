import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Alert } from 'react-native';
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react-native';
import { scaleFont } from '@/utils/responsive';
import { AuthContext } from './_layout';
import { router } from 'expo-router';
import { validateDemoCredentials, DEMO_CREDENTIALS } from '@/utils/demoCredentials';

// Color Palette
const COLORS = {
  primary: '#4F46E5',    // Indigo-600
  primaryLight: '#6366F1', // Indigo-400
  background: '#FFFFFF', // White
  surface: '#F8FAFC',   // Slate-50
  textPrimary: '#1E293B', // Slate-800
  textSecondary: '#64748B', // Slate-500
  inputBg: '#F1F5F9',   // Slate-100
  inputBorder: '#E2E8F0', // Slate-200
  error: '#EF4444',     // Red-500
  success: '#10B981',   // Emerald-500
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { login } = React.useContext(AuthContext);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call for login validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate against demo credentials
      const user = validateDemoCredentials(email, password);
      
      if (user) {
        console.log('User validated, logging in...');
        // Call the login function from AuthContext
        await login();
        console.log('Login successful, should navigate now...');
        
        // Show success message and navigate
        Alert.alert('Success!', `Welcome back, ${user.name}!`, [
          { 
            text: 'OK',
            onPress: () => {
              console.log('Manually navigating to tabs...');
              router.replace('/(tabs)');
            }
          }
        ]);
      } else {
        Alert.alert('Invalid Credentials', 'Please check your email and password.\n\nDemo credentials:\n• demo@skinoai.com / demo123\n• test@skinoai.com / test123');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    router.navigate('/signup' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, keyboardVisible && styles.headerSmall]}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Smartphone size={scaleFont(28)} color={COLORS.primary} />
                </View>
              </View>
              <Text style={styles.title}>Welcome to SkinOAI</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  selectionColor={COLORS.primary}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    selectionColor={COLORS.primary}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    {showPassword ? (
                      <EyeOff size={scaleFont(20)} color={COLORS.textSecondary} />
                    ) : (
                      <Eye size={scaleFont(20)} color={COLORS.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Demo Info */}
              <View style={styles.demoInfo}>
                <Text style={styles.demoInfoText}>
                  💡 Demo credentials: demo@skinoai.com / demo123
                </Text>
              </View>

              {!keyboardVisible && (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={goToSignup}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerSmall: {
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 16,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  demoInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F0F9EB', // Light green background
    borderRadius: 8,
    alignItems: 'center',
  },
  demoInfoText: {
    color: '#22C55E', // Green text
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
});
