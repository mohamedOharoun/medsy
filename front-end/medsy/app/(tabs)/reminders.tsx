import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = 'daily' | 'weekly';

type Reminder = {
  id: string;
  name: string;
  dose: string;
  time: string;
  frequency: Frequency;
  days: string[]; // only used when frequency === 'weekly'
  active: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEK_DAYS = [
  { id: 'L', label: 'L', full: 'Lunes' },
  { id: 'M', label: 'M', full: 'Martes' },
  { id: 'X', label: 'X', full: 'Miércoles' },
  { id: 'J', label: 'J', full: 'Jueves' },
  { id: 'V', label: 'V', full: 'Viernes' },
  { id: 'S', label: 'S', full: 'Sábado' },
  { id: 'D', label: 'D', full: 'Domingo' },
];

const HOUR_OPTIONS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: '1',
    name: 'Ibuprofeno',
    dose: '400 mg',
    time: '08:00',
    frequency: 'daily',
    days: [],
    active: true,
  },
  {
    id: '2',
    name: 'Omeprazol',
    dose: '20 mg',
    time: '14:00',
    frequency: 'daily',
    days: [],
    active: true,
  },
  {
    id: '3',
    name: 'Atorvastatina',
    dose: '10 mg',
    time: '21:00',
    frequency: 'daily',
    days: [],
    active: true,
  },
  {
    id: '4',
    name: 'Vitamina D3',
    dose: '1000 UI',
    time: '09:00',
    frequency: 'weekly',
    days: ['L', 'X', 'V'],
    active: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDays(days: string[]) {
  if (days.length === 7) return 'Todos los días';
  return days.join(', ');
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReminderRow({
  item,
  onToggle,
  onDelete,
}: {
  item: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={[styles.reminderRow, !item.active && styles.reminderRowInactive]}>
      {/* Pill icon */}
      <View style={[styles.rowIcon, !item.active && styles.rowIconInactive]}>
        <Text style={styles.rowIconText}>💊</Text>
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, !item.active && styles.rowNameInactive]}>
          {item.name}
        </Text>
        <Text style={styles.rowMeta}>{item.dose}</Text>
        <Text style={styles.rowMeta}>
          🕐 {item.time}
          {'  '}
          {item.frequency === 'daily'
            ? '📅 Todos los días'
            : `📅 ${formatDays(item.days)}`}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.rowActions}>
        {/* Toggle active */}
        <TouchableOpacity
          style={[styles.toggleBtn, item.active && styles.toggleBtnOn]}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleBtnText, item.active && styles.toggleBtnTextOn]}>
            {item.active ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Add modal ────────────────────────────────────────────────────────────────

type NewReminder = {
  name: string;
  dose: string;
  time: string;
  frequency: Frequency;
  days: string[];
};

const EMPTY: NewReminder = {
  name: '',
  dose: '',
  time: '08:00',
  frequency: 'daily',
  days: [],
};

// Step labels
const STEPS = ['Medicamento', 'Hora', 'Frecuencia'];

function AddModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (r: NewReminder) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewReminder>(EMPTY);

  function reset() {
    setStep(0);
    setForm(EMPTY);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleNext() {
    if (step === 0 && !form.name.trim()) {
      Alert.alert('Falta el nombre', 'Por favor escribe el nombre del medicamento.');
      return;
    }
    if (step === 2 && form.frequency === 'weekly' && form.days.length === 0) {
      Alert.alert('Elige los días', 'Selecciona al menos un día de la semana.');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onSave(form);
      reset();
    }
  }

  function toggleDay(dayId: string) {
    setForm((f) => ({
      ...f,
      days: f.days.includes(dayId)
        ? f.days.filter((d) => d !== dayId)
        : [...f.days, dayId],
    }));
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalSheet}>
          {/* Handle bar */}
          <View style={styles.modalHandle} />

          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            {STEPS.map((label, i) => (
              <View key={i} style={styles.stepIndicatorItem}>
                <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                  <Text style={[styles.stepCircleText, i <= step && styles.stepCircleTextActive]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Step 0: Nombre y dosis ──────────── */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿Qué medicamento?</Text>
              <Text style={styles.inputLabel}>Nombre del medicamento</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Ibuprofeno"
                placeholderTextColor="#BBBBBB"
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                autoCapitalize="words"
              />
              <Text style={styles.inputLabel}>Dosis (opcional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 400 mg"
                placeholderTextColor="#BBBBBB"
                value={form.dose}
                onChangeText={(v) => setForm((f) => ({ ...f, dose: v }))}
              />
            </View>
          )}

          {/* ── Step 1: Hora ────────────────────── */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿A qué hora?</Text>
              <Text style={styles.inputLabel}>Selecciona la hora</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timeRow}
              >
                {HOUR_OPTIONS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.timeChip, form.time === h && styles.timeChipActive]}
                    onPress={() => setForm((f) => ({ ...f, time: h }))}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.timeChipText, form.time === h && styles.timeChipTextActive]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.selectedTimeBox}>
                <Text style={styles.selectedTimeLabel}>Hora seleccionada</Text>
                <Text style={styles.selectedTimeValue}>{form.time}</Text>
              </View>
            </View>
          )}

          {/* ── Step 2: Frecuencia ──────────────── */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿Con qué frecuencia?</Text>

              <TouchableOpacity
                style={[
                  styles.freqOption,
                  form.frequency === 'daily' && styles.freqOptionActive,
                ]}
                onPress={() => setForm((f) => ({ ...f, frequency: 'daily', days: [] }))}
                activeOpacity={0.8}
              >
                <Text style={styles.freqOptionIcon}>📅</Text>
                <View>
                  <Text style={[styles.freqOptionTitle, form.frequency === 'daily' && styles.freqOptionTitleActive]}>
                    Todos los días
                  </Text>
                  <Text style={styles.freqOptionSub}>Se repetirá cada día</Text>
                </View>
                {form.frequency === 'daily' && (
                  <Text style={styles.freqCheck}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.freqOption,
                  form.frequency === 'weekly' && styles.freqOptionActive,
                ]}
                onPress={() => setForm((f) => ({ ...f, frequency: 'weekly' }))}
                activeOpacity={0.8}
              >
                <Text style={styles.freqOptionIcon}>🗓️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.freqOptionTitle, form.frequency === 'weekly' && styles.freqOptionTitleActive]}>
                    Días concretos
                  </Text>
                  <Text style={styles.freqOptionSub}>Elige los días que quieras</Text>
                </View>
                {form.frequency === 'weekly' && (
                  <Text style={styles.freqCheck}>✓</Text>
                )}
              </TouchableOpacity>

              {form.frequency === 'weekly' && (
                <View style={styles.daysGrid}>
                  {WEEK_DAYS.map((d) => (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.dayBtn,
                        form.days.includes(d.id) && styles.dayBtnActive,
                      ]}
                      onPress={() => toggleDay(d.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dayBtnText,
                          form.days.includes(d.id) && styles.dayBtnTextActive,
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ── Buttons ─────────────────────────── */}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.backBtn} onPress={step === 0 ? handleClose : () => setStep((s) => s - 1)} activeOpacity={0.8}>
              <Text style={styles.backBtnText}>{step === 0 ? 'Cancelar' : '← Atrás'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>
                {step === STEPS.length - 1 ? '✓ Guardar' : 'Siguiente →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('reminders');

  const daily  = reminders.filter((r) => r.frequency === 'daily');
  const weekly = reminders.filter((r) => r.frequency === 'weekly');

  function handleToggle(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  function handleDelete(id: string) {
    Alert.alert(
      'Eliminar recordatorio',
      '¿Seguro que quieres eliminar este recordatorio?',
      [
        { text: 'No, cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: () => setReminders((prev) => prev.filter((r) => r.id !== id)),
        },
      ]
    );
  }

  function handleSave(newR: NewReminder) {
    const reminder: Reminder = {
      id: uid(),
      name: newR.name.trim(),
      dose: newR.dose.trim(),
      time: newR.time,
      frequency: newR.frequency,
      days: newR.days,
      active: true,
    };
    setReminders((prev) => [...prev, reminder]);
    setShowModal(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF7" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Mis recordatorios</Text>
            <Text style={styles.pageSubtitle}>
              {reminders.filter((r) => r.active).length} activo
              {reminders.filter((r) => r.active).length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.headerEmoji}>⏰</Text>
        </View>

        {/* ── Add button ──────────────────────────────────── */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnPlus}>＋</Text>
          <Text style={styles.addBtnText}>Añadir nuevo recordatorio</Text>
        </TouchableOpacity>

        {/* ── Daily section ───────────────────────────────── */}
        {daily.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionDot}>●</Text>
              <Text style={styles.sectionTitle}>Diarios</Text>
            </View>
            {daily.map((r) => (
              <ReminderRow
                key={r.id}
                item={r}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}

        {/* ── Weekly section ──────────────────────────────── */}
        {weekly.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={[styles.sectionDot, { color: '#F0A500' }]}>●</Text>
              <Text style={styles.sectionTitle}>Semanales</Text>
            </View>
            {weekly.map((r) => (
              <ReminderRow
                key={r.id}
                item={r}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}

        {/* ── Empty state ─────────────────────────────────── */}
        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💊</Text>
            <Text style={styles.emptyTitle}>Aún no tienes recordatorios</Text>
            <Text style={styles.emptySub}>
              Pulsa el botón de arriba para añadir tu primer medicamento.
            </Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Add modal ───────────────────────────────────────── */}
      <AddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: SUBTEXT,
    marginTop: 2,
    fontWeight: '500',
  },
  headerEmoji: {
    fontSize: 42,
  },

  // ── Add button
  addBtn: {
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnPlus: {
    fontSize: 28,
    color: '#FFFFFF',
    marginRight: 12,
    lineHeight: 30,
  },
  addBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionDot: {
    fontSize: 14,
    color: GREEN,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },

  // ── Reminder row
  reminderRow: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderRowInactive: {
    opacity: 0.5,
  },
  rowIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowIconInactive: {
    backgroundColor: '#ECECEC',
  },
  rowIconText: { fontSize: 24 },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 19,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  rowNameInactive: {
    color: '#AAAAAA',
  },
  rowMeta: {
    fontSize: 14,
    color: SUBTEXT,
    marginTop: 1,
  },
  rowActions: {
    alignItems: 'center',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    backgroundColor: '#F5F5F5',
    minWidth: 56,
    alignItems: 'center',
  },
  toggleBtnOn: {
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AAAAAA',
  },
  toggleBtnTextOn: {
    color: GREEN,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: 18 },

  // ── Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 16,
    color: SUBTEXT,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },

  // ── Bottom nav
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
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 26, marginBottom: 4 },
  navLabel: { fontSize: 10, fontWeight: '500', color: SUBTEXT, textAlign: 'center' },
  navLabelActive: { color: GREEN, fontWeight: '700' },
  navDot: { marginTop: 4, width: 5, height: 5, borderRadius: 3, backgroundColor: GREEN },

  // ── Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 16,
    minHeight: 480,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 20,
  },

  // Step indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    gap: 24,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: GREEN,
  },
  stepCircleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#AAAAAA',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: SUBTEXT,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: GREEN,
    fontWeight: '700',
  },

  // Step content
  stepContent: {
    flex: 1,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: SUBTEXT,
    marginBottom: 8,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#F4F7FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 18,
    color: TEXT,
    fontWeight: '500',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  // Time picker
  timeRow: {
    paddingVertical: 4,
    gap: 10,
    paddingBottom: 8,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  timeChipActive: {
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
  },
  timeChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: SUBTEXT,
  },
  timeChipTextActive: {
    color: GREEN,
  },
  selectedTimeBox: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  selectedTimeLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  selectedTimeValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },

  // Frequency
  freqOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 14,
  },
  freqOptionActive: {
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
  },
  freqOptionIcon: { fontSize: 26 },
  freqOptionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  freqOptionTitleActive: {
    color: GREEN,
  },
  freqOptionSub: {
    fontSize: 13,
    color: SUBTEXT,
  },
  freqCheck: {
    fontSize: 20,
    color: GREEN,
    fontWeight: '800',
    marginLeft: 'auto',
  },

  // Day grid
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayBtnActive: {
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
  },
  dayBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: SUBTEXT,
  },
  dayBtnTextActive: {
    color: GREEN,
  },

  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: SUBTEXT,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});