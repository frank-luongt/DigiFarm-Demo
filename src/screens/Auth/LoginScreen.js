import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('907270184');

  const handleLogin = async () => {
    if (phoneNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // For prototype, skip OTP and login directly
    // Check if user exists, otherwise go to onboarding
    const existingUser = await AsyncStorage.getItem('user');

    if (existingUser) {
      // User exists, navigate to main app
      navigation.replace('Main');
    } else {
      // New user, go to onboarding
      await AsyncStorage.setItem('tempPhone', '+84' + phoneNumber);
      navigation.navigate('Onboarding');
    }
  };

  const handleQuickDemo = async () => {
    // For quick demo access, create a demo user
    const demoUser = {
      name: 'Nguyen Van A',
      phone: '+84 907270184',
      language: 'Vietnamese',
    };
    await AsyncStorage.setItem('user', JSON.stringify(demoUser));
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🌱</Text>
          </View>
          <Text style={styles.appName}>DigiFarm</Text>
          <Text style={styles.tagline}>Digitalize Your Farming Operations</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+84</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Button */}
        <View style={styles.demoContainer}>
          <TouchableOpacity style={styles.demoButton} onPress={handleQuickDemo}>
            <Text style={styles.demoButtonText}>Quick Demo Access</Text>
          </TouchableOpacity>
          <Text style={styles.demoSubtext}>Skip login and explore the app</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  countryCode: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  demoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  demoButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    marginBottom: 8,
  },
  demoButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  demoSubtext: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
