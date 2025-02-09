import { z } from 'zod';

export const urlFormatSchema = z.object({
   // original_url: z.string().url(), // Validamos que sea una URL válida
   // usando esquema para aceptar solo https:// y http://
   original_url: z
      .string()
      .toLowerCase()
      .url()
      .startsWith('https://')
      .or(z.string().toLowerCase().url().startsWith('http://')),
});
