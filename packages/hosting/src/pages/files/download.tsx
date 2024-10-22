import { FC, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getBlob } from "firebase/storage";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { useDetectAdBlock } from "@/hooks/useDetectAdBlock";
import { storage, db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/Form";
import { Seo } from "@/components/Seo";
import { DownloadModal } from "@/components/DownloadModal";
import { checkTimestampAge } from "@/utils/checkTimestampAge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StyledLink } from "@/components/ui/StyledLink";
import { Checkbox } from "@/components/ui/Checkbox";

const FileDownload: FC = () => {
  const adBlockDetected = useDetectAdBlock()
  const [searchParams] = useSearchParams();
  const { fileId } = useParams() as {
    fileId: string;
  };
  const firestoreRef = doc(db, "files", fileId);
  const [dbValue, loading, error] = useDocumentData(firestoreRef);
  const paramsNow = searchParams.get("t");
  const isOld = checkTimestampAge(parseInt(paramsNow!, 10), 1000 * 60 * 60 * 2);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isLoadingCompoliteButFailed = !loading && !dbValue;

  // useEffect(() => {
  //   console.log("dbValue", dbValue)
  // }, [dbValue])

  const handleConfirm = useCallback(() => {
    setIsConfirmed((prev) => !prev);
  }, []);

  const handlePasswordSubmit = (e: any) => {
    e.preventDefault()
    console.log("e", e)
  }

  const handleDownload = useCallback(async () => {
    if (!dbValue) return;
    
    const { name, path } = dbValue;
    const storageRef = ref(storage, `files/${path}`);
    const blob = await getBlob(storageRef);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute("href", objectUrl);
    link.setAttribute("download", name);
    link.click();
    
    await updateDoc(firestoreRef, {
      downloaded: dbValue!.downloaded + 1,
    }).then(() => {
      URL.revokeObjectURL(objectUrl);
      link.remove();
      setIsConfirmed(false);
      setIsOpen(true);
    });
  }, [dbValue]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (isOld) {
    throw new Error("リンクが古くなっています。");
  } else if (isLoadingCompoliteButFailed) {
    throw new Error(JSON.stringify(error));
  }

  if (adBlockDetected) {
    return (
      <Container>
        <Seo noindex />
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-center text-xl">ダウンロード</h1>
          <div className="flex flex-col gap-6">
            <div className="mb-4 text-base sm:text-lg">
              広告ブロッカーをご利用のようです。当サイトでは全画面広告をオフにしています。広告ブロッカーの設定で当サイトを対象から外すか、拡張機能自体を無効にしてください。
            </div>
            <ButtonLink to="/files">ファイル一覧へ戻る</ButtonLink>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="">
      <Seo noindex />
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-xl">ダウンロード</h1>
        <div className="flex flex-col gap-6">
          <div className="mb-4 text-base sm:text-lg">
            ダウンロードを続けるには、
            <StyledLink href="/terms" className="mx-2" isExternal>
              利用規約
            </StyledLink>
            に同意した上で「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
          </div>
          <div className="mb-4">
            <Checkbox id="confirm" checked={isConfirmed} onChange={handleConfirm} label="利用規約に同意する" />
            {dbValue?.password && (
              <form onSubmit={handlePasswordSubmit}>
                <input type="text" id="password" placeholder="半角英数" />
                <Button type="submit">認証</Button>
            </form>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Button type="button" disabled={!isConfirmed} onClick={handleDownload}>
              {isConfirmed ? 'ダウンロード' : '読み込み中'}
            </Button>
            <ButtonLink
              to="/files"
              className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            >
              ファイル一覧へ戻る
            </ButtonLink>
          </div>
        </div>
      </div>
      <DownloadModal isOpen={isOpen} onClose={handleCloseModal} />
    </Container>
  );
};

export default FileDownload;
