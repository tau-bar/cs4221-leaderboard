import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ROUTES } from './constants/routes';
import { AuthenticationForm } from './pages/AuthenticationForm';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<AuthenticationForm />} />
    </Routes>
  );
}

export default App;
