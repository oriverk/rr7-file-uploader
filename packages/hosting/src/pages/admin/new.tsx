import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ref, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { FormData } from "@/types/firestore";
import { CreateFormSchema } from "@/lib/zod";
import { storage, db } from "@/lib/firebase";
import { Container } from "@/components/Container";
import { TextArea, Button } from "@/components/Form";
import { DropzoneInput } from "@/components/Dropzone";

const defaultDescription = `## 注意・お知らせ

- 使用することで生じた損害は一切保証致しません。
- 改変・再配布・転載自由です。スキルデータは'/src / constants / SkillCandidate.json'で修正できます。
- 投稿：[IxaMera 2022 README.txt](https://ixanary.com/entry/2022/mera-2022-readme/)
- 投稿：[Meraについて](https://ixanary.com/entry/2022/about-mera/)
  - 10系など他のmokoとの違いを説明しています。`;

const NewFile: FC = () => {
  const navigate = useNavigate();
  // const [progress, setProgress] = useState(0);
  const methods = useForm<Pick<FormData, "name" | "description" | "file">>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      file: [],
      description: defaultDescription,
    },
  });
  const { handleSubmit, getValues, setValue } = methods;

  useEffect(() => {
    const { name, file } = getValues();
    if (!name && file.length) {
      const { name: fileName } = file[0];
      setValue("name", fileName);
    }
  }, [getValues("file")]);

  const onSubmit = handleSubmit(async (data) => {
    const { file, description } = data;
    const { path, preview } = file[0];
    const blob = await fetch(preview).then((r) => r.blob());
    const storageRef = ref(storage, `files/${uuidv4()}-${path}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // eslint-disable-next-line no-console
        console.log("progress", progress);
      },
      (error) => {
        // eslint-disable-next-line no-alert
        alert(`Error: ${error}`);
      },
      async () => {
        const { name } = getValues();
        const { metadata } = uploadTask.snapshot;
        const { name: uuidName, contentType, size, fullPath } = metadata;
        const docRef = await addDoc(collection(db, "files"), {
          name,
          contentType,
          size,
          path: uuidName,
          fullPath,
          description,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          deletedAt: null,
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
            <div className="mt-8 mx-auto max-w-xl">
              <div className="grid grid-cols-1 gap-6">
                <DropzoneInput
                  id="file"
                  label="file"
                  accept={{
                    "application/zip": [".zip"],
                  }}
                />
                <TextArea id="description" label="description" />
                <Button type="submit">submit</Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};

export default NewFile;
