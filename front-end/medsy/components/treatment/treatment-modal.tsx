import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Treatment, MedicationCatalogItem } from '../../services/api';
import { styles } from '../../styles/components/treatment-modal.styles';
import { NUMBERS, UNITS, FREQUENCIES, parseCIMAField } from './treatment-utils';
import { useTreatmentModalLogic } from '../../hooks/use-treatment-modal-logic';

const CustomDropdown = ({ label, value, options, onSelect }: any) => {
  const [open, setOpen] = React.useState(false);
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
  onSave: (name: string, dosage: string, frequency: string, times?: string[]) => void;
}

export const TreatmentModal: React.FC<Props> = ({ visible, treatment, onClose, onSave }) => {
  const { state, actions } = useTreatmentModalLogic(visible, treatment);

  const handleSave = () => {
    if (!state.selectedMed || !state.dosageNum || !state.dosageUnit || !state.frequency) {
      return alert("Por favor selecciona todos los campos del formulario.");
    }
    const finalDosage = `${state.dosageNum} ${state.dosageUnit}`;
    const finalName = state.selectedMed.nombre;

    onSave(finalName, finalDosage, state.frequency, state.calculatedTimes);
    onClose();
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      actions.setShowTimePicker(false);
    }
    if (selectedDate) {
      actions.setStartTime(selectedDate);
    }
  };

  const showTime = state.frequency && state.frequency !== 'Solo si es necesario';

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
                    value={state.medQuery}
                    onChangeText={(t) => { actions.setMedQuery(t); }}
                    placeholder="Escribe al menos 3 letras..."
                    placeholderTextColor="#A1A1AA"
                  />
                  {state.loadingSearch && <ActivityIndicator size="small" color="#2E7D5E" />}
                  {state.selectedMed && !state.loadingSearch && <Ionicons name="checkmark-circle" size={20} color="#2E7D5E" />}
                </View>

                {state.medResults.length > 0 && !state.selectedMed && (
                  <View style={styles.dropdownList}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled">
                      {state.medResults.map(med => (
                        <TouchableOpacity
                          key={med.nregistro}
                          style={styles.dropdownOption}
                          onPress={() => actions.setMedSelection(med)}
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
                  <CustomDropdown label="Cantidad" value={state.dosageNum} options={NUMBERS} onSelect={actions.setDosageNum} />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomDropdown label="Unidad" value={state.dosageUnit} options={UNITS} onSelect={actions.setDosageUnit} />
                </View>
              </View>

              {/* FRECUENCIA */}
              <View>
                <CustomDropdown label="Frecuencia de tomas" value={state.frequency} options={FREQUENCIES} onSelect={actions.setFrequency} />
              </View>

              {/* HORARIO */}
              {showTime && (
                <View style={styles.timeSection}>
                  <Text style={styles.label}>{state.frequency === '1 vez al día' ? 'Hora de la toma' : 'Hora de la primera toma'}</Text>
                  <TouchableOpacity style={styles.timePickerBtn} onPress={() => actions.setShowTimePicker(true)}>
                    <Text style={styles.timeValue}>
                      {state.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Ionicons name="time" size={24} color="#2E7D5E" />
                  </TouchableOpacity>

                  {state.showTimePicker && (
                    <>
                      <DateTimePicker
                        value={state.startTime}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                      />
                      {Platform.OS === 'ios' && (
                        <TouchableOpacity 
                          style={styles.doneBtn} 
                          onPress={() => actions.setShowTimePicker(false)}
                        >
                          <Text style={styles.doneBtnText}>Listo</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  {state.calculatedTimes.length > 1 && (
                    <View style={styles.timeScheduleContainer}>
                      <Text style={styles.scheduleTitle}>Horarios calculados:</Text>
                      <View style={styles.timeTagContainer}>
                        {state.calculatedTimes.map((t, idx) => (
                          <View key={idx} style={styles.timeTag}>
                            <Text style={styles.timeTagText}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

              <View style={[styles.buttonRow, { marginTop: 20 }]}>
                <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveBtn, (!state.selectedMed || !state.dosageNum || !state.dosageUnit || !state.frequency) && styles.disabledBtn]}
                  onPress={handleSave}
                  disabled={!state.selectedMed || !state.dosageNum || !state.dosageUnit || !state.frequency}
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

