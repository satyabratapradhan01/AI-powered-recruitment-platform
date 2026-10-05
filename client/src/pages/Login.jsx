import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import ErrorState from '../components/ui/ErrorState';
import { Mail, Lock, Briefcase, Sparkles, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
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

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setValidationError(err.message || 'Invalid email or password.');
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
            AI-Powered Recruitment Engine
          </p>
        </div>

        <Card variant="default" className="shadow-xl border-slate-200/80">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign in to your portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your recruitment workspace.
              </p>
            </div>

            {validationError && (
              <ErrorState
                title="Authentication Error"
                message={validationError}
              />
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email Address *"
                type="email"
                name="email"
                placeholder="candidate@company.com"
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={LogIn}
                className="mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Create account for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
