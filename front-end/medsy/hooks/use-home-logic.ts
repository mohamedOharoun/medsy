import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTreatments } from '../hooks/use-treatments';

export function useHomeLogic() {
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
        time: t.frequency, 
        taken: false,
      }));
      setReminders(mapped);
    }
  }, [treatments]);

  const handleTake = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, taken: true } : r))
    );
  };

  const doneCount = reminders.filter((r) => r.taken).length;
  const total = reminders.length;
  const allDone = total > 0 && doneCount === total;

  return {
    state: { reminders, loading, doneCount, total, allDone },
    actions: { handleTake, router, refetch }
  };
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}
