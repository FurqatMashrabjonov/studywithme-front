import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { useStore } from './store/useStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="/notebook/:id" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        } />
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </Router>
  );
}

export default App;
