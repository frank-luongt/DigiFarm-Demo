import React, { useState } from 'react';
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

export default function FarmManagementScreen({ navigation }) {
  const { farms, plots } = useData();
  const [expandedFarms, setExpandedFarms] = useState({});

  const toggleFarm = (farmId) => {
    setExpandedFarms(prev => ({
      ...prev,
      [farmId]: !prev[farmId],
    }));
  };

  const getPlotsByFarm = (farmId) => {
    return plots.filter(plot => plot.farmId === farmId);
  };

  const getFarmStats = (farmId) => {
    const farmPlots = getPlotsByFarm(farmId);
    const totalArea = farmPlots.reduce((sum, p) => sum + parseFloat(p.area), 0);
    const activePlots = farmPlots.filter(p => p.status === 'Active').length;
    return { totalPlots: farmPlots.length, totalArea, activePlots };
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: '#4CAF50',
      Fallow: '#FF9800',
      Preparation: '#2196F3',
      Inactive: '#757575',
    };
    return colors[status] || '#757575';
  };

  const getCropIcon = (cropType) => {
    const lowerCrop = cropType?.toLowerCase() || '';
    if (lowerCrop.includes('rice') || lowerCrop.includes('wheat')) return '🌾';
    if (lowerCrop.includes('tomato') || lowerCrop.includes('vegetable')) return '🍅';
    if (lowerCrop.includes('corn') || lowerCrop.includes('maize')) return '🌽';
    if (lowerCrop.includes('potato')) return '🥔';
    if (lowerCrop.includes('fruit')) return '🍎';
    return '🌱';
  };

  const FarmCard = ({ farm }) => {
    const isExpanded = expandedFarms[farm.id];
    const farmPlots = getPlotsByFarm(farm.id);
    const stats = getFarmStats(farm.id);

    return (
      <View style={styles.farmCard}>
        <TouchableOpacity
          style={styles.farmHeader}
          onPress={() => toggleFarm(farm.id)}
        >
          <View style={styles.farmIcon}>
            <Ionicons name="business" size={24} color="#2E7D32" />
          </View>
          <View style={styles.farmInfo}>
            <Text style={styles.farmName}>{farm.name}</Text>
            <View style={styles.farmMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text style={styles.metaText}>{farm.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="grid-outline" size={12} color="#666" />
                <Text style={styles.metaText}>{stats.totalPlots} plots</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="resize-outline" size={12} color="#666" />
                <Text style={styles.metaText}>{stats.totalArea.toFixed(1)} acres</Text>
              </View>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.farmContent}>
            {/* Farm Stats */}
            <View style={styles.farmStats}>
              <View style={styles.farmStatItem}>
                <Ionicons name="leaf" size={20} color="#4CAF50" />
                <Text style={styles.farmStatValue}>{stats.activePlots}</Text>
                <Text style={styles.farmStatLabel}>Active</Text>
              </View>
              <View style={styles.farmStatItem}>
                <Ionicons name="pause-circle" size={20} color="#FF9800" />
                <Text style={styles.farmStatValue}>
                  {farmPlots.filter(p => p.status === 'Fallow').length}
                </Text>
                <Text style={styles.farmStatLabel}>Fallow</Text>
              </View>
              <View style={styles.farmStatItem}>
                <Ionicons name="construct" size={20} color="#2196F3" />
                <Text style={styles.farmStatValue}>
                  {farmPlots.filter(p => p.status === 'Preparation').length}
                </Text>
                <Text style={styles.farmStatLabel}>Prep</Text>
              </View>
            </View>

            {/* Plot List */}
            <Text style={styles.plotsTitle}>Plots</Text>
            {farmPlots.map(plot => (
              <PlotCard key={plot.id} plot={plot} />
            ))}

            {farmPlots.length === 0 && (
              <View style={styles.emptyPlots}>
                <Ionicons name="leaf-outline" size={32} color="#ccc" />
                <Text style={styles.emptyPlotsText}>No plots in this farm</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const PlotCard = ({ plot }) => (
    <View style={styles.plotCard}>
      <View style={styles.plotHeader}>
        <Text style={styles.plotEmoji}>{getCropIcon(plot.cropType)}</Text>
        <View style={styles.plotInfo}>
          <Text style={styles.plotName}>{plot.name}</Text>
          <Text style={styles.plotCrop}>{plot.cropType}</Text>
        </View>
        <View
          style={[
            styles.plotStatusBadge,
            { backgroundColor: getStatusColor(plot.status) + '20' },
          ]}
        >
          <Text
            style={[
              styles.plotStatusText,
              { color: getStatusColor(plot.status) },
            ]}
          >
            {plot.status}
          </Text>
        </View>
      </View>

      <View style={styles.plotDetails}>
        <View style={styles.plotDetailRow}>
          <View style={styles.plotDetailItem}>
            <Ionicons name="resize-outline" size={16} color="#666" />
            <Text style={styles.plotDetailText}>
              {plot.area} {plot.unit}
            </Text>
          </View>
          {plot.soilType && (
            <View style={styles.plotDetailItem}>
              <Ionicons name="flask-outline" size={16} color="#666" />
              <Text style={styles.plotDetailText}>{plot.soilType}</Text>
            </View>
          )}
        </View>

        {plot.plantingDate && (
          <View style={styles.plotDetailRow}>
            <View style={styles.plotDetailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.plotDetailText}>
                Planted: {new Date(plot.plantingDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {plot.expectedHarvestDate && (
          <View style={styles.plotDetailRow}>
            <View style={styles.plotDetailItem}>
              <Ionicons name="basket-outline" size={16} color="#666" />
              <Text style={styles.plotDetailText}>
                Harvest: {new Date(plot.expectedHarvestDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Summary Header */}
        <View style={styles.summaryHeader}>
          <View style={styles.summaryCard}>
            <Ionicons name="business" size={24} color="#2E7D32" />
            <Text style={styles.summaryValue}>{farms.length}</Text>
            <Text style={styles.summaryLabel}>Total Farms</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="grid" size={24} color="#4CAF50" />
            <Text style={styles.summaryValue}>{plots.length}</Text>
            <Text style={styles.summaryLabel}>Total Plots</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="leaf" size={24} color="#8BC34A" />
            <Text style={styles.summaryValue}>
              {plots.filter(p => p.status === 'Active').length}
            </Text>
            <Text style={styles.summaryLabel}>Active Plots</Text>
          </View>
        </View>

        {/* Farm List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>My Farms</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => Alert.alert('Coming Soon', 'Add farm feature is under development')}
          >
            <Ionicons name="add-circle" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {farms.map(farm => (
          <FarmCard key={farm.id} farm={farm} />
        ))}

        {farms.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No farms yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first farm to get started
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  farmCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  farmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  farmIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  farmMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  farmContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  farmStats: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  farmStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  farmStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  farmStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  plotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  plotCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  plotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plotEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  plotInfo: {
    flex: 1,
  },
  plotName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  plotCrop: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  plotStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  plotStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  plotDetails: {
    marginTop: 8,
  },
  plotDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  plotDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  plotDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyPlots: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyPlotsText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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
