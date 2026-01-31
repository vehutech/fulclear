"use client";

import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, LogOut, Users, FileText } from 'lucide-react';

// Types
type UserRole = 'student' | 'official' | 'admin';

type OfficialType = 
  | 'Bursary'
  | 'Laboratory'
  | 'Dean of Faculty'
  | 'Librarian'
  | 'Health Service'
  | 'Coordinator Sport Unit'
  | 'Security Officer'
  | 'Examination and Records Officer'
  | 'Alumni and Endowment Unit'
  | 'Dean of Student Affairs';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricNumber?: string;
  phoneNumber?: string;
  department?: string;
  officialType?: OfficialType;
}

interface ClearanceStatus {
  officialType: OfficialType;
  status: 'pending' | 'initiated' | 'cleared' | 'rejected';
  documents?: string[];
  issue?: string;
  updatedAt?: Date;
}

interface StudentClearance {
  studentId: string;
  clearances: ClearanceStatus[];
}

// Mock authentication
const mockAuth = {
  currentUser: null as User | null,
  login: (email: string, password: string, role: UserRole = 'student') => {
    // Mock login logic
    return {
      id: Math.random().toString(),
      name: email.split('@')[0],
      email,
      role,
      matricNumber: role === 'student' ? '2020/1/12345' : undefined,
      phoneNumber: role === 'student' ? '08012345678' : undefined,
      department: role === 'student' ? 'Computer Science' : undefined,
      officialType: role === 'official' ? 'Bursary' as OfficialType : undefined
    };
  }
};

const OFFICIALS: OfficialType[] = [
  'Bursary',
  'Laboratory',
  'Dean of Faculty',
  'Librarian',
  'Health Service',
  'Coordinator Sport Unit',
  'Security Officer',
  'Examination and Records Officer',
  'Alumni and Endowment Unit',
  'Dean of Student Affairs'
];

