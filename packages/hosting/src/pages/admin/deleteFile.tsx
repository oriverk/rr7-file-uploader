import { FC, useCallback, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { storage, db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { DeleteFormSchema } from "@/lib/zod";
import { FirestoreFileType, FormData } from "@/types/firestore";
import { Button, CheckBox, Input } from "@/components/Form";
import { ButtonLink } from "@/components/ui/ButtonLink";

const DeleteFile: FC = () => {
  const navigate = useNavigate();
  const { fileId } = useParams() as {
    fileId: string;
  };
  const docRef = doc(db, "files", fileId);
  const [value, , error] = useDocumentData(docRef);
  const methods = useForm<Pick<FormData, "name" | "deleted">>({
    resolver: zodResolver(DeleteFormSchema),
    defaultValues: {},
  });
  const { getValues } = methods;

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!value) return;

      const { name, fullPath } = value as FirestoreFileType;
      const { name: inputName, deleted } = getValues();
      if (!deleted || name !== inputName) return;

      const isConfirmed = window.confirm("本当に物理削除しても大丈夫ですか？\n操作は取り消せません");
      if (isConfirmed) {
        console.log("confirmed");
        const storageRef = ref(storage, fullPath);
        deleteObject(storageRef)
          .then(async () => {
            console.log("file was deleted");
            await deleteDoc(doc(db, "files", fileId)).then(() => {
              alert("ファイルとデータは完全に削除されました");
              navigate("/admin");
            });
          })
          .catch((error) => {
            console.log("Uh-oh, an error occurred!");
            alert(JSON.stringify(error));
          });
      }
    },
    [value]
  );

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
                  <Input id="name" label="name" placeholder={`input name "${value.name}"`} />
                  <CheckBox id="deleted" label="delete (論理削除)" />
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    delete this from firestore and cloudstorage
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </Container>
    </>
  );
};

export default DeleteFile;
