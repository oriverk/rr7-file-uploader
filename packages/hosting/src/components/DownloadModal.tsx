import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { BuyMePotato } from "@/components/ads/BuyMePotato";
import { BannerLink } from "@/components/ads/AmazonAffiliate";
import { Banners } from "@/constants/banners";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const location = useLocation();
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    const upperHref = window.location.href.replace(/download\/?.*/, "");
    copy(upperHref);
  }, []);

  useEffect(() => {
    onClose();
    return () => {
      onClose();
    };
  }, [location]);

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-gray-900 shadow-xl transition-all dark:bg-gray-900 dark:text-gray-100">
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute right-0 flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:text-slate-400 dark:hover:text-slate-300"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <Dialog.Title as="h3" className="mb-8 text-center text-lg font-semibold leading-6 sm:text-xl">
                    Downloaded?
                  </Dialog.Title>
                  <div className="">
                    <h4 className="mb-8 text-center text-base font-medium">
                      Amazonでモノ買う時の前には当サイト内バナーをポチッと押して行ってください！サイト・ツールの開発の継続に繋がります。
                    </h4>
                    <div className="mb-4 flex justify-center gap-x-4">
                      <BannerLink {...Banners[0]} />
                    </div>
                    <div className="mb-4">
                      <BuyMePotato />
                    </div>
                    <div className="mb-4">
                      {!copiedText ? (
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="flex w-full justify-center rounded-md border border-gray-900 bg-gray-300 py-1 px-4 hover:bg-gray-400"
                        >
                          <LinkIcon className="mr-4 h-6 w-6" />
                          URLリンクをコピーする
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex w-full justify-center rounded-md border border-gray-900 bg-gray-300 py-1 px-4"
                        >
                          <CheckIcon className="mr-4 h-6 w-6 text-teal-400" />
                          クリップボードにコピーしました。
                        </button>
                      )}
                    </div>
                    <p className="text-center">README ファイルをよく読んで使用してください。</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
