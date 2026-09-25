import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/dark2.png'

const SignupPage = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branchId, setBranchId] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch('/api/branches');
        const data = await res.json();
        if (res.ok) {
          setBranches(data);
          if (data.length > 0) {
            setBranchId(data[0].id.toString()); // Set default to first branch
          }
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };
    fetchBranches();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = {
        name,
        email: role === 'student' ? `${rollNumber}@student.nitandhra.ac.in` : `${email}`,
        password,
        role,
        ...(role === 'student' ? { branchId, cgpa, rollNumber, registrationNumber } : {})
      };
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="card" style={{ width: 400 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#2563eb', marginBottom: 24 }}>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 16 }}>
            <label className='text-blue-500' style={{ fontWeight: 500 }}>Role:</label>
            <select value={role} onChange={e => setRole(e.target.value)} required>
              <option className='bg-blue-900' value="student">Student</option>
              <option className='bg-blue-900' value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className='text-blue-500'>Name:</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" />
          </div>
          {role === 'student' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className='text-blue-500'>Branch:</label>
                <select value={branchId} onChange={e => setBranchId(e.target.value)} required>
                  <option className='bg-blue-900' value="">Select Branch</option>
                  {branches.map(branch => (
                    <option className='bg-blue-900' key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className='text-blue-500'>Registration Number:</label>
                <input value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required placeholder="Registration Number" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className='text-blue-500'>Roll Number:</label>
                <input value={rollNumber} onChange={e => setRollNumber(e.target.value)} required placeholder="Roll Number" />
              </div>
            <div style={{ marginBottom: 16 }}>
  <label className='text-blue-500'>Email:</label>

  <div className='flex items-center'>
    <input
      value={rollNumber ? `${rollNumber}@student.nitandhra.ac.in` : ''}
      readOnly
      placeholder="Email"
      style={{ width: '100%' }}
    />
  </div>
</div>
            </>
          )}
          {role !== 'student' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className='text-blue-500'>Email:</label>
                <div className='flex items-center'>
                <input value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" />
                <span style={{ fontSize: 18, color: '#6b7280' }}></span>
                </div>
              </div>
            </>
          )}
          <div style={{ marginBottom: 16 }}>
            <label className='text-blue-500'>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" />
          </div>
          {role === 'student' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className='text-blue-500'>CGPA:</label>
                <input type="number" step="0.01" value={cgpa} onChange={e => setCgpa(e.target.value)} required placeholder="CGPA" min="0" max="10" />
              </div>
            </>
          )}
          {error && <div className="text-center" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, color: 'white' }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
