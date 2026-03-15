import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock data ────────────────────────────────────────────────────────────────

const USER_NAME = 'User';

const TODAY_REMINDERS = [
  {
    id: '1',
    name: 'Ibuprofeno',
    dose: '400 mg',
    time: '08:00',
    taken: true,
  },
  {
    id: '2',
    name: 'Omeprazol',
    dose: '20 mg',
    time: '14:00',
    taken: false,
  },
  {
    id: '3',
    name: 'Atorvastatina',
    dose: '10 mg',
    time: '21:00',
    taken: false,
  },
];
// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

// ─── Components ───────────────────────────────────────────────────────────────

function ReminderCard({
  item,
  onTake,
}: {
  item: (typeof TODAY_REMINDERS)[0];
  onTake: (id: string) => void;
}) {
  return (
    <View style={[styles.reminderCard, item.taken && styles.reminderCardDone]}>
      {/* Left: pill icon + info */}
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

      {/* Right: action */}
      {item.taken ? (
        <View style={styles.takenBadge}>
          <Text style={styles.takenBadgeText}>✓ Tomado</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.takeBtn}
          onPress={() => onTake(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.takeBtnText}>Tomar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [reminders, setReminders] = useState(TODAY_REMINDERS);
  const [activeTab, setActiveTab] = useState('home');

  const doneCount = reminders.filter((r) => r.taken).length;
  const total = reminders.length;
  const allDone = doneCount === total;

  function handleTake(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, taken: true } : r))
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
                {reminders.map((r) => (
                  <View key={r.id} style={[styles.dot, r.taken && styles.dotDone]} />
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── Section label ───────────────────────────────── */}
        <Text style={styles.sectionLabel}>Mis medicamentos de hoy</Text>

        {/* ── Reminder cards ──────────────────────────────── */}
        {reminders.map((item) => (
          <ReminderCard key={item.id} item={item} onTake={handleTake} />
        ))}

        {/* ── Help banners ────────────────────────────────── */}
        <TouchableOpacity style={styles.helpBanner} activeOpacity={0.85}>
          <Text style={styles.helpBannerIcon}>🔍</Text>
          <View style={styles.helpBannerText}>
            <Text style={styles.helpBannerTitle}>Buscar un medicamento</Text>
            <Text style={styles.helpBannerSub}>
              Encuentra información de cualquier medicamento
            </Text>
          </View>
          <Text style={styles.helpBannerArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpBanner} activeOpacity={0.85}>
          <Text style={styles.helpBannerIcon}>🏥</Text>
          <View style={styles.helpBannerText}>
            <Text style={styles.helpBannerTitle}>Farmacias cercanas</Text>
            <Text style={styles.helpBannerSub}>
              Encuentra la farmacia más próxima a ti
            </Text>
          </View>
          <Text style={styles.helpBannerArrow}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GREEN       = '#2E7D5E';
const GREEN_LIGHT = '#E8F5EE';
const BG          = '#FAFAF7';
const CARD        = '#FFFFFF';
const TEXT        = '#1C1C1E';
const SUBTEXT     = '#6B6B6B';
const DONE_BG     = '#F2F2F0';
const DONE_TEXT   = '#AAAAAA';

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

  // ── Summary card
  summaryCard: {
    backgroundColor: GREEN,
    borderRadius: 22,
    padding: 24,
    marginBottom: 28,
  },
  summaryCardDone: {
    backgroundColor: GREEN,
    borderRadius: 22,
    padding: 24,
    marginBottom: 28,
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  summaryHighlight: {
    fontSize: 26,
    fontWeight: '900',
    color: '#AAFFD4',
  },
  summarySubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotDone: {
    backgroundColor: '#AAFFD4',
  },

  // ── Section label
  sectionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 14,
    letterSpacing: -0.2,
  },

  // ── Reminder card
  reminderCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderCardDone: {
    backgroundColor: DONE_BG,
    shadowOpacity: 0,
    elevation: 0,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pillIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pillIconDone: {
    backgroundColor: '#EBEBEB',
  },
  pillIconText: {
    fontSize: 26,
  },
  reminderTextBlock: {
    flex: 1,
  },
  reminderName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  reminderNameDone: {
    color: DONE_TEXT,
    textDecorationLine: 'line-through',
  },
  reminderDose: {
    fontSize: 16,
    color: SUBTEXT,
    fontWeight: '500',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 15,
    color: SUBTEXT,
  },
  takeBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 82,
    alignItems: 'center',
  },
  takeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  takenBadge: {
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  takenBadgeText: {
    color: GREEN,
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Help banners
  helpBanner: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  helpBannerIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  helpBannerText: {
    flex: 1,
  },
  helpBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  helpBannerSub: {
    fontSize: 14,
    color: SUBTEXT,
  },
  helpBannerArrow: {
    fontSize: 28,
    color: SUBTEXT,
    marginLeft: 8,
  },

  // ── Bottom navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: SUBTEXT,
    textAlign: 'center',
  },
  navLabelActive: {
    color: GREEN,
    fontWeight: '700',
  },
  navDot: {
    marginTop: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
});