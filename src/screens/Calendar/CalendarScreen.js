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
import { Colors, Typography, Spacing, BorderRadius, IconSize } from '../../theme/design-tokens';

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
      High: Colors.red50,
      Medium: Colors.orange40,
      Low: Colors.green50,
    };
    return colors[priority] || Colors.gray60;
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
            size={IconSize.lg}
            color={isCompleted ? Colors.green50 : Colors.icon02}
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
                size={IconSize.sm}
                color={Colors.icon02}
              />
              <Text style={styles.metaText}>{task.type}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={IconSize.sm} color={Colors.icon02} />
              <Text style={styles.metaText}>{getPlotName(task.plotId)}</Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                { borderColor: getPriorityColor(task.priority) },
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
            <Text style={[
              styles.taskCount,
              isSelected && styles.taskCountSelected,
            ]}>{tasksCount}</Text>
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
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedTasks)
          .sort()
          .map(date => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateSectionHeader}>
                <Ionicons name="calendar-outline" size={IconSize.md} color={Colors.green40} />
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
            <Ionicons name="calendar-outline" size={64} color={Colors.ui03} />
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubtext}>
              {filterStatus === 'All'
                ? 'Your schedule is clear'
                : `No ${filterStatus.toLowerCase()} tasks`}
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.spacing10 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui02,
  },
  calendarContainer: {
    backgroundColor: Colors.ui01,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
    paddingVertical: Spacing.spacing05,
  },
  calendarScroll: {
    paddingHorizontal: Spacing.spacing04,
  },
  calendarDate: {
    alignItems: 'center',
    paddingVertical: Spacing.spacing04,
    paddingHorizontal: Spacing.spacing05,
    marginHorizontal: Spacing.spacing02,
    borderRadius: BorderRadius.default,
    minWidth: 70,
  },
  calendarDateSelected: {
    backgroundColor: Colors.interactive,
  },
  calendarDateToday: {
    borderWidth: 1,
    borderColor: Colors.interactive,
  },
  calendarDay: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginBottom: Spacing.spacing02,
  },
  calendarDaySelected: {
    color: Colors.text04,
  },
  calendarNumber: {
    fontSize: Typography.fontSize.productiveHeading03,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
  },
  calendarNumberSelected: {
    color: Colors.text04,
  },
  taskDot: {
    marginTop: Spacing.spacing02,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.green40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskDotSelected: {
    backgroundColor: Colors.text04,
  },
  taskCount: {
    fontSize: Typography.fontSize.caption01,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text04,
  },
  taskCountSelected: {
    color: Colors.interactive,
  },
  filterContainer: {
    marginVertical: Spacing.spacing05,
  },
  filterContent: {
    paddingHorizontal: Spacing.spacing05,
  },
  filterChip: {
    paddingHorizontal: Spacing.spacing05,
    paddingVertical: Spacing.spacing03,
    backgroundColor: Colors.ui01,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.spacing03,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  filterChipActive: {
    backgroundColor: Colors.interactive,
    borderColor: Colors.interactive,
  },
  filterChipText: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
  },
  filterChipTextActive: {
    color: Colors.text04,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContainer: {
    flex: 1,
  },
  dateSection: {
    marginBottom: Spacing.spacing06,
  },
  dateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing04,
  },
  dateSectionTitle: {
    fontSize: Typography.fontSize.productiveHeading02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginLeft: Spacing.spacing03,
    flex: 1,
  },
  dateSectionCount: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing04,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  checkboxContainer: {
    marginRight: Spacing.spacing04,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.spacing02,
  },
  taskTitle: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text03,
  },
  overdueBadge: {
    backgroundColor: Colors.ui02,
    paddingHorizontal: Spacing.spacing03,
    paddingVertical: Spacing.spacing02,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.red50,
  },
  overdueText: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.red50,
    fontWeight: Typography.fontWeight.semibold,
  },
  taskDescription: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    marginBottom: Spacing.spacing03,
  },
  taskDescriptionCompleted: {
    color: Colors.text03,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
    marginBottom: Spacing.spacing02,
  },
  metaText: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginLeft: Spacing.spacing02,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.spacing03,
    paddingVertical: Spacing.spacing02,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: Typography.fontSize.caption01,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.spacing10,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.productiveHeading03,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text03,
    marginTop: Spacing.spacing05,
  },
  emptyStateSubtext: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text03,
    marginTop: Spacing.spacing03,
    textAlign: 'center',
    paddingHorizontal: Spacing.spacing07,
  },
});
