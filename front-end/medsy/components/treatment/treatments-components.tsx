import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/tabs/treatments.styles';

export const TreatmentsHeader = ({ title }: any) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
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
    <Text style={styles.emptyTitle}>Sin tratamiento</Text>
    <Text style={styles.emptyText}>Aún no has agregado medicamentos a tu tratamiento.</Text>
    <TouchableOpacity style={styles.emptyBtn} onPress={onAddPress}>
        <Text style={styles.emptyBtnText}>Comenzar a agregar</Text>
    </TouchableOpacity>
  </View>
);

export const FAB = ({ onPress }: any) => (
  <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name="add" size={32} color="#fff" />
  </TouchableOpacity>
);
