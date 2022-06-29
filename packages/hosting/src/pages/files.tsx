import { FC } from "react";
import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CloudDownloadIcon } from "@heroicons/react/outline";

import type { IData } from "./fileDetail";
import { db } from "../lib/firebase";
import { dateString } from "../utils/dateString";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";
import { Container } from "../components/Container";

interface IListData extends IData {
  id: string;
}

const StyledTr: FC<Omit<IListData, "description">> = (props) => {
  const { id, name, createdAt, updatedAt, size, downloaded = 0 } = props;
  const sizeString = convertByteWithUnit(size);

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" className="px-6 py-4">
        <a href={`/files/${id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
          {name}
        </a>
      </th>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        <time dateTime={updatedAt} title={`作成：${createdAt}`}>
          {updatedAt}
        </time>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        <div title={`${size}byte`}>{sizeString}</div>
      </td>
      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {downloaded}
      </td>
    </tr>
  );
};

const converter: FirestoreDataConverter<IListData> = {
  toFirestore(post: WithFieldValue<IData>): DocumentData {
    return post;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): IListData {
    const data = snapshot.data(options);
    const { name, path, description, contentType, size, downloaded, createdAt, updatedAt } = data;
    return {
      id: snapshot.id,
      name,
      path,
      description,
      contentType,
      size,
      downloaded,
      updatedAt: dateString(updatedAt.toDate()),
      createdAt: dateString(createdAt.toDate()),
    };
  },
};

const Files: FC = () => {
  const collectionRef = collection(db, "files").withConverter(converter);
  const [files, , error] = useCollectionData(collectionRef);

  if (error) {
    return (
      <Container>
        <strong>Error: {JSON.stringify(error)}</strong>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mt-8 mx-auto max-w-5xl">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3" title="file">
                  ファイル
                </th>
                <th scope="col" className="px-6 py-3" title="updated at">
                  更新
                </th>
                <th scope="col" className="px-6 py-3" title="size">
                  サイズ
                </th>
                <th scope="col" className="px-6 py-3" title="download">
                  <CloudDownloadIcon className="h-5 w-5 mx-auto text-gray-700 dark:text-gray-400 uppercase pointer-events-none" />
                </th>
              </tr>
            </thead>
            <tbody>
              {files?.map((file) => {
                const { id, name, path, contentType, size, downloaded, createdAt, updatedAt } = file;
                return (
                  <StyledTr
                    id={id}
                    name={name}
                    path={path}
                    contentType={contentType}
                    size={size}
                    downloaded={downloaded}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                    key={path}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default Files;
