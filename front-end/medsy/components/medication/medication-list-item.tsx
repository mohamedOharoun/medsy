import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Treatment } from '../../services/api';

interface Props {
  treatment: Treatment;
  onEdit: (t: Treatment) => void;
  onDelete: (t: Treatment) => void;
}

export const MedicationListItem: React.FC<Props> = ({ treatment, onEdit, onDelete }) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderLeftActions = (progress: any, dragX: any) => {
    return (
      <TouchableOpacity 
        style={[styles.actionButton, styles.editAction]} 
        onPress={() => {
          swipeableRef.current?.close();
          onEdit(treatment);
        }}
      >
        <Ionicons name="pencil" size={24} color="#FFF" />
        <Text style={styles.actionText}>Editar</Text>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <TouchableOpacity 
        style={[styles.actionButton, styles.deleteAction]} 
        onPress={() => {
          swipeableRef.current?.close();
          onDelete(treatment);
        }}
      >
        <Ionicons name="trash" size={24} color="#FFF" />
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable 
      ref={swipeableRef}
      renderLeftActions={renderLeftActions} 
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={24} color="#2E7D5E" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{treatment.medicationName}</Text>
          <Text style={styles.details}>{treatment.dosage} • {treatment.frequency}</Text>
          {treatment.times && treatment.times.length > 0 && (
            <Text style={styles.timesText}>Próximas ingestas: {treatment.times.join(', ')}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => onEdit(treatment)}>
            <Ionicons name="pencil" size={18} color="#2E7D5E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onDelete(treatment)}>
            <Ionicons name="trash" size={18} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(46, 125, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timesText: {
    fontSize: 12,
    color: '#2E7D5E',
    marginTop: 2,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderRadius: 16,
  },
  editAction: {
    backgroundColor: '#2E7D5E',
    marginRight: 8,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  }
});
