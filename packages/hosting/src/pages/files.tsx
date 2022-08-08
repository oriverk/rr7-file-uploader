import { FC } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CloudDownloadIcon } from "@heroicons/react/outline";

import { db } from "@/lib/firebase";
import { dateString } from "@/utils/dateString";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Container } from "@/components/Container";
import { Seo } from "@/components/Seo";
import { AmazonAffiliateBanners } from "@/components/Ads/AmazonAffiliate";
import { FirestoreFileType } from "@/types/firestore";

interface IProps extends Omit<FirestoreFileType, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

type TrProps = Omit<IProps, "description" | "fullPath" | "path">

const StyledTr: FC<TrProps> = (props) => {
  const { id, name, createdAt, updatedAt, size, downloaded = 0 } = props;
  const sizeString = convertByteWithUnit(size);

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" className="px-6 py-4">
        <Link to={`/files/${id}`} className="font-medium text-blue-600 dark:text-blue-300 hover:underline">
          {name}
        </Link>
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
      ...rest
    };
  },
};

const Files: FC = () => {
  const collectionRef = collection(db, "files").withConverter(converter);
  const q = query(collectionRef, where("deletedAt", "==", null),)
  const [files, , error] = useCollectionData(q);

  if (!files?.length || error) {
    return (
      <Container>
        <Seo pathname="/files" title="Files" description="list uploaded files" />
        <strong>Error: {JSON.stringify(error)}</strong>
      </Container>
    );
  }

  const sortedFiles = files.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) {
      return 1
    }
    if (a.updatedAt > b.updatedAt) {
      return -1
    }
    return 0
  })

  return (
    <Container className="flex flex-col gap-8 sm:flex-row">
      <AmazonAffiliateBanners isKasane />
      <Seo pathname="/files" title="Files" />
      <div className="w-full max-w-5xl">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="dark table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
              {sortedFiles.map((file) => {
                const { description, path, fullPath, ...rest } = file;
                return (
                  <StyledTr key={path} {...rest} />
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