const FulClear = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  const [selectedOfficial, setSelectedOfficial] = useState<OfficialType>('Bursary');
  
  // Student data
  const [studentClearances, setStudentClearances] = useState<ClearanceStatus[]>([]);
  const [initiatingFor, setInitiatingFor] = useState<OfficialType | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  // Official data
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    if (currentUser?.role === 'student') {
      initializeStudentClearances();
    } else if (currentUser?.role === 'official') {
      loadPendingStudents();
    }
  }, [currentUser]);

  const initializeStudentClearances = () => {
    const clearances: ClearanceStatus[] = OFFICIALS.map(official => ({
      officialType: official,
      status: 'pending' as const
    }));
    setStudentClearances(clearances);
  };

  const loadPendingStudents = () => {
    // Mock data - in real app, fetch from database
    const students = [
      {
        id: '1',
        name: 'John Doe',
        matricNumber: '2020/1/12345',
        department: 'Computer Science',
        documents: ['receipt.pdf', 'clearance_form.pdf'],
        status: 'initiated'
      },
      {
        id: '2',
        name: 'Jane Smith',
        matricNumber: '2020/1/12346',
        department: 'Engineering',
        documents: ['payment_proof.pdf'],
        status: 'initiated'
      }
    ];
    setPendingStudents(students);
  };



  const handleInitiateClearance = (official: OfficialType) => {
    setInitiatingFor(official);
  };

  const handleSubmitDocuments = () => {
    if (uploadedDocs.length === 0) {
      alert('Please upload at least one document');
      return;
    }
    
    setStudentClearances(prev => 
      prev.map(c => 
        c.officialType === initiatingFor
          ? { ...c, status: 'initiated' as const, documents: uploadedDocs }
          : c
      )
    );
    setInitiatingFor(null);
    setUploadedDocs([]);
    alert('Documents submitted successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
    }
  };

  const handleOfficialAction = (studentId: string, action: 'cleared' | 'rejected', issue?: string) => {
    setPendingStudents(prev => 
      prev.map(s => 
        s.id === studentId
          ? { ...s, status: action, issue }
          : s
      )
    );
    setSelectedStudent(null);
    alert(`Student ${action === 'cleared' ? 'cleared' : 'rejected'} successfully`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setStudentClearances([]);
    setPendingStudents([]);
  };

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">FulClear</h1>
            <p className="text-gray-600">Federal University Lokoja Clearance System</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Login As</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLoginRole('student')}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  loginRole === 'student'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setLoginRole('official')}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  loginRole === 'official'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Official
              </button>
            </div>
          </div>

          {loginRole === 'official' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Office</label>
              <select
                value={selectedOfficial}
                onChange={(e) => setSelectedOfficial(e.target.value as OfficialType)}
                className="w-full px-4 text-green-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {OFFICIALS.map(official => (
                  <option key={official} value={official}>{official}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="login-email"
                required
                className="w-full bg-green-100 text-green-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your.email@student.fulokoja.edu.ng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="login-password"
                required
                className="w-full px-4 py-2 border bg-green-100 text-green-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={(e) => {
                const email = (document.getElementById('login-email') as HTMLInputElement).value;
                const password = (document.getElementById('login-password') as HTMLInputElement).value;
                if (email && password) {
                  const user = mockAuth.login(email, password, loginRole);
                  if (loginRole === 'official') {
                    user.officialType = selectedOfficial;
                  }
                  setCurrentUser(user);
                  setView('dashboard');
                }
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Login
            </button>
          </div>

          {loginRole === 'student' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setView('signup')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Don't have an account? Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Signup View
  if (view === 'signup') {
    return (
      <div className="min-h-screen text-black bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Student Registration</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="signup-name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matric Number</label>
              <input
                type="text"
                id="signup-matric"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="signup-email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                id="signup-phone"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                id="signup-dept"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="signup-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                const name = (document.getElementById('signup-name') as HTMLInputElement).value;
                const matricNumber = (document.getElementById('signup-matric') as HTMLInputElement).value;
                const email = (document.getElementById('signup-email') as HTMLInputElement).value;
                const phoneNumber = (document.getElementById('signup-phone') as HTMLInputElement).value;
                const department = (document.getElementById('signup-dept') as HTMLInputElement).value;
                const password = (document.getElementById('signup-password') as HTMLInputElement).value;
                
                if (name && matricNumber && email && phoneNumber && department && password) {
                  const user: User = {
                    id: Math.random().toString(),
                    name,
                    email,
                    role: 'student',
                    matricNumber,
                    phoneNumber,
                    department
                  };
                  setCurrentUser(user);
                  setView('dashboard');
                }
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setView('login')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  if (currentUser?.role === 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-700 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">FulClear</h1>
              <p className="text-sm opacity-90">Welcome, {currentUser.name}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="container mx-auto p-6 text-green-700">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-green-700">Student Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Name:</span> {currentUser.name}</div>
              <div><span className="font-semibold">Matric No:</span> {currentUser.matricNumber}</div>
              <div><span className="font-semibold">Department:</span> {currentUser.department}</div>
              <div><span className="font-semibold">Phone:</span> {currentUser.phoneNumber}</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Clearance Status</h2>
          <div className="grid gap-4">
            {studentClearances.map((clearance) => (
              <div key={clearance.officialType} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{clearance.officialType}</h3>
                    <div className="flex items-center gap-2">
                      {clearance.status === 'pending' && (
                        <>
                          <span className="font-bold text-red-600">NOT CLEARED</span>
                          <XCircle className="text-red-600" size={20} />
                        </>
                      )}
                      {clearance.status === 'initiated' && (
                        <>
                          <span className="font-semibold text-yellow-600">Pending Review</span>
                          <AlertCircle className="text-yellow-600" size={20} />
                        </>
                      )}
                      {clearance.status === 'cleared' && (
                        <>
                          <span className="font-semibold text-green-600">Cleared</span>
                          <CheckCircle className="text-green-600" size={20} />
                        </>
                      )}
                      {clearance.status === 'rejected' && (
                        <>
                          <span className="font-bold text-red-600">Rejected</span>
                          <XCircle className="text-red-600" size={20} />
                        </>
                      )}
                    </div>
                    {clearance.issue && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <span className="font-semibold">Issue: </span>{clearance.issue}
                      </div>
                    )}
                  </div>
                  <div>
                    {clearance.status === 'pending' && (
                      <button
                        onClick={() => handleInitiateClearance(clearance.officialType)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Initiate Clearance
                      </button>
                    )}
                    {clearance.status === 'rejected' && (
                      <button
                        onClick={() => handleInitiateClearance(clearance.officialType)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Resubmit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Upload Modal */}
        {initiatingFor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md text-green-700 w-full">
              <h3 className="text-xl font-bold mb-4">Submit Documents for {initiatingFor}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Required Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {uploadedDocs.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedDocs.map((doc, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <FileText size={16} />
                        {doc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitDocuments}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setInitiatingFor(null);
                    setUploadedDocs([]);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Official Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">FulClear - Official Portal</h1>
            <p className="text-sm opacity-90">{currentUser?.officialType}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-green-600" size={24} />
            <h2 className="text-xl font-bold">Pending Clearance Requests</h2>
          </div>
          <p className="text-gray-600">{pendingStudents.length} students awaiting clearance</p>
        </div>

        <div className="grid gap-4">
          {pendingStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p><span className="font-semibold">Matric No:</span> {student.matricNumber}</p>
                    <p><span className="font-semibold">Department:</span> {student.department}</p>
                    <p><span className="font-semibold">Documents:</span></p>
                    <ul className="ml-4 list-disc">
                      {student.documents.map((doc: string, idx: number) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Review Clearance</h3>
              <div className="mb-4">
                <p className="font-semibold">{selectedStudent.name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.matricNumber}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Issue (if rejecting)
                </label>
                <textarea
                  id="issue"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOfficialAction(selectedStudent.id, 'cleared')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Clear
                </button>
                <button
                  onClick={() => {
                    const issue = (document.getElementById('issue') as HTMLTextAreaElement).value;
                    if (!issue.trim()) {
                      alert('Please provide a reason for rejection');
                      return;
                    }
                    handleOfficialAction(selectedStudent.id, 'rejected', issue);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulClear;