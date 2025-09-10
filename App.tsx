
import React, { useState, useCallback } from 'react';
import { Role } from './types';
import Login from './components/Login';
import AuthorityDashboard from './components/AuthorityDashboard';
import StudentDashboard from './components/StudentDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: Role } | null>(null);

  const handleLogin = useCallback((email: string, role: Role) => {
    setUser({ email, role });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  switch (user.role) {
    case Role.Authority:
      return <AuthorityDashboard userEmail={user.email} onLogout={handleLogout} />;
    case Role.Student:
      return <StudentDashboard userEmail={user.email} onLogout={handleLogout} />;
    default:
      return <Login onLogin={handleLogin} />;
  }
};

export default App;
