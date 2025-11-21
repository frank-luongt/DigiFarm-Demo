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

export default function HarvestScreen({ navigation }) {
  const { harvests, plots } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');

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
      A: '#4CAF50',
      B: '#FF9800',
      C: '#F44336',
    };
    return colors[grade] || '#757575';
  };

  const HarvestCard = ({ harvest }) => (
    <TouchableOpacity style={styles.harvestCard}>
      <View style={styles.harvestHeader}>
        <View style={styles.harvestTitleRow}>
          <Ionicons name="basket" size={24} color="#2E7D32" />
          <View style={styles.harvestTitleContent}>
            <Text style={styles.harvestCrop}>{harvest.cropType}</Text>
            <Text style={styles.harvestPlot}>{getPlotName(harvest.plotId)}</Text>
          </View>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(harvest.grade) }]}>
            <Text style={styles.gradeText}>Grade {harvest.grade}</Text>
          </View>
        </View>
        <Text style={styles.harvestDate}>
          {new Date(harvest.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.harvestMetrics}>
        <View style={styles.metricItem}>
          <Ionicons name="scale-outline" size={16} color="#666" />
          <Text style={styles.metricText}>
            {harvest.quantity} {harvest.unit}
          </Text>
        </View>
        {harvest.laborHours && (
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metricText}>{harvest.laborHours}h</Text>
          </View>
        )}
        {harvest.laborCost && (
          <View style={styles.metricItem}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.metricText}>₹{harvest.laborCost.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {harvest.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={14} color="#999" />
          <Text style={styles.notesText}>{harvest.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="basket" size={24} color="#4CAF50" />
          <Text style={styles.summaryValue}>{metrics.totalQuantity} kg</Text>
          <Text style={styles.summaryLabel}>Total Harvest</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-up" size={24} color="#2196F3" />
          <Text style={styles.summaryValue}>₹{(metrics.totalValue / 1000).toFixed(1)}K</Text>
          <Text style={styles.summaryLabel}>Total Value</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="star" size={24} color="#4CAF50" />
          <Text style={styles.summaryValue}>{metrics.gradeACounts}</Text>
          <Text style={styles.summaryLabel}>Grade A</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="star-half" size={24} color="#FF9800" />
          <Text style={styles.summaryValue}>{metrics.gradeBCounts}</Text>
          <Text style={styles.summaryLabel}>Grade B</Text>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search harvests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
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
      <ScrollView style={styles.listContainer}>
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
            <Ionicons name="basket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No harvest records found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or add a new harvest
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHarvest')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    minWidth: 120,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 16,
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
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  harvestCard: {
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
  harvestHeader: {
    marginBottom: 12,
  },
  harvestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  harvestTitleContent: {
    flex: 1,
    marginLeft: 12,
  },
  harvestCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  harvestPlot: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  harvestDate: {
    fontSize: 12,
    color: '#999',
  },
  harvestMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
