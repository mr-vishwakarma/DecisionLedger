import { useCallback, useMemo, useState } from 'react';
import AuthContext from './AuthStore';

const STORAGE_KEY = 'decisionledger_user';
const TOKEN_KEY = 'decisionledger_token';
const REFRESH_TOKEN_KEY = 'decisionledger_refresh_token';

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

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
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const loginUser = useCallback(async (email, password) => {
    const res = await fetch(`${apiBase}/api/auth/login`, {
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
      companyName: data.companyName,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    if (!nextUser.companyName) setShowCompanyModal(true);
    return nextUser;
  }, []);

  const registerUser = useCallback(async (name, email, password) => {
    const res = await fetch(`${apiBase}/api/auth/register`, {
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
      companyName: data.companyName,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    if (!nextUser.companyName) setShowCompanyModal(true);
    return nextUser;
  }, []);

  const googleLoginUser = useCallback(async (credential) => {
    const res = await fetch(`${apiBase}/api/auth/google/callback`, {
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
      companyName: data.companyName,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    if (!nextUser.companyName) setShowCompanyModal(true);
    return nextUser;
  }, []);

  const githubLoginUser = useCallback(async (code) => {
    const res = await fetch(`${apiBase}/api/auth/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'GitHub Auth failed');
    }

    const data = await res.json();
    const nextUser = {
      _id: data._id,
      email: data.email,
      name: data.name,
      isEmailVerified: data.isEmailVerified,
      avatar: data.avatar,
      companyName: data.companyName,
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(nextUser);
    setToken(data.accessToken);
    if (!nextUser.companyName) setShowCompanyModal(true);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const updateCompanyName = async (companyName) => {
    const res = await fetch(`${apiBase}/api/auth/profile/company`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ companyName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Update company failed');
    }
    const updated = await res.json();
    const updatedUser = { ...user, companyName: updated.companyName };
    setUser(updatedUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setShowCompanyModal(false);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loginUser,
      registerUser,
      googleLoginUser,
      githubLoginUser,
      logout,
      showCompanyModal,
      setShowCompanyModal,
      updateCompanyName,
      showAiChat,
      setShowAiChat,
    }),
    [loginUser, registerUser, googleLoginUser, githubLoginUser, logout, user, token, showCompanyModal, showAiChat]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
