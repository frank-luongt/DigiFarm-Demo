import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';

export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useData();
  const [formData, setFormData] = useState({
    type: 'Expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Completed',
  });

  const types = ['Income', 'Expense'];
  const incomeCategories = ['Crop Sales', 'Livestock Sales', 'Government Subsidy', 'Other Income'];
  const expenseCategories = ['Seeds', 'Fertilizer', 'Pesticides', 'Labor', 'Equipment', 'Maintenance', 'Transportation', 'Other Expense'];
  const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'UPI'];
  const paymentStatuses = ['Completed', 'Pending', 'Failed'];

  const categories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  const handleSubmit = async () => {
    if (!formData.category || !formData.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await addTransaction(transaction);
      Alert.alert('Success', 'Transaction added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Type Selection */}
        <Text style={styles.label}>
          Transaction Type <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.typeContainer}>
          {types.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                formData.type === type && styles.typeButtonSelected,
                formData.type === type && type === 'Income' && styles.typeButtonIncome,
                formData.type === type && type === 'Expense' && styles.typeButtonExpense,
              ]}
              onPress={() => setFormData({ ...formData, type, category: '' })}
            >
              <Ionicons
                name={type === 'Income' ? 'trending-up' : 'trending-down'}
                size={24}
                color={formData.type === type ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.typeText,
                  formData.type === type && styles.typeTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                formData.category === category && styles.chipSelected,
              ]}
              onPress={() => setFormData({ ...formData, category })}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.category === category && styles.chipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Amount */}
        <Text style={styles.label}>
          Amount (₫) <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₫</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={formData.amount}
            onChangeText={text => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Date */}
        <Text style={styles.label}>
          Date <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.date}
          onChangeText={text => setFormData({ ...formData, date: text })}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add details about this transaction"
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
        >
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method}
              style={[
                styles.chip,
                formData.paymentMethod === method && styles.chipSelected,
              ]}
              onPress={() => setFormData({ ...formData, paymentMethod: method })}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.paymentMethod === method && styles.chipTextSelected,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Payment Status */}
        <Text style={styles.label}>Payment Status</Text>
        <View style={styles.statusContainer}>
          {paymentStatuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                formData.paymentStatus === status && styles.statusButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, paymentStatus: status })}
            >
              <Ionicons
                name={
                  status === 'Completed'
                    ? 'checkmark-circle-outline'
                    : status === 'Pending'
                    ? 'time-outline'
                    : 'close-circle-outline'
                }
                size={20}
                color={formData.paymentStatus === status ? '#2E7D32' : '#999'}
              />
              <Text
                style={[
                  styles.statusText,
                  formData.paymentStatus === status && styles.statusTextSelected,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  required: {
    color: '#F44336',
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  typeButtonSelected: {
    borderWidth: 2,
  },
  typeButtonIncome: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonExpense: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  typeTextSelected: {
    color: '#fff',
  },
  chipContainer: {
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  statusTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
