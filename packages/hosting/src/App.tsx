import { FC, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import { FileLayout } from "./components/Layout/FileLayout";
import { PageNotFound } from "./pages/404";

const Signup = lazy(() => import("./pages/signup"));
const Login = lazy(() => import("./pages/login"));

const RequiredAuth = lazy(() => import("./components/RequiedAuth"))
const Admin = lazy(() => import("./pages/admin"));
const NewFile = lazy(() => import("./pages/admin/new"));
const EditFile = lazy(() => import("./pages/admin/editFile"));

const Home = lazy(() => import("./pages/home"));
const Lorem = lazy(() => import("./pages/lorem"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const Pricing = lazy(() => import("./pages/pricing"));
const TermOfService = lazy(() => import("./pages/term-of-service"));

const Files = lazy(() => import("./pages/files"));
const FileDetail = lazy(() => import("./pages/files/detail"));
const FileDownload = lazy(() => import("./pages/files/download"));

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lorem" element={<Lorem />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermOfService />} />
        <Route path="price" element={<Pricing />} />
        <Route path="files" element={<FileLayout />}>
          <Route index element={<Files />} />
          <Route path=":fileId">
            <Route index element={<FileDetail />} />
            <Route path="download" element={<FileDownload />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin" element={<RequiredAuth />}>
          <Route index element={<Admin />} />
          <Route path="new" element={<NewFile />} />
          <Route path="files/:fileId" element={<EditFile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
