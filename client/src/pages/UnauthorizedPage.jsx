import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';

const UnauthorizedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'seeker';

  const getRoleDashboard = () => {
    if (userRole === 'hr') return '/hr/dashboard';
    if (userRole === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card variant="default" className="max-w-md w-full text-center p-6 sm:p-8 shadow-xl border-slate-200/80">
        <CardContent className="p-0 space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mx-auto border border-rose-200 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="danger" size="sm" showDot>
              403 Unauthorized
            </Badge>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Access Denied
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your account with role <strong className="text-slate-800 uppercase">{userRole}</strong> does not have permission to view this restricted page.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-1 text-slate-600">
            <p className="font-bold text-slate-800">Security Policy:</p>
            <p className="leading-snug">
              Direct URL navigation to unauthorized route endpoints is blocked by RoleGuard protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={Home}
              fullWidth
              onClick={() => navigate(getRoleDashboard())}
            >
              Return to My Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
