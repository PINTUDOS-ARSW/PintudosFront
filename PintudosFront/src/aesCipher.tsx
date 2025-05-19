import CryptoJS from 'crypto-js';

const AES_KEY = '1234567890123456'; // La misma clave que en backend

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, AES_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, AES_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
