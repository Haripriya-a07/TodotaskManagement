import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { X, Calendar, Flag } from 'lucide-react-native';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { tasks, addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!taskId;
  const existingTask = tasks.find(task => task.id === taskId);

  useEffect(() => {
    if (isEditing && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setDueDate(new Date(existingTask.dueDate));
      setPriority(existingTask.priority);
    }
  }, [isEditing, existingTask]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
        priority,
      };

      if (isEditing && existingTask) {
        await updateTask(existingTask.id, taskData);
      } else {
        const newTask: Task = {
          id: uuidv4(),
          ...taskData,
          status: 'open' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addTask(newTask);
      }

      router.back();
    } catch (err) {
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getPriorityColor = (priorityLevel: 'low' | 'medium' | 'high') => {
    switch (priorityLevel) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Task' : 'Add Task'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, (!title.trim() || loading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!title.trim() || loading}
        >
          <Text style={[styles.saveButtonText, (!title.trim() || loading) && styles.saveButtonTextDisabled]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description (optional)"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.dateButtonText}>{formatDate(dueDate)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((priorityLevel) => (
              <TouchableOpacity
                key={priorityLevel}
                style={[
                  styles.priorityButton,
                  priority === priorityLevel && {
                    backgroundColor: getPriorityColor(priorityLevel),
                    borderColor: getPriorityColor(priorityLevel),
                  }
                ]}
                onPress={() => setPriority(priorityLevel)}
              >
                <Flag 
                  size={16} 
                  color={priority === priorityLevel ? '#FFFFFF' : getPriorityColor(priorityLevel)} 
                />
                <Text style={[
                  styles.priorityButtonText,
                  priority === priorityLevel && styles.priorityButtonTextSelected
                ]}>
                  {priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  formGroup: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  priorityButtonTextSelected: {
    color: '#FFFFFF',
  },
});