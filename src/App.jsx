import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.context';
import { Home } from './pages/home/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { PrivateRoute } from './components/auth/PrivateRoute';
import { Profile } from './pages/profile/Profile';
import NotfoundPage from './pages/NotfoundPage';
import Layout from './pages/Layout';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotfoundPage/>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};