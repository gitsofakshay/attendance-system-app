import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../utils/colors';

export default function PendingApprovalScreen() {
  const { user, signOut, isUnapproved, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('[PendingApproval] Sign-out error:', err);
    }
  };

  // Navigate to login when user is cleared (signOut successful)
  React.useEffect(() => {
    if (!isUnapproved && !isLoading) {
      router.push('/(auth)/login');
    }
  }, [isUnapproved, isLoading]);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="pending-actions"
              size={80}
              color={Colors.primary}
            />
          </View>

          {/* Main Message */}
          <Text style={styles.title}>Approval Pending</Text>
          <Text style={styles.message}>
            Your account is currently pending admin approval. You'll be notified via email once your account is approved.
          </Text>

          {/* User Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>
                {user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>What happens next?</Text>
            <Text style={styles.helpText}>
              • An administrator will review your account{'\n'}
              • You'll receive a confirmation email when approved{'\n'}
              • Once approved, you can access your dashboard
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}  
          onPress={handleLogout}
          disabled={isLoading}  
        >
          <MaterialIcons name="logout" size={20} color={Colors.white} />
          <Text style={styles.logoutButtonText}>{isLoading ? 'Signing Out...' : 'Sign Out'}</Text> 
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    backgroundColor: Colors.lightGray,
    borderRadius: 80,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  helpSection: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
