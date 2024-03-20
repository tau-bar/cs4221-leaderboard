import { Flex } from '@mantine/core';
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROUTES } from './constants/routes';
import { AuthenticationForm } from './pages/AuthenticationForm';
import { StudentRoutes } from './routers/StudentRouters';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<AuthenticationForm />} />

      <Route
        element={
          <ProtectedRoute>
            <Flex direction={'row'}>
              <Navbar />
              <Outlet />
            </Flex>
          </ProtectedRoute>
        }
      >
        {StudentRoutes}
      </Route>
    </Routes>
  );
}

export default App;
