
import React, { useState } from 'react';
import { Role } from '../types';
import { CalendarIcon, UserGroupIcon, ShieldCheckIcon } from './icons/Icons';

interface LoginProps {
  onLogin: (email: string, role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.Authority);
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setError('');
      setIsEmailEntered(true);
    } else {
      setError('Please enter a valid email address.');
    }
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };
  
  const handleFinalLogin = () => {
    onLogin(email, role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3">
                <CalendarIcon className="h-10 w-10 text-primary-600"/>
                <h1 className="text-4xl font-bold text-gray-800">TimeTable AI</h1>
            </div>
          <p className="text-gray-500 mt-2">Intelligent Scheduling, Simplified.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-500">
          {!isEmailEntered ? (
            <form onSubmit={handleEmailSubmit}>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Passwordless Login</h2>
              <p className="text-gray-500 mb-6">Enter your email to get started.</p>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., admin@university.edu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300">
                Continue
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome!</h2>
              <p className="text-gray-500 mb-6">Select your role to proceed to your dashboard.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleRoleSelect(Role.Authority)}
                  className={`p-6 border-2 rounded-lg text-center transition duration-200 flex flex-col items-center justify-center h-32 ${role === Role.Authority ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'}`}
                >
                  <ShieldCheckIcon className={`h-8 w-8 mb-2 ${role === Role.Authority ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${role === Role.Authority ? 'text-primary-700' : 'text-gray-600'}`}>Authority</span>
                </button>
                <button
                  onClick={() => handleRoleSelect(Role.Student)}
                  className={`p-6 border-2 rounded-lg text-center transition duration-200 flex flex-col items-center justify-center h-32 ${role === Role.Student ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'}`}
                >
                  <UserGroupIcon className={`h-8 w-8 mb-2 ${role === Role.Student ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${role === Role.Student ? 'text-primary-700' : 'text-gray-600'}`}>Student</span>
                </button>
              </div>

              <button onClick={handleFinalLogin} className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300">
                Go to Dashboard
              </button>
              <button onClick={() => setIsEmailEntered(false)} className="w-full text-center text-gray-500 mt-4 text-sm hover:text-primary-600">
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
