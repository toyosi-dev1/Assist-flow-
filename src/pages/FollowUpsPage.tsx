import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  Calendar,
  Building,
  User,
  MessageSquare,
  Send,
  RotateCcw
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
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'due' | 'waiting' | 'closed'>('all');

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
      status: reschedulingFollowUp.status === 'Closed' ? 'Pending' : reschedulingFollowUp.status
    });
    setRescheduleModalOpen(false);
  };

  const handleQuickStatusChange = (fu: FollowUp, newStatus: FollowUpStatus) => {
    const isNowContacted = newStatus === 'Followed Up' || newStatus === 'Waiting Response';
    updateFollowUp({
      ...fu,
      status: newStatus,
      lastContactDate: isNowContacted ? today : fu.lastContactDate
    });
  };

  const filteredFollowUps = followUps.filter(f => {
    const matchesSearch =
      f.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || f.priority === priorityFilter;

    let matchesTab = true;
    if (activeTabFilter === 'due') {
      matchesTab = f.status !== 'Closed' && (f.nextFollowUpDate <= today || f.status === 'Due Today');
    } else if (activeTabFilter === 'waiting') {
      matchesTab = f.status === 'Waiting Response';
    } else if (activeTabFilter === 'closed') {
      matchesTab = f.status === 'Closed';
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
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
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 font-bold">Due Today</span>;
      case 'Waiting Response':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">Waiting Response</span>;
      case 'Followed Up':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Followed Up</span>;
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
            Systematic communications management. Track outstanding responses, schedule reminders, and log engagement history.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Follow-up</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTabFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTabFilter === 'all'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Threads ({followUps.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabFilter('due')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTabFilter === 'due'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Action Required ({followUps.filter(f => f.status !== 'Closed' && (f.nextFollowUpDate <= today || f.status === 'Due Today')).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabFilter('waiting')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTabFilter === 'waiting'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Awaiting Stakeholder Response ({followUps.filter(f => f.status === 'Waiting Response').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabFilter('closed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTabFilter === 'closed'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Closed ({followUps.filter(f => f.status === 'Closed').length})
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
              <option value="all">All Specific Statuses</option>
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
          <span>Showing {filteredFollowUps.length} of {followUps.length} follow-up threads</span>
        </div>
      </div>

      {filteredFollowUps.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E2D5] p-12 text-center text-stone-400 shadow-xs">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-stone-300" />
          <p className="text-sm font-medium">No follow-ups match your current filter.</p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-3 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
          >
            + Create a follow-up
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFollowUps.map(fu => {
            const isOverdue = fu.status !== 'Closed' && isDatePast(fu.nextFollowUpDate);
            return (
              <div
                key={fu.id}
                className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-all space-y-3 ${
                  isOverdue
                    ? 'border-amber-400 bg-amber-50/20'
                    : fu.status === 'Closed'
                    ? 'border-stone-200 opacity-80'
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

                  <h3 className={`text-sm font-bold leading-snug ${fu.status === 'Closed' ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                    {fu.subject}
                  </h3>

                  <div className="space-y-1 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{fu.contactName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{fu.company}</span>
                    </div>
                  </div>

                  {fu.description && (
                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
                        Outstanding Deliverable / Request:
                      </span>
                      <p className="text-xs text-stone-700 mt-0.5 line-clamp-2 leading-relaxed">
                        {fu.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>Last: {formatDisplayDate(fu.lastContactDate)}</span>
                    <span className={`font-semibold ${isOverdue ? 'text-amber-900 font-bold' : 'text-stone-700'}`}>
                      Next: {formatDisplayDate(fu.nextFollowUpDate)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-stone-500 font-medium">Quick Status:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(fu, 'Waiting Response')}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          fu.status === 'Waiting Response' ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Mark as Awaiting Response"
                      >
                        Awaiting
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(fu, 'Followed Up')}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          fu.status === 'Followed Up' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Mark as Followed Up today"
                      >
                        Contacted
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFollowUpComplete(fu.id)}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          fu.status === 'Closed' ? 'bg-stone-300 text-stone-800 font-bold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title={fu.status === 'Closed' ? 'Reopen thread' : 'Close thread'}
                      >
                        {fu.status === 'Closed' ? 'Reopen' : 'Close'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openRescheduleModal(fu)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                        title="Reschedule next follow-up date"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(fu)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                        title="Edit full follow-up details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFollowUpToDelete(fu.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete follow-up record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Outstanding Request & Deliverable</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What specifically is pending from the stakeholder?"
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
            Rescheduling for: <strong className="text-stone-900">{reschedulingFollowUp?.contactName}</strong> ({reschedulingFollowUp?.company})
          </p>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">New Follow-up Date</label>
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
