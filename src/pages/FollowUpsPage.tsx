import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  Calendar,
  Building,
  User,
  ArrowRight
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FollowUp, FollowUpStatus, PriorityLevel } from '../types';
import { getTodayString, isDatePast, formatDisplayDate } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const FollowUpsPage: React.FC = () => {
  const {
    followUps,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp,
    toggleFollowUpComplete
  } = useWorkspace();

  const today = getTodayString();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [reschedulingFollowUp, setReschedulingFollowUp] = useState<FollowUp | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(today);
  const [followUpToDelete, setFollowUpToDelete] = useState<string | null>(null);

  const [contactName, setContactName] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [lastContactDate, setLastContactDate] = useState(today);
  const [nextFollowUpDate, setNextFollowUpDate] = useState(today);
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<FollowUpStatus>('Pending');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingFollowUp(null);
    setContactName('');
    setCompany('');
    setSubject('');
    setDescription('');
    setLastContactDate(today);
    setNextFollowUpDate(today);
    setPriority('Medium');
    setStatus('Pending');
    setNotes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (fu: FollowUp) => {
    setEditingFollowUp(fu);
    setContactName(fu.contactName);
    setCompany(fu.company);
    setSubject(fu.subject);
    setDescription(fu.description);
    setLastContactDate(fu.lastContactDate);
    setNextFollowUpDate(fu.nextFollowUpDate);
    setPriority(fu.priority);
    setStatus(fu.status);
    setNotes(fu.notes);
    setFormError('');
    setModalOpen(true);
  };

  const openRescheduleModal = (fu: FollowUp) => {
    setReschedulingFollowUp(fu);
    setNewRescheduleDate(fu.nextFollowUpDate);
    setRescheduleModalOpen(true);
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !subject.trim()) {
      setFormError('Contact name and subject are required.');
      return;
    }

    if (editingFollowUp) {
      updateFollowUp({
        ...editingFollowUp,
        contactName: contactName.trim(),
        company: company.trim(),
        subject: subject.trim(),
        description: description.trim(),
        lastContactDate,
        nextFollowUpDate,
        priority,
        status,
        notes: notes.trim()
      });
    } else {
      addFollowUp({
        contactName: contactName.trim(),
        company: company.trim() || 'Direct Contact',
        subject: subject.trim(),
        description: description.trim(),
        lastContactDate,
        nextFollowUpDate,
        priority,
        status,
        notes: notes.trim()
      });
    }
    setModalOpen(false);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingFollowUp) return;
    updateFollowUp({
      ...reschedulingFollowUp,
      nextFollowUpDate: newRescheduleDate,
      status: 'Pending'
    });
    setRescheduleModalOpen(false);
  };

  const filteredFollowUps = followUps.filter(f => {
    const matchesSearch =
      f.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || f.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (item: FollowUp) => {
    const isOverdue = item.status !== 'Closed' && isDatePast(item.nextFollowUpDate);
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-800" />
          Overdue
        </span>
      );
    }

    switch (item.status) {
      case 'Closed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-600">Closed</span>;
      case 'Due Today':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">Due Today</span>;
      case 'Waiting Response':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800">Waiting Response</span>;
      case 'Followed Up':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800">Followed Up</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Follow-up Tracker</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Never let a stakeholder loop go cold. Track response timelines, pending outreach, and re-engagements.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Follow-up</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by contact, company, subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Due Today">Due Today</option>
              <option value="Waiting Response">Waiting Response</option>
              <option value="Followed Up">Followed Up</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span>Tracking {filteredFollowUps.length} follow-up threads</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFollowUps.map(fu => {
          const isOverdue = fu.status !== 'Closed' && isDatePast(fu.nextFollowUpDate);
          return (
            <div
              key={fu.id}
              className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-colors space-y-3 ${
                isOverdue
                  ? 'border-amber-400 bg-amber-50/20'
                  : fu.status === 'Closed'
                  ? 'border-stone-200 opacity-75'
                  : 'border-[#E8E2D5] hover:border-amber-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {getStatusBadge(fu)}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      fu.priority === 'High'
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {fu.priority}
                  </span>
                </div>

                <h3 className={`text-sm font-bold ${fu.status === 'Closed' ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                  {fu.subject}
                </h3>

                <div className="space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>{fu.contactName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                    <span>{fu.company}</span>
                  </div>
                </div>

                {fu.description && (
                  <p className="text-xs text-stone-500 line-clamp-2 pt-1 border-t border-stone-100">
                    {fu.description}
                  </p>
                )}

                <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Last: {formatDisplayDate(fu.lastContactDate)}</span>
                  <span className={`font-semibold ${isOverdue ? 'text-amber-900 font-bold' : ''}`}>
                    Next: {formatDisplayDate(fu.nextFollowUpDate)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleFollowUpComplete(fu.id)}
                    className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                    title={fu.status === 'Closed' ? 'Reopen Follow-up' : 'Mark as Closed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openRescheduleModal(fu)}
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                    title="Reschedule follow-up date"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(fu)}
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                    title="Edit follow-up"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setFollowUpToDelete(fu.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete follow-up"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFollowUp ? 'Edit Follow-up' : 'Add Follow-up'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFollowUp} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Name <span className="text-amber-700">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Entity</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Apex Horizon Capital"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Subject <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g., Q4 Term Sheet & Capital Distribution Schedule"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Last Contact Date</label>
              <input
                type="date"
                required
                value={lastContactDate}
                onChange={e => setLastContactDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                required
                value={nextFollowUpDate}
                onChange={e => setNextFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as FollowUpStatus)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Due Today">Due Today</option>
                <option value="Waiting Response">Waiting Response</option>
                <option value="Followed Up">Followed Up</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Context & Key Questions</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What specifically needs to be clarified or confirmed?"
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
              {editingFollowUp ? 'Save Changes' : 'Create Follow-up'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Follow-up"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <p className="text-xs text-stone-600">
            Rescheduling for: <strong className="text-stone-900">{reschedulingFollowUp?.contactName}</strong>
          </p>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">New Target Date</label>
            <input
              type="date"
              required
              value={newRescheduleDate}
              onChange={e => setNewRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRescheduleModalOpen(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg shadow-xs cursor-pointer"
            >
              Update Schedule
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(followUpToDelete)}
        onClose={() => setFollowUpToDelete(null)}
        onConfirm={() => {
          if (followUpToDelete) deleteFollowUp(followUpToDelete);
        }}
        title="Delete Follow-up"
        message="Are you sure you want to permanently delete this follow-up record?"
        confirmLabel="Delete Follow-up"
      />
    </div>
  );
};
