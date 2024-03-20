import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import HomePage from '../pages/HomePage';
import { Question } from '../pages/Question';
import Leaderboard from '../pages/Leaderboard';

export const StudentRoutes = [
  <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />,
  <Route key={ROUTES.QUESTION} path={ROUTES.QUESTION} element={<Question />} />,
  <Route
    key={ROUTES.LEADERBOARD}
    path={ROUTES.LEADERBOARD}
    element={<Leaderboard />}
  />,
];
