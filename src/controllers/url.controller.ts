/**
 * Controlador para gestionar las operaciones de URLs
 * Contiene la lógica de negocio para acortar, redirigir y obtener información de URLs
 */
import { Context } from 'hono';
import { generateRandomCode, normalizeUrl } from '../utils';
import { html } from '../html/not-found';
import { urlFormatSchema } from '../schemas';
import { AppContext } from '../types';

/**
 * Muestra un mensaje de bienvenida
 */
export const welcomeController = (c: Context) => {
  return c.text('¡Hola! Bienvenido a la API de acortador de URLs creada por roldyoran!');
};

/**
 * Acorta una URL original
 * Verifica si ya existe y crea una nueva URL corta si es necesario
 */
export const shortenUrlController = async (c: AppContext) => {
  const { original_url } = c.req.valid('json');
  const normalizedUrl = normalizeUrl(original_url);

  const urlService = c.get('urlService');
  
  // Verificar si la URL ya existe en la base de datos
  const existingShortUrl = await urlService.getShortUrl(normalizedUrl);
  if (existingShortUrl) {
    return c.json({
      short_url: existingShortUrl[0].short_url,
      original_url: normalizedUrl,
    });
  }

  // Generar una nueva URL corta única
  let shortUrl = generateRandomCode();
  while (await urlService.urlExists(shortUrl)) {
    shortUrl = generateRandomCode();
  }

  // Insertar la nueva URL en la base de datos
  const insertSuccess = await urlService.createUrl(shortUrl, normalizedUrl);
  if (!insertSuccess) {
    return c.json({ error: 'Error al insertar URL' }, 500);
  }

  return c.json({ short_url: shortUrl, original_url: normalizedUrl });
};

/**
 * Obtiene información detallada de una URL acortada
 */
export const getUrlInfoController = async (c: AppContext) => {
  const shortUrl = c.req.param('short_url');
  const urlService = c.get('urlService');
  const result = await urlService.getUrlInfo(shortUrl);

  if (!result) {
    return c.json({ error: 'URL corta no encontrada' }, 404);
  }

  return c.json(result);
};

/**
 * Redirige a la URL original a partir de una URL acortada
 * Incrementa el contador de clics al redirigir
 */
export const redirectToOriginalUrlController = async (c: AppContext) => {
  const shortUrl = c.req.param('short_url');
  const urlService = c.get('urlService');
  
  // Obtener la URL original
  const result = await urlService.getOriginalUrl(shortUrl);
  if (!result) {
    return c.html(html);
  }
  
  // Validar el formato de la URL
  const parsed = urlFormatSchema.safeParse({ original_url: result.original_url });
  if (!parsed.success) {
    return c.json({ error: 'Formato de URL inválido' }, 400);
  }
  
  // Incrementar el contador de clics
  await urlService.incrementClicks(shortUrl);
  
  // Redirigir a la URL original
  return c.redirect(parsed.data.original_url, 301); // Redirección permanente
};