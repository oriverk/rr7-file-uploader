import { FC, useCallback, useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore"
import { ref, getBlob } from "firebase/storage";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { storage, db } from "../lib/firebase";
import { Container } from "../components/Container";
import { Button } from "../components/Form";
import { Seo } from "../components/Seo";

/**
 * @param time
 * @param threshold
 * 2days: 1000 * 60 * 60 * 24 * 2
 * @returns 
 */
const checkTimestampAge = (time: number, threshold: number) => {
  const gap = Date.now() - time
  return Number.isNaN(gap) || gap > threshold;
}

const FileDownload: FC = () => {
  const [objectUrl, setObjectUrl] = useState<string>()
  const [saveName, setSaveName] = useState<string>("")
  const [searchParams] = useSearchParams();
  const { fileId } = useParams() as {
    fileId: string;
  };
  const firestoreRef = doc(db, "files", fileId)
  const [dbValue] = useDocumentData(firestoreRef)
  const paramsNow = searchParams.get("t");
  const isOld = checkTimestampAge(parseInt(paramsNow!, 10), 1000 * 60 * 60 * 2)
  const [isConfirmed, setIsConfirmed] = useState(false);

  async function setFileBlob(storageFilePath: string) {
    const storageRef = ref(storage, storageFilePath);
    const blob = await getBlob(storageRef)
    setObjectUrl(URL.createObjectURL(blob))
  }

  useEffect(() => {
    if (isOld || !dbValue) return;
    setSaveName(dbValue.name)
    setFileBlob(`files/${dbValue.path}`)
  }, [dbValue])

  const handleConfirm = useCallback(() => {
    setIsConfirmed(prev => !prev)
  }, [isConfirmed])

  const handleDownload = useCallback(() => {
    if (!dbValue) return;

    async function updateFileDownloadNum() {
      await updateDoc(firestoreRef, {
        downloaded: dbValue!.downloaded + 1
      })
    }
    updateFileDownloadNum()
  },[dbValue])

  if (isOld || !dbValue) {
    let errorText = ""
    if (isOld) {
      errorText = "Error: リンクが古くなっています"
    } else if (!dbValue){
      errorText = "Error: URLパスが間違っています"
    } else if (!objectUrl) {
      errorText = "Error: ファイルは削除された可能性があります"
    }

    return (
      <Container>
        <Seo noindex />
        <div className="mt-8 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <strong className="mb-4 text-red-500">
                {errorText}
              </strong>
            </div>
            <Link
              to="/files"
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ファイル一覧へ戻る
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Seo noindex />
      <div className="mt-8 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4 text-lg">
            {saveName} のダウンロードを続けるには
            <Link
              to="/terms"
              target="_blank" rel="noopener noreferrer"
              className="mx-4 text-indigo-500 hover:text-red-600 underline underline-offset-4 active:text-red-700 transition duration-100"
            >
              利用規約
            </Link>
            に同意した上で「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
          </div>
          <div className="mb-4">
            <label className="ml-2 flex justify-center items-center text-base font-medium text-gray-900 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isConfirmed}
                onClick={handleConfirm}
                className="w-4 h-4 mr-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              利用規約に同意する
            </label>
          </div>
          {isConfirmed && objectUrl ? (
            <a
              href={objectUrl}
              download={saveName}
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleDownload}
            >
              ダウンロード
            </a>
          ) : (
            <Button type="button" disabled>
              読み込み中
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default FileDownload;
