import { useCallback, useMemo, useState } from 'react';
import AuthContext from './AuthStore';

const STORAGE_KEY = 'decisionledger_user';
const TOKEN_KEY = 'decisionledger_token';
const REFRESH_TOKEN_KEY = 'decisionledger_refresh_token';

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY));

  const loginUser = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    const nextUser = {
      _id: data._id,
      email: data.email,
      name: data.name,
      isEmailVerified: data.isEmailVerified,
      avatar: data.avatar,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    return nextUser;
  }, []);

  const registerUser = useCallback(async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    const data = await res.json();
    const nextUser = {
      _id: data._id,
      email: data.email,
      name: data.name,
      isEmailVerified: data.isEmailVerified,
      avatar: data.avatar,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    return nextUser;
  }, []);

  const googleLoginUser = useCallback(async (credential) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Google Auth failed');
    }

    const data = await res.json();
    const nextUser = {
      _id: data._id,
      email: data.email,
      name: data.name,
      isEmailVerified: data.isEmailVerified,
      avatar: data.avatar,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loginUser,
      registerUser,
      googleLoginUser,
      logout,
    }),
    [loginUser, registerUser, googleLoginUser, logout, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
