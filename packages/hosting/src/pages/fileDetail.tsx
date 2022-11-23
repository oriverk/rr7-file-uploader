import { FC } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Container } from "@/components/Container";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Markdown } from "@/components/Markdown";
import { Seo } from "@/components/Seo";
import { AmazonAffiliateBanners } from "@/components/Ads/AmazonAffiliate";
import type { FirestoreFileType } from "@/types/firestore";

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

  if (error || !value) {
    return (
      <Container>
        <div className="mx-auto mt-8 max-w-5xl">
          <strong>Error: {JSON.stringify(error)}</strong>
        </div>
      </Container>
    );
  }

  const { name, description, contentType, size, downloaded, createdAt, updatedAt } = value;

  return (
    <Container className="flex flex-col gap-8 sm:flex-row">
      <Seo pathname={`/files/${fileId}`} title={name} description={`Download ${name}`} />
      <AmazonAffiliateBanners isKasane />
      <div className="w-full max-w-5xl">
        <h2 className="text-center text-2xl">{name}</h2>
        <div className="mx-auto mt-8">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="dark w-full table-auto text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    label
                  </th>
                  <th scope="col" className="px-6 py-3">
                    info
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ファイル
                  </th>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">{name}</td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    種類
                  </th>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {contentType}
                  </td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    サイズ
                  </th>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {convertByteWithUnit(size)}
                  </td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    最終更新
                  </th>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <time dateTime={updatedAt} title={`作成：${createdAt}`}>
                      {updatedAt}
                    </time>
                  </td>
                </tr>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ダウンロード
                  </th>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {downloaded}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {description && (
          <div className="mx-auto mt-8 max-w-5xl">
            <Markdown markdown={description} />
          </div>
        )}
        <div className="mx-auto mt-8 max-w-5xl">
          <Link
            to={`download?t=${Date.now()}`}
            className="block w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            次へ進む
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default FileDetail;
