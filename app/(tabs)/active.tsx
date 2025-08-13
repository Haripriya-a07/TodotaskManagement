import { View, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TaskCard } from '@/components/TaskCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types/task';
import { TouchableOpacity, Text } from 'react-native';
import { Trash2 } from 'lucide-react-native';

export default function ActiveTasksScreen() {
  const { tasks, loading, refreshing, toggleTaskStatus, deleteTask, refreshTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');


  const filteredTasks = useMemo(() => {
    const activeTasks = tasks.filter(task => task.status === 'open');
    if (!searchQuery) return activeTasks;
    return activeTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleTaskPress = (task: Task) => {
    router.push(`/add-task?taskId=${task.id}`);
  };

  const handleAddTask = () => {
    router.push('/add-task');
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onToggleStatus={toggleTaskStatus}
      onPress={handleTaskPress}
    />
  );

  const renderHiddenItem = ({ item }: { item: Task }) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Trash2 size={24} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onSearch={setSearchQuery} placeholder="Search active tasks..." />
      
      {filteredTasks.length === 0 ? (
        <EmptyState type="active" />
      ) : (
        <SwipeListView
          data={filteredTasks}
          renderItem={renderTask}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id}
          rightOpenValue={-80}
          disableRightSwipe
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshTasks} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FloatingActionButton onPress={handleAddTask} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    paddingVertical: 8,
  },
  hiddenItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 16,
    marginVertical: 6,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '90%',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
});