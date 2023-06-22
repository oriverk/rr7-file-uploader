import { FC, useState } from "react";
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
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

import { db } from "@/lib/firebase";
import { dateString } from "@/utils/dateString";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Container } from "@/components/ui/Container";
import { Seo } from "@/components/Seo";
import { FirestoreFileType } from "@/types/firestore";
import { Table, Thead, Th, Td } from "@/components/Table";

interface IProps extends Omit<FirestoreFileType, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

type TrProps = Omit<IProps, "description" | "fullPath" | "path">;

const StyledTr: FC<TrProps> = (props) => {
  const { id, name, createdAt, updatedAt, size, downloaded = 0 } = props;
  const sizeString = convertByteWithUnit(size);

  return (
    <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
      <Th scope="row">
        <Link to={`/files/${id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-300">
          {name}
        </Link>
      </Th>
      <Td>
        <time dateTime={createdAt} title={`作成：${createdAt}`}>
          {createdAt}
        </time>
      </Td>
      <Td>
        <time dateTime={updatedAt} title={`更新：${updatedAt}`}>
          {updatedAt}
        </time>
      </Td>
      <Td>
        <div title={`${size}byte`}>{sizeString}</div>
      </Td>
      <Td className="text-center">{downloaded}</Td>
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
      ...rest,
    };
  },
};

const collectionRef = collection(db, "files").withConverter(converter);

const Files: FC = () => {
  const q = query(collectionRef, where("deletedAt", "==", null));
  const [files, loading, error] = useCollectionData(q);
  const pageSize = 8
  const [page, setPage] = useState(1)

  if (!loading && error) {
    throw new Error(JSON.stringify(error));
  } else if (!files?.length) {
    return null;
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

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <Container className="">
      <Seo pathname="/files" title="Files" />
      <div className="w-full max-w-5xl">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <Table className="dark w-full table-auto">
            <Thead className="uppercase">
              <tr>
                <Th scope="col" title="file">
                  ファイル
                </Th>
                <Th scope="col" title="created at">
                  作成
                </Th>
                <Th scope="col" title="updated at">
                  更新
                </Th>
                <Th scope="col" title="size">
                  サイズ
                </Th>
                <Th scope="col" title="download">
                  <CloudArrowDownIcon className="pointer-events-none mx-auto h-5 w-5 uppercase text-gray-700 dark:text-gray-400" />
                </Th>
              </tr>
            </Thead>
            <tbody>
              {sortedFiles.slice(0, pageSize * page).map(({ description, path, fullPath, ...rest }) => (
                <StyledTr key={path} {...rest} />
              ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-8 text-center">
          <button type="button" onClick={handleLoadMore}
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            もっと読み込む
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Files;
