import React, { useMemo } from 'react';
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
import { Colors, Typography, Spacing, BorderRadius, Elevation, IconSize } from '../../theme/design-tokens';

export default function ProfileScreen({ navigation }) {
  const { user, farms, plots, activities, harvests, transactions, logout } = useData();

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalFarms = farms.length;
    const totalPlots = plots.length;
    const activePlots = plots.filter(p => p.status === 'Active').length;
    const totalArea = plots.reduce((sum, p) => sum + parseFloat(p.area), 0);
    const totalActivities = activities.length;
    const totalHarvests = harvests.reduce((sum, h) => sum + h.quantity, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalFarms,
      totalPlots,
      activePlots,
      totalArea,
      totalActivities,
      totalHarvests,
      totalIncome,
      totalExpenses,
    };
  }, [farms, plots, activities, harvests, transactions]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: Colors.ui02 }]}>
        <Ionicons name={icon} size={IconSize.md} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={IconSize.md} color={Colors.icon02} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={IconSize.md} color={Colors.icon02} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={48} color={Colors.text04} />
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'farmer@example.com'}</Text>
        {user?.phone && <Text style={styles.userPhone}>+84 {user.phone}</Text>}
      </View>

      {/* Farm Summary Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm summary</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="business"
            value={stats.totalFarms}
            label="Farms"
            color={Colors.blue50}
          />
          <StatCard
            icon="grid"
            value={stats.totalPlots}
            label="Total plots"
            color={Colors.green40}
          />
          <StatCard
            icon="leaf"
            value={stats.activePlots}
            label="Active plots"
            color={Colors.green50}
          />
          <StatCard
            icon="resize"
            value={`${stats.totalArea.toFixed(1)}`}
            label="Total area"
            color={Colors.purple40}
          />
        </View>
      </View>

      {/* Activity Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="clipboard" size={IconSize.lg} color={Colors.blue50} />
            </View>
            <Text style={styles.summaryValue}>{stats.totalActivities}</Text>
            <Text style={styles.summaryLabel}>Activities</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="basket" size={IconSize.lg} color={Colors.yellow30} />
            </View>
            <Text style={styles.summaryValue}>{stats.totalHarvests} kg</Text>
            <Text style={styles.summaryLabel}>Harvested</Text>
          </View>
        </View>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-up" size={IconSize.lg} color={Colors.green50} />
            </View>
            <Text style={styles.summaryValue}>₫{(stats.totalIncome / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Income</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-down" size={IconSize.lg} color={Colors.red50} />
            </View>
            <Text style={styles.summaryValue}>₫{(stats.totalExpenses / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Expenses</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <MenuItem
          icon="business-outline"
          title="Farm management"
          subtitle="Manage your farms and plots"
          onPress={() => navigation.navigate('FarmManagement')}
        />
        <MenuItem
          icon="person-outline"
          title="Edit profile"
          subtitle="Update your personal information"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
        />
        <MenuItem
          icon="settings-outline"
          title="Settings"
          subtitle="App preferences and configuration"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
        />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
        />
        <MenuItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
        />
        <MenuItem
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert('DigiFarm', 'Version 1.0.0\n\nA comprehensive farm management solution.')}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={IconSize.md} color={Colors.red50} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.spacing10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui02,
  },
  header: {
    backgroundColor: Colors.ui01,
    paddingTop: Spacing.spacing10,
    paddingBottom: Spacing.spacing07,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  profileImageContainer: {
    marginBottom: Spacing.spacing05,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.interactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  userEmail: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    marginBottom: Spacing.spacing02,
  },
  userPhone: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
  },
  section: {
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginTop: Spacing.spacing05,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.productiveHeading03,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing05,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.ui02,
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing05,
    marginBottom: Spacing.spacing05,
    marginRight: '2%',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.spacing04,
  },
  statValue: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  statLabel: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.ui02,
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing05,
    marginRight: Spacing.spacing05,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui01,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.spacing04,
  },
  summaryValue: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
  },
  menuSection: {
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginTop: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.spacing05,
    paddingVertical: Spacing.spacing05,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing02,
  },
  menuSubtitle: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginTop: Spacing.spacing05,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.red50,
  },
  logoutText: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.red50,
    marginLeft: Spacing.spacing03,
  },
});
