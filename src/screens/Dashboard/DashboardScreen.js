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
import { Colors, Typography, Spacing, BorderRadius, Elevation, IconSize } from '../../theme/design-tokens';

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

    return {
      totalIncome,
      totalExpenses,
      profit,
      totalHarvest,
      activePlots,
      pendingTasks,
      recentActivities,
    };
  }, [transactions, harvests, plots, tasks, activities]);

  const formatCurrency = (amount) => {
    return `₫${(amount / 1000).toFixed(1)}K`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    const icons = {
      Planting: 'leaf',
      Irrigation: 'water',
      Fertilization: 'flask',
      'Pest Control': 'bug',
      Weeding: 'cut',
      Maintenance: 'construct',
      Monitoring: 'analytics',
    };
    return icons[type] || 'ellipse';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, {user?.name || 'Farmer'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={IconSize.lg} color={Colors.icon01} />
          {metrics.pendingTasks > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{metrics.pendingTasks}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Profit Card */}
          <TouchableOpacity
            style={[styles.metricCard, styles.metricCardLarge]}
            onPress={() => navigation.navigate('Finance')}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Net profit</Text>
              <Ionicons name="trending-up" size={IconSize.md} color={Colors.green40} />
            </View>
            <Text style={[styles.metricValue, { color: metrics.profit >= 0 ? Colors.green50 : Colors.red50 }]}>
              {formatCurrency(metrics.profit)}
            </Text>
            <View style={styles.metricSubRow}>
              <Text style={styles.metricSub}>
                <Text style={{ color: Colors.green50 }}>↑ {formatCurrency(metrics.totalIncome)}</Text>
                {' '}income
              </Text>
              <Text style={styles.metricSub}>
                <Text style={{ color: Colors.red50 }}>↓ {formatCurrency(metrics.totalExpenses)}</Text>
                {' '}expenses
              </Text>
            </View>
          </TouchableOpacity>

          {/* Harvest Card */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Harvest')}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total harvest</Text>
              <Ionicons name="basket-outline" size={IconSize.md} color={Colors.yellow30} />
            </View>
            <Text style={styles.metricValue}>{metrics.totalHarvest} kg</Text>
            <Text style={styles.metricSub}>All crops combined</Text>
          </TouchableOpacity>

          {/* Active Plots Card */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Active plots</Text>
              <Ionicons name="leaf-outline" size={IconSize.md} color={Colors.green40} />
            </View>
            <Text style={styles.metricValue}>{metrics.activePlots}</Text>
            <Text style={styles.metricSub}>{plots.length} total plots</Text>
          </TouchableOpacity>

          {/* Recent Activities Card */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Activities')}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Activities</Text>
              <Ionicons name="clipboard-outline" size={IconSize.md} color={Colors.blue40} />
            </View>
            <Text style={styles.metricValue}>{metrics.recentActivities}</Text>
            <Text style={styles.metricSub}>Last 7 days</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Tasks Alert */}
        {metrics.pendingTasks > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => navigation.navigate('Calendar')}
            activeOpacity={0.8}
          >
            <View style={styles.alertIconContainer}>
              <Ionicons name="time" size={IconSize.md} color={Colors.orange40} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{metrics.pendingTasks} pending tasks</Text>
              <Text style={styles.alertDescription}>Review your scheduled farm activities</Text>
            </View>
            <Ionicons name="chevron-forward" size={IconSize.md} color={Colors.icon02} />
          </TouchableOpacity>
        )}

        {/* Recent Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent activities</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
              <Text style={styles.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {activities.slice(0, 5).map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.listItem,
                  index !== activities.slice(0, 5).length - 1 && styles.listItemBorder
                ]}
              >
                <View style={styles.listItemIcon}>
                  <Ionicons name={getActivityIcon(activity.type)} size={IconSize.md} color={Colors.green40} />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{activity.type}</Text>
                  <Text style={styles.listItemDescription}>{activity.description}</Text>
                </View>
                <Text style={styles.listItemDate}>{formatDate(activity.date)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Plots Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your plots</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.sectionLink}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {plots.slice(0, 3).map((plot, index) => (
              <View
                key={plot.id}
                style={[
                  styles.listItem,
                  index !== plots.slice(0, 3).length - 1 && styles.listItemBorder
                ]}
              >
                <View style={styles.plotIconContainer}>
                  <Text style={styles.plotIcon}>🌾</Text>
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{plot.name}</Text>
                  <Text style={styles.listItemDescription}>
                    {plot.cropType} • {plot.area} {plot.unit}
                  </Text>
                </View>
                <View style={[styles.tag, styles.tagGreen]}>
                  <Text style={styles.tagText}>{plot.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.spacing05,
    paddingTop: Spacing.spacing10,
    paddingBottom: Spacing.spacing06,
    backgroundColor: Colors.ui01,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  headerTitle: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.red50,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text04,
    fontWeight: Typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.spacing05,
  },
  metricCard: {
    backgroundColor: Colors.ui01,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
    width: '48%',
    marginBottom: Spacing.spacing05,
    marginRight: '2%',
  },
  metricCardLarge: {
    width: '100%',
    marginRight: 0,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.spacing04,
  },
  metricLabel: {
    fontSize: Typography.fontSize.label01,
    color: Colors.text02,
  },
  metricValue: {
    fontSize: Typography.fontSize.productiveHeading05,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing03,
  },
  metricSub: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginRight: Spacing.spacing05,
  },
  metricSubRow: {
    flexDirection: 'row',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing05,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange40,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.ui03,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  alertDescription: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
  },
  section: {
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing05,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.spacing05,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.productiveHeading03,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
  },
  sectionLink: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.link01,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: Colors.ui03,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.spacing05,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.green10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
  },
  plotIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
  },
  plotIcon: {
    fontSize: 24,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  listItemDescription: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
  },
  listItemDate: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text03,
  },
  tag: {
    height: 24,
    paddingHorizontal: Spacing.spacing03,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagGreen: {
    backgroundColor: Colors.green10,
  },
  tagText: {
    fontSize: Typography.fontSize.caption01,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.green60,
  },
});
