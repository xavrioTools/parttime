import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Trash2,
  Tag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Mail,
  Building,
} from 'lucide-react';
import { Contact } from '../types/mailforge';
import { INITIAL_CONTACTS } from '../data/mockData';

interface ContactManagerProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  onOpenCreateCampaign: () => void;
}

export const ContactManager: React.FC<ContactManagerProps> = ({
  contacts,
  setContacts,
  onOpenCreateCampaign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Contact Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTag, setNewTag] = useState('Enterprise');

  // Filter contacts
  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesTag && matchesStatus;
  });

  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags)));

  const handleAddNewContact = () => {
    if (!newEmail.trim()) return;
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: newName || 'New Prospect',
      email: newEmail,
      company: newCompany || 'Enterprise Inc',
      role: newRole || 'Executive',
      status: 'valid',
      tags: [newTag],
    };
    setContacts([newContact, ...contacts]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewCompany('');
    setNewRole('');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Email,Company,Role,Status,Tags\n' +
      contacts
        .map(
          (c) =>
            `"${c.name}","${c.email}","${c.company}","${c.role}","${c.status}","${c.tags.join(
              ';'
            )}"`
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'MailForge_Contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FFD6D1]/60 dark:border-[#522329]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD6D1] text-[#FF6B6B]">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
              Contact & Audience Management
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Lists, Segments & Verified Audiences
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize prospects, filter by engagement score, and manage verified email lists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] text-slate-700 text-xs font-bold hover:bg-[#FFD6D1]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Add Contact
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#FFD6D1] dark:border-[#522329] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, company or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-hidden text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="p-2 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] dark:bg-[#1C1214] font-semibold"
          >
            <option value="all">All Segments ({contacts.length})</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-xl border border-[#FFD6D1] bg-[#FFFDFB] dark:bg-[#1C1214] font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="valid">Verified Valid</option>
            <option value="risky">Risky / Catch-All</option>
            <option value="invalid">Invalid Syntax</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-3xl glass-panel border border-[#FFD6D1] dark:border-[#522329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8F6] dark:bg-[#140C0E] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-4">Contact</th>
                <th className="p-4">Company & Role</th>
                <th className="p-4">Validation Status</th>
                <th className="p-4">Tags / Segments</th>
                <th className="p-4">Delivery History</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFD6D1]/40 dark:divide-[#522329]/40">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFD6D1]/15 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{c.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{c.company}</p>
                    <p className="text-[11px] text-slate-500">{c.role}</p>
                  </td>
                  <td className="p-4">
                    {c.status === 'valid' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> MX Validated
                      </span>
                    )}
                    {c.status === 'risky' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Catch-All
                      </span>
                    )}
                    {c.status === 'invalid' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" /> Bad Syntax
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFD6D1]/50 text-[#FF6B6B]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
                    {c.deliveryStatus ? (
                      <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                        {c.deliveryStatus} {c.sentAt && `(${c.sentAt.split(' ')[0]})`}
                      </span>
                    ) : (
                      'Not Dispatched'
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setContacts(contacts.filter((item) => item.id !== c.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDFB] dark:bg-[#1C1214] p-6 rounded-3xl border border-[#FFD6D1] dark:border-[#522329] max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Add Single Prospect
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company
              </label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Lumina Health"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="VP of Growth"
                className="w-full p-2.5 rounded-xl border border-[#FFD6D1] text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewContact}
                className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold hover:bg-[#FF5252]"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
