import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';

export default function FinanceScreen({ navigation }) {
  const { transactions } = useData();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Income', 'Expense'];

  const filteredTransactions = transactions
    .filter(transaction => activeTab === 'All' || transaction.type === activeTab)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

    // Category breakdown for expenses
    const expensesByCategory = {};
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    // Category breakdown for income
    const incomeByCategory = {};
    transactions
      .filter(t => t.type === 'Income')
      .forEach(t => {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      });

    return {
      totalIncome,
      totalExpenses,
      profit,
      profitMargin,
      expensesByCategory,
      incomeByCategory,
    };
  }, [transactions]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Crop Sales': 'basket',
      'Livestock Sales': 'paw',
      'Government Subsidy': 'document-text',
      'Other Income': 'cash',
      Seeds: 'leaf',
      Fertilizer: 'flask',
      Pesticides: 'bug',
      Labor: 'people',
      Equipment: 'construct',
      Maintenance: 'hammer',
      Transportation: 'car',
      'Other Expense': 'ellipsis-horizontal',
    };
    return icons[category] || 'cash-outline';
  };

  const getCategoryColor = (category, type) => {
    if (type === 'Income') {
      return '#4CAF50';
    }
    const colors = {
      Seeds: '#8BC34A',
      Fertilizer: '#FF9800',
      Pesticides: '#F44336',
      Labor: '#2196F3',
      Equipment: '#9C27B0',
      Maintenance: '#FF5722',
      Transportation: '#00BCD4',
    };
    return colors[category] || '#757575';
  };


  const TransactionCard = ({ transaction }) => (
    <TouchableOpacity style={styles.transactionCard}>
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: getCategoryColor(transaction.category, transaction.type) },
        ]}
      >
        <Ionicons
          name={getCategoryIcon(transaction.category)}
          size={24}
          color="#fff"
        />
      </View>
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text
            style={[
              styles.transactionAmount,
              { color: transaction.type === 'Income' ? '#4CAF50' : '#F44336' },
            ]}
          >
            {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </Text>
        </View>
        {transaction.description && (
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
        )}
        <View style={styles.transactionMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color="#666" />
            <Text style={styles.metaText}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
          {transaction.paymentMethod && (
            <View style={styles.metaItem}>
              <Ionicons name="card-outline" size={12} color="#666" />
              <Text style={styles.metaText}>{transaction.paymentMethod}</Text>
            </View>
          )}
          {transaction.paymentStatus && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{transaction.paymentStatus}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: '#4CAF50' }]}>
            <Ionicons name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.summaryValue}>₹{(metrics.totalIncome / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Total Income</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#F44336' }]}>
            <Ionicons name="trending-down" size={24} color="#F44336" />
            <Text style={styles.summaryValue}>₹{(metrics.totalExpenses / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </View>
        </View>
        <View style={[styles.profitCard, { backgroundColor: metrics.profit >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
          <View style={styles.profitHeader}>
            <Text style={styles.profitLabel}>Net Profit</Text>
            <View style={styles.profitBadge}>
              <Ionicons
                name={metrics.profit >= 0 ? 'arrow-up' : 'arrow-down'}
                size={16}
                color={metrics.profit >= 0 ? '#4CAF50' : '#F44336'}
              />
              <Text
                style={[
                  styles.profitMargin,
                  { color: metrics.profit >= 0 ? '#4CAF50' : '#F44336' },
                ]}
              >
                {metrics.profitMargin.toFixed(1)}%
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.profitValue,
              { color: metrics.profit >= 0 ? '#2E7D32' : '#C62828' },
            ]}
          >
            ₹{metrics.profit.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Expense Breakdown */}
      {metrics.totalExpenses > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <View style={styles.categoryList}>
            {Object.entries(metrics.expensesByCategory).map(([category, amount]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category, 'Expense') }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>₹{amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'Transaction' : 'Transactions'}
          </Text>
        </View>

        {filteredTransactions.map(transaction => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}

        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first transaction to start tracking finances
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
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
  profitCard: {
    borderRadius: 12,
    padding: 16,
  },
  profitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profitLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitMargin: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  profitValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
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
  transactionCard: {
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
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  transactionMeta: {
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
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#4CAF50',
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
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
