import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task } from '@/types/task';
import { SquareCheck as CheckSquare, Square, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { format } from 'date-fns';
import { useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onPress: (task: Task) => void;
}

export function TaskCard({ task, onToggleStatus, onPress }: TaskCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacityAnim.setValue(task.status === 'completed' ? 0.7 : 1);
  }, [task.status, opacityAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(task);
  };

  const handleToggleStatus = () => {
    onToggleStatus(task.id);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatDueDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
      ]}
    >
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={handleToggleStatus}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {task.status === 'completed' ? (
              <CheckSquare size={24} color="#10B981" />
            ) : (
              <Square size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text 
              style={[
                styles.title, 
                task.status === 'completed' && styles.completedTitle
              ]} 
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
          </View>
        </View>

        {task.description ? (
          <Text 
            style={[
              styles.description, 
              task.status === 'completed' && styles.completedText
            ]} 
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.dueDateContainer}>
            <Clock size={16} color="#6B7280" />
            <Text 
              style={[
                styles.dueDate, 
                task.status === 'completed' && styles.completedText
              ]}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          </View>
          
          {task.priority === 'high' && task.status === 'open' && (
            <View style={styles.urgentContainer}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 36,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  completedText: {
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 36,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  urgentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});