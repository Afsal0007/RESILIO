import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import * as authService from '@/services/auth';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return { user: action.user, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.user, isLoading: false };
    case 'LOGOUT':
      return { user: null, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    (async () => {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          dispatch({ type: 'RESTORE', user });
        }
      } catch {
        if (isMounted) {
          dispatch({ type: 'RESTORE', user: null });
        }
      }

      unsubscribe = authService.onAuthStateChange((user) => {
        if (isMounted) {
          dispatch({ type: 'SET_USER', user });
        }
      });
    })();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback((credentials) => authService.login(credentials), []);
  const signUp = useCallback((payload) => authService.signUp(payload), []);
  const logout = useCallback(() => authService.logout(), []);
  const forgotPassword = useCallback((payload) => authService.forgotPassword(payload), []);
  const demoLogin = useCallback((role) => authService.demoLogin(role), []);
  const submitVerification = useCallback((uri) => authService.submitVerification(uri), []);

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user),
      isLoading: state.isLoading,
      login,
      signUp,
      logout,
      forgotPassword,
      demoLogin,
      submitVerification,
    }),
    [state.user, state.isLoading, login, signUp, logout, forgotPassword, demoLogin, submitVerification]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
