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
import { Colors, Typography, Spacing, BorderRadius, IconSize, Elevation } from '../../theme/design-tokens';

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
      return Colors.green50;
    }
    const colors = {
      Seeds: Colors.green40,
      Fertilizer: Colors.orange40,
      Pesticides: Colors.red50,
      Labor: Colors.blue50,
      Equipment: Colors.purple40,
      Maintenance: Colors.red50,
      Transportation: Colors.teal40,
    };
    return colors[category] || Colors.gray60;
  };

  const TransactionCard = ({ transaction }) => (
    <TouchableOpacity style={styles.transactionCard} activeOpacity={0.8}>
      <View style={[
        styles.transactionBorder,
        { backgroundColor: transaction.type === 'Income' ? Colors.green50 : Colors.red50 }
      ]} />
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: Colors.ui02 },
        ]}
      >
        <Ionicons
          name={getCategoryIcon(transaction.category)}
          size={IconSize.md}
          color={getCategoryColor(transaction.category, transaction.type)}
        />
      </View>
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text
            style={[
              styles.transactionAmount,
              { color: transaction.type === 'Income' ? Colors.green50 : Colors.red50 },
            ]}
          >
            {transaction.type === 'Income' ? '+' : '-'}₫{transaction.amount.toLocaleString()}
          </Text>
        </View>
        {transaction.description && (
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
        )}
        <View style={styles.transactionMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={IconSize.sm} color={Colors.icon02} />
            <Text style={styles.metaText}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
          {transaction.paymentMethod && (
            <View style={styles.metaItem}>
              <Ionicons name="card-outline" size={IconSize.sm} color={Colors.icon02} />
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
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-up" size={IconSize.lg} color={Colors.green50} />
            </View>
            <Text style={styles.summaryValue}>₫{(metrics.totalIncome / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Total income</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-down" size={IconSize.lg} color={Colors.red50} />
            </View>
            <Text style={styles.summaryValue}>₫{(metrics.totalExpenses / 1000).toFixed(1)}K</Text>
            <Text style={styles.summaryLabel}>Total expenses</Text>
          </View>
        </View>
        <View style={[
          styles.profitCard,
          { backgroundColor: metrics.profit >= 0 ? Colors.green10 : Colors.ui02 }
        ]}>
          <View style={styles.profitHeader}>
            <Text style={styles.profitLabel}>Net profit</Text>
            <View style={styles.profitBadge}>
              <Ionicons
                name={metrics.profit >= 0 ? 'arrow-up' : 'arrow-down'}
                size={IconSize.sm}
                color={metrics.profit >= 0 ? Colors.green50 : Colors.red50}
              />
              <Text
                style={[
                  styles.profitMargin,
                  { color: metrics.profit >= 0 ? Colors.green50 : Colors.red50 },
                ]}
              >
                {metrics.profitMargin.toFixed(1)}%
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.profitValue,
              { color: metrics.profit >= 0 ? Colors.green60 : Colors.red60 },
            ]}
          >
            ₫{metrics.profit.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Expense Breakdown */}
      {metrics.totalExpenses > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense breakdown</Text>
          <View style={styles.categoryList}>
            {Object.entries(metrics.expensesByCategory).map(([category, amount]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(category, 'Expense') }
                  ]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>₫{amount.toLocaleString()}</Text>
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
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
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
            <Ionicons name="wallet-outline" size={64} color={Colors.ui03} />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first transaction to start tracking finances
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.spacing13 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
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
    padding: Spacing.spacing05,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: Spacing.spacing05,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.ui02,
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing05,
    marginHorizontal: Spacing.spacing02,
    borderWidth: 1,
    borderColor: Colors.ui03,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.ui01,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.spacing03,
  },
  summaryValue: {
    fontSize: Typography.fontSize.productiveHeading04,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginTop: Spacing.spacing02,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.caption01,
    color: Colors.text02,
    marginTop: Spacing.spacing02,
  },
  profitCard: {
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing05,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  profitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.spacing03,
  },
  profitLabel: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    fontWeight: Typography.fontWeight.semibold,
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitMargin: {
    fontSize: Typography.fontSize.bodyShort01,
    fontWeight: Typography.fontWeight.semibold,
    marginLeft: Spacing.spacing02,
  },
  profitValue: {
    fontSize: Typography.fontSize.productiveHeading05,
    fontWeight: Typography.fontWeight.semibold,
  },
  chartCard: {
    backgroundColor: Colors.ui01,
    margin: Spacing.spacing05,
    padding: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  chartTitle: {
    fontSize: Typography.fontSize.productiveHeading02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
    marginBottom: Spacing.spacing05,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.ui01,
    marginHorizontal: Spacing.spacing05,
    borderRadius: BorderRadius.default,
    padding: Spacing.spacing02,
    borderWidth: 1,
    borderColor: Colors.ui03,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.spacing03,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.interactive,
  },
  tabText: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    fontWeight: Typography.fontWeight.semibold,
  },
  tabTextActive: {
    color: Colors.text04,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContainer: {
    flex: 1,
    marginTop: Spacing.spacing05,
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
  transactionCard: {
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
  transactionBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.default,
    borderBottomLeftRadius: BorderRadius.default,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.spacing05,
    marginLeft: Spacing.spacing03,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.spacing02,
  },
  transactionCategory: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text01,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.bodyShort02,
    fontWeight: Typography.fontWeight.semibold,
  },
  transactionDescription: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    marginBottom: Spacing.spacing03,
  },
  transactionMeta: {
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
  statusBadge: {
    backgroundColor: Colors.green10,
    paddingHorizontal: Spacing.spacing03,
    paddingVertical: Spacing.spacing02,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.green40,
  },
  statusText: {
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
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.spacing04,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui03,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.spacing04,
  },
  categoryName: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text01,
    fontWeight: Typography.fontWeight.semibold,
  },
  categoryAmount: {
    fontSize: Typography.fontSize.bodyShort01,
    color: Colors.text02,
    fontWeight: Typography.fontWeight.semibold,
  },
});
