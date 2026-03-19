import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { Treatment } from '../services/api';

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTreatments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTreatments();
      setTreatments(data || []);
    } catch (e) {
      console.error("Failed to load treatments", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTreatments();
  }, [loadTreatments]);

  const onAddTreatment = async (name: string, dosage: string, frequency: string) => {
    await api.addTreatment(name, dosage, frequency);
    await loadTreatments();
  };

  const onUpdateTreatment = async (id: number, name: string, dosage: string, frequency: string) => {
    await api.updateTreatment(id, name, dosage, frequency);
    await loadTreatments();
  };

  const onDeleteTreatment = async (id: number) => {
    await api.deleteTreatment(id);
    await loadTreatments();
  };

  return {
    treatments,
    loading,
    refetch: loadTreatments,
    addTreatment: onAddTreatment,
    updateTreatment: onUpdateTreatment,
    deleteTreatment: onDeleteTreatment
  };
}
