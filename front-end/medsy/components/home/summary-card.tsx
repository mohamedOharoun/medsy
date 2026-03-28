import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SummaryCard({ allDone, total, doneCount, reminders }: any) {
  return (
    <View style={allDone ? styles.summaryCardDone : styles.summaryCard}>
      {allDone ? (
        <>
          <Text style={styles.summaryEmoji}>🎉</Text>
          <Text style={styles.summaryTitle}>¡Muy bien!</Text>
          <Text style={styles.summarySubtitle}>
            Has tomado todos los medicamentos de hoy.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.summaryTitle}>
            Te quedan{' '}
            <Text style={styles.summaryHighlight}>{total - doneCount}</Text>{' '}
            medicamento{total - doneCount !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.summarySubtitle}>de {total} para hoy</Text>
          <View style={styles.dotsRow}>
            {reminders.map((r: any) => (
              <View key={r.id} style={[styles.dot, r.taken && styles.dotDone]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const GREEN = '#2E7D5E';
const styles = StyleSheet.create({
  summaryCard: { backgroundColor: GREEN, borderRadius: 22, padding: 24, marginBottom: 28 },
  summaryCardDone: { backgroundColor: GREEN, borderRadius: 22, padding: 24, marginBottom: 28, alignItems: 'center' },
  summaryEmoji: { fontSize: 40, marginBottom: 8 },
  summaryTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, letterSpacing: -0.3 },
  summaryHighlight: { fontSize: 26, fontWeight: '900', color: '#AAFFD4' },
  summarySubtitle: { fontSize: 17, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 16 },
  dotsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotDone: { backgroundColor: '#AAFFD4' },
});
