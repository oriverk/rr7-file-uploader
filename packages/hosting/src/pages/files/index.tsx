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
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

import { db } from "@/lib/firebase";
import { dateString } from "@/utils/dateString";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Container } from "@/components/ui/Container";
import { Seo } from "@/components/Seo";
import { AmazonAffiliateBanners } from "@/components/ads/AmazonAffiliate";
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

const Files: FC = () => {
  const collectionRef = collection(db, "files").withConverter(converter);
  const q = query(collectionRef, where("deletedAt", "==", null));
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
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  });

  return (
    <Container className="flex flex-col gap-8 sm:flex-row">
      <AmazonAffiliateBanners isKasane />
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
              {sortedFiles.map(({ description, path, fullPath, ...rest }) => (
                <StyledTr key={path} {...rest} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default Files;
