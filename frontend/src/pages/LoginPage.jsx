import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginbg from '../assets/dark2.png'

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        // Decode JWT to get role
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.role === 'admin') {
          navigate('/admin');
        } else if (payload.role === 'company') {
          navigate('/company/applicants');
        } else {
          navigate('/student/eligible-companies');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   window.location.reload();
  // };

  // const token = localStorage.getItem('token');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${loginbg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="card" style={{ width: 400 }}>
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, color: 'white'}}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#2563eb', textDecoration: 'underline' }}>Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
