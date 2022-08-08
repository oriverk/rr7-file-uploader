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
        <div className="mt-8 mx-auto max-w-5xl">
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
        <h2 className="text-2xl text-center">{name}</h2>
        <div className="mt-8 mx-auto">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="dark table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    ファイル
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{name}</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    種類
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {contentType}
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    サイズ
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {convertByteWithUnit(size)}
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    最終更新
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <time dateTime={updatedAt} title={`作成：${createdAt}`}>
                      {updatedAt}
                    </time>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    ダウンロード
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {downloaded}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {description && (
          <div className="mt-8 mx-auto max-w-5xl">
            <Markdown markdown={description} />
          </div>
        )}
        <div className="mt-8 mx-auto max-w-5xl">
          <Link
            to={`download?t=${Date.now()}`}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            次へ進む
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default FileDetail;
