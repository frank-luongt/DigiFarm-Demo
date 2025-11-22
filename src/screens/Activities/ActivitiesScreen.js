import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import { Colors, Typography, Spacing, BorderRadius, IconSize, Elevation } from '../../theme/design-tokens';

export default function ActivitiesScreen({ navigation }) {
  const { activities, plots } = useData();
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const activityTypes = [
    'All',
    'Planting',
    'Irrigation',
    'Fertilization',
    'Pest Control',
    'Weeding',
    'Maintenance',
    'Monitoring',
  ];

  const filteredActivities = activities
    .filter(activity => {
      const matchesType = filterType === 'All' || activity.type === filterType;
      const matchesSearch =
        searchQuery === '' ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.cropType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
      Planting: Colors.green50,
      Irrigation: Colors.blue50,
      Fertilization: Colors.orange40,
      'Pest Control': Colors.red50,
      Weeding: Colors.green40,
      Maintenance: Colors.purple40,
      Monitoring: Colors.teal40,
    };
    return colors[type] || Colors.gray60;
  };

  const getPlotName = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    return plot ? plot.name : 'Unknown Plot';
  };

  const ActivityCard = ({ activity }) => (
    <TouchableOpacity style={styles.activityCard} activeOpacity={0.8}>
      <View style={[
        styles.activityBorder,
        { backgroundColor: getActivityColor(activity.type) }
      ]} />
      <View
        style={[
          styles.activityIconContainer,
          { backgroundColor: Colors.ui02 },
        ]}
      >
        <Ionicons
          name={getActivityIcon(activity.type)}
          size={IconSize.md}
          color={getActivityColor(activity.type)}
        />
      </View>
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityType}>{activity.type}</Text>
          <Text style={styles.activityDate}>
            {new Date(activity.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.metaText}>{getPlotName(activity.plotId)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="leaf-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.metaText}>{activity.cropType}</Text>
          </View>
          {activity.laborHours && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={IconSize.sm} color={Colors.icon02} />
              <Text style={styles.metaText}>{activity.laborHours}h</Text>
            </View>
          )}
        </View>
        {activity.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="document-text-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.notesText}>{activity.notes}</Text>
          </View>
        )}
        {activity.laborCost && (
          <Text style={styles.costText}>Cost: ₫{activity.laborCost.toLocaleString()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={[
        styles.searchContainer,
        searchFocused && styles.searchContainerFocused
      ]}>
        <Ionicons name="search" size={IconSize.md} color={Colors.icon02} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          placeholderTextColor={Colors.text03}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {activityTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              filterType === type && styles.filterChipActive,
            ]}
            onPress={() => setFilterType(type)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                filterType === type && styles.filterChipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'}
          </Text>
        </View>

        {filteredActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}

        {filteredActivities.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color={Colors.ui03} />
            <Text style={styles.emptyStateText}>No activities found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or add a new activity
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.spacing13 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddActivity')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={IconSize.xl} color={Colors.text04} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui02,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ui01,
    margin: Spacing.spacing05,
    paddingHorizontal: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  searchContainerFocused: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.focus,
  },
  searchIcon: {
    marginRight: Spacing.spacing03,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.spacing04,
    fontSize: Typography.fontSize.bodyShort02,
    color: Colors.text01,
  },
  filterContainer: {
    marginBottom: Spacing.spacing05,
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
  listHeader: {
    paddingHorizontal: Spacing.spacing05,
    paddingBottom: Spacing.spacing04,
  },
  listTitle: {
    fontSize: Typography.fontSize.label01,
    color: Colors.text02,
    fontWeight: Typography.fontWeight.semibold,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing04,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
    position: 'relative',
  },
  activityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.default,
    borderBottomLeftRadius: BorderRadius.default,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
    marginLeft: Spacing.spacing03,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.spacing02,
  },
  activityType: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
  },
  activityDate: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text03,
  },
  activityDescription: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    marginBottom: Spacing.spacing03,
  },
  activityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.spacing03,
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
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.ui02,
    padding: Spacing.spacing03,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.spacing03,
  },
  notesText: {
    flex: 1,
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginLeft: Spacing.spacing03,
  },
  costText: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.green50,
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
  fab: {
    position: 'absolute',
    right: Spacing.spacing06,
    bottom: Spacing.spacing06,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.interactive,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.shadow03,
  },
});
