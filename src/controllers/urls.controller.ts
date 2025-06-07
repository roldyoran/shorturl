// src/controllers/urls.controller.ts
import { Context } from 'hono';
import {
    getOriginalUrl,
    getShortUrl,
    incrementClicks,
    insertURL,
    urlExists,
    getUrlInfo,
} from '@/db/queries';
import { AppContext } from '@/models/bindings';
import { reformatUrl } from '@/controllers/url.reformat';
import { generateRandomCode } from '@/antiguo/utils';
import { htmlNotFound } from '@/html/not-found';

export const getInfoShortUrlHandler = async (c: Context<AppContext>) => {
    const { short_url } = await c.req.json();
    if (!short_url) {
        return c.json({ error: 'Original URL is required' }, 400);
    }
    const info = (await getUrlInfo(c.env.DB, short_url)) || {};

    return c.json(info, 200);
};

export const redirectToOriginalUrl = async (c: Context<AppContext>) => {
    const { short_url } = c.req.param();
    if (!short_url) {
        return c.json({ error: 'Short URL is required' }, 400);
    }
    const { original_url } = (await getOriginalUrl(c.env.DB, short_url)) || {};
    if (!original_url) {
        return c.html(htmlNotFound, 404);
    }

    // aumentar clicks
    const updateClicks = await incrementClicks(c.env.DB, short_url);
    if (!updateClicks) {
        console.error('Error incrementing clicks for short URL:', short_url);
    }

    return c.redirect(original_url, 302);
};

export const postShortenUrlHandler = async (c: Context<AppContext>) => {
    const { original_url } = await c.req.json();
    const { hash } = await c.req.json();
    if (!original_url) {
        return c.json({ error: 'Original URL is required' }, 400);
    }
    const formatted_url = reformatUrl(original_url);
    if (!formatted_url) {
        return c.json({ error: 'Invalid URL format' }, 400);
    }

    const { existingShortUrl } = (await getShortUrl(c.env.DB, formatted_url)) || {};
    let shortUrl = hash ? hash : '';
    // Si no se proporciona un hash, generar uno aleatorio
    if (!hash) {
        // Verificar si la URL acortada ya existe
        if (existingShortUrl) {
            return c.json({ short_url: existingShortUrl, original_url: original_url }, 200);
        }

        // Generar una nueva URL corta única
        shortUrl = generateRandomCode();
        while (await urlExists(c.env.DB, shortUrl)) {
            shortUrl = generateRandomCode();
        }
    }
    // Si se proporciona un hash, verificar que no exista
    else if (hash && (await urlExists(c.env.DB, hash))) {
        return c.json(
            {
                error: 'CUSTOM_URL_EXISTS',
                message: 'The custom URL you provided is already in use',
                status: 'error',
            },
            400,
        );
    }

    const insertSuccess = await insertURL(c.env.DB, shortUrl, formatted_url);
    if (!insertSuccess) {
        return c.json({ error: 'Error inserting URL' }, 500);
    }

    return c.json({ short_url: shortUrl, original_url: formatted_url }, 201);
};
