import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../component/common/Button';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import { Colors } from '../../utils/colors';

export default function AdminDashboardScreen() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    courses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [teachers, students, courses] = await Promise.all([
        adminService.getTeachers(),
        adminService.getStudents(),
        adminService.getCourses(),
      ]);

      setStats({
        teachers: teachers.length,
        students: students.length,
        courses: courses.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('signout button just pressed');
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, {user?.name}</Text>
            <Text style={styles.subtitle}>Admin Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="person-outline" size={32} color={Colors.primary} />
              <Text style={styles.statValue}>{stats.teachers}</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="school" size={32} color={Colors.warning} />
              <Text style={styles.statValue}>{stats.students}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="class" size={32} color={Colors.success} />
              <Text style={styles.statValue}>{stats.courses}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Button
            title="Manage Teachers"
            onPress={() => router.push('/(admin)/teachers')}
            fullWidth
            style={styles.menuButton}
          />

          <Button
            title="Manage Students"
            onPress={() => router.push('/(admin)/students')}
            fullWidth
            variant="secondary"
            style={styles.menuButton}
          />

          <Button
            title="Manage Courses"
            onPress={() => router.push('/(admin)/courses')}
            fullWidth
            variant="success"
            style={styles.menuButton}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
  menuContainer: {
    gap: 12,
  },
  menuButton: {
    marginBottom: 0,
  },
});