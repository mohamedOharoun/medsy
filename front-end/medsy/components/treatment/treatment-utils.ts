export const NUMBERS = Array.from({ length: 10 }, (_, i) => String(i + 1)).concat(['15', '20', '30', '40', '50', '100', '200', '250', '400', '500', '600', '800', '1000']);
export const UNITS = ['mg', 'g', 'ml', 'pastilla(s)', 'sobre(s)', 'gota(s)', 'inyección'];
export const FREQUENCIES = [
  'Una vez al día', '2 veces al día', '3 veces al día', '4 veces al día',
  'Cada 4 horas', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas',
  'Solo si es necesario'
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
  if (!frequency || frequency === 'Solo si es necesario') {
    return [];
  }

  const times: string[] = [];
  const startH = startTime.getHours();
  const startM = startTime.getMinutes();

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (frequency === 'Una vez al día' || frequency === 'Cada 24 horas') {
    times.push(formatTime(startH, startM));
  } else if (frequency.startsWith('Cada')) {
    const match = frequency.match(/Cada (\d+) horas/);
    if (match) {
      const interval = parseInt(match[1]);
      const count = Math.floor(24 / interval);
      for (let i = 0; i < count; i++) {
        const nextH = (startH + i * interval) % 24;
        times.push(formatTime(nextH, startM));
      }
    }
  } else if (frequency.includes('veces al día')) {
    const match = frequency.match(/(\d+) veces al día/);
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
