import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountryCode } from '../interfaces/auth';

const COUNTRY_KEY = 'io.selectedCountry';

export async function loadSelectedCountry(): Promise<CountryCode | null> {
  try {
    const value = await AsyncStorage.getItem(COUNTRY_KEY);
    return value as CountryCode | null;
  } catch {
    return null;
  }
}

export async function saveSelectedCountry(country: CountryCode) {
  try {
    await AsyncStorage.setItem(COUNTRY_KEY, country);
  } catch {
    // TODO: replace local persistence with backend user profile sync when API is available.
  }
}
