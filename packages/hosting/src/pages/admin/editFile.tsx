import { FC, useEffect, useCallback, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { Container } from "@/components/Container";
import { CreateFormSchema } from "@/lib/zod";
import { FirestoreFileType, FormData } from "@/types/firestore";
import { Button, CheckBox, Input, TextArea } from "@/components/Form";

const EditFile: FC = () => {
  const { fileId } = useParams() as {
    fileId: string;
  };
  const docRef = doc(db, "files", fileId);
  const [value, , error] = useDocumentData(docRef);
  const methods = useForm<FormData>({
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
        <div className="mx-auto max-w-xl">
          <Link
            to="/admin"
            className="block w-full rounded-lg bg-teal-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 sm:w-auto"
          >
            back to /admin
          </Link>
        </div>
        <div className="mb-4">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className="mx-auto mt-8 max-w-xl">
                <div className="grid grid-cols-1 gap-6">
                  <Input id="name" label="name" />
                  <CheckBox id="deleted" label="delete" />
                  <TextArea id="description" label="description" />
                  <Button type="submit">submit</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </Container>
    </>
  );
};

export default EditFile;
