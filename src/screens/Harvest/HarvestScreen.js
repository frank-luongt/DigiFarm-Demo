import React, { useState, useMemo } from 'react';
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

export default function HarvestScreen({ navigation }) {
  const { harvests, plots } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [searchFocused, setSearchFocused] = useState(false);

  const grades = ['All', 'A', 'B', 'C'];

  const filteredHarvests = harvests
    .filter(harvest => {
      const matchesGrade = filterGrade === 'All' || harvest.grade === filterGrade;
      const matchesSearch =
        searchQuery === '' ||
        harvest.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getPlotName(harvest.plotId).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGrade && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const metrics = useMemo(() => {
    const totalQuantity = harvests.reduce((sum, h) => sum + h.quantity, 0);
    const totalValue = harvests.reduce((sum, h) => sum + (h.quantity * (h.pricePerUnit || 0)), 0);
    const totalLaborCost = harvests.reduce((sum, h) => sum + (h.laborCost || 0), 0);
    const gradeACounts = harvests.filter(h => h.grade === 'A').length;
    const gradeBCounts = harvests.filter(h => h.grade === 'B').length;
    const gradeCCounts = harvests.filter(h => h.grade === 'C').length;

    return {
      totalQuantity,
      totalValue,
      totalLaborCost,
      gradeACounts,
      gradeBCounts,
      gradeCCounts,
    };
  }, [harvests]);

  const getPlotName = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    return plot ? plot.name : 'Unknown Plot';
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: Colors.green50,
      B: Colors.orange40,
      C: Colors.red50,
    };
    return colors[grade] || Colors.gray60;
  };

  const HarvestCard = ({ harvest }) => (
    <TouchableOpacity style={styles.harvestCard} activeOpacity={0.8}>
      <View style={styles.harvestHeader}>
        <View style={styles.harvestTitleRow}>
          <View style={styles.harvestIconContainer}>
            <Ionicons name="basket" size={IconSize.md} color={Colors.green40} />
          </View>
          <View style={styles.harvestTitleContent}>
            <Text style={styles.harvestCrop}>{harvest.cropType}</Text>
            <Text style={styles.harvestPlot}>{getPlotName(harvest.plotId)}</Text>
          </View>
          <View style={[
            styles.gradeBadge,
            { borderColor: getGradeColor(harvest.grade) }
          ]}>
            <Text style={[
              styles.gradeText,
              { color: getGradeColor(harvest.grade) }
            ]}>Grade {harvest.grade}</Text>
          </View>
        </View>
        <Text style={styles.harvestDate}>
          {new Date(harvest.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.harvestMetrics}>
        <View style={styles.metricItem}>
          <Ionicons name="scale-outline" size={IconSize.sm} color={Colors.icon02} />
          <Text style={styles.metricText}>
            {harvest.quantity} {harvest.unit}
          </Text>
        </View>
        {harvest.laborHours && (
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.metricText}>{harvest.laborHours}h</Text>
          </View>
        )}
        {harvest.laborCost && (
          <View style={styles.metricItem}>
            <Ionicons name="cash-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.metricText}>₫{harvest.laborCost.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {harvest.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={IconSize.sm} color={Colors.icon02} />
          <Text style={styles.notesText}>{harvest.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const SummaryCard = ({ icon, value, label, color }) => (
    <View style={styles.summaryCard}>
      <Ionicons name={icon} size={IconSize.lg} color={color} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryContainer}
        contentContainerStyle={styles.summaryContent}
      >
        <SummaryCard
          icon="basket"
          value={`${metrics.totalQuantity} kg`}
          label="Total harvest"
          color={Colors.green40}
        />
        <SummaryCard
          icon="trending-up"
          value={`₫${(metrics.totalValue / 1000).toFixed(1)}K`}
          label="Total value"
          color={Colors.blue50}
        />
        <SummaryCard
          icon="star"
          value={metrics.gradeACounts}
          label="Grade A"
          color={Colors.green50}
        />
        <SummaryCard
          icon="star-half"
          value={metrics.gradeBCounts}
          label="Grade B"
          color={Colors.orange40}
        />
      </ScrollView>

      {/* Search Bar */}
      <View style={[
        styles.searchContainer,
        searchFocused && styles.searchContainerFocused
      ]}>
        <Ionicons name="search" size={IconSize.md} color={Colors.icon02} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search harvests..."
          placeholderTextColor={Colors.text03}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>

      {/* Grade Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {grades.map(grade => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.filterChip,
              filterGrade === grade && styles.filterChipActive,
            ]}
            onPress={() => setFilterGrade(grade)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                filterGrade === grade && styles.filterChipTextActive,
              ]}
            >
              {grade === 'All' ? 'All Grades' : `Grade ${grade}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Harvest List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filteredHarvests.length} {filteredHarvests.length === 1 ? 'Record' : 'Records'}
          </Text>
        </View>

        {filteredHarvests.map(harvest => (
          <HarvestCard key={harvest.id} harvest={harvest} />
        ))}

        {filteredHarvests.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={64} color={Colors.ui03} />
            <Text style={styles.emptyStateText}>No harvest records found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or add a new harvest
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.spacing13 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHarvest')}
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
  summaryContainer: {
    backgroundColor: Colors.ui01,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
    paddingVertical: Spacing.spacing05,
  },
  summaryContent: {
    paddingHorizontal: Spacing.spacing04,
  },
  summaryCard: {
    backgroundColor: Colors.ui02,
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing05,
    marginHorizontal: Spacing.spacing02,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  summaryValue: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginTop: Spacing.spacing03,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginTop: Spacing.spacing02,
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
  harvestCard: {
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    marginBottom: Spacing.spacing04,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  harvestHeader: {
    marginBottom: Spacing.spacing04,
  },
  harvestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.spacing03,
  },
  harvestIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing04,
  },
  harvestTitleContent: {
    flex: 1,
  },
  harvestCrop: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
  },
  harvestPlot: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginTop: Spacing.spacing01,
  },
  gradeBadge: {
    paddingHorizontal: Spacing.spacing04,
    paddingVertical: Spacing.spacing02,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  gradeText: {
    fontSize: Typography.fontSize.caption01,
    fontWeight: Typography.fontWeight.semibold,
  },
  harvestDate: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text03,
  },
  harvestMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.spacing03,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
    marginBottom: Spacing.spacing02,
  },
  metricText: {
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
    marginTop: Spacing.spacing03,
  },
  notesText: {
    flex: 1,
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginLeft: Spacing.spacing03,
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
