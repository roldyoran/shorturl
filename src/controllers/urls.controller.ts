// src/controllers/urls.controller.ts
import { Context } from 'hono';
import { getShortUrl } from '@/db/queries';
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
    const shortUrl = await getShortUrl(c.env.DB, formatted_url);
    if (!shortUrl) {
        return c.json({ error: 'Short URL not found' }, 404);
    }
    return c.json({ short_url: shortUrl.short_url }, 200);
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
