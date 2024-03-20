import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import HomePage from '../pages/HomePage';

export const StudentRoutes = [
  <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />,
  <Route key={ROUTES.PROFILE} path={ROUTES.PROFILE} element={<HomePage />} />,
];
