import * as z from "zod";

// const FILE_TYPES = ['application/zip']

// const CustomFileListSchema = z.object({
//   file: z
//     .custom<FileList>()
//     .refine((file) => file.length !== 0, { message: "必須です" })
//     .transform((file) => file[0])
//     .refine((file) => file.size < 1_000_000, { message: "ファイルサイズは最大1MBです" })
//     .refine((file) => FILE_TYPES.includes(file.type), {
//       message: ".zipのみ可能です"
//     })
// })

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
  description: z.string().max(10000).nullable(),
  file: z.array(FileSchema),
  // file: CustomFileListSchema,
  // downloaded: z.number().min(0),
  // createdAt: z.date(),
  // updatedAt: z.date().optional(),
  deleted: z.boolean()
});

export const DeleteFormSchema = z.object({
  name: z.string().min(3),
  deleted: z.boolean()
})

// type Type = z.infer<typeof CreateFormSchema>
