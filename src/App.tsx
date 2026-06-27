import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import FacultyLogin from './pages/FacultyLogin';
import TeamLogin from './pages/TeamLogin';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableTopics from './pages/student/AvailableTopics';
import MyProject from './pages/student/MyProject';
import StudentProfile from './pages/student/StudentProfile';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ManageTopics from './pages/faculty/ManageTopics';
import AddTopic from './pages/faculty/AddTopic';
import EditTopic from './pages/faculty/EditTopic';
import ViewAllocations from './pages/faculty/ViewAllocations';
import FacultyProfile from './pages/faculty/FacultyProfile';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole: 'faculty' | 'team' }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login/team" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
}

// Public Route - redirects authenticated users to their dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login/faculty"
        element={
          <PublicRoute>
            <FacultyLogin />
          </PublicRoute>
        }
      />
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
          <ProtectedRoute requiredRole="team">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/topics"
        element={
          <ProtectedRoute requiredRole="team">
            <AvailableTopics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-project"
        element={
          <ProtectedRoute requiredRole="team">
            <MyProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="team">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/topics"
        element={
          <ProtectedRoute requiredRole="faculty">
            <ManageTopics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/topics/new"
        element={
          <ProtectedRoute requiredRole="faculty">
            <AddTopic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/topics/edit/:id"
        element={
          <ProtectedRoute requiredRole="faculty">
            <EditTopic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/allocations"
        element={
          <ProtectedRoute requiredRole="faculty">
            <ViewAllocations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyProfile />
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
