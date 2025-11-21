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

export default function AddActivityScreen({ navigation }) {
  const { plots, addActivity } = useData();
  const [formData, setFormData] = useState({
    plotId: '',
    type: '',
    cropType: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    quantity: '',
    quantityUnit: '',
    laborHours: '',
    laborCost: '',
    materialCost: '',
    notes: '',
  });

  const activityTypes = [
    'Planting',
    'Irrigation',
    'Fertilization',
    'Pest Control',
    'Weeding',
    'Maintenance',
    'Monitoring',
  ];

  const handleSubmit = async () => {
    if (!formData.plotId || !formData.type || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const plot = plots.find(p => p.id === formData.plotId);
      const activity = {
        ...formData,
        farmId: plot.farmId,
        cropType: formData.cropType || plot.cropType,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        laborHours: formData.laborHours ? parseFloat(formData.laborHours) : undefined,
        laborCost: formData.laborCost ? parseFloat(formData.laborCost) : undefined,
        materialCost: formData.materialCost ? parseFloat(formData.materialCost) : undefined,
      };

      await addActivity(activity);
      Alert.alert('Success', 'Activity recorded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save activity');
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
              onPress={() => setFormData({ ...formData, plotId: plot.id, cropType: plot.cropType })}
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

        {/* Activity Type */}
        <Text style={styles.label}>
          Activity Type <Text style={styles.required}>*</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {activityTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                formData.type === type && styles.chipSelected,
              ]}
              onPress={() => setFormData({ ...formData, type })}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.type === type && styles.chipTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Description */}
        <Text style={styles.label}>
          Description <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the activity"
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.date}
          onChangeText={text => setFormData({ ...formData, date: text })}
        />

        {/* Quantity */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Quantity</Text>
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
            <TextInput
              style={styles.input}
              placeholder="kg, liters, etc."
              value={formData.quantityUnit}
              onChangeText={text => setFormData({ ...formData, quantityUnit: text })}
            />
          </View>
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
            <Text style={styles.label}>Labor Cost (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.laborCost}
              onChangeText={text => setFormData({ ...formData, laborCost: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Material Cost */}
        <Text style={styles.label}>Material Cost (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={formData.materialCost}
          onChangeText={text => setFormData({ ...formData, materialCost: text })}
          keyboardType="numeric"
        />

        {/* Notes */}
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any additional observations or notes"
          value={formData.notes}
          onChangeText={text => setFormData({ ...formData, notes: text })}
          multiline
          numberOfLines={4}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>Save Activity</Text>
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
