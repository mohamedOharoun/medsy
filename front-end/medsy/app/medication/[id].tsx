import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMedicationDetail, MedicationCatalogItem } from '../../services/api';

const parseCIMAField = (field: string | any): string[] => {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.map((p: any) => p.nombre);
      }
    } catch (e) {
      return [field];
    }
  }
  return [String(field)];
};

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [medication, setMedication] = useState<MedicationCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        const data = await getMedicationDetail(id);
        setMedication(data);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D5E" />
      </View>
    );
  }

  if (!medication) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>No se encontró el medicamento</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeSubstances = parseCIMAField(medication.principiosActivos);
  const excipients = parseCIMAField(medication.excipientes);
  const administrations = parseCIMAField(medication.viasAdministracion);
  const presentations = parseCIMAField(medication.presentaciones);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Detalle',
          headerTitleStyle: { fontWeight: '700' },
          headerBackTitle: 'Atrás',
          headerTintColor: '#2E7D5E',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{medication.nombre}</Text>
          </View>
          <Text style={styles.originalName}>{medication.nombreOriginal}</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, medication.receta ? styles.badgeRed : styles.badgeGreen]}>
              <Text style={medication.receta ? styles.badgeTextRed : styles.badgeTextGreen}>
                {medication.receta ? '💊 Con Receta' : '🛒 Sin Receta'}
              </Text>
            </View>
            <View style={styles.badgeNeutral}>
              <Text style={styles.badgeTextNeutral}>{medication.estado}</Text>
            </View>
            {medication.generico === 1 && (
              <View style={styles.badgeBlue}>
                <Text style={styles.badgeTextBlue}>EFG</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sustancias activas</Text>
          <View style={styles.listContainer}>
            {activeSubstances.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="flask-outline" size={18} color="#2E7D5E" style={styles.listIcon} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vía de administración</Text>
          <View style={styles.listContainer}>
            {administrations.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="navigate-outline" size={18} color="#2E7D5E" style={styles.listIcon} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma farmacéutica</Text>
          <View style={styles.listItem}>
            <Ionicons name="medical-outline" size={18} color="#2E7D5E" style={styles.listIcon} />
            <Text style={styles.listText}>{medication.formaFarmaceutica}</Text>
          </View>
        </View>

        {presentations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presentaciones</Text>
            <View style={styles.listContainer}>
              {presentations.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="cube-outline" size={18} color="#2E7D5E" style={styles.listIcon} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {excipients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Excipientes notables</Text>
            <Text style={styles.excipientText}>{excipients.join(', ')}</Text>
          </View>
        )}

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Documentación oficial</Text>
          <View style={styles.docButtons}>
            {medication.prospectoPdf && (
              <TouchableOpacity
                style={styles.docButton}
                onPress={() => Linking.openURL(medication.prospectoPdf!)}
              >
                <Ionicons name="document-text" size={24} color="#fff" />
                <Text style={styles.docButtonText}>Ver Prospecto (PDF)</Text>
              </TouchableOpacity>
            )}
            {medication.prospectoHtml && (
              <TouchableOpacity
                style={[styles.docButton, styles.docButtonOutline]}
                onPress={() => Linking.openURL(medication.prospectoHtml!)}
              >
                <Ionicons name="globe-outline" size={24} color="#2E7D5E" />
                <Text style={styles.docButtonTextOutline}>Ver en CIMA (Web)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#3A3A3C',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#2E7D5E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    flex: 1,
    letterSpacing: -0.5,
  },
  originalName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    lineHeight: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeRed: {
    backgroundColor: '#FF3B3015',
  },
  badgeGreen: {
    backgroundColor: '#2E7D5E15',
  },
  badgeBlue: {
    backgroundColor: '#007AFF15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeNeutral: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeTextRed: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextGreen: {
    color: '#2E7D5E',
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextBlue: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextNeutral: {
    color: '#3A3A3C',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  lastSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIcon: {
    marginRight: 10,
  },
  listText: {
    fontSize: 16,
    color: '#3A3A3C',
    flex: 1,
  },
  excipientText: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
  },
  docButtons: {
    gap: 12,
  },
  docButton: {
    backgroundColor: '#2E7D5E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 10,
  },
  docButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2E7D5E',
  },
  docButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  docButtonTextOutline: {
    color: '#2E7D5E',
    fontSize: 16,
    fontWeight: '700',
  },
});
