import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../utils/colors';
import { Validation, ValidationMessages } from '../../utils/validation';
import { Button } from '../common/Button';
import { TextInput } from '../common/TextInput';

interface SignupFormProps {
  onSubmit: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  onSignInPress?: () => void;
  isLoading?: boolean;
  error?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onSignInPress,
  isLoading = false,
  error,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [roleError, setRoleError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(ValidationMessages.required);
      isValid = false;
    } else if (!Validation.isValidName(name)) {
      setNameError(ValidationMessages.invalidName);
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError(ValidationMessages.required);
      isValid = false;
    } else if (!Validation.isEmail(email)) {
      setEmailError(ValidationMessages.invalidEmail);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError(ValidationMessages.required);
      isValid = false;
    } else if (!Validation.isStrongPassword(password)) {
      setPasswordError(ValidationMessages.weakPassword);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmError(ValidationMessages.required);
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError(ValidationMessages.passwordMismatch);
      isValid = false;
    } else {
      setConfirmError('');
    }

    if (!selectedRole) {
      setRoleError('Please select your role');
      isValid = false;
    } else {
      setRoleError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm() && selectedRole) {
      try {
        await onSubmit(email, password, name, selectedRole);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      {error && <Text style={styles.errorAlert}>{error}</Text>}

      <View style={styles.form}>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={nameError}
          editable={!isLoading}
          containerStyle={styles.field}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          editable={!isLoading}
          containerStyle={styles.field}
        />

        <TextInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={passwordError}
          editable={!isLoading}
          containerStyle={styles.field}
        />

        <TextInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={confirmError}
          editable={!isLoading}
          containerStyle={styles.field}
        />

        <View>
          <Text style={styles.label}>Select Role {roleError && <Text style={styles.errorText}>*</Text>}</Text>
          <View style={styles.roleContainer}>
            {(['teacher', 'student'] as const).map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => setSelectedRole(role)}
                disabled={isLoading}
                style={[
                  styles.roleButton,
                  selectedRole === role && styles.roleButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role && styles.roleButtonTextSelected,
                  ]}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {roleError && <Text style={styles.errorTextSmall}>{roleError}</Text>}
        </View>

        <Button
          title="Sign Up"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          size="large"
          style={styles.submitButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={onSignInPress} disabled={isLoading}>
          <Text style={styles.footerLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
  },
  errorAlert: {
    backgroundColor: Colors.danger,
    color: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  form: {
    marginBottom: 24,
    gap: 16,
  },
  field: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.dark,
  },
  errorText: {
    color: Colors.danger,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  roleButtonTextSelected: {
    color: Colors.white,
  },
  errorTextSmall: {
    color: Colors.danger,
    fontSize: 12,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
