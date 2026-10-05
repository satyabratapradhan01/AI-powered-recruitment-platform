import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import ErrorState from '../components/ui/ErrorState';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, UserPlus, UserCheck, Building2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker', // Default role: Job Seeker
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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

      // Register user with specified role ('seeker' or 'hr')
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.role
      );

      // Automatically log in after successful registration
      const userObj = await login(formData.email.trim(), formData.password);
      toast.success('Account created successfully! Welcome to TalentAI.');

      // Role-based redirect
      if (userObj?.role === 'hr') {
        navigate('/dashboard');
      } else {
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
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Talent<span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Create Your Account
          </p>
        </div>

        <Card variant="default" className="shadow-xl border-slate-200/80">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Join the platform
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your primary account type to get started.
              </p>
            </div>

            {errors.api && (
              <ErrorState title="Registration Error" message={errors.api} />
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Account Role Selector Cards */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'seeker' }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      formData.role === 'seeker'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className={`w-5 h-5 mb-1 ${formData.role === 'seeker' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Job Seeker</span>
                    <span className="text-[10px] text-slate-500 font-medium">Default Role</span>
                  </div>

                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'hr' }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      formData.role === 'hr'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mb-1 ${formData.role === 'hr' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">HR / Recruiter</span>
                    <span className="text-[10px] text-slate-500 font-medium">Employer Portal</span>
                  </div>
                </div>
              </div>

              <Input
                label="Full Name *"
                type="text"
                name="name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
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
                Register Account
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
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
