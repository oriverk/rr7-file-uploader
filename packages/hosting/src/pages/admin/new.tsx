import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ref, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { CreateFormSchema } from "@/lib/zod";
import { storage, db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { TextArea, Button, CheckBox, PasswordInput } from "@/components/Form";
import { DropzoneInput } from "@/components/Dropzone";
import { ButtonLink } from "@/components/ui/ButtonLink";
import Description from "@/docs/description.md?raw";

const NewFile: FC = () => {
  const navigate = useNavigate();
  const methods = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      file: [],
      description: Description,
      password: "",
      deleted: false,
    },
  });
  const { handleSubmit, getValues, setValue } = methods;
  const values = getValues();

  useEffect(() => {
    const { name, file } = values;
    if (name || !file.length) return;
    setValue("name", file[0].name);
  }, [values]);

  const onSubmit = handleSubmit(async (data) => {
    const { file, description, deleted, password } = data;
    const { path, preview } = file[0];
    const blob = await fetch(preview).then((r) => r.blob());
    const storageRef = ref(storage, `files/${uuidv4()}-${path}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("progress", progress);
      },
      (error) => {
        alert(`Error: ${error}`);
      },
      async () => {
        const { name } = getValues();
        const { metadata } = uploadTask.snapshot;
        const { name: uuidName, contentType, size, fullPath } = metadata;
        const timestamp = serverTimestamp();
        const docRef = await addDoc(collection(db, "files"), {
          name,
          contentType,
          size,
          path: uuidName,
          fullPath,
          description,
          createdAt: timestamp,
          updatedAt: timestamp,
          deletedAt: deleted ? timestamp : null,
          downloaded: 0,
        });
        navigate(`/files/${docRef.id}`);
      }
    );
  });

  return (
    <Container>
      <div className="mb-4">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <div className="mx-auto mt-8 max-w-4xl">
              <div className="grid grid-cols-1 gap-6">
                <DropzoneInput
                  id="file"
                  label="file"
                  accept={{
                    "application/zip": [".zip"],
                  }}
                />
                <TextArea id="description" label="description" />
                <PasswordInput id="password" label="password (optional)" placeholder="半角英数" />
                <CheckBox id="deleted" label="delete (論理削除)" />
                <div className="flex flex-col gap-4">
                  <Button type="submit">submit</Button>
                  <ButtonLink
                    to="/admin"
                    className="bg-teal-700 hover:bg-teal-800 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
                  >
                    Admin ファイル一覧へ戻る
                  </ButtonLink>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};

export default NewFile;
