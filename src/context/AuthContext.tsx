import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authenticateTeam, authenticateFaculty, updateTeam, getTeamById } from '../lib/api';
import { Team, Faculty, AuthState } from '../types';

interface AuthContextType extends AuthState {
  loginTeam: (teamId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginFaculty: (facultyId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<Team>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState(parsed);

        // Fetch fresh team details to sync database state with browser session
        if (parsed.isAuthenticated && parsed.role === 'team' && parsed.user?.id) {
          getTeamById(parsed.user.id)
            .then((freshTeam) => {
              if (freshTeam) {
                setAuthState({
                  user: freshTeam,
                  role: 'team',
                  isAuthenticated: true,
                });
              }
            })
            .catch(console.error);
        }
      } catch (e) {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
    }
  }, [authState]);

  const loginTeam = async (teamId: string, password: string) => {
    try {
      const team = await authenticateTeam(teamId, password);
      if (!team) {
        return { success: false, error: 'Invalid Team ID or Password' };
      }

      setAuthState({
        user: team,
        role: 'team',
        isAuthenticated: true,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const loginFaculty = async (facultyId: string, password: string) => {
    try {
      const faculty = await authenticateFaculty(facultyId, password);
      if (!faculty) {
        return { success: false, error: 'Invalid Faculty ID or Password' };
      }

      setAuthState({
        user: faculty,
        role: 'faculty',
        isAuthenticated: true,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      role: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth');
  };

  const updateUser = async (updates: Partial<Team>) => {
    if (authState.user) {
      const updated = await updateTeam(authState.user.id, updates);
      setAuthState((prev) => ({
        ...prev,
        user: updated ?? (prev.user ? { ...prev.user, ...updates } : null),
      }));
      return;
    }

    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginTeam,
        loginFaculty,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
