import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import './style.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("⚠️ Password must be at least 6 characters long!");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('✅ Welcome Back!');
        navigate('/registration');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('🎉 Account created successfully!');
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth Error Code:", error.code);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('❌ This email is already registered.');
          break;
        case 'auth/invalid-email':
          alert('❌ Invalid email address.');
          break;
        case 'auth/weak-password':
          alert('❌ The password is too weak.');
          break;
        case 'auth/user-not-found':
          alert('❌ No account found with this email.');
          break;
        case 'auth/wrong-password':
          alert('❌ Incorrect password! Please try again.');
          break;
        case 'auth/network-request-failed':
          alert('🌐 Network error, please check your internet connection.');
          break;
        default:
          alert('❌ Something went wrong: ' + error.message);
      }
    }}

  return (
    <div className="auth-page">
      <div className="glass-card">
        <div className="auth-header text-center">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password (Min 6 chars)" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="submit-btn">{isLogin ? 'Sign In' : 'Register'}</button>
        </form>
        <p className="text-center mt-3" onClick={() => setIsLogin(!isLogin)} style={{cursor:'pointer', color:'#695CFE'}}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;