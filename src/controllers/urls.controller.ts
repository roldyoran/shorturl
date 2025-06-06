// src/controllers/urls.controller.ts
import { Context } from 'hono';
import { getOriginalUrl, getShortUrl } from '@/db/queries';
import { AppContext } from '@/models/bindings';
import { reformatUrl } from '@/controllers/url.reformat';

export const getShortUrlInfoHandler = async (c: Context<AppContext>) => {
    const { original_url } = await c.req.json();
    if (!original_url) {
        return c.json({ error: 'Original URL is required' }, 400);
    }
    const formatted_url = reformatUrl(original_url);
    if (!formatted_url) {
        return c.json({ error: 'Invalid URL format' }, 400);
    }
    const { short_url } = (await getShortUrl(c.env.DB, formatted_url)) || {};
    if (!short_url) {
        return c.json({ error: 'Short URL not found' }, 404);
    }
    return c.json({ short_url }, 200);
};

export const redirectToOriginalUrl = async (c: Context<AppContext>) => {
    const { short_url } = c.req.param();
    if (!short_url) {
        return c.json({ error: 'Short URL is required' }, 400);
    }
    const { original_url } = (await getOriginalUrl(c.env.DB, short_url)) || {};
    if (!original_url) {
        return c.json({ error: 'Short URL not found' }, 404);
    }

    // aumentar clicks

    return c.redirect(original_url, 302);
};

// export const getAllTodos = async (c: Context<EnvWithD1>) => {
//   const todos = await getTodos(c.env.DB);
//   return c.json(todos);
// };

// export const addTodo = async (c: Context<EnvWithD1>) => {
//   const { title } = await c.req.json();
//   await createTodo(c.env.DB, title);
//   return c.json({ message: 'Todo created' }, 201);
// };
