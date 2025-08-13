import { View, Text, StyleSheet } from 'react-native';
import { SquareCheck as CheckSquare, Square, List } from 'lucide-react-native';

interface EmptyStateProps {
  type: 'all' | 'active' | 'completed';
}

export function EmptyState({ type }: EmptyStateProps) {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'active':
        return {
          icon: <Square size={64} color="#E5E7EB" />,
          title: 'No active tasks',
          subtitle: 'All caught up! Add a new task to get started.',
        };
      case 'completed':
        return {
          icon: <CheckSquare size={64} color="#E5E7EB" />,
          title: 'No completed tasks',
          subtitle: 'Complete some tasks to see them here.',
        };
      default:
        return {
          icon: <List size={64} color="#E5E7EB" />,
          title: 'No tasks yet',
          subtitle: 'Tap the + button to create your first task.',
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {config.icon}
      </View>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.subtitle}>{config.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
});