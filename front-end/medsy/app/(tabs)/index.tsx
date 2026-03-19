import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ReminderCard } from '../../components/treatment/reminder-card';
import { SummaryCard } from '../../components/home/summary-card';
import { useTreatments } from '../../hooks/use-treatments';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

const USER_NAME = 'Usuario';


export default function HomeScreen() {
  const router = useRouter();
  const { treatments, loading, refetch } = useTreatments();
  const [reminders, setReminders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (treatments) {
      const mapped = treatments.map((t) => ({
        id: t.id.toString(),
        name: t.medicationName,
        dose: t.dosage,
        time: t.frequency, // Using frequency as time for now
        taken: false,
      }));
      setReminders(mapped);
    }
  }, [treatments]);

  const doneCount = reminders.filter((r) => r.taken).length;
  const total = reminders.length;
  const allDone = total > 0 && doneCount === total;

  function handleTake(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, taken: true } : r))
    );
  }

  if (loading && reminders.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2E7D5E" />
          <Text style={{ marginTop: 10, color: '#6B6B6B' }}>Cargando tus medicamentos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      {/* ── Scrollable content ─────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{USER_NAME} 👋</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>M</Text>
          </View>
        </View>

        {/* ── Progress summary ────────────────────────────── */}
        {total > 0 && (
          <SummaryCard
            allDone={allDone}
            total={total}
            doneCount={doneCount}
            reminders={reminders}
          />
        )}

        {/* ── Section label ───────────────────────────────── */}
        {total > 0 && <Text style={styles.sectionLabel}>Mis medicamentos de hoy</Text>}

        {/* ── Reminder cards ──────────────────────────────── */}
        {total > 0 ? (
          reminders.map((item) => (
            <ReminderCard key={item.id} item={item} onTake={handleTake} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🌿</Text>
            <Text style={styles.emptyStateText}>No tienes medicamentos programados para hoy.</Text>
            <Text style={styles.emptyStateSubtext}>Puedes agregar nuevos tratamientos buscando en el catálogo o usando el botón "+" en la pestaña de Tratamientos.</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Floating Action Button ────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/treatments')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GREEN = '#2E7D5E';
const GREEN_LIGHT = '#E8F5EE';
const BG = '#FAFAF7';
const CARD = '#FFFFFF';
const TEXT = '#1C1C1E';
const SUBTEXT = '#6B6B6B';
const DONE_BG = '#F2F2F0';
const DONE_TEXT = '#AAAAAA';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  emptyState: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: SUBTEXT,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    color: SUBTEXT,
    fontWeight: '400',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: GREEN,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
});