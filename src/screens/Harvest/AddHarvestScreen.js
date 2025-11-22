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

export default function AddHarvestScreen({ navigation }) {
  const { plots, addHarvest } = useData();
  const [formData, setFormData] = useState({
    plotId: '',
    cropType: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'kg',
    grade: '',
    laborHours: '',
    laborCost: '',
    notes: '',
  });

  const grades = ['A', 'B', 'C'];
  const units = ['kg', 'tons', 'bags', 'pieces'];

  const handleSubmit = async () => {
    if (!formData.plotId || !formData.cropType || !formData.quantity || !formData.grade) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const plot = plots.find(p => p.id === formData.plotId);
      const harvest = {
        ...formData,
        farmId: plot.farmId,
        quantity: parseFloat(formData.quantity),
        laborHours: formData.laborHours ? parseFloat(formData.laborHours) : undefined,
        laborCost: formData.laborCost ? parseFloat(formData.laborCost) : undefined,
      };

      await addHarvest(harvest);
      Alert.alert('Success', 'Harvest recorded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save harvest');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Plot Selection */}
        <Text style={styles.label}>
          Select Plot <Text style={styles.required}>*</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {plots.map(plot => (
            <TouchableOpacity
              key={plot.id}
              style={[
                styles.chip,
                formData.plotId === plot.id && styles.chipSelected,
              ]}
              onPress={() => setFormData({
                ...formData,
                plotId: plot.id,
                cropType: plot.cropType
              })}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.plotId === plot.id && styles.chipTextSelected,
                ]}
              >
                {plot.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Crop Type */}
        <Text style={styles.label}>
          Crop Type <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Tomatoes, Rice, Wheat"
          value={formData.cropType}
          onChangeText={text => setFormData({ ...formData, cropType: text })}
        />

        {/* Date */}
        <Text style={styles.label}>
          Harvest Date <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.date}
          onChangeText={text => setFormData({ ...formData, date: text })}
        />

        {/* Quantity and Unit */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>
              Quantity <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.quantity}
              onChangeText={text => setFormData({ ...formData, quantity: text })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Unit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitChipContainer}>
              {units.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitChip,
                    formData.unit === unit && styles.unitChipSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, unit })}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      formData.unit === unit && styles.unitChipTextSelected,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Grade */}
        <Text style={styles.label}>
          Grade <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.gradeContainer}>
          {grades.map(grade => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.gradeButton,
                formData.grade === grade && styles.gradeButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, grade })}
            >
              <Ionicons
                name={formData.grade === grade ? 'checkbox' : 'square-outline'}
                size={24}
                color={formData.grade === grade ? '#2E7D32' : '#999'}
              />
              <Text
                style={[
                  styles.gradeText,
                  formData.grade === grade && styles.gradeTextSelected,
                ]}
              >
                Grade {grade}
              </Text>
              <Text style={styles.gradeDescription}>
                {grade === 'A' && 'Premium quality'}
                {grade === 'B' && 'Good quality'}
                {grade === 'C' && 'Average quality'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Labor */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Labor Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.laborHours}
              onChangeText={text => setFormData({ ...formData, laborHours: text })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Labor Cost (₫)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.laborCost}
              onChangeText={text => setFormData({ ...formData, laborCost: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any additional observations about the harvest"
          value={formData.notes}
          onChangeText={text => setFormData({ ...formData, notes: text })}
          multiline
          numberOfLines={4}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>Record Harvest</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  unitChipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unitChipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  unitChipText: {
    fontSize: 12,
    color: '#666',
  },
  unitChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  gradeContainer: {
    marginBottom: 8,
  },
  gradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  gradeButtonSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#F1F8E9',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  gradeTextSelected: {
    color: '#2E7D32',
  },
  gradeDescription: {
    fontSize: 12,
    color: '#999',
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
