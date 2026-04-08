import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';

// ...existing code...
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { StudentCourseList } from '../../component/student/CourseCard';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { Course } from '../../types';
import { Colors } from '../../utils/colors';

export default function StudentDashboardScreen() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { courses, isLoading, fetchCourses } = useCourses('student');

  // Redirect if not approved
  useEffect(() => {
    if (user && !user.approved) {
      router.replace('/(auth)/pending-approval');
    }
  }, [user?.approved]);

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchCourses(user.id);
      }
    }, [user?.id, fetchCourses])
  );

  const handleNavigateToCourse = (course: Course) => {
    router.push({
      pathname: '/(student)/courses/[id]',
      params: { id: course.id },
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenContainer>
      <View style={[styles.scroll, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, {user?.name}</Text>
            <Text style={styles.subtitle}>Student Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Courses List */}
        <Text style={styles.sectionTitle}>Your Courses</Text>
        <StudentCourseList
          courses={courses}
          isLoading={isLoading}
          onCoursePress={handleNavigateToCourse}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
    marginHorizontal: 16,
  },
});
