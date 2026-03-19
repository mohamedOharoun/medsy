import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTreatments } from '../../hooks/use-treatments';
import { MedicationListItem } from '../../components/medication/medication-list-item';
import { TreatmentModal } from '../../components/treatment/treatment-modal';
import { Treatment } from '../../services/api';

export default function TreatmentsScreen() {
  const { treatments, loading, addTreatment, updateTreatment, deleteTreatment } = useTreatments();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const handleAddPress = () => {
    setEditingTreatment(null);
    setModalVisible(true);
  };

  const handleEditPress = (t: Treatment) => {
    setEditingTreatment(t);
    setModalVisible(true);
  };

  const handleSave = (name: string, dosage: string, frequency: string) => {
    if (editingTreatment) {
      updateTreatment(editingTreatment.id, name, dosage, frequency);
    } else {
      addTreatment(name, dosage, frequency);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis tratamientos</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2E7D5E" />
            <Text style={styles.loadingText}>Cargando tus medicamentos...</Text>
          </View>
        ) : (
          <FlatList
            data={treatments}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <MedicationListItem 
                treatment={item} 
                onEdit={handleEditPress} 
                onDelete={deleteTreatment} 
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="medical-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyTitle}>Ningún tratamiento</Text>
                <Text style={styles.emptyText}>Todavía no has añadido medicamentos a tu tratamiento.</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={handleAddPress}>
                    <Text style={styles.emptyBtnText}>Comenzar a añadir</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        <TreatmentModal 
          visible={modalVisible}
          treatment={editingTreatment}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#2E7D5E',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extrapadding for tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A3A3C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: 'rgba(46, 125, 94, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#2E7D5E',
    fontWeight: '600',
    fontSize: 16,
  }
});
