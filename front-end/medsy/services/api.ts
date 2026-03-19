import { Platform } from 'react-native';
import Constants from 'expo-constants';

let host = 'localhost';

if (Constants.expoConfig?.hostUri) {
  host = Constants.expoConfig.hostUri.split(':')[0];
} else if (Platform.OS === 'android') {
  host = '10.0.2.2';
}

if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
  host = '10.0.2.2';
}

let API_URL = `http://${host}:3000/api`;

export interface Treatment {
  id: number;
  userId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
}

export interface MedicationCatalogItem {
  nregistro: string;
  nombre: string;
  nombreOriginal?: string;
  estado: string;
  receta: number;
  generico: number;
  principiosActivos: string;
  excipientes: string;
  viasAdministracion: string;
  presentaciones: string;
  formaFarmaceutica: string;
  prospectoPdf?: string | null;
  prospectoHtml?: string | null;
}

export const getTreatments = async (): Promise<Treatment[]> => {
  try {
    const res = await fetch(`${API_URL}/treatments`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return [];
  }
};

export const addTreatment = async (medicationName: string, dosage: string, frequency: string): Promise<Treatment | null> => {
  try {
    const res = await fetch(`${API_URL}/treatments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationName, dosage, frequency }),
    });
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error adding treatment:", error);
    return null;
  }
};

export const updateTreatment = async (id: number, medicationName: string, dosage: string, frequency: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/treatments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationName, dosage, frequency }),
    });
    const json = await res.json();
    return json.success;
  } catch (error) {
    console.error("Error updating treatment:", error);
    return false;
  }
};

export const deleteTreatment = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/treatments/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return json.success;
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return false;
  }
};

export const getMedicationDetail = async (id: string): Promise<MedicationCatalogItem | null> => {
  try {
    const res = await fetch(`${API_URL}/medications/${id}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching medication detail:", error);
    return null;
  }
};

export const searchMedications = async (name: string = '', substance: string = '', administration: string = ''): Promise<MedicationCatalogItem[]> => {
  try {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (substance) params.append('substance', substance);
    if (administration) params.append('administration', administration);

    const res = await fetch(`${API_URL}/medications/search?${params.toString()}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error searching medications:", error);
    return [];
  }
};
