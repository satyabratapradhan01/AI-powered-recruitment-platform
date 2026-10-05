import React, { useState } from 'react';
import { mockAdminUsers } from '../../data/adminMockData';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Eye, ShieldCheck, UserCheck, Building2, Lock, Unlock } from 'lucide-react';

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.companyName.toLowerCase().includes(query);
    return matchesRole && matchesStatus && matchesQuery;
  });

  const handleToggleUserStatus = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'Active' ? 'Inactive' : 'Active';

    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
    );

    if (userModalOpen) {
      setSelectedUser((prev) => ({ ...prev, status: newStatus }));
    }

    toast.success(`User "${selectedUser.name}" status changed to ${newStatus}`);
    setConfirmModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Management & Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View registered Job Seekers, HR Recruiters, and Platform Admins. Activate or deactivate accounts.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full sm:w-auto">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'seeker', label: 'Job Seeker' },
              { value: 'hr', label: 'HR Recruiter' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company / Entity</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                    <Avatar name={u.name} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === 'admin' ? 'purple' : u.role === 'hr' ? 'primary' : 'info'}
                      size="xs"
                    >
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{u.companyName}</TableCell>
                  <TableCell className="text-xs text-slate-500">{u.joinedDate}</TableCell>
                  <TableCell className="text-xs text-slate-500">{u.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      leftIcon={Eye}
                      onClick={() => {
                        setSelectedUser(u);
                        setUserModalOpen(true);
                      }}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          title={`User Profile — ${selectedUser.name}`}
          description={`Account ID: ${selectedUser.id}`}
          size="md"
        >
          <div className="space-y-4 py-2 text-xs text-slate-700">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Avatar name={selectedUser.name} size="md" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedUser.name}</h4>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Account Role</p>
                <p className="font-bold text-slate-800 uppercase mt-0.5">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Account Status</p>
                <Badge variant={selectedUser.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Company Entity</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedUser.companyName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Joined Date</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedUser.joinedDate}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant={selectedUser.status === 'Active' ? 'danger' : 'success'}
                size="xs"
                leftIcon={selectedUser.status === 'Active' ? Lock : Unlock}
                onClick={() => setConfirmModalOpen(true)}
              >
                {selectedUser.status === 'Active' ? 'Deactivate User' : 'Activate User'}
              </Button>
              <Button variant="outline" size="xs" onClick={() => setUserModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {selectedUser && (
        <ConfirmationDialog
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleToggleUserStatus}
          title={selectedUser.status === 'Active' ? 'Deactivate User Account' : 'Activate User Account'}
          description={`Are you sure you want to ${
            selectedUser.status === 'Active' ? 'deactivate' : 'activate'
          } account "${selectedUser.name}"?`}
          confirmLabel={selectedUser.status === 'Active' ? 'Deactivate' : 'Activate'}
          variant={selectedUser.status === 'Active' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};

export default AdminUsers;
