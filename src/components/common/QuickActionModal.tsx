import React, { useState } from 'react';
import { Modal } from './Modal';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getTodayString } from '../../utils/dateUtils';
import { TaskCategory, PriorityLevel, EventType, FollowUpStatus } from '../../types';

export const QuickActionModal: React.FC = () => {
  const {
    quickActionModal,
    setQuickActionModal,
    clients,
    addTask,
    addMeeting,
    addFollowUp,
    addContact
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'task' | 'meeting' | 'followup' | 'contact'>(
    quickActionModal || 'task'
  );

  React.useEffect(() => {
    if (quickActionModal) {
      setActiveTab(quickActionModal);
    }
  }, [quickActionModal]);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskClient, setTaskClient] = useState(clients[0]?.name || '');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('Medium');
  const [taskDueDate, setTaskDueDate] = useState(getTodayString());
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Administrative');
  const [taskAssignee, setTaskAssignee] = useState('Alex Morgan');

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(getTodayString());
  const [meetingStart, setMeetingStart] = useState('10:00');
  const [meetingEnd, setMeetingEnd] = useState('11:00');
  const [meetingClient, setMeetingClient] = useState(clients[0]?.name || '');
  const [meetingLocation, setMeetingLocation] = useState('Zoom Conference');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState('Alex Morgan');
  const [meetingAgenda, setMeetingAgenda] = useState('');

  const [fuContact, setFuContact] = useState('');
  const [fuCompany, setFuCompany] = useState(clients[0]?.name || '');
  const [fuSubject, setFuSubject] = useState('');
  const [fuDescription, setFuDescription] = useState('');
  const [fuDate, setFuDate] = useState(getTodayString());
  const [fuPriority, setFuPriority] = useState<PriorityLevel>('Medium');
  const [fuStatus, setFuStatus] = useState<FollowUpStatus>('Pending');

  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCategory, setContactCategory] = useState<'Client' | 'Vendor' | 'Executive' | 'Partner' | 'Personal'>('Client');
  const [contactNotes, setContactNotes] = useState('');

  const [formError, setFormError] = useState('');

  if (!quickActionModal) return null;

  const handleClose = () => {
    setFormError('');
    setQuickActionModal(null);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFormError('Task title is required.');
      return;
    }
    addTask({
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      status: 'To Do',
      priority: taskPriority,
      dueDate: taskDueDate,
      client: taskClient || 'Internal',
      assignee: taskAssignee.trim() || 'Alex Morgan',
      category: taskCategory
    });
    setTaskTitle('');
    setTaskDescription('');
    handleClose();
  };

  const handleSubmitMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      setFormError('Meeting title is required.');
      return;
    }
    const attendeesList = meetingAttendees
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    addMeeting({
      title: meetingTitle.trim(),
      date: meetingDate,
      startTime: meetingStart,
      endTime: meetingEnd,
      attendees: attendeesList.length ? attendeesList : ['Alex Morgan'],
      client: meetingClient || 'General',
      meetingLink: meetingLink.trim(),
      location: meetingLocation.trim() || 'Virtual',
      agenda: meetingAgenda.trim(),
      prepChecklist: [],
      notes: '',
      decisions: [],
      actionItems: [],
      status: 'Scheduled'
    });
    setMeetingTitle('');
    setMeetingAgenda('');
    handleClose();
  };

  const handleSubmitFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuContact.trim() || !fuSubject.trim()) {
      setFormError('Contact name and subject are required.');
      return;
    }
    addFollowUp({
      contactName: fuContact.trim(),
      company: fuCompany.trim() || 'Direct Contact',
      subject: fuSubject.trim(),
      description: fuDescription.trim(),
      lastContactDate: getTodayString(),
      nextFollowUpDate: fuDate,
      priority: fuPriority,
      status: fuStatus,
      notes: ''
    });
    setFuContact('');
    setFuSubject('');
    setFuDescription('');
    handleClose();
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      setFormError('Contact name is required.');
      return;
    }
    if (contactEmail && !contactEmail.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    addContact({
      name: contactName.trim(),
      jobTitle: contactTitle.trim(),
      company: contactCompany.trim() || 'Independent',
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      category: contactCategory,
      notes: contactNotes.trim()
    });
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    handleClose();
  };

  return (
    <Modal isOpen={Boolean(quickActionModal)} onClose={handleClose} title="Create Record" maxWidth="xl">
      <div className="flex border-b border-stone-200 mb-5 gap-2">
        <button
          type="button"
          onClick={() => { setActiveTab('task'); setFormError(''); }}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'task'
              ? 'border-amber-700 text-amber-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          New Task
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('meeting'); setFormError(''); }}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'meeting'
              ? 'border-amber-700 text-amber-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Schedule Meeting
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('followup'); setFormError(''); }}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'followup'
              ? 'border-amber-700 text-amber-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Add Follow-up
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('contact'); setFormError(''); }}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'contact'
              ? 'border-amber-700 text-amber-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Add Contact
        </button>
      </div>

      {formError && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
          {formError}
        </div>
      )}

      {activeTab === 'task' && (
        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Task Title <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="e.g., Draft executive travel briefing document"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Associated Client</label>
              <select
                value={taskClient}
                onChange={e => setTaskClient(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="Internal">Internal Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={taskCategory}
                onChange={e => setTaskCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Administrative">Administrative</option>
                <option value="Scheduling">Scheduling</option>
                <option value="Travel">Travel</option>
                <option value="Finance">Finance</option>
                <option value="Email">Email</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={taskDueDate}
                onChange={e => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Assignee</label>
              <input
                type="text"
                value={taskAssignee}
                onChange={e => setTaskAssignee(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Deliverables</label>
            <textarea
              rows={3}
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="Provide background, links, and completion criteria..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {activeTab === 'meeting' && (
        <form onSubmit={handleSubmitMeeting} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Meeting Title <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g., Weekly Strategic Review & Operational Alignment"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={meetingDate}
                onChange={e => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={meetingStart}
                onChange={e => setMeetingStart(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={meetingEnd}
                onChange={e => setMeetingEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Client</label>
              <select
                value={meetingClient}
                onChange={e => setMeetingClient(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Attendees (comma separated)</label>
              <input
                type="text"
                value={meetingAttendees}
                onChange={e => setMeetingAttendees(e.target.value)}
                placeholder="Marcus Vance, Alex Morgan"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location or Platform</label>
              <input
                type="text"
                value={meetingLocation}
                onChange={e => setMeetingLocation(e.target.value)}
                placeholder="e.g., Zoom Conference #102 or Claridge's Suite"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Meeting Link (optional)</label>
              <input
                type="url"
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Agenda</label>
            <textarea
              rows={3}
              value={meetingAgenda}
              onChange={e => setMeetingAgenda(e.target.value)}
              placeholder="Outline meeting topics, objectives, and discussion items..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      )}

      {activeTab === 'followup' && (
        <form onSubmit={handleSubmitFollowUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Name <span className="text-amber-700">*</span>
              </label>
              <input
                type="text"
                required
                value={fuContact}
                onChange={e => setFuContact(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={fuCompany}
                onChange={e => setFuCompany(e.target.value)}
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
              value={fuSubject}
              onChange={e => setFuSubject(e.target.value)}
              placeholder="e.g., Q4 Term Sheet Signature & Capital Call Memo"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                required
                value={fuDate}
                onChange={e => setFuDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
              <select
                value={fuPriority}
                onChange={e => setFuPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Status</label>
              <select
                value={fuStatus}
                onChange={e => setFuStatus(e.target.value as FollowUpStatus)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Due Today">Due Today</option>
                <option value="Followed Up">Followed Up</option>
                <option value="Waiting Response">Waiting Response</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Follow-up Details & Context</label>
            <textarea
              rows={3}
              value={fuDescription}
              onChange={e => setFuDescription(e.target.value)}
              placeholder="What specifically needs to be checked or communicated?"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              Add Follow-up
            </button>
          </div>
        </form>
      )}

      {activeTab === 'contact' && (
        <form onSubmit={handleSubmitContact} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-amber-700">*</span>
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">Job Title</label>
              <input
                type="text"
                value={contactTitle}
                onChange={e => setContactTitle(e.target.value)}
                placeholder="Managing Partner"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={contactCompany}
                onChange={e => setContactCompany(e.target.value)}
                placeholder="Apex Horizon Capital"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={contactCategory}
                onChange={e => setContactCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Client">Client</option>
                <option value="Executive">Executive</option>
                <option value="Partner">Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="m.vance@company.com"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="+44 20 7946 0192"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Executive Notes</label>
            <textarea
              rows={2}
              value={contactNotes}
              onChange={e => setContactNotes(e.target.value)}
              placeholder="Key preferences, assistant notes, or communication preferences..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
