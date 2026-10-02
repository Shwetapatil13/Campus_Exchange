import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Building2, Lock, ShieldCheck, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college || 'Stanford University');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const colleges = [
    { value: 'Stanford University', label: 'Stanford University' },
    { value: 'MIT Tech Campus', label: 'MIT Tech Campus' },
    { value: 'IIT Bombay', label: 'IIT Bombay' },
    { value: 'UC Berkeley', label: 'UC Berkeley' },
    { value: 'Other University Campus', label: 'Other University Campus' },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const updated = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        college,
        profileImage: profileImage.trim() || undefined,
      });

      updateUser(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter current and new password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password. Check your current password.';
      showToast(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Card Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-20 h-20 rounded-full bg-brand-500/10 text-brand-600 font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-brand-500/30 shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-emerald-600 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4" /> Verified Campus Account
          </div>
        </div>
      </div>

      {/* Main Grid: Edit Profile & Change Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Info Form */}
        <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-brand-600" /> Update Profile Details
          </h3>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="w-4 h-4" />}
            placeholder="+91 98765 43210"
          />

          <Select
            label="College / Campus"
            options={colleges}
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />

          <Input
            label="Avatar Image URL (Optional)"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            icon={<Camera className="w-4 h-4" />}
            placeholder="https://..."
          />

          <Button type="submit" variant="primary" isLoading={isUpdatingProfile} className="w-full">
            Save Profile Changes
          </Button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" /> Change Security Password
          </h3>

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
            required
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            placeholder="At least 6 characters"
            required
          />

          <Button type="submit" variant="secondary" isLoading={isChangingPassword} className="w-full">
            Update Password
          </Button>
        </form>

      </div>
    </div>
  );
};
