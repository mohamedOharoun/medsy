import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Recordatorios de Medicación',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#2E7D5E',
      enableVibrate: true,
      sound: 'default',
    });
  }
};

export const scheduleMedicationNotifications = async (
  medicationName: string,
  dosage: string,
  times: string[]
) => {
  try {
    await setupNotificationChannel();

    for (const time of times) {
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Hora de tomar medicamentos!💊',
          body: `Tienes que tomar ${dosage} de ${medicationName}.`,
          sound: true,
          data: { medicationName, dosage, time },
        },
        trigger: {
          hour,
          minute,
          repeats: true,
          channelId: 'medication-reminders',
        },
      });
    }
    
    console.log(`Notificaciones locales programadas para: ${medicationName}`);
  } catch (error) {
    console.error("Error programando notificaciones locales:", error);
  }
};
