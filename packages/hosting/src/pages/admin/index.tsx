import { FC } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CloudDownloadIcon, TrashIcon } from "@heroicons/react/outline";

import { db } from "@/lib/firebase";
import { dateString } from "@/utils/dateString";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Container } from "@/components/Container";
import { FirestoreFileType } from "@/types/firestore";

interface IProps extends Omit<FirestoreFileType, "createdAt" | "updatedAt" | "deletedAt"> {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

type TrProps = Omit<IProps, "description" | "fullPath" | "path">;

const StyledTr: FC<TrProps> = (props) => {
  const { id, name, createdAt, updatedAt, size, downloaded = 0, deleted } = props;
  const sizeString = convertByteWithUnit(size);

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" className="px-6 py-4">
        <Link to={`files/${id}`} className="font-medium text-blue-600 dark:text-blue-300 hover:underline">
          {name}
        </Link>
      </th>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        <time dateTime={createdAt} title={`作成：${createdAt}`}>
          {createdAt}
        </time>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        <time dateTime={updatedAt} title={`更新：${updatedAt}`}>
          {updatedAt}
        </time>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
        <div title={`${size}byte`}>{sizeString}</div>
      </td>
      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {downloaded}
      </td>
      <td className={`px-6 py-4 text-center font-medium whitespace-nowrap ${deleted ? "text-red-500" : "text-blue-500"}`}>
        {deleted.toString()}
      </td>
    </tr>
  );
};

const converter: FirestoreDataConverter<IProps> = {
  toFirestore(post: WithFieldValue<IProps>): DocumentData {
    return post;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    const { createdAt, updatedAt, deletedAt, ...rest } = data as FirestoreFileType;
    return {
      id: snapshot.id,
      updatedAt: dateString(updatedAt.toDate()),
      createdAt: dateString(createdAt.toDate()),
      deleted: !!deletedAt,
      ...rest,
    };
  },
};

const Admin: FC = () => {
  const collectionRef = collection(db, "files").withConverter(converter);
  const [files, , error] = useCollectionData(collectionRef);

  if (!files?.length || error) {
    return (
      <Container>
        <strong>Error: {JSON.stringify(error)}</strong>
      </Container>
    );
  }

  const sortedFiles = files.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  });

  return (
    <>
      <Container className="mb-8 flex flex-col justify-center gap-8">
        <h1 className="text-xl text-center">Admin Page</h1>
        <div className="mx-auto">
          <h2 className="mb-4 text-lg">commands</h2>
          <ul className="list-disc">
            <li>
              <Link to="new" className="font-medium text-blue-600 dark:text-blue-300 hover:underline">
                new File
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <Container>
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="dark table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3" title="file">
                    ファイル
                  </th>
                  <th scope="col" className="px-6 py-3" title="created at">
                    作成
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
                  <th scope="col" className="px-6 py-3" title="deleted">
                    <TrashIcon className="h-5 w-5 mx-auto text-red-700 dark:text-red-500 uppercase pointer-events-none" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFiles?.map((file) => {
                  const { description, path, fullPath, ...rest } = file;
                  return <StyledTr key={path} {...rest} />;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Admin;
