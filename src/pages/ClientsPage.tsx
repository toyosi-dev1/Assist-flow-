import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Clock,
  Edit2,
  Trash2,
  Users,
  Briefcase
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Client } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ClientsPage: React.FC = () => {
  const {
    clients,
    addClient,
    updateClient,
    deleteClient,
    tasks,
    meetings,
    followUps,
    selectedClientId,
    setSelectedClientId
  } = useWorkspace();

  const [activeClientId, setActiveClientId] = useState<string>(
    selectedClientId || clients[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedClientId) {
      setActiveClientId(selectedClientId);
    } else if (clients.length > 0 && !activeClientId) {
      setActiveClientId(clients[0].id);
    }
  }, [selectedClientId, clients, activeClientId]);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'Active' | 'Onboarding' | 'Retainer' | 'Inactive'>('Active');
  const [companyDescription, setCompanyDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingClient(null);
    setName('');
    setPrimaryContact('');
    setEmail('');
    setPhone('');
    setIndustry('');
    setStatus('Active');
    setCompanyDescription('');
    setNotes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setPrimaryContact(client.primaryContact);
    setEmail(client.email);
    setPhone(client.phone);
    setIndustry(client.industry);
    setStatus(client.status);
    setCompanyDescription(client.companyDescription);
    setNotes(client.notes);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Client name is required.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address (e.g., contact@company.com).');
      return;
    }

    if (editingClient) {
      updateClient({
        ...editingClient,
        name: name.trim(),
        primaryContact: primaryContact.trim(),
        email: email.trim(),
        phone: phone.trim(),
        industry: industry.trim(),
        status,
        companyDescription: companyDescription.trim(),
        notes: notes.trim()
      });
    } else {
      addClient({
        name: name.trim(),
        primaryContact: primaryContact.trim(),
        email: email.trim(),
        phone: phone.trim(),
        industry: industry.trim() || 'General Business',
        status,
        companyDescription: companyDescription.trim(),
        notes: notes.trim()
      });
    }
    setModalOpen(false);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.primaryContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const relatedTasks = activeClient ? tasks.filter(t => t.client.toLowerCase() === activeClient.name.toLowerCase()) : [];
  const relatedMeetings = activeClient ? meetings.filter(m => m.client.toLowerCase() === activeClient.name.toLowerCase()) : [];
  const relatedFollowUps = activeClient
    ? followUps.filter(f => f.company.toLowerCase() === activeClient.name.toLowerCase() || f.contactName.toLowerCase() === activeClient.primaryContact.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Client Accounts</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Executive client profiles, key stakeholder directories, and consolidated cross-module records.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search clients by name, contact, sector..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[620px]">
            {filteredClients.map(c => {
              const isSelected = activeClient?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveClientId(c.id);
                    setSelectedClientId(c.id);
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 bg-[#FAF8F5] hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">{c.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-full font-semibold shrink-0">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-stone-600 font-medium">Contact: {c.primaryContact}</p>
                  <p className="text-[11px] text-stone-400">{c.industry}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          {activeClient ? (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full">
                      {activeClient.status}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {activeClient.industry}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">{activeClient.name}</h2>
                  <p className="text-xs text-stone-600 mt-2 max-w-xl leading-relaxed">
                    {activeClient.companyDescription || 'No company overview recorded.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => openEditModal(activeClient)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer"
                    title="Edit client profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientToDelete(activeClient.id)}
                    className="p-1.5 text-stone-500 hover:text-rose-700 bg-stone-50 hover:bg-rose-50 border border-stone-200 rounded-lg cursor-pointer"
                    title="Delete client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs space-y-1">
                  <span className="text-stone-400 font-semibold block text-[10px] uppercase">Primary Liaison</span>
                  <p className="font-bold text-stone-900 text-sm">{activeClient.primaryContact}</p>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs space-y-1">
                  <span className="text-stone-400 font-semibold block text-[10px] uppercase">Email Contact</span>
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{activeClient.email || 'None on file'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs space-y-1">
                  <span className="text-stone-400 font-semibold block text-[10px] uppercase">Phone Line</span>
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{activeClient.phone || 'None on file'}</span>
                  </div>
                </div>
              </div>

              {activeClient.notes && (
                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D5] rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Assistant Notes & Preferences
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {activeClient.notes}
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Connected Workspace Records
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-stone-200 rounded-lg p-3 bg-[#FAF8F5] space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-800" />
                        Tasks ({relatedTasks.length})
                      </span>
                    </div>
                    {relatedTasks.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic py-2">No related tasks found.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {relatedTasks.map(t => (
                          <div key={t.id} className="p-2 bg-white rounded border border-stone-200 text-[11px]">
                            <p className="font-semibold text-stone-900 truncate">{t.title}</p>
                            <div className="flex items-center justify-between mt-1 text-stone-500 text-[10px]">
                              <span>{t.status}</span>
                              <span>Due {formatDisplayDate(t.dueDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border border-stone-200 rounded-lg p-3 bg-[#FAF8F5] space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-800" />
                        Meetings ({relatedMeetings.length})
                      </span>
                    </div>
                    {relatedMeetings.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic py-2">No meetings scheduled.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {relatedMeetings.map(m => (
                          <div key={m.id} className="p-2 bg-white rounded border border-stone-200 text-[11px]">
                            <p className="font-semibold text-stone-900 truncate">{m.title}</p>
                            <div className="flex items-center justify-between mt-1 text-stone-500 text-[10px]">
                              <span>{formatDisplayDate(m.date)}</span>
                              <span>{m.startTime}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border border-stone-200 rounded-lg p-3 bg-[#FAF8F5] space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-800" />
                        Follow-ups ({relatedFollowUps.length})
                      </span>
                    </div>
                    {relatedFollowUps.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic py-2">No follow-ups pending.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {relatedFollowUps.map(f => (
                          <div key={f.id} className="p-2 bg-white rounded border border-stone-200 text-[11px]">
                            <p className="font-semibold text-stone-900 truncate">{f.subject}</p>
                            <div className="flex items-center justify-between mt-1 text-stone-500 text-[10px]">
                              <span>{f.status}</span>
                              <span>Next: {formatDisplayDate(f.nextFollowUpDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 text-sm">
              Select or add a client to review information.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Edit Client Profile' : 'Add New Client'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveClient} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Client / Company Name <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Apex Horizon Capital"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Executive Contact</label>
              <input
                type="text"
                value={primaryContact}
                onChange={e => setPrimaryContact(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="Private Equity & Venture"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="m.vance@company.com"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+44 20 7946 0192"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Retainer">Retainer</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Company Description</label>
            <textarea
              rows={2}
              value={companyDescription}
              onChange={e => setCompanyDescription(e.target.value)}
              placeholder="Business overview, mandate, and scope..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Executive Notes & Working Guidelines</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Assistant protocol, delivery schedule, communication tone..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              {editingClient ? 'Save Changes' : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={() => {
          if (clientToDelete) deleteClient(clientToDelete);
        }}
        title="Delete Client Account"
        message="Are you sure you want to remove this client? This will remove their profile record from your directory."
        confirmLabel="Delete Client"
      />
    </div>
  );
};
