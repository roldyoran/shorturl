


// Validar API Key
import type { Context } from 'hono';
import { AppContext } from '@/models/bindings';



export const validateApiKey = (c: Context<AppContext>) => {
  const apiKey = c.req.header('x-api-key');
  if (!apiKey || apiKey !== c.env.API_KEY) {
    return c.json({ error: 'Invalid or missing API key' }, 401);
  } 
    return c.next();
}