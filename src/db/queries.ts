// src/db/queries.ts
export const getShortUrl = async (db: D1Database, original_url: string) => {
    const result = await db
        .prepare('SELECT short_url FROM URLS WHERE original_url = ?')
        .bind(original_url)
        .first();
    return result;
};

export const getOriginalUrl = async (db: D1Database, short_url: string) => {
    const result = await db
        .prepare('SELECT original_url FROM URLS WHERE short_url = ?')
        .bind(short_url)
        .first();
    return result ? (result as { original_url: string }) : null;
};

export const incrementClicks = async (db: D1Database, short_url: string) => {
    try {
        const response = await db
            .prepare('UPDATE URLS SET clicks = clicks + 1 WHERE short_url = ?')
            .bind(short_url)
            .run();

        // retornar si la respuesta fue exitosa
        return response.success;
    } catch (error) {
        console.error('Error al incrementar clics:', error);
    }
};

export const insertURL = async (db: D1Database, short_url: string, original_url: string) => {
    try {
        const insert = await db
            .prepare('INSERT INTO URLS (short_url, original_url) VALUES (?, ?)')
            .bind(short_url, original_url)
            .run();

        return !!insert;
    } catch (error) {
        console.error('Error al insertar URL:', error);
        return false;
    }
};

export const getUrlInfo = async (db: D1Database, short_url: string) => {
    try {
        const result = await db
            .prepare('SELECT * FROM URLS WHERE short_url = ?')
            .bind(short_url)
            .first();

        return result
            ? ({
                  short_url: result.short_url as string,
                  original_url: result.original_url as string,
                  clicks: result.clicks as number,
                  created_at: result.created_at as string,
              } as { short_url: string; original_url: string; clicks: number; created_at: string })
            : null;
    } catch (error) {
        console.error('Error al obtener información de URL:', error);
        return null;
    }
};

export const urlExists = async (db: D1Database, short_url: string) => {
    try {
        const result = await db
            .prepare('SELECT 1 FROM URLS WHERE short_url = ?')
            .bind(short_url)
            .first();

        return !!result;
    } catch (error) {
        console.error('Error al verificar existencia de URL:', error);
        return false;
    }
};
