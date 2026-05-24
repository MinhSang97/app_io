import * as Crypto from 'expo-crypto';

export async function generateNonce(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhoneNumber = (phonenumber: string) => /^\d{10,}$/.test(phonenumber);

export const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}$/.test(password);
