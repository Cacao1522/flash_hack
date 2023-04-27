import { z } from 'zod';

export const dataSchema = z
  .object({
    page_id: z.string(),
    name: z.string(),
    checkbox: z.boolean(),
  })
  .array();
