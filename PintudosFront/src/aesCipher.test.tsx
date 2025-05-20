import { encrypt, decrypt } from './aesCipher';

describe('AES Cipher', () => {
  const sampleText = 'Hola mundo';

  test('debería cifrar el texto y luego descifrarlo correctamente', () => {
    const encrypted = encrypt(sampleText);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(sampleText); // No debería ser igual al texto plano

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(sampleText); // Debería recuperar el texto original
  });

  test('debería retornar cadena vacía si el texto cifrado es inválido', () => {
    const resultado = decrypt('texto-inválido');
    expect(resultado).toBe(''); // CryptoJS retorna '' si no puede descifrar
  });
});
