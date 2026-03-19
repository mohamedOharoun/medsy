import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Treatment, MedicationCatalogItem, searchMedications } from '../../services/api';

const NUMBERS = Array.from({ length: 10 }, (_, i) => String(i + 1)).concat(['15', '20', '30', '40', '50', '100', '200', '250', '400', '500', '600', '800', '1000']);
const UNITS = ['mg', 'g', 'ml', 'pastilla(s)', 'sobre(s)', 'gota(s)', 'inyección'];
const FREQUENCIES = [
  '1 vez al día', '2 veces al día', '3 veces al día', '4 veces al día',
  'Cada 4 horas', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas',
  'Solo si es necesario'
];

const parseCIMAField = (field: string | any): string => {
  if (!field) return '';
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.map((p: any) => p.nombre).join(', ');
      }
    } catch (e) {
      return field;
    }
  }
  return String(field);
};

const CustomDropdown = ({ label, value, options, onSelect }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setOpen(!open)}>
        <Text style={{ color: value ? '#1C1C1E' : '#A1A1AA', fontSize: 16 }}>{value || 'Elegir...'}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="#8E8E93" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {options.map((opt: string) => (
              <TouchableOpacity key={opt} style={styles.dropdownOption} onPress={() => { onSelect(opt); setOpen(false); }}>
                <Text style={{ color: '#1C1C1E', fontSize: 16, fontWeight: value === opt ? 'bold' : 'normal' }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

interface Props {
  visible: boolean;
  treatment?: Treatment | null;
  onClose: () => void;
  onSave: (name: string, dosage: string, frequency: string) => void;
}

export const TreatmentModal: React.FC<Props> = ({ visible, treatment, onClose, onSave }) => {
  const [selectedMed, setSelectedMed] = useState<MedicationCatalogItem | null>(null);
  const [medQuery, setMedQuery] = useState('');
  const [medResults, setMedResults] = useState<MedicationCatalogItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [dosageNum, setDosageNum] = useState('');
  const [dosageUnit, setDosageUnit] = useState('');
  const [frequency, setFrequency] = useState('');

  // Buscador asíncrono para el catálogo de medicamentos
  useEffect(() => {
    if (medQuery.length < 3) {
      setMedResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSearch(true);
      const data = await searchMedications(medQuery);
      setMedResults(data);
      setLoadingSearch(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [medQuery]);

  useEffect(() => {
    if (visible) {
      if (treatment) {
        setMedQuery(treatment.medicationName);
        setSelectedMed({ nombre: treatment.medicationName } as MedicationCatalogItem); // Mock para validación local

        // Parse dosage "500 mg" into "500" "mg"
        const parts = treatment.dosage.split(' ');
        if (parts.length >= 2) {
          setDosageNum(parts[0]);
          setDosageUnit(parts.slice(1).join(' '));
        } else {
          setDosageNum(treatment.dosage);
          setDosageUnit('');
        }

        setFrequency(treatment.frequency);
      } else {
        setMedQuery('');
        setSelectedMed(null);
        setMedResults([]);
        setDosageNum('');
        setDosageUnit('');
        setFrequency('');
      }
    }
  }, [treatment, visible]);

  const handleSave = () => {
    if (!selectedMed || !dosageNum || !dosageUnit || !frequency) {
      return alert("Por favor selecciona todos los campos del formulario.");
    }
    const finalDosage = `${dosageNum} ${dosageUnit}`;
    const finalName = selectedMed.nombre;

    onSave(finalName, finalDosage, frequency);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.dragHandle} />
            <Text style={styles.title}>{treatment ? 'Editar medicamento' : 'Nuevo medicamento'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

              {/* AUTOCOMPLETE DE MEDICAMENTOS */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Nombre del medicamento (Catálogo)</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.inputText}
                    value={medQuery}
                    onChangeText={(t) => { setMedQuery(t); setSelectedMed(null); }}
                    placeholder="Escribe al menos 3 letras..."
                    placeholderTextColor="#A1A1AA"
                  />
                  {loadingSearch && <ActivityIndicator size="small" color="#2E7D5E" />}
                  {selectedMed && !loadingSearch && <Ionicons name="checkmark-circle" size={20} color="#2E7D5E" />}
                </View>

                {medResults.length > 0 && !selectedMed && (
                  <View style={styles.dropdownList}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled">
                      {medResults.map(med => (
                        <TouchableOpacity
                          key={med.nregistro}
                          style={styles.dropdownOption}
                          onPress={() => { setMedQuery(med.nombre); setSelectedMed(med); setMedResults([]); }}
                        >
                          <Text style={{ fontWeight: '600', color: '#1C1C1E' }}>{med.nombre}</Text>
                          {med.principiosActivos ? <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>{parseCIMAField(med.principiosActivos)}</Text> : null}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* DOSIS */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <CustomDropdown label="Cantidad" value={dosageNum} options={NUMBERS} onSelect={setDosageNum} />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomDropdown label="Unidad" value={dosageUnit} options={UNITS} onSelect={setDosageUnit} />
                </View>
              </View>

              {/* FRECUENCIA */}
              <View>
                <CustomDropdown label="Frecuencia de tomas" value={frequency} options={FREQUENCIES} onSelect={setFrequency} />
              </View>

              <View style={[styles.buttonRow, { marginTop: 20 }]}>
                <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveBtn, (!selectedMed || !dosageNum || !dosageUnit || !frequency) && styles.disabledBtn]}
                  onPress={handleSave}
                  disabled={!selectedMed || !dosageNum || !dosageUnit || !frequency}
                >
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  keyboardView: { width: '100%' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%' },
  dragHandle: { width: 40, height: 5, backgroundColor: '#E5E5EA', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#1C1C1E' },
  label: { fontSize: 14, fontWeight: '600', color: '#3A3A3C', marginBottom: 8, marginLeft: 4 },

  dropdownContainer: { marginBottom: 20 },
  input: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 14, padding: 16, height: 52 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 14, paddingHorizontal: 16, height: 52 },
  inputText: { flex: 1, fontSize: 16, color: '#1C1C1E', height: '100%' },

  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#F2F2F7', borderRadius: 14, marginTop: 4, overflow: 'hidden' },
  dropdownOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  button: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F2F2F7' },
  saveBtn: { backgroundColor: '#2E7D5E', shadowColor: '#2E7D5E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  disabledBtn: { opacity: 0.5, shadowOpacity: 0 },
  cancelText: { color: '#2E7D5E', fontWeight: '600', fontSize: 16 },
  saveText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});
