import * as z from "zod";

import { FormData, FileWithPreview } from "../types/firestore";

const FileSchema = z.object({
  path: z.string(),
  preview: z.string()
})

export const CreateFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().max(140).nullable(),
  file: z.array(FileSchema),
  password: z.string().max(20).nullable(),
  // downloaded: z.number().min(0),
  // createdAt: z.date(),
  // updatedAt: z.date().optional(),
  // deletedAt: z.date().optional(),
})

// type Type = z.infer<typeof CreateFormSchema>