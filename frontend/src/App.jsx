import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { loadStoredAuth, selectIsAuthenticated, selectAuthLoading, selectUser } from './store/slices/authSlice';
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

// ─── Route Guards ──────────────────────────────────────────────────

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'landlord' ? '/dashboard' : '/listings'} replace />;
  }
  return children;
};

// ─── App Content ───────────────────────────────────────────────────

const AppContent = () => {
  const dispatch = useDispatch();

  // Load auth from localStorage on first mount
  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />

          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['landlord']}><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/add-room" element={
            <ProtectedRoute allowedRoles={['landlord']}><AddRoomPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
              <h1 className="text-8xl font-extrabold text-zinc-200 mb-4 font-display">404</h1>
              <p className="text-zinc-400 mb-8 text-lg">This page doesn't exist.</p>
              <a
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Go Home
              </a>
            </div>
          } />
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
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#18181b',
                color: '#fafafa',
                fontSize: '14px',
                borderRadius: '10px',
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.08)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fafafa' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fafafa' } },
            }}
          />
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
