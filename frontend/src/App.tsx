import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROUTES } from './constants/routes';
import { AuthenticationForm } from './pages/AuthenticationForm';
import { StudentRoutes } from './routers/StudentRouters';
import { Layout } from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<AuthenticationForm />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        {StudentRoutes}
      </Route>
    </Routes>
  );
}

export default App;
