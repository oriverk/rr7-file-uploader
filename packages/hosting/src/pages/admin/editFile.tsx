import { FC, useEffect, useCallback, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { FormProvider, useForm } from "react-hook-form";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { CreateFormSchema } from "@/lib/zod";
import type { FirestoreFileType } from "@/types/firestore";
import { Button, CheckBox, Input, TextArea } from "@/components/Form";
import { ButtonLink } from "@/components/ui/ButtonLink";

const EditFile: FC = () => {
  const { fileId } = useParams() as {
    fileId: string;
  };
  const docRef = doc(db, "files", fileId);
  const [value, , error] = useDocumentData(docRef);
  const methods = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {},
  });
  const { getValues, setValue } = methods;

  useEffect(() => {
    if (!value || error) return;
    const { name, description, deletedAt } = value as FirestoreFileType;
    setValue("name", name);
    setValue("description", description);
    setValue("deleted", !!deletedAt);
  }, [value]);

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, deleted } = getValues();

    await updateDoc(docRef, {
      name: name.trim() ? name : value!.name,
      description,
      deletedAt: deleted ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  }, []);

  if (error || !value) {
    return (
      <Container>
        <div className="mx-auto mt-8 max-w-5xl">
          <strong>Error: {JSON.stringify(error)}</strong>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <div className="mx-auto mb-4 overflow-x-auto rounded-sm border border-gray-300 p-4">
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      </Container>
      <Container>
        <div className="mx-auto max-w-4xl">
          <ButtonLink
            to="/admin"
            className="bg-teal-700 hover:bg-teal-800 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            back to /admin
          </ButtonLink>
        </div>
        <div className="mb-4">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className="mx-auto mt-8 max-w-4xl">
                <div className="grid grid-cols-1 gap-6">
                  <Input id="name" label="name" />
                  <CheckBox id="deleted" label="delete (論理削除)" />
                  <TextArea id="description" label="description" />
                  <Button type="submit">submit</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        {value.deletedAt && (
          <div className="mx-auto max-w-4xl">
            <ButtonLink to="../delete" className="bg-red-600 hover:bg-red-700">
              ファイル削除ページへ (物理削除)
            </ButtonLink>
          </div>
        )}
      </Container>
    </>
  );
};

export default EditFile;
