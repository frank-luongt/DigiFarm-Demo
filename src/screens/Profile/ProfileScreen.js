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
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, onPress, color = '#2E7D32' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'farmer@example.com'}</Text>
        {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
      </View>

      {/* Farm Summary Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm Summary</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="business"
            value={stats.totalFarms}
            label="Farms"
            color="#2E7D32"
          />
          <StatCard
            icon="grid"
            value={stats.totalPlots}
            label="Total Plots"
            color="#4CAF50"
          />
          <StatCard
            icon="leaf"
            value={stats.activePlots}
            label="Active Plots"
            color="#8BC34A"
          />
          <StatCard
            icon="resize"
            value={`${stats.totalArea.toFixed(1)}`}
            label="Total Area"
            color="#2196F3"
          />
        </View>
      </View>

      {/* Activity Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="clipboard" size={20} color="#2E7D32" />
            <Text style={styles.summaryValue}>{stats.totalActivities}</Text>
            <Text style={styles.summaryLabel}>Activities</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="basket" size={20} color="#FF9800" />
            <Text style={styles.summaryValue}>{stats.totalHarvests} kg</Text>
            <Text style={styles.summaryLabel}>Harvested</Text>
          </View>
        </View>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.summaryValue}>₹{(stats.totalIncome / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Income</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="trending-down" size={20} color="#F44336" />
            <Text style={styles.summaryValue}>₹{(stats.totalExpenses / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Expenses</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.section}>
        <MenuItem
          icon="business-outline"
          title="Farm Management"
          subtitle="Manage your farms and plots"
          onPress={() => navigation.navigate('FarmManagement')}
          color="#2E7D32"
        />
        <MenuItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          color="#2196F3"
        />
        <MenuItem
          icon="settings-outline"
          title="Settings"
          subtitle="App preferences and configuration"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          color="#9C27B0"
        />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          color="#FF9800"
        />
        <MenuItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          color="#00BCD4"
        />
        <MenuItem
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert('DigiFarm', 'Version 1.0.0\n\nA comprehensive farm management solution.')}
          color="#757575"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 60,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  userPhone: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 8,
  },
});
