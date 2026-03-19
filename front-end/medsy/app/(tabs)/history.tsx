import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.subtitle}>Tus registros de consumo pasados</Text>
        </View>
        <ScrollView contentContainerStyle={styles.listContent}>
           <View style={styles.emptyContainer}>
                <Ionicons name="time-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyTitle}>Sin registros</Text>
                <Text style={styles.emptyText}>Aquí aparecerá el historial detallado de tus medicamentos finalizados y tomas realizadas en el pasado.</Text>
           </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#1C1C1E', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', marginTop: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, flex: 1, justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#3A3A3C', marginTop: 16, marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#8E8E93', fontSize: 16, lineHeight: 24, paddingHorizontal: 30 },
});
