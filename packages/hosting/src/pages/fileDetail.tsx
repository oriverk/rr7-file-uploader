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

import { db } from "../lib/firebase";
import { dateString } from "../utils/dateString";
import { Container } from "../components/Container";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";
import { Markdown } from "../components/Markdown";

export interface IData {
  name: string;
  path: string;
  fullPath?: string;
  description: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  downloaded?: number;
}

const converter: FirestoreDataConverter<IData> = {
  toFirestore(post: WithFieldValue<IData>): DocumentData {
    return post;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): IData {
    const data = snapshot.data(options);
    const { name, path, fullPath, description, contentType, size, downloaded, createdAt, updatedAt } = data;
    return {
      name,
      path,
      fullPath,
      description,
      contentType,
      size,
      downloaded,
      updatedAt: dateString(updatedAt.toDate()),
      createdAt: dateString(createdAt.toDate()),
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

  const { name, description, contentType, size, downloaded, createdAt, updatedAt } = value as IData;

  return (
    <Container>
      <div className="max-x-5xl text-center">
        <h2 className="text-2xl">{name}</h2>
      </div>
      <div className="mt-8 mx-auto max-w-5xl">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{contentType}</td>
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
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{downloaded}</td>
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
    </Container>
  );
};

export default FileDetail;
