import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/tabs/history.styles';

export const HistoryHeader = ({ title, subtitle }: any) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

export const EmptyHistoryState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="time-outline" size={64} color="#C7C7CC" />
    <Text style={styles.emptyTitle}>Sin registros</Text>
    <Text style={styles.emptyText}>Tu historial detallado de medicamentos completados e ingestas pasadas aparecerá aquí.</Text>
  </View>
);
