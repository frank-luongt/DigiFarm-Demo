import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';

export default function DashboardScreen({ navigation }) {
  const { user, farms, plots, activities, harvests, transactions, tasks } = useData();

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpenses;

    const totalHarvest = harvests.reduce((sum, h) => sum + h.quantity, 0);

    const activePlots = plots.filter(p => p.status === 'Active').length;

    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivities = activities.filter(
      a => new Date(a.date) >= sevenDaysAgo
    ).length;

    // Harvest trend (last 30 days)
    const last30Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i) * 5);
      return date.toISOString().split('T')[0];
    });

    const harvestData = last30Days.map(date => {
      return harvests
        .filter(h => h.date.split('T')[0] <= date)
        .reduce((sum, h) => sum + h.quantity, 0);
    });

    // Income vs Expense last 6 months
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toISOString().substring(0, 7);

      const income = transactions
        .filter(t => t.type === 'Income' && t.date.substring(0, 7) === month)
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter(t => t.type === 'Expense' && t.date.substring(0, 7) === month)
        .reduce((sum, t) => sum + t.amount, 0);

      return { month: date.toLocaleDateString('en', { month: 'short' }), income, expense };
    });

    return {
      totalIncome,
      totalExpenses,
      profit,
      totalHarvest,
      activePlots,
      pendingTasks,
      recentActivities,
      harvestData,
      monthlyData,
    };
  }, [transactions, harvests, plots, tasks, activities]);

  const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const formatCurrency = (amount) => {
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {metrics.pendingTasks > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Income"
          value={formatCurrency(metrics.totalIncome)}
          subtitle="This season"
          icon="trending-up"
          color="#4CAF50"
          onPress={() => navigation.navigate('Finance')}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(metrics.profit)}
          subtitle={`${((metrics.profit / metrics.totalIncome) * 100).toFixed(0)}% margin`}
          icon="cash"
          color="#2196F3"
          onPress={() => navigation.navigate('Finance')}
        />
        <StatCard
          title="Total Harvest"
          value={`${metrics.totalHarvest} kg`}
          subtitle="All crops"
          icon="basket"
          color="#FF9800"
          onPress={() => navigation.navigate('Harvest')}
        />
        <StatCard
          title="Active Plots"
          value={metrics.activePlots}
          subtitle={`${plots.length} total plots`}
          icon="leaf"
          color="#8BC34A"
          onPress={() => navigation.navigate('Profile', { screen: 'FarmManagement' })}
        />
      </View>

      {/* Pending Tasks Alert */}
      {metrics.pendingTasks > 0 && (
        <TouchableOpacity
          style={styles.taskAlert}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="alert-circle" size={24} color="#FF9800" />
          <View style={styles.taskAlertText}>
            <Text style={styles.taskAlertTitle}>
              {metrics.pendingTasks} Pending Tasks
            </Text>
            <Text style={styles.taskAlertSubtitle}>Tap to view your schedule</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      )}

      {/* Financial Summary */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 Financial Overview</Text>
        <View style={{padding: 20, backgroundColor: '#F5F5F5', borderRadius: 8, alignItems: 'center'}}>
          <Ionicons name="bar-chart" size={48} color="#2E7D32" />
          <Text style={{fontSize: 14, color: '#666', marginTop: 12, textAlign: 'center'}}>
            Interactive charts available on mobile app
          </Text>
          <Text style={{fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center'}}>
            Install the app on your phone to view harvest trends and financial charts
          </Text>
        </View>
        <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: '#666'}}>Income</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#4CAF50'}}>{formatCurrency(metrics.totalIncome)}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: '#666'}}>Expenses</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#F44336'}}>{formatCurrency(metrics.totalExpenses)}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: '#666'}}>Profit</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#2196F3'}}>{formatCurrency(metrics.profit)}</Text>
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.activitySummary}>
          {metrics.recentActivities} activities in the last 7 days
        </Text>
        {activities.slice(0, 3).map((activity, index) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
              <Ionicons name={getActivityIcon(activity.type)} size={20} color="#fff" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.type}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityDate}>
                {new Date(activity.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Farm Overview */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Plots</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { screen: 'FarmManagement' })}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>
        {plots.slice(0, 3).map(plot => (
          <View key={plot.id} style={styles.plotItem}>
            <View style={styles.plotIcon}>
              <Text style={styles.plotEmoji}>🌾</Text>
            </View>
            <View style={styles.plotContent}>
              <Text style={styles.plotName}>{plot.name}</Text>
              <Text style={styles.plotDetails}>
                {plot.cropType} • {plot.area} {plot.unit}
              </Text>
            </View>
            <View style={[styles.plotStatus, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.plotStatusText, { color: '#4CAF50' }]}>
                {plot.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const getActivityIcon = (type) => {
  const icons = {
    Planting: 'leaf',
    Irrigation: 'water',
    Fertilization: 'flask',
    'Pest Control': 'bug',
    Weeding: 'cut',
    Maintenance: 'construct',
    Monitoring: 'eye',
  };
  return icons[type] || 'ellipse';
};

const getActivityColor = (type) => {
  const colors = {
    Planting: '#4CAF50',
    Irrigation: '#2196F3',
    Fertilization: '#FF9800',
    'Pest Control': '#F44336',
    Weeding: '#8BC34A',
    Maintenance: '#9C27B0',
    Monitoring: '#00BCD4',
  };
  return colors[type] || '#757575';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#999',
  },
  taskAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    margin: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  taskAlertText: {
    flex: 1,
    marginLeft: 12,
  },
  taskAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  taskAlertSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  activitySummary: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 11,
    color: '#999',
  },
  plotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  plotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  plotEmoji: {
    fontSize: 24,
  },
  plotContent: {
    flex: 1,
  },
  plotName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  plotDetails: {
    fontSize: 12,
    color: '#666',
  },
  plotStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  plotStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
