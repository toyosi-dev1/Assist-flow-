import React, { useState, useEffect } from 'react';
import {
  Plus,
  Video,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  CheckSquare,
  CheckCircle2,
  Circle,
  FileText,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  Save,
  Check
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Meeting, MeetingChecklistItem, MeetingActionItem } from '../types';
import { getTodayString, formatDisplayDate } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const MeetingsPage: React.FC = () => {
  const {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    convertActionItemToTask,
    clients,
    selectedMeetingId,
    setSelectedMeetingId
  } = useWorkspace();

  const [activeMeetingId, setActiveMeetingId] = useState<string>(
    selectedMeetingId || meetings[0]?.id || ''
  );

  useEffect(() => {
    if (selectedMeetingId) {
      setActiveMeetingId(selectedMeetingId);
    } else if (meetings.length > 0 && !activeMeetingId) {
      setActiveMeetingId(meetings[0].id);
    }
  }, [selectedMeetingId, meetings, activeMeetingId]);

  const activeMeeting = meetings.find(m => m.id === activeMeetingId) || meetings[0];

  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');
  const [liveNotes, setLiveNotes] = useState(activeMeeting ? activeMeeting.notes : '');
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  useEffect(() => {
    if (activeMeeting) {
      setLiveNotes(activeMeeting.notes);
    }
  }, [activeMeeting?.id]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [newDecisionText, setNewDecisionText] = useState('');
  const [newActionText, setNewActionText] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('Alex Morgan');
  const [newActionDeadline, setNewActionDeadline] = useState(getTodayString());

  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(getTodayString());
  const [formStart, setFormStart] = useState('10:00');
  const [formEnd, setFormEnd] = useState('11:00');
  const [formClient, setFormClient] = useState(clients[0]?.name || 'Apex Horizon Capital');
  const [formAttendees, setFormAttendees] = useState('Alex Morgan');
  const [formLocation, setFormLocation] = useState('Zoom Conference');
  const [formLink, setFormLink] = useState('');
  const [formAgenda, setFormAgenda] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingMeeting(null);
    setFormTitle('');
    setFormDate(getTodayString());
    setFormStart('10:00');
    setFormEnd('11:00');
    setFormClient(clients[0]?.name || 'Apex Horizon Capital');
    setFormAttendees('Alex Morgan');
    setFormLocation('Zoom Conference');
    setFormLink('');
    setFormAgenda('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormTitle(meeting.title);
    setFormDate(meeting.date);
    setFormStart(meeting.startTime);
    setFormEnd(meeting.endTime);
    setFormClient(meeting.client);
    setFormAttendees(meeting.attendees.join(', '));
    setFormLocation(meeting.location);
    setFormLink(meeting.meetingLink);
    setFormAgenda(meeting.agenda);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Meeting title is required.');
      return;
    }

    const attendeesList = formAttendees
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    if (editingMeeting) {
      updateMeeting({
        ...editingMeeting,
        title: formTitle.trim(),
        date: formDate,
        startTime: formStart,
        endTime: formEnd,
        client: formClient,
        attendees: attendeesList.length ? attendeesList : ['Alex Morgan'],
        location: formLocation.trim(),
        meetingLink: formLink.trim(),
        agenda: formAgenda.trim()
      });
    } else {
      addMeeting({
        title: formTitle.trim(),
        date: formDate,
        startTime: formStart,
        endTime: formEnd,
        client: formClient,
        attendees: attendeesList.length ? attendeesList : ['Alex Morgan'],
        location: formLocation.trim() || 'Virtual',
        meetingLink: formLink.trim(),
        agenda: formAgenda.trim(),
        prepChecklist: [
          { id: `prep-${Date.now()}-1`, label: 'Prepare briefing documents', completed: false },
          { id: `prep-${Date.now()}-2`, label: 'Verify calendar invitations', completed: false }
        ],
        notes: '',
        decisions: [],
        actionItems: [],
        status: 'Scheduled'
      });
    }
    setModalOpen(false);
  };

  const handleTogglePrepItem = (prepId: string) => {
    if (!activeMeeting) return;
    const updated = {
      ...activeMeeting,
      prepChecklist: activeMeeting.prepChecklist.map(item =>
        item.id === prepId ? { ...item, completed: !item.completed } : item
      )
    };
    updateMeeting(updated);
  };

  const handleAddPrepItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistLabel.trim() || !activeMeeting) return;
    const newItem: MeetingChecklistItem = {
      id: `prep-${Date.now()}`,
      label: newChecklistLabel.trim(),
      completed: false
    };
    updateMeeting({
      ...activeMeeting,
      prepChecklist: [...activeMeeting.prepChecklist, newItem]
    });
    setNewChecklistLabel('');
  };

  const handleSaveLiveNotes = () => {
    if (!activeMeeting) return;
    updateMeeting({
      ...activeMeeting,
      notes: liveNotes
    });
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2000);
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionText.trim() || !activeMeeting) return;
    updateMeeting({
      ...activeMeeting,
      decisions: [...activeMeeting.decisions, newDecisionText.trim()]
    });
    setNewDecisionText('');
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim() || !activeMeeting) return;
    const newAct: MeetingActionItem = {
      id: `act-${Date.now()}`,
      text: newActionText.trim(),
      assignee: newActionAssignee.trim() || 'Alex Morgan',
      deadline: newActionDeadline || getTodayString(),
      completed: false
    };
    updateMeeting({
      ...activeMeeting,
      actionItems: [...activeMeeting.actionItems, newAct]
    });
    setNewActionText('');
  };

  const handleToggleActionComplete = (actId: string) => {
    if (!activeMeeting) return;
    updateMeeting({
      ...activeMeeting,
      actionItems: activeMeeting.actionItems.map(a =>
        a.id === actId ? { ...a, completed: !a.completed } : a
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Executive Meetings</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Structured three-stage lifecycle: pre-meeting prep, live in-session notes, and post-meeting deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">All Scheduled Sessions</h2>
            <span className="text-xs text-stone-500 font-semibold">{meetings.length} total</span>
          </div>

          {meetings.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              No meetings found. Click "Schedule Meeting" to create one.
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[640px]">
              {meetings.map(m => {
                const isSelected = activeMeeting?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveMeetingId(m.id);
                      setSelectedMeetingId(m.id);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 bg-[#FAF8F5] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-stone-900 leading-snug line-clamp-1">
                        {m.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white rounded border border-stone-200 text-stone-600 shrink-0 font-medium">
                        {m.startTime}
                      </span>
                    </div>

                    <p className="text-stone-500 font-medium">
                      {m.client} • {formatDisplayDate(m.date)}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                      <span>{m.attendees.length} attendees</span>
                      {m.actionItems.length > 0 && (
                        <span>{m.actionItems.length} action items</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          {activeMeeting ? (
            <>
              <div className="p-5 border-b border-stone-200 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-900 rounded">
                      {activeMeeting.client}
                    </span>
                    <span className="text-xs text-stone-500">
                      {formatDisplayDate(activeMeeting.date)} • {activeMeeting.startTime} - {activeMeeting.endTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-stone-900">{activeMeeting.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {activeMeeting.location || 'Virtual'}
                    </span>
                    {activeMeeting.meetingLink && (
                      <a
                        href={activeMeeting.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Join Call
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(activeMeeting)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer"
                    title="Edit meeting details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingToDelete(activeMeeting.id)}
                    className="p-1.5 text-stone-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-stone-200 rounded-lg cursor-pointer"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex border-b border-stone-200 bg-[#FAF7F2] px-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('before')}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'before'
                      ? 'border-amber-800 text-amber-950'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  1. Before Meeting (Prep)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('during')}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'during'
                      ? 'border-amber-800 text-amber-950'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  2. During Meeting (Live Notes)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('after')}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'after'
                      ? 'border-amber-800 text-amber-950'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  3. After Meeting (Decisions & Actions)
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {activeTab === 'before' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-800" />
                        Confirmed Attendees
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeMeeting.attendees.map((attendee, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-[#FAF8F5] border border-stone-200 rounded-md text-xs font-medium text-stone-700"
                          >
                            {attendee}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-800" />
                        Meeting Agenda
                      </h3>
                      <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs leading-relaxed text-stone-700 whitespace-pre-line">
                        {activeMeeting.agenda || 'No formal agenda has been outlined yet.'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-amber-800" />
                          Preparation Checklist
                        </h3>
                        <span className="text-[11px] text-stone-500">
                          {activeMeeting.prepChecklist.filter(c => c.completed).length} of {activeMeeting.prepChecklist.length} completed
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeMeeting.prepChecklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleTogglePrepItem(item.id)}
                            className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg flex items-center gap-3 cursor-pointer text-xs transition-colors hover:bg-stone-50"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                            )}
                            <span className={item.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddPrepItem} className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newChecklistLabel}
                          onChange={e => setNewChecklistLabel(e.target.value)}
                          placeholder="Add new prep checklist requirement..."
                          className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors"
                        >
                          Add Item
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'during' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          Live Meeting Notes & Executive Transcript
                        </h3>
                        <p className="text-xs text-stone-500">
                          Capture key statements, clarifications, and questions raised in real time.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {notesSavedNotice && (
                          <span className="flex items-center gap-1 text-xs text-amber-900 font-medium">
                            <Check className="w-3.5 h-3.5 text-amber-700" /> Saved
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveLiveNotes}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium shadow-xs cursor-pointer transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Notes</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={12}
                      value={liveNotes}
                      onChange={e => setLiveNotes(e.target.value)}
                      placeholder="Type live notes, meeting flow, participant questions, agreed numbers..."
                      className="w-full p-4 text-xs sm:text-sm font-mono border border-stone-200 rounded-lg bg-[#FAF8F5] focus:outline-none focus:border-amber-700 focus:bg-white leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'after' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                        Formal Decisions & Resolutions
                      </h3>

                      {activeMeeting.decisions.length === 0 ? (
                        <p className="text-xs text-stone-400 italic mb-2">No formal decisions recorded yet.</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {activeMeeting.decisions.map((dec, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs font-medium text-amber-950 flex items-start gap-2"
                            >
                              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <span>{dec}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleAddDecision} className="flex gap-2">
                        <input
                          type="text"
                          value={newDecisionText}
                          onChange={e => setNewDecisionText(e.target.value)}
                          placeholder="Record key resolution agreed upon..."
                          className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg cursor-pointer"
                        >
                          Record Decision
                        </button>
                      </form>
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          Assigned Action Items
                        </h3>
                        <span className="text-[11px] text-stone-500">
                          {activeMeeting.actionItems.length} items tracked
                        </span>
                      </div>

                      {activeMeeting.actionItems.length === 0 ? (
                        <p className="text-xs text-stone-400 italic mb-3">No action items created yet.</p>
                      ) : (
                        <div className="space-y-2.5 mb-4">
                          {activeMeeting.actionItems.map(act => (
                            <div
                              key={act.id}
                              className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-start gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionComplete(act.id)}
                                  className="mt-0.5 text-stone-400 hover:text-amber-800 cursor-pointer"
                                >
                                  {act.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-amber-800" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-stone-300" />
                                  )}
                                </button>
                                <div>
                                  <p className={act.completed ? 'line-through text-stone-400' : 'font-semibold text-stone-900'}>
                                    {act.text}
                                  </p>
                                  <p className="text-stone-500 text-[11px] mt-0.5">
                                    Responsible: <strong className="text-stone-700">{act.assignee}</strong> • Deadline: {formatDisplayDate(act.deadline)}
                                  </p>
                                </div>
                              </div>

                              <div className="self-end sm:self-center shrink-0">
                                {act.taskId ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 px-2 py-1 bg-stone-100 rounded">
                                    <Check className="w-3 h-3 text-stone-700" /> Converted to Task
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => convertActionItemToTask(activeMeeting.id, act.id)}
                                    className="px-2.5 py-1 bg-white border border-stone-300 hover:border-amber-700 text-stone-800 hover:text-amber-900 font-medium rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    Convert to Task <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleAddActionItem} className="p-3 bg-[#FAF7F2] border border-stone-200 rounded-lg space-y-2">
                        <span className="text-xs font-semibold text-stone-700 block">Add New Action Item</span>
                        <input
                          type="text"
                          required
                          value={newActionText}
                          onChange={e => setNewActionText(e.target.value)}
                          placeholder="Action item deliverable..."
                          className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:outline-none focus:border-amber-700 bg-white"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newActionAssignee}
                            onChange={e => setNewActionAssignee(e.target.value)}
                            placeholder="Assignee (e.g., Alex Morgan)"
                            className="px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:outline-none focus:border-amber-700 bg-white"
                          />
                          <input
                            type="date"
                            value={newActionDeadline}
                            onChange={e => setNewActionDeadline(e.target.value)}
                            className="px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:outline-none focus:border-amber-700 bg-white"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded-md cursor-pointer"
                          >
                            Add Action Item
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-stone-400 text-sm">
              Select or schedule a meeting to view details.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Meeting Title <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g., Board Review & Financial Projections Sync"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formStart}
                onChange={e => setFormStart(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formEnd}
                onChange={e => setFormEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Client</label>
              <select
                value={formClient}
                onChange={e => setFormClient(e.target.value)}
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
                value={formAttendees}
                onChange={e => setFormAttendees(e.target.value)}
                placeholder="Marcus Vance, Alex Morgan"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                placeholder="Zoom Conference #102 or Claridge's Suite"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Meeting Link</label>
              <input
                type="url"
                value={formLink}
                onChange={e => setFormLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Agenda Outline</label>
            <textarea
              rows={3}
              value={formAgenda}
              onChange={e => setFormAgenda(e.target.value)}
              placeholder="Outline session topics and objectives..."
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
              {editingMeeting ? 'Save Changes' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(meetingToDelete)}
        onClose={() => setMeetingToDelete(null)}
        onConfirm={() => {
          if (meetingToDelete) deleteMeeting(meetingToDelete);
        }}
        title="Delete Meeting"
        message="Are you sure you want to delete this meeting? Associated prep notes and action items will also be removed."
        confirmLabel="Delete Meeting"
      />
    </div>
  );
};
