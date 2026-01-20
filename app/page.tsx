"use client"

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, LogOut, Users, FileText, 
  ArrowRight, Shield, Zap, Clock, Menu, X 
} from 'lucide-react';

// Types
type OfficialType = 'Bursary' | 'Laboratory' | 'Dean of Faculty' | 'Librarian' | 'Health Service' | 'Coordinator Sport Unit' | 'Security Officer' | 'Examination and Records Officer' | 'Alumni and Endowment Unit' | 'Dean of Student Affairs';
type UserRole = 'student' | 'official' | 'admin';
type ClearanceStatus = 'pending' | 'initiated' | 'cleared' | 'rejected';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface Clearance {
  id: string;
  officialType: OfficialType;
  status: ClearanceStatus;
  documents?: string[];
  issueDescription?: string;
  fullName?: string;
  matricNumber?: string;
  department?: string;
  phoneNumber?: string;
}

// Mock API (Replace with real API calls to your backend)
const mockApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@fulokoja.edu.ng' && password === 'Admin@123') {
      return { id: '1', email, role: 'admin' };
    }
    if (email === 'bursary@fulokoja.edu.ng' && password === 'Official@123') {
      return { id: '2', email, role: 'official' };
    }
    if (email.endsWith('@student.fulokoja.edu.ng')) {
      return { id: '3', email, role: 'student' };
    }
    throw new Error('Invalid credentials');
  },
  
  getClearances: async (role: UserRole): Promise<Clearance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const officials: OfficialType[] = [
      'Bursary', 'Laboratory', 'Dean of Faculty', 'Librarian', 'Health Service',
      'Coordinator Sport Unit', 'Security Officer', 'Examination and Records Officer',
      'Alumni and Endowment Unit', 'Dean of Student Affairs'
    ];
    
    if (role === 'student') {
      return officials.map(type => ({
        id: Math.random().toString(),
        officialType: type,
        status: 'pending' as ClearanceStatus,
        fullName: 'John Doe',
        matricNumber: '2020/1/12345',
        department: 'Computer Science',
        phoneNumber: '08012345678'
      }));
    }
    
    return [{
      id: '1',
      officialType: 'Bursary',
      status: 'initiated' as ClearanceStatus,
      documents: ['receipt.pdf'],
      fullName: 'Jane Smith',
      matricNumber: '2020/1/12346',
      department: 'Engineering',
      phoneNumber: '08098765432'
    }];
  }
};

