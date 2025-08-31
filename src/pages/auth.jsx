// src/pages/Auth.jsx
import { useState } from "react";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Logged in!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Account created!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("✅ Logged in with Google!");
    } catch (err) {
      console.error("Google login error:", err);
      alert("❌ Google login failed. Check console.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Sign Up"} to EventHive
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-72">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
      >
        Continue with Google
      </button>

      <p
        className="mt-4 text-sm text-gray-600 cursor-pointer hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default Auth;
