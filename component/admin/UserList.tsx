import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Profile } from '../../types';
import { Colors } from '../../utils/colors';
import { EmptyState } from '../common/EmptyState';

interface UserListProps {
  users: Profile[];
  isLoading: boolean;
  onUserPress?: (user: Profile) => void;
  onDeletePress?: (userId: string) => void;
  onApprovePress?: (userId: string) => void;
  onDisapprovePress?: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onUserPress,
  onDeletePress,
  onApprovePress,
  onDisapprovePress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (users.length === 0) {
    return <EmptyState title="No Users" message="No users found" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => onUserPress?.(item)}
        >
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            {!item.approved && (
              <Text style={styles.pendingBadge}>Pending Approval</Text>
            )}
          </View>

          <View style={styles.actions}>
            {!item.approved && onApprovePress && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onApprovePress(item.id)}
              >
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={Colors.success}
                />
              </TouchableOpacity>
            )}

            {item.approved && onDisapprovePress && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDisapprovePress(item.id)}
              >
                <MaterialIcons
                  name="block"
                  size={24}
                  color={Colors.warning}
                />
              </TouchableOpacity>
            )}

            {onDeletePress && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDeletePress(item.id)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  pendingBadge: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
});
