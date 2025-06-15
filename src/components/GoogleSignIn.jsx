import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#fff',
  color: '#222',
  border: '1.5px solid #4285F4',
  borderRadius: 8,
  padding: '10px 22px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(66,133,244,0.08)',
  transition: 'background 0.2s',
};

const GoogleSignIn = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert('Google sign-in failed: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={user.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <span style={{ fontWeight: 600 }}>{user.displayName || user.email}</span>
        <button onClick={handleSignOut} style={{ ...buttonStyle, border: '1.5px solid #d32f2f', color: '#d32f2f' }}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={handleSignIn} style={buttonStyle}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 24, height: 24 }} />
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn; 