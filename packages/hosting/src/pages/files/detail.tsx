import { FC } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { db } from "@/lib/firebase";
import { dateString } from "@/utils/dateString";
import { Container } from "@/components/ui/Container";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Markdown } from "@/components/ui/Markdown";
import { Seo } from "@/components/Seo";
import type { FirestoreFileType } from "@/types/firestore";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Table, Thead, Th, Td } from "@/components/Table";

interface IProps extends Omit<FirestoreFileType, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const converter: FirestoreDataConverter<IProps> = {
  toFirestore(post: WithFieldValue<IProps>): DocumentData {
    return post;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    const { createdAt, updatedAt, ...rest } = data as FirestoreFileType;
    return {
      id: snapshot.id,
      updatedAt: dateString(updatedAt.toDate()),
      createdAt: dateString(createdAt.toDate()),
      ...rest,
    };
  },
};

const FileDetail: FC = () => {
  const { fileId } = useParams() as {
    fileId: string;
  };

  const docRef = doc(db, "files", fileId).withConverter(converter);
  const [value, , error] = useDocumentData(docRef);

  if (error) {
    throw new Error(JSON.stringify(error));
  } else if (!value) {
    return null;
  }

  const { name, description, contentType, size, downloaded, createdAt, updatedAt } = value;

  return (
    <Container className="">
      <Seo pathname={`/files/${fileId}`} title={name} description={`Download ${name}`} />
      <div className="w-full max-w-5xl">
        <h2 className="text-center text-2xl">{name}</h2>
        <div className="mx-auto mt-8">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table className="dark w-full table-auto">
              <Thead className="uppercase">
                <tr>
                  <Th scope="col">label</Th>
                  <Th scope="col">info</Th>
                </tr>
              </Thead>
              <tbody>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Th scope="row" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ファイル
                  </Th>
                  <Td>{name}</Td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Th scope="row" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    種類
                  </Th>
                  <Td>{contentType}</Td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Th scope="row" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    サイズ
                  </Th>
                  <Td>{convertByteWithUnit(size)}</Td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Th scope="row" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    最終更新
                  </Th>
                  <Td>
                    <time dateTime={updatedAt} title={`作成：${createdAt}`}>
                      {updatedAt}
                    </time>
                  </Td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Th scope="row" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ダウンロード
                  </Th>
                  <Td>{downloaded}</Td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        {description && (
          <div className="mx-auto mt-8 max-w-5xl">
            <Markdown markdown={description} />
          </div>
        )}
        <div className="mx-auto mt-8 max-w-5xl">
          <ButtonLink to={`download?t=${Date.now()}`}>次へ進む</ButtonLink>
        </div>
      </div>
    </Container>
  );
};

export default FileDetail;
