import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function ReminderCard({ item, onTake, onUntake }: any) {
  return (
    <View style={[styles.reminderCard, item.taken && styles.reminderCardDone]}>
      <View style={styles.reminderLeft}>
        <View style={[styles.pillIcon, item.taken && styles.pillIconDone]}>
          <Text style={styles.pillIconText}>💊</Text>
        </View>
        <View style={styles.reminderTextBlock}>
          <Text style={[styles.reminderName, item.taken && styles.reminderNameDone]}>
            {item.name}
          </Text>
          <Text style={styles.reminderDose}>{item.dose}</Text>
          <Text style={styles.reminderTime}>🕐 {item.time}</Text>
        </View>
      </View>

      {item.taken ? (
        <TouchableOpacity style={styles.takenBtn} onPress={() => onUntake(item.id)} activeOpacity={0.8}>
          <Text style={styles.takenBtnText}>✓ Tomado</Text>
          <View style={styles.untakeIcon}>
            <Text style={styles.untakeIconText}>✕</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.takeBtn} onPress={() => onTake(item.id)} activeOpacity={0.8}>
          <Text style={styles.takeBtnText}>Tomar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const GREEN = '#2E7D5E';
const GREEN_LIGHT = '#E8F5EE';
const CARD = '#FFFFFF';
const TEXT = '#1C1C1E';
const SUBTEXT = '#6B6B6B';
const DONE_BG = '#F2F2F0';
const DONE_TEXT = '#AAAAAA';

const styles = StyleSheet.create({
  reminderCard: { backgroundColor: CARD, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  reminderCardDone: { backgroundColor: DONE_BG, shadowOpacity: 0, elevation: 0 },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  pillIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: GREEN_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  pillIconDone: { backgroundColor: '#EBEBEB' },
  pillIconText: { fontSize: 26 },
  reminderTextBlock: { flex: 1 },
  reminderName: { fontSize: 20, fontWeight: '700', color: TEXT, marginBottom: 2 },
  reminderNameDone: { color: DONE_TEXT, textDecorationLine: 'line-through' },
  reminderDose: { fontSize: 16, color: SUBTEXT, fontWeight: '500', marginBottom: 2 },
  reminderTime: { fontSize: 15, color: SUBTEXT },
  takeBtn: { backgroundColor: GREEN, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14, minWidth: 82, alignItems: 'center' },
  takeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  takenBtn: { backgroundColor: GREEN_LIGHT, paddingLeft: 14, paddingRight: 10, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  takenBtnText: { color: GREEN, fontWeight: '700', fontSize: 15 },
  untakeIcon: { backgroundColor: 'rgba(46, 125, 94, 0.15)', borderRadius: 10, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  untakeIconText: { color: GREEN, fontSize: 11, fontWeight: 'bold' },
});
