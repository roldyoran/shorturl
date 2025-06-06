import { zValidator } from '@hono/zod-validator';
import { originalURLFormatSchema } from '@/models/zod.schemas';

export const validateOriginalURL = zValidator('json', originalURLFormatSchema);
