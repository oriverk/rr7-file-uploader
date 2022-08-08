import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, LinkIcon, XIcon } from '@heroicons/react/outline';
import { FC, Fragment, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { BuyMePotato } from './Ads/BuyMePotato';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const location = useLocation()
  const [copiedText, copy] = useCopyToClipboard()

  const handleCopy = useCallback(() => {
    copy(window.location.href)
  },[])

  useEffect(() => {
    onClose();
    return () => {
      onClose()
    }
  },[location])

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute right-0 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      onClick={onClose}
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <Dialog.Title as="h3" className="mb-8 text-center text-lg sm:text-xl font-medium leading-6">
                    Downloaded?
                  </Dialog.Title>
                  <div className="">
                    <div className="mb-4">
                      <p className='mb-2 text-base'>
                        もしよろしければサポートしてくださると有難いです。
                      </p>
                      <BuyMePotato />
                    </div>
                    <div className="mb-4">
                      {!copiedText ? (
                        <button type="button"
                          onClick={handleCopy}
                          className="w-full flex justify-center py-1 px-4 border border-gray-900 rounded-md bg-gray-300 hover:bg-gray-400"
                        >
                          <LinkIcon className="w-6 h-6 mr-4" />
                          URLリンクをコピーする
                        </button>
                      ) : (
                        <button type="button" disabled
                            className="w-full flex justify-center py-1 px-4 border border-gray-900 rounded-md bg-gray-300"
                        >
                          <CheckIcon className="w-6 h-6 mr-4 text-teal-400" />
                          クリップボードにコピーしました。
                        </button>
                      )}
                    </div>
                    <p>フォルダ内にREADMEファイルがある場合はよく読んで使用してください。</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}