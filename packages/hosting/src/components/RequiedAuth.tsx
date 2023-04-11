import { FC } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebase";
import { Container } from "./ui/Container";
import { Seo } from "./Seo";

const RequiredAuth: FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return (
      <Container>
        <div className="mx-auto mt-8 max-w-xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Authentication</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="mx-auto max-w-lg rounded-lg border p-4 text-center md:p-8">
              <strong>...loading</strong>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!loading && error) {
    return (
      <Container>
        <div className="mx-auto mt-8 max-w-xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Authentication</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="mx-auto max-w-lg rounded-lg border p-4 text-center md:p-8">
              {error && <strong className="text-red-500">{`Error: ${error}`}</strong>}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Seo noindex />
      <Outlet />
    </>
  );
};

export default RequiredAuth;
