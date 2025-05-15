/**
 * Servicio para gestionar las operaciones relacionadas con URLs
 * Proporciona métodos para buscar, crear y actualizar URLs acortadas
 */
import { UrlData } from '../types';

export class UrlService {
   private db: D1Database;

   /**
    * Constructor del servicio de URLs
    * @param db Instancia de la base de datos D1
    */
   constructor(db: D1Database) {
      this.db = db;
   }

   /**
    * Obtiene la URL corta asociada a una URL original
    * @param originalUrl URL original a buscar
    * @returns Array de objetos con la URL corta o null si no existe
    */
   async getShortUrl(originalUrl: string): Promise<Array<Pick<UrlData, 'short_url'>> | null> {
      try {
         const { results } = await this.db
            .prepare('SELECT short_url FROM URLS WHERE original_url = ?')
            .bind(originalUrl)
            .all();
         return results.length ? results as Array<Pick<UrlData, 'short_url'>> : null;
      } catch (error) {
         console.error('Error en consulta getShortUrl:', error);
         return null;
      }
   }

   /**
    * Obtiene la URL original asociada a una URL corta
    * @param shortUrl URL corta a buscar
    * @returns Objeto con la URL original o null si no existe
    */
   async getOriginalUrl(shortUrl: string): Promise<Pick<UrlData, 'original_url'> | null> {
      try {
         const result = await this.db
            .prepare('SELECT original_url FROM URLS WHERE short_url = ?')
            .bind(shortUrl)
            .first();
         return result ? result as Pick<UrlData, 'original_url'> : null;
      } catch (error) {
         console.error('Error en consulta getOriginalUrl:', error);
         return null;
      }
   }

   /**
    * Incrementa el contador de clics para una URL corta
    * @param shortUrl URL corta a actualizar
    * @returns void
    */
   async incrementClicks(shortUrl: string): Promise<void> {
      try {
         await this.db
            .prepare('UPDATE URLS SET clicks = clicks + 1 WHERE short_url = ?')
            .bind(shortUrl)
            .run();
      } catch (error) {
         console.error('Error al incrementar clics:', error);
      }
   }

   /**
    * Inserta una nueva URL en la base de datos
    * @param shortUrl URL corta a insertar
    * @param originalUrl URL original a insertar
    * @returns true si la inserción fue exitosa, false en caso contrario
    */
   async createUrl(shortUrl: string, originalUrl: string): Promise<boolean> {
      try {
         const insert = await this.db
            .prepare('INSERT INTO URLS (short_url, original_url) VALUES (?, ?)')
            .bind(shortUrl, originalUrl)
            .run();

         return !!insert;
      } catch (error) {
         console.error('Error al insertar URL:', error);
         return false;
      }
   }

   /**
    * Obtiene toda la información de una URL corta
    * @param shortUrl URL corta a buscar
    * @returns Objeto con toda la información o null si no existe
    */
   async getUrlInfo(shortUrl: string): Promise<UrlData | null> {
      try {
         const result = await this.db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(shortUrl)
            .first();

         return result ? {
            short_url: result.short_url as string,
            original_url: result.original_url as string,
            clicks: result.clicks as number,
            created_at: result.created_at as string
         } as UrlData : null;
      } catch (error) {
         console.error('Error al obtener información de URL:', error);
         return null;
      }
   }

   /**
    * Verifica si una URL corta existe en la base de datos
    * @param shortUrl URL corta a verificar
    * @returns true si existe, false en caso contrario
    */
   async urlExists(shortUrl: string): Promise<boolean> {
      try {
         const result = await this.db
            .prepare('SELECT 1 FROM URLS WHERE short_url = ?')
            .bind(shortUrl)
            .first();

         return !!result;
      } catch (error) {
         console.error('Error al verificar existencia de URL:', error);
         return false;
      }
   }
}