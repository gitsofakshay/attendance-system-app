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
import { Course } from '../../types';
import { Colors } from '../../utils/colors';
import { EmptyState } from '../common/EmptyState';

interface TeacherCourseListProps {
  courses: Course[];
  isLoading: boolean;
  onCoursePress?: (course: Course) => void;
}

export const TeacherCourseList: React.FC<TeacherCourseListProps> = ({
  courses,
  isLoading,
  onCoursePress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No Courses"
        message="You haven't been assigned to any courses yet"
      />
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.courseCard}
          onPress={() => onCoursePress?.(item)}
        >
          <View style={styles.courseIcon}>
            <MaterialIcons name="class" size={32} color={Colors.primary} />
          </View>

          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseCode}>{item.code}</Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color={Colors.gray}
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
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
  courseCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  courseIcon: {
    width: 56,
    height: 56,
    backgroundColor: Colors.light,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    color: Colors.gray,
  },
});
