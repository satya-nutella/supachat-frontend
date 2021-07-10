import React, { useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    return auth.signInWithPopup(googleProvider);
  };

  const signOut = () => {
    return auth.signOut();
  }

  const value = {
    currentUser,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {loading || children}
    </AuthContext.Provider>
  );
}
