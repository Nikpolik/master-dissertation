import { authState } from 'auth/state';
import { ReactNode, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PrivateRouteProps {
  redirect: string;
  children: ReactNode;
}

function PrivateRoute(props: PrivateRouteProps) {
  const { redirect, children } = props;
  const auth = useRecoilValue(authState);

  if (!auth.token) {
    return <Navigate to={redirect} />;
  }

  return <Suspense fallback="Loading...">{children}</Suspense>;
}

export default PrivateRoute;
