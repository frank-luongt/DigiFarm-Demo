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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Elevation, Components } from '../../theme/design-tokens';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('907270184');
  const [focused, setFocused] = useState(false);

  const handleLogin = async () => {
    if (phoneNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      // Store user data in AsyncStorage
      const userData = {
        name: 'Luong Tuan Thanh',
        phone: phoneNumber,
        email: 'luongthanh@digifarm.vn',
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const handleQuickDemo = async () => {
    try {
      // Store demo user data in AsyncStorage
      const userData = {
        name: 'Luong Tuan Thanh',
        phone: '907270184',
        email: 'luongthanh@digifarm.vn',
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="leaf" size={32} color={Colors.green40} />
            </View>
          </View>
          <Text style={styles.title}>DigiFarm</Text>
          <Text style={styles.subtitle}>Modern farm management platform</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Sign in</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone number</Text>
            <View style={[
              styles.inputContainer,
              focused && styles.inputContainerFocused
            ]}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>+84</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={Colors.text03}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </View>
            <Text style={styles.helperText}>Default: 907270184 (Luong Tuan Thanh)</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.text04} style={styles.buttonIcon} />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleQuickDemo}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Explore demo</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui01,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.spacing05,
    paddingTop: Spacing.spacing10,
    paddingBottom: Spacing.spacing07,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: Spacing.spacing08,
  },
  logoContainer: {
    marginBottom: Spacing.spacing06,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.green10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.productiveHeading06,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing03,
    letterSpacing: Typography.letterSpacing.normal,
  },
  subtitle: {
    fontSize: Typography.fontSize.bodyShort02,
    color: Colors.text02,
    letterSpacing: Typography.letterSpacing.normal,
  },
  formSection: {
    flex: 1,
  },
  formTitle: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing07,
  },
  fieldGroup: {
    marginBottom: Spacing.spacing06,
  },
  label: {
    fontSize: Typography.fontSize.label01,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text02,
    marginBottom: Spacing.spacing03,
  },
  inputContainer: {
    flexDirection: 'row',
    height: Components.input.height.lg,
    backgroundColor: Colors.field01,
    borderWidth: 1,
    borderColor: Colors.ui04,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui04,
  },
  inputContainerFocused: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.focus,
  },
  prefix: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ui02,
    borderRightWidth: 1,
    borderRightColor: Colors.ui03,
  },
  prefixText: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text01,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.spacing05,
    fontSize: Typography.fontSize.bodyShort02,
    color: Colors.text01,
    fontWeight: Typography.fontWeight.regular,
  },
  helperText: {
    fontSize: Typography.fontSize.helperText01,
    color: Colors.text02,
    marginTop: Spacing.spacing03,
  },
  primaryButton: {
    height: Components.button.height.lg,
    backgroundColor: Colors.interactive,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.spacing07,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text04,
  },
  buttonIcon: {
    marginLeft: Spacing.spacing03,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.spacing06,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.ui03,
  },
  dividerText: {
    fontSize: Typography.fontSize.label01,
    color: Colors.text03,
    paddingHorizontal: Spacing.spacing05,
  },
  secondaryButton: {
    height: Components.button.height.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.interactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.interactive,
  },
  footer: {
    paddingTop: Spacing.spacing06,
  },
  footerText: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.caption01,
  },
  footerLink: {
    color: Colors.link01,
    fontWeight: Typography.fontWeight.semibold,
  },
});
