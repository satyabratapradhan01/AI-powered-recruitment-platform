import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import ErrorState from '../components/ui/ErrorState';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Building2, UserCheck } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get('role');
  const isHRMode = roleParam === 'hr' || roleParam === 'recruiter' || roleParam === 'employer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: isHRMode ? 'hr' : 'seeker',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: isHRMode ? 'hr' : 'seeker',
    }));
  }, [isHRMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // Register user with current role ('seeker' or 'hr')
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.role
      );

      // Automatically log in after successful registration
      const userObj = await login(formData.email.trim(), formData.password);
      
      if (userObj?.role === 'hr') {
        toast.success('HR Recruiter account registered! You can start posting jobs immediately.');
        navigate('/hr/dashboard');
      } else {
        toast.success('Candidate account created successfully! Welcome to HireFlow AI.');
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ api: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10 animate-fade-in-up">
        {/* Official HireFlow AI Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              HireFlow <span className="font-bold text-slate-900">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {isHRMode ? 'Employer & Recruiter Portal' : 'Candidate Registration'}
          </p>
        </div>

        <Card variant="default" className="shadow-xl border-slate-200/80">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isHRMode ? 'Register HR Recruiter' : 'Create Candidate Account'}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    isHRMode
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {isHRMode ? (
                    <>
                      <Building2 className="w-3 h-3 text-purple-600" />
                      <span>HR Recruiter</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3 text-indigo-600" />
                      <span>Job Candidate</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isHRMode
                  ? 'Sign up to post jobs and manage candidate hiring pipelines immediately.'
                  : 'Create your account to apply for jobs and track applications in real-time.'}
              </p>
            </div>

            {errors.api && (
              <ErrorState title="Registration Error" message={errors.api} />
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Full Name *"
                type="text"
                name="name"
                placeholder={isHRMode ? 'Sarah Chen (HR Manager)' : 'Alex Morgan'}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={User}
                required
              />

              <Input
                label="Work Email Address *"
                type="email"
                name="email"
                placeholder={isHRMode ? 'sarah@company.com' : 'alex@email.com'}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={Mail}
                required
              />

              <Input
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={Lock}
                rightIcon={() => (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
                required
              />

              <Input
                label="Confirm Password *"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={Lock}
                rightIcon={() => (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={UserPlus}
                className="mt-2"
              >
                {isHRMode ? 'Register HR Account' : 'Register Candidate Account'}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs text-slate-500">
              <p>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Sign in here
                </Link>
              </p>

              {isHRMode ? (
                <p>
                  Looking for job opportunities?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    Candidate Sign up
                  </Link>
                </p>
              ) : (
                <p>
                  Are you an Employer or HR Manager?{' '}
                  <Link
                    to="/register?role=hr"
                    className="font-bold text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    Register HR Account here
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
