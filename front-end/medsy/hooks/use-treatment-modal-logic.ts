import { useState, useEffect } from 'react';
import { Treatment, MedicationCatalogItem, searchMedications } from '../services/api';
import { calculateDoseTimes } from '../components/treatment/treatment-utils';

export function useTreatmentModalLogic(visible: boolean, treatment: Treatment | null | undefined) {
  const [selectedMed, setSelectedMed] = useState<MedicationCatalogItem | null>(null);
  const [medQuery, setMedQuery] = useState('');
  const [medResults, setMedResults] = useState<MedicationCatalogItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [dosageNum, setDosageNum] = useState('');
  const [dosageUnit, setDosageUnit] = useState('');
  const [frequency, setFrequency] = useState('');
  
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>([]);

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
        setSelectedMed({ nombre: treatment.medicationName } as MedicationCatalogItem);

        const parts = treatment.dosage.split(' ');
        if (parts.length >= 2) {
          setDosageNum(parts[0]);
          setDosageUnit(parts.slice(1).join(' '));
        } else {
          setDosageNum(treatment.dosage);
          setDosageUnit('');
        }

        setFrequency(treatment.frequency);
        
        if (treatment.times && treatment.times.length > 0) {
          setCalculatedTimes(treatment.times);
          const [hours, minutes] = treatment.times[0].split(':').map(Number);
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          setStartTime(d);
        } else {
          setCalculatedTimes([]);
          setStartTime(new Date());
        }
      } else {
        resetForm();
      }
    }
  }, [treatment, visible]);

  useEffect(() => {
    setCalculatedTimes(calculateDoseTimes(frequency, startTime));
  }, [frequency, startTime]);

  const resetForm = () => {
    setMedQuery('');
    setSelectedMed(null);
    setMedResults([]);
    setDosageNum('');
    setDosageUnit('');
    setFrequency('');
    setStartTime(new Date());
    setCalculatedTimes([]);
  };

  const setMedSelection = (med: MedicationCatalogItem) => {
    setMedQuery(med.nombre);
    setSelectedMed(med);
    setMedResults([]);
  };

  return {
    state: {
      selectedMed,
      medQuery,
      medResults,
      loadingSearch,
      dosageNum,
      dosageUnit,
      frequency,
      startTime,
      showTimePicker,
      calculatedTimes,
    },
    actions: {
      setMedQuery,
      setMedSelection,
      setDosageNum,
      setDosageUnit,
      setFrequency,
      setStartTime,
      setShowTimePicker,
      resetForm,
    }
  };
}
