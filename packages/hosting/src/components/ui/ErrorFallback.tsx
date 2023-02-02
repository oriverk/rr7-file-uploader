// [React: アプリ内のエラーを全部まとめて処理する（react-error-boundary）](https://zenn.dev/longbridge/articles/b7e76b31f993d9#%E3%82%A8%E3%83%A9%E3%83%BC%E3%83%AA%E3%82%AB%E3%83%90%E3%83%AA%E3%83%BC%EF%BC%88%E6%99%82%E9%96%93%E3%81%8C%E8%A7%A3%E6%B1%BA%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88%EF%BC%89)
import { FallbackProps } from 'react-error-boundary'
import { Container } from './Container'

export const handleErrorBounary = (error: Error, info: { componentStack: string }) => {
  console.log('error.message', error.message)
  console.log('info.componentStack:', info.componentStack)
}

export function ErrorFallback({ error }: FallbackProps) {
  return (
    <Container>
      <div className="min-h-96 relative flex flex-1 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
        <h1 className="text-2xl">An error occurred.</h1>
        <p className="text-xl">
          <pre>{error.message}</pre>
        </p>
      </div>
    </Container>
  )
}