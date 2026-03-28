import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MedicationCatalogItem } from '../../services/api';

const parseCIMAField = (field: string | any): string => {
  if (!field) return '';
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.map((p: any) => p.nombre).join(', ').toLowerCase();
      }
    } catch (e) {
      return field;
    }
  }
  return String(field);
};

const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const MedicationCatalogCard = ({ item, onPress }: { item: MedicationCatalogItem, onPress?: () => void }) => {
  const activos = parseCIMAField(item.principiosActivos);
  const vias = capitalizeFirstLetter(parseCIMAField(item.viasAdministracion));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>

      {activos ? (
        <Text style={styles.cardDetail}>
          <Text style={styles.boldDetail}>Sustancia activa: </Text>
          {capitalizeFirstLetter(activos)}
        </Text>
      ) : null}

      {vias ? (
        <Text style={styles.cardDetail}>
          <Text style={styles.boldDetail}>Vía de admn: </Text>
          {vias}
        </Text>
      ) : null}

      <View style={styles.badges}>
        <View style={[styles.badge, item.receta ? styles.badgeRed : styles.badgeGreen]}>
          <Text style={item.receta ? styles.badgeTextRed : styles.badgeTextGreen}>
            {item.receta ? '💊 Con receta' : '🛒 Sin receta'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 4,
  },
  boldDetail: {
    fontWeight: '600',
    color: '#8E8E93',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeRed: {
    backgroundColor: '#E5E5EA',
  },
  badgeGreen: {
    backgroundColor: 'rgba(46, 125, 94, 0.1)',
  },
  badgeTextRed: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeTextGreen: {
    color: '#2E7D5E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeNeutral: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextNeutral: {
    color: '#3A3A3C',
    fontSize: 12,
    fontWeight: '600',
  },
});
