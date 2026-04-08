import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ScreenContainer } from '../../component/common/ScreenContainer';
import { TeacherCourseList } from '../../component/teacher/CourseCard';
import { useAuth } from '../../hooks/useAuth';
import { teacherService } from '../../services/teacherService';
import { Course } from '../../types';
import { Colors } from '../../utils/colors';

export default function TeacherDashboardScreen() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        fetchCourses();
      }
    }, [user?.id])
  );

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;
      const data = await teacherService.getCourses(user.id);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToCourse = (course: Course) => {
    router.push({
      pathname: '/(teacher)/courses/[id]',
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.name}</Text>
          <Text style={styles.subtitle}>Teacher Dashboard</Text>
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
      <TeacherCourseList
        courses={courses}
        isLoading={isLoading}
        onCoursePress={handleNavigateToCourse}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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