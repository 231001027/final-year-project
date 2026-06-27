import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import TeamLogin from './pages/TeamLogin';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableTopics from './pages/student/AvailableTopics';
import MyProject from './pages/student/MyProject';
import StudentProfile from './pages/student/StudentProfile';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login/team" replace />;
  }

  return <>{children}</>;
}

// Public Route - redirects authenticated users to their dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login/team"
        element={
          <PublicRoute>
            <TeamLogin />
          </PublicRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/topics"
        element={
          <ProtectedRoute>
            <AvailableTopics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-project"
        element={
          <ProtectedRoute>
            <MyProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
