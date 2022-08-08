import { FC, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { RequiredAuth } from "./components/RequiedAuth";
import { Layout } from "./components/Layout";
import { PageNotFound } from "./pages/404";

const Home = lazy(() => import("./pages/home"));
const Lorem = lazy(() => import("./pages/lorem"))
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const Pricing = lazy(() => import("./pages/pricing"));
const TermOfService = lazy(() => import("./pages/term-of-service"));

const Admin = lazy(() => import("./pages/admin"));
const Signup = lazy(() => import("./pages/signup"));
const Login = lazy(() => import("./pages/login"));

const NewFile = lazy(() => import("./pages/admin/new"));
const Files = lazy(() => import("./pages/files"));
const FileDetail = lazy(() => import("./pages/fileDetail"));
const FileDownload = lazy(() => import("./pages/fileDownload"));

const App: FC = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lorem" element={<Lorem />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermOfService />} />
          <Route path="price" element={<Pricing />} />
          <Route path="files">
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
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )

export default App;
