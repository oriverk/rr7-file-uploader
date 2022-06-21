/* eslint-disable no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
