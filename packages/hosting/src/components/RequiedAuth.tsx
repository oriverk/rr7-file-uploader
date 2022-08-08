import { FC } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebase";
import { Container } from "./Container";
import { Seo } from "./Seo";

export const RequiredAuth: FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return (
      <Container>
        <div className="mt-8 mx-auto max-w-xl">
          <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">Authentication</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 md:p-8 mx-auto max-w-lg border rounded-lg text-center">
              <strong>...loading</strong>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (!loading && error) {
    return (
      <Container>
        <div className="mt-8 mx-auto max-w-xl">
          <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">Authentication</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 md:p-8 mx-auto max-w-lg border rounded-lg text-center">
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
