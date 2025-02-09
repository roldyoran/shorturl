export class UserService {
   private db: D1Database;

   constructor(db: D1Database) {
      this.db = db;
   }

   async getUserById(userId: string) {
      try {
         const { results } = await this.db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(userId)
            .all();
         return results.length ? results : null;
      } catch (_error) {
         console.error('Database query getUserById failed:', _error);
         return null;
      }
   }

   async fetchOriginalUrl(short_url: string) {
      try {
         const result = await this.db
            .prepare('SELECT original_url FROM URLS WHERE short_url = ?')
            .bind(short_url)
            .first();
         return result ? result : null;
      } catch (_error) {
         console.error('Database query fetchOriginalUrl failed:', _error);
         return null;
      }
   }

   async incrementClicks(short_url: string) {
      try {
         await this.db
            .prepare('UPDATE URLS SET clicks = clicks + 1 WHERE short_url = ?')
            .bind(short_url)
            .run();
      } catch (_error) {
         console.error('Database query failed:', _error);
      }
   }

   async getShortUrl(original_url: string) {
      try {
         const { results } = await this.db
            .prepare('SELECT short_url FROM URLS WHERE original_url = ?')
            .bind(original_url)
            .all();
         return results.length ? results : null;
      } catch (_error) {
         console.error('Database query getShortUrl failed:', _error);
         return null;
      }
   }

   async insertUrls(short_url: string, original_url: string) {
      try {
         const insert = await this.db
            .prepare('INSERT INTO URLS (short_url, original_url) VALUES (?, ?)')
            .bind(short_url, original_url)
            .run();

         if (!insert) {
            return false;
         }

         return true;
      } catch (_error) {
         console.error('Database query insertUrls failed:', _error);
         return false;
      }
   }

   async getUrlInfo(short_url: string) {
      try {
         const result = await this.db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(short_url)
            .first();

         if (!result) {
            return null;
         }

         return result;
      } catch (_error) {
         console.error('Database query getUrlInfo failed:', _error);
         return null;
      }
   }

   async verifyURL(short_url: string) {
      try {
         const result = await this.db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(short_url)
            .first();

         if (!result) {
            return false;
         }

         return true;
      } catch (_error) {
         console.error('Database query verifyURL failed:', _error);
         return false;
      }
   }
}
