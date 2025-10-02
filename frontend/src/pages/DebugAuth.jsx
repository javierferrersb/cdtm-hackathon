import React from 'react';
import { useAuth } from '../services/auth';

const DebugAuth = () => {
  const { user, loading, checkAuthStatus } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Authentication Debug</h2>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
      <button onClick={checkAuthStatus}>Check Auth Status</button>
      <br /><br />
      <a href="/auth/google">Sign in with Google</a>
    </div>
  );
};

export default DebugAuth;