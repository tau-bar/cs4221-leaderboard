import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import HomePage from '../pages/HomePage';
import Question from '../pages/Question';
import QuestionSubmissions from '../pages/QuestionSubmissions';
import Leaderboard from '../pages/Leaderboard';
import AddQuestion from '../pages/AddQuestion';

export const StudentRoutes = [
  <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />,
  <Route
    key={ROUTES.QUESTION_SUBMISSIONS}
    path={ROUTES.QUESTION_SUBMISSIONS}
    element={<QuestionSubmissions />}
  />,
  <Route key={ROUTES.QUESTION} path={ROUTES.QUESTION} element={<Question />} />,
  <Route
    key={ROUTES.LEADERBOARD}
    path={ROUTES.LEADERBOARD}
    element={<Leaderboard />}
  />,
  <Route
    key={ROUTES.ADDQUESTIONS}
    path={ROUTES.ADDQUESTIONS}
    element={<AddQuestion />}
  />,
];
