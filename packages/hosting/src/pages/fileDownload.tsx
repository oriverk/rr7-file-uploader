import { FC, useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ref } from "firebase/storage"
import { useDownloadURL } from 'react-firebase-hooks/storage';

import { storage } from '../lib/firebase'
import { Container } from '../components/Container'

const FileDownload: FC = () => {
  const [searchParams] = useSearchParams();
  const { fileId } = useParams() as {
    fileId: string
  }
  const name = searchParams.get('name')
  const q = searchParams.get('q')
  const paramsNow = searchParams.get('d')
  const now = Date.now()
  // 2days: 1000 * 60 * 60 * 24 * 2
  const isOld = !paramsNow || now - parseInt(paramsNow!, 10) > 1000 * 60 * 60 * 24 * 2
  const storageRef = ref(storage, `files/${q}`)
  const [downloadUrl, loading, error] = useDownloadURL(storageRef);
  const [objectUrl, setObjectUrl] = useState<string>()

  useEffect(() => {
    if (!downloadUrl || !name || isOld) return
    async function getBlob() {
      fetch(downloadUrl!)
        .then(res => res.blob())
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob)
          setObjectUrl(objectUrl)
        })
    }
    getBlob()
  },[downloadUrl])

  if (isOld) {
    return (
      <Container>
        <strong>Error: リンクが古くなっています</strong>
        <Link to={`/files/${fileId}`}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          ファイル詳細へ戻る
        </Link>
      </Container>
    )
  }

  if (error || loading) {
    return (
      <Container>
        <div className="mt-8 mx-auto max-w-5xl">
          {error && (<strong>Error: {JSON.stringify(error)}</strong>)}
          {loading && (<span>Document: Loading...</span>)}
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="mt-8 mx-auto max-w-5xl">
        {/* <p className="mb-4">
          利用規約に同意した上で、{path} のダウンロードを続けるには「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
        </p> */}
        <a href={objectUrl} download={name}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          target="_blank" rel="noopener noreferrer"
        >
          ダウンロード
        </a>
      </div>
    </Container>
  )
}

export default FileDownload