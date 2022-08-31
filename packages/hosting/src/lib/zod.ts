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
  description: z.string().max(1000).nullable(),
  file: z.array(FileSchema),
  // downloaded: z.number().min(0),
  // createdAt: z.date(),
  // updatedAt: z.date().optional(),
  // deleted: z.boolean()
});

// type Type = z.infer<typeof CreateFormSchema>
