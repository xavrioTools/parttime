import React, { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  Clock,
  Plus,
  Mail,
  CheckCircle2,
  Lock,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { WORKSPACE_MEMBERS, ACTIVITY_LOGS } from '../data/mockData';
import { WorkspaceMember, ActivityLog } from '../types/mailforge';

export const TeamWorkspace: React.FC = () => {
  const [members, setMembers] = useState<WorkspaceMember[]>(WORKSPACE_MEMBERS);
  const [logs, setLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceMember['role']>('Campaign Manager');

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: WorkspaceMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'invited',
    };
    setMembers([...members, newMember]);
    setLogs([
      {
        id: `act-${Date.now()}`,
        user: 'You (Owner)',
        action: `Invited new team member (${inviteRole})`,
        target: inviteEmail,
        timestamp: 'Just now',
      },
      ...logs,
    ]);
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Workspace & Multi-User Governance
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            ApexFlow Growth Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage agency teammates, role-based access controls, and collaborative campaign permissions.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" /> Invite Teammate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Members List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Team Members ({members.length})
            </h3>
            <span className="text-xs text-slate-400">Enterprise Seats: 4 of 10 used</span>
          </div>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#FFD6D1]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</p>
                      {m.status === 'invited' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                          Pending Invite
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                      m.role === 'Owner'
                        ? 'bg-[#FF6B6B] text-white'
                        : 'bg-[#FFD6D1]/50 text-[#FF6B6B] dark:bg-[#522329]'
                    }`}
                  >
                    {m.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions Matrix Overview */}
          <div className="p-5 rounded-2xl bg-[#FFF8F6] dark:bg-[#140C0E] border border-[#FFD6D1] space-y-3 mt-6">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#FF6B6B]" /> Role Permissions Matrix
            </h4>
            <div className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
              <p>• <strong>Owner / Admin:</strong> Full billing, domain DNS, SMTP relay configuration, member invites.</p>
              <p>• <strong>Campaign Manager:</strong> Create, schedule, and dispatch campaigns; edit contact lists.</p>
              <p>• <strong>Copywriter:</strong> Draft and review email variants and voice outreach scripts.</p>
              <p>• <strong>Analyst:</strong> View performance metrics and export executive CSV/PDF reports.</p>
            </div>
          </div>
        </div>

        {/* Activity Logs (Audit Trail) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Activity & Audit Trail
            </h3>
            <span className="text-xs text-slate-400">Real-Time</span>
          </div>

          <div className="rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] p-5 divide-y divide-[#FFD6D1]/40">
            {logs.map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{log.user}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {log.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#FF6B6B] font-semibold">{log.action}</p>
                <p className="text-[11px] text-slate-500 truncate">{log.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDFB] dark:bg-[#1C1214] p-6 rounded-3xl border border-[#FFD6D1] dark:border-[#522329] max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Invite Team Member to Workspace
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Teammate Email
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@youragency.com"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs font-semibold"
              >
                <option value="Admin">Admin</option>
                <option value="Campaign Manager">Campaign Manager</option>
                <option value="Copywriter">Copywriter</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold hover:bg-[#FF5252]"
              >
                Send Workspace Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
