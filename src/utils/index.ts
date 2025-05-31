/**
 * Utilidades para la aplicación de acortador de URLs
 */

/**
 * Genera un código aleatorio para usar como URL corta
 * @returns Cadena aleatoria de 9 caracteres alfanuméricos
 */
export const generateRandomCode = (): string => {
   // Caracteres permitidos para generar el código
   const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let code = '';

   // Generar un código de 9 caracteres
   for (let i = 0; i < 9; i++) {
      code += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
   }

   return code;
};

/**
 * Normaliza una URL eliminando la barra final y convirtiéndola a minúsculas
 * @param url URL a normalizar
 * @returns URL normalizada
 */
export const normalizeUrl = (url: string): string => {
   return url.replace(/\/$/, '');
};
