import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useUserStore } from '../store/userStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProtectedRoute = ({ children }: any) => {
  const { profile } = useUserStore();

  if (!profile) {
    return <Navigate to={ROUTES.LOGIN} />;
  }
  return children;
};
