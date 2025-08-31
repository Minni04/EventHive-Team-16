// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      alert("✅ Logged out!");
    } catch (err) {
      console.error(err);
    }
  };

  return { user, logout };
}
