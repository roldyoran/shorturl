/**
 * Servicio para gestionar las operaciones relacionadas con URLs
 * Proporciona métodos para buscar, crear y actualizar URLs acortadas
 */
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
    * @returns Objeto con la URL corta o null si no existe
    */
   async getShortUrl(originalUrl: string) {
      try {
         const { results } = await this.db
            .prepare('SELECT short_url FROM URLS WHERE original_url = ?')
            .bind(originalUrl)
            .all();
         return results.length ? results : null;
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
   async getOriginalUrl(shortUrl: string) {
      try {
         const result = await this.db
            .prepare('SELECT original_url FROM URLS WHERE short_url = ?')
            .bind(shortUrl)
            .first();
         return result ? result : null;
      } catch (error) {
         console.error('Error en consulta getOriginalUrl:', error);
         return null;
      }
   }

   /**
    * Incrementa el contador de clics para una URL corta
    * @param shortUrl URL corta a actualizar
    */
   async incrementClicks(shortUrl: string) {
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
   async createUrl(shortUrl: string, originalUrl: string) {
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
   async getUrlInfo(shortUrl: string) {
      try {
         const result = await this.db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(shortUrl)
            .first();

         return result || null;
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
   async urlExists(shortUrl: string) {
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