const FulClear = () => {
  const [page, setPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  if (page === 'landing') {
    return <LandingPage onNavigate={() => setPage('login')} />;
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setPage('landing')} />;
  }

  if (user?.role === 'student') {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  if (user?.role === 'official') {
    return <OfficialDashboard user={user} onLogout={handleLogout} />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return null;
};

// Landing Page
const LandingPage: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">FulClear</h1>
          <button
            onClick={onNavigate}
            className="px-6 py-2 text-green-700 hover:text-green-800 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </nav>

    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Digital Clearance
          <span className="block text-green-600">Made Simple</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Federal University Lokoja's paperless clearance system. Complete your final year clearance from anywhere, anytime.
        </p>
        <button
          onClick={onNavigate}
          className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition inline-flex items-center gap-2"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl font-bold text-green-600 mb-2">10</div>
          <div className="text-gray-600">Departments to Clear</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-gray-600">Digital Process</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-gray-600">Available Access</div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose FulClear?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Zap className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast & Efficient</h3>
            <p className="text-gray-600">No more long queues. Submit documents and track clearance status in real-time.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">Your documents are encrypted and stored securely with enterprise-grade security.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Clock className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your clearance status across all departments from one dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-green-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Complete Your Clearance?</h2>
        <p className="text-xl text-green-100 mb-8">Join thousands of students who have successfully cleared using FulClear</p>
        <button
          onClick={onNavigate}
          className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-lg hover:bg-green-50 transition"
        >
          Login to Your Account
        </button>
      </div>
    </section>

    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="mb-4">&copy; 2026 FulClear - Federal University Lokoja</p>
        <p className="text-sm">Digitizing Education, One Clearance at a Time</p>
      </div>
    </footer>
  </div>
);

// Login Page
const LoginPage: React.FC<{ onLogin: (user: User) => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await mockApi.login(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">FulClear</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="your.email@fulokoja.edu.ng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-6 text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Home
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2"><strong>Demo Credentials:</strong></p>
          <p className="text-xs text-gray-600">Admin: admin@fulokoja.edu.ng / Admin@123</p>
          <p className="text-xs text-gray-600">Official: bursary@fulokoja.edu.ng / Official@123</p>
        </div>
      </div>
    </div>
  );
};

// Student Dashboard
const StudentDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [clearances, setClearances] = useState<Clearance[]>([]);
  const [initiatingFor, setInitiatingFor] = useState<OfficialType | null>(null);

  useEffect(() => {
    mockApi.getClearances(user.role).then(setClearances);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">FulClear - Student Portal</h1>
            <p className="text-sm opacity-90">{clearances[0]?.fullName}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {clearances[0] && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Student Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Name:</span> {clearances[0].fullName}</div>
              <div><span className="font-semibold">Matric No:</span> {clearances[0].matricNumber}</div>
              <div><span className="font-semibold">Department:</span> {clearances[0].department}</div>
              <div><span className="font-semibold">Phone:</span> {clearances[0].phoneNumber}</div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Clearance Status</h2>
        <div className="grid gap-4">
          {clearances.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{c.officialType}</h3>
                  <div className="flex items-center gap-2">
                    {c.status === 'pending' && <><XCircle className="text-red-600" size={20} /><span className="font-bold text-red-600">NOT CLEARED</span></>}
                    {c.status === 'initiated' && <><AlertCircle className="text-yellow-600" size={20} /><span className="font-semibold text-yellow-600">Pending Review</span></>}
                    {c.status === 'cleared' && <><CheckCircle className="text-green-600" size={20} /><span className="font-semibold text-green-600">Cleared</span></>}
                    {c.status === 'rejected' && <><XCircle className="text-red-600" size={20} /><span className="font-bold text-red-600">Rejected</span></>}
                  </div>
                  {c.issueDescription && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <span className="font-semibold">Issue: </span>{c.issueDescription}
                    </div>
                  )}
                </div>
                {c.status === 'pending' && (
                  <button
                    onClick={() => setInitiatingFor(c.officialType)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Initiate Clearance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {initiatingFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Submit Documents for {initiatingFor}</h3>
            <input type="file" multiple className="w-full px-4 py-2 border rounded-lg mb-4" />
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">Submit</button>
              <button onClick={() => setInitiatingFor(null)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Official Dashboard
const OfficialDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [clearances, setClearances] = useState<Clearance[]>([]);

  useEffect(() => {
    mockApi.getClearances(user.role).then(setClearances);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">FulClear - Official Portal</h1>
            <p className="text-sm opacity-90">Bursary Office</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-green-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Pending Clearance Requests</h2>
              <p className="text-gray-600">{clearances.length} students awaiting clearance</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {clearances.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{c.fullName}</h3>
              <p className="text-sm text-gray-600">Matric: {c.matricNumber} | Dept: {c.department}</p>
              <div className="mt-4 flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} /> Clear
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FulClear - Admin Portal</h1>
          <button onClick={onLogout} className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold mb-6"
        >
          Register New Student
        </button>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Student Registration</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="px-4 py-2 border rounded-lg" placeholder="Full Name" />
              <input className="px-4 py-2 border rounded-lg" placeholder="Matric Number" />
              <input className="px-4 py-2 border rounded-lg" placeholder="Email" />
              <input className="px-4 py-2 border rounded-lg" placeholder="Phone Number" />
              <input className="px-4 py-2 border rounded-lg" placeholder="Department" />
              <input type="password" className="px-4 py-2 border rounded-lg" placeholder="Password" />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg">Register</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-300 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulClear;