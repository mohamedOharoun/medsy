import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/tabs/treatments.styles';

export const TreatmentsHeader = ({ title, onAddPress }: any) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
      <Ionicons name="add" size={26} color="#fff" />
    </TouchableOpacity>
  </View>
);

export const LoadingTreatments = () => (
  <View style={styles.centerBox}>
    <ActivityIndicator size="large" color="#2E7D5E" />
    <Text style={styles.loadingText}>Cargando tus medicamentos...</Text>
  </View>
);

export const EmptyTreatmentsState = ({ onAddPress }: any) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="medical-outline" size={64} color="#C7C7CC" />
    <Text style={styles.emptyTitle}>Ningún tratamiento</Text>
    <Text style={styles.emptyText}>Todavía no has añadido medicamentos a tu tratamiento.</Text>
    <TouchableOpacity style={styles.emptyBtn} onPress={onAddPress}>
        <Text style={styles.emptyBtnText}>Comenzar a añadir</Text>
    </TouchableOpacity>
  </View>
);
