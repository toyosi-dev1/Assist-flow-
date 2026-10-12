import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { CalendarEvent, EventType } from '../types';
import { getTodayString, formatDisplayDate, findOverlappingMeetings } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const CalendarPage: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    clients
  } = useWorkspace();

  const todayStr = getTodayString();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [attendees, setAttendees] = useState('');
  const [client, setClient] = useState(clients[0]?.name || 'Apex Horizon Capital');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EventType>('Meeting');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(todayStr);
  };

  const openCreateModal = (targetDate?: string) => {
    setEditingEvent(null);
    setTitle('');
    setDate(targetDate || selectedDate || todayStr);
    setStartTime('10:00');
    setEndTime('11:00');
    setAttendees('Alex Morgan');
    setClient(clients[0]?.name || 'Apex Horizon Capital');
    setLocation('');
    setType('Meeting');
    setNotes('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setAttendees(event.attendees.join(', '));
    setClient(event.client);
    setLocation(event.location);
    setType(event.type);
    setNotes(event.notes);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Event title is required.');
      return;
    }
    if (startTime >= endTime) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    const attendeesList = attendees
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    if (editingEvent) {
      updateCalendarEvent({
        ...editingEvent,
        title: title.trim(),
        date,
        startTime,
        endTime,
        attendees: attendeesList.length ? attendeesList : ['Alex Morgan'],
        client,
        location: location.trim(),
        type,
        notes: notes.trim()
      });
    } else {
      addCalendarEvent({
        title: title.trim(),
        date,
        startTime,
        endTime,
        attendees: attendeesList.length ? attendeesList : ['Alex Morgan'],
        client,
        location: location.trim(),
        type,
        notes: notes.trim()
      });
    }
    setModalOpen(false);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    calendarDays.push(`${currentYear}-${mStr}-${dStr}`);
  }

  const selectedDateEvents = calendarEvents.filter(e => e.date === selectedDate);
  const upcomingEvents = calendarEvents
    .filter(e => e.date >= todayStr)
    .sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)))
    .slice(0, 5);

  const getEventTypeBadgeClass = (eventType: EventType) => {
    switch (eventType) {
      case 'Meeting':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Call':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Deadline':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Travel':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Deep Work':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Executive Calendar</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Synchronized schedule, executive time-blocks, and commitment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-stone-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200 rounded-lg overflow-hidden text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
              <div key={dayName} className="bg-[#FAF8F5] py-2 font-semibold text-stone-600">
                {dayName}
              </div>
            ))}

            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} className="bg-white min-h-[72px] sm:min-h-[88px]" />;
              }

              const dayEvents = calendarEvents.filter(e => e.date === dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const dayNum = parseInt(dateStr.split('-')[2], 10);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`bg-white min-h-[72px] sm:min-h-[88px] p-1.5 flex flex-col justify-between text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-amber-700 ring-inset bg-amber-50/30'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-amber-800 text-white'
                          : isSelected
                          ? 'text-amber-900 font-bold'
                          : 'text-stone-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[10px] px-1 py-0.5 rounded truncate border font-medium ${getEventTypeBadgeClass(ev.type)}`}
                        title={`${ev.startTime} - ${ev.title}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-stone-500 font-semibold pl-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {formatDisplayDate(selectedDate)}
                </h3>
                <span className="text-xs text-stone-500">
                  {selectedDate === todayStr ? 'Today' : 'Selected Date'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openCreateModal(selectedDate)}
                className="p-1.5 text-amber-800 hover:bg-amber-50 rounded-lg cursor-pointer"
                title="Add event on this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs bg-[#FAF8F5] rounded-lg border border-dashed border-stone-200">
                <CalendarIcon className="w-6 h-6 mx-auto mb-1 text-stone-300" />
                <p>No events scheduled on this day.</p>
                <button
                  type="button"
                  onClick={() => openCreateModal(selectedDate)}
                  className="mt-2 text-amber-800 font-semibold hover:underline"
                >
                  Create an event
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-semibold border ${getEventTypeBadgeClass(event.type)}`}>
                          {event.type}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-1">{event.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(event)}
                          className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventToDelete(event.id)}
                          className="p-1 text-stone-400 hover:text-rose-700 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.client && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-stone-400" />
                          <span>{event.client}</span>
                        </div>
                      )}
                      {event.attendees.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate">{event.attendees.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Upcoming Commitments
            </h3>
            <div className="space-y-2.5">
              {upcomingEvents.map(ue => (
                <div
                  key={ue.id}
                  onClick={() => setSelectedDate(ue.date)}
                  className="p-2.5 rounded-lg border border-stone-200 hover:border-amber-300 bg-[#FAF8F5] transition-colors cursor-pointer text-xs"
                >
                  <p className="font-semibold text-stone-900 truncate">{ue.title}</p>
                  <p className="text-stone-500 mt-0.5">
                    {formatDisplayDate(ue.date)} • {ue.startTime} ({ue.client})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Calendar Event' : 'Create Calendar Event'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {type === 'Meeting' && findOverlappingMeetings(calendarEvents.filter(e => e.type === 'Meeting'), date, startTime, endTime, editingEvent?.id).length > 0 && (
            <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Scheduling Notice</p>
                <p className="mt-0.5 text-stone-700">
                  This meeting overlaps with "{findOverlappingMeetings(calendarEvents.filter(e => e.type === 'Meeting'), date, startTime, endTime, editingEvent?.id)[0].title}" ({findOverlappingMeetings(calendarEvents.filter(e => e.type === 'Meeting'), date, startTime, endTime, editingEvent?.id)[0].startTime} - {findOverlappingMeetings(calendarEvents.filter(e => e.type === 'Meeting'), date, startTime, endTime, editingEvent?.id)[0].endTime}). Proceed if this is intentional.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Event Title <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Executive Portfolio Strategy Sync"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EventType)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Deadline">Deadline</option>
                <option value="Travel">Travel</option>
                <option value="Deep Work">Deep Work</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Client</label>
              <select
                value={client}
                onChange={e => setClient(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location or Link</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Room A or Zoom URL"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Attendees</label>
              <input
                type="text"
                value={attendees}
                onChange={e => setAttendees(e.target.value)}
                placeholder="Marcus Vance, Alex Morgan"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Key agenda notes or requirements..."
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
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={() => {
          if (eventToDelete) deleteCalendarEvent(eventToDelete);
        }}
        title="Delete Calendar Event"
        message="Are you sure you want to remove this event from your calendar? This action cannot be undone."
        confirmLabel="Delete Event"
      />
    </div>
  );
};
