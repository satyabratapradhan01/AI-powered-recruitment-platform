import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import ErrorState from '../components/ui/ErrorState';
import { Mail, Lock, User, Briefcase, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password);
      await login(email.trim(), password);
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      setValidationError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Talent<span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            AI Recruitment Platform Registration
          </p>
        </div>

        <Card variant="default" className="shadow-xl border-slate-200/80">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Create your account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Join our recruitment ecosystem to track jobs and AI matching metrics.
              </p>
            </div>

            {validationError && (
              <ErrorState
                title="Registration Error"
                message={validationError}
              />
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Full Name *"
                type="text"
                name="name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                leftIcon={User}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                name="email"
                placeholder="alex@company.com"
                value={formData.email}
                onChange={handleChange}
                leftIcon={Mail}
                required
              />

              <Input
                label="Password *"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                leftIcon={Lock}
                required
              />

              <Input
                label="Confirm Password *"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={Lock}
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
                Register Account
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
