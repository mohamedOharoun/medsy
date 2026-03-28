export const NUMBERS = Array.from({ length: 10 }, (_, i) => String(i + 1)).concat(['15', '20', '30', '40', '50', '100', '200', '250', '400', '500', '600', '800', '1000']);
export const UNITS = ['mg', 'g', 'ml', 'pill(s)', 'sachet(s)', 'drop(s)', 'injection'];
export const FREQUENCIES = [
  'Once a day', '2 times a day', '3 times a day', '4 times a day',
  'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Every 24 hours',
  'Only if needed'
];

export const parseCIMAField = (field: string | any): string => {
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

export const calculateDoseTimes = (frequency: string, startTime: Date): string[] => {
  if (!frequency || frequency === 'Only if needed') {
    return [];
  }

  const times: string[] = [];
  const startH = startTime.getHours();
  const startM = startTime.getMinutes();

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (frequency === 'Once a day' || frequency === 'Every 24 hours') {
    times.push(formatTime(startH, startM));
  } else if (frequency.startsWith('Every')) {
    const match = frequency.match(/Every (\d+) hours/);
    if (match) {
      const interval = parseInt(match[1]);
      const count = Math.floor(24 / interval);
      for (let i = 0; i < count; i++) {
        const nextH = (startH + i * interval) % 24;
        times.push(formatTime(nextH, startM));
      }
    }
  } else if (frequency.includes('times a day')) {
    const match = frequency.match(/(\d+) times a day/);
    if (match) {
      const count = parseInt(match[1]);
      const interval = Math.floor(24 / count);
      for (let i = 0; i < count; i++) {
        const nextH = (startH + i * interval) % 24;
        times.push(formatTime(nextH, startM));
      }
    }
  }

  return times.sort();
};
