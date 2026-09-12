import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddRoomPage from './pages/AddRoomPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest Route (redirects if logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'landlord' ? '/dashboard' : '/listings'} replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['landlord']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-room"
            element={
              <ProtectedRoute allowedRoles={['landlord']}>
                <AddRoomPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h1 className="text-6xl font-bold text-surface-200 mb-4">404</h1>
                <p className="text-surface-700/60 mb-6">Page not found</p>
                <a
                  href="/"
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium hover:bg-primary-700 transition-colors"
                >
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '14px',
                  borderRadius: '10px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#f8fafc' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
                },
              }}
            />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
