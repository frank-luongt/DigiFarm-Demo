import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';

export default function CalendarScreen({ navigation }) {
  const { tasks, updateTask, plots } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('All');

  const statusFilters = ['All', 'Pending', 'Completed', 'Overdue'];

  // Get upcoming dates for calendar
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      let matchesStatus = true;
      if (filterStatus === 'Pending') {
        matchesStatus = task.status === 'Pending';
      } else if (filterStatus === 'Completed') {
        matchesStatus = task.status === 'Completed';
      } else if (filterStatus === 'Overdue') {
        matchesStatus = task.status === 'Pending' && taskDate < today;
      }

      return matchesStatus;
    });
  }, [tasks, filterStatus]);

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const grouped = {};
    filteredTasks.forEach(task => {
      const date = task.dueDate.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const getPlotName = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    return plot ? plot.name : 'Unknown Plot';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: '#F44336',
      Medium: '#FF9800',
      Low: '#4CAF50',
    };
    return colors[priority] || '#757575';
  };

  const getTaskTypeIcon = (type) => {
    const icons = {
      Planting: 'leaf',
      Irrigation: 'water',
      Fertilization: 'flask',
      'Pest Control': 'bug',
      Weeding: 'cut',
      Harvesting: 'basket',
      Maintenance: 'construct',
      Other: 'ellipse',
    };
    return icons[type] || 'checkmark-circle-outline';
  };

  const isTaskOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    const taskDate = dueDate.split('T')[0];
    return taskDate < today;
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateFull = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (date === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const TaskCard = ({ task }) => {
    const isOverdue = task.status === 'Pending' && isTaskOverdue(task.dueDate);
    const isCompleted = task.status === 'Completed';

    return (
      <TouchableOpacity style={styles.taskCard}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleToggleComplete(task)}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={isCompleted ? '#4CAF50' : '#999'}
          />
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text
              style={[
                styles.taskTitle,
                isCompleted && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </Text>
            {isOverdue && !isCompleted && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueText}>Overdue</Text>
              </View>
            )}
          </View>
          {task.description && (
            <Text
              style={[
                styles.taskDescription,
                isCompleted && styles.taskDescriptionCompleted,
              ]}
            >
              {task.description}
            </Text>
          )}
          <View style={styles.taskMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name={getTaskTypeIcon(task.type)}
                size={14}
                color="#666"
              />
              <Text style={styles.metaText}>{task.type}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{getPlotName(task.plotId)}</Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(task.priority) },
                ]}
              >
                {task.priority}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const CalendarDate = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    const tasksCount = (groupedTasks[dateStr] || []).length;

    return (
      <TouchableOpacity
        style={[
          styles.calendarDate,
          isSelected && styles.calendarDateSelected,
          isToday && styles.calendarDateToday,
        ]}
        onPress={() => setSelectedDate(dateStr)}
      >
        <Text
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
          ]}
        >
          {date.toLocaleDateString('en-US', { weekday: 'short' })}
        </Text>
        <Text
          style={[
            styles.calendarNumber,
            isSelected && styles.calendarNumberSelected,
          ]}
        >
          {date.getDate()}
        </Text>
        {tasksCount > 0 && (
          <View
            style={[
              styles.taskDot,
              isSelected && styles.taskDotSelected,
            ]}
          >
            <Text style={styles.taskCount}>{tasksCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendar Dates */}
      <View style={styles.calendarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {upcomingDates.map((date, index) => (
            <CalendarDate key={index} date={date} />
          ))}
        </ScrollView>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {statusFilters.map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              filterStatus === status && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === status && styles.filterChipTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <ScrollView style={styles.listContainer}>
        {Object.keys(groupedTasks)
          .sort()
          .map(date => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateSectionHeader}>
                <Ionicons name="calendar-outline" size={20} color="#2E7D32" />
                <Text style={styles.dateSectionTitle}>{formatDateFull(date)}</Text>
                <Text style={styles.dateSectionCount}>
                  {groupedTasks[date].length} {groupedTasks[date].length === 1 ? 'task' : 'tasks'}
                </Text>
              </View>
              {groupedTasks[date].map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </View>
          ))}

        {Object.keys(groupedTasks).length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubtext}>
              {filterStatus === 'All'
                ? 'Your schedule is clear'
                : `No ${filterStatus.toLowerCase()} tasks`}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 16,
  },
  calendarScroll: {
    paddingHorizontal: 12,
  },
  calendarDate: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 70,
  },
  calendarDateSelected: {
    backgroundColor: '#2E7D32',
  },
  calendarDateToday: {
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  calendarDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calendarDaySelected: {
    color: '#fff',
  },
  calendarNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarNumberSelected: {
    color: '#fff',
  },
  taskDot: {
    marginTop: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskDotSelected: {
    backgroundColor: '#fff',
  },
  taskCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    marginVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  dateSectionCount: {
    fontSize: 12,
    color: '#666',
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  overdueBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overdueText: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskDescriptionCompleted: {
    color: '#999',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
