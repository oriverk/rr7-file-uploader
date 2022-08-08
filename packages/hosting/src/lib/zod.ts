import * as z from "zod";

export const SignInWithEmailAndPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const FileSchema = z.object({
  path: z.string(),
  preview: z.string(),
  size: z.number(),
});

export const CreateFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().max(500).nullable(),
  file: z.array(FileSchema),
  // password: z.string().max(20).nullable(),
  // downloaded: z.number().min(0),
  // createdAt: z.date(),
  // updatedAt: z.date().optional(),
  deleted: z.date().optional(),
});

// type Type = z.infer<typeof CreateFormSchema>
