import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPromptModal from '@/components/auth/LoginPromptModal';

const HELP_MODE_KEY = '@resilio/helpMode';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [helpMode, setHelpModeState] = useState(null);
  const [loginPrompt, setLoginPrompt] = useState({
    visible: false,
    intendedRoute: '/home',
    actionLabel: 'do this',
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(HELP_MODE_KEY);
        if (stored) setHelpModeState(stored);
      } catch {
        // Guest preference is optional.
      }
    })();
  }, []);

  const setHelpMode = useCallback(async (mode) => {
    setHelpModeState(mode);
    try {
      if (mode) {
        await AsyncStorage.setItem(HELP_MODE_KEY, mode);
      } else {
        await AsyncStorage.removeItem(HELP_MODE_KEY);
      }
    } catch {
      // Ignore persistence errors for a UI preference.
    }
  }, []);

  const showLoginPrompt = useCallback(({ intendedRoute = '/home', actionLabel = 'do this' } = {}) => {
    setLoginPrompt({
      visible: true,
      intendedRoute,
      actionLabel,
    });
  }, []);

  const hideLoginPrompt = useCallback(() => {
    setLoginPrompt((current) => ({ ...current, visible: false }));
  }, []);

  const value = useMemo(
    () => ({
      helpMode,
      setHelpMode,
      loginPrompt,
      showLoginPrompt,
      hideLoginPrompt,
    }),
    [helpMode, setHelpMode, loginPrompt, showLoginPrompt, hideLoginPrompt]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <LoginPromptModal
        visible={loginPrompt.visible}
        intendedRoute={loginPrompt.intendedRoute}
        actionLabel={loginPrompt.actionLabel}
        onClose={hideLoginPrompt}
      />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
