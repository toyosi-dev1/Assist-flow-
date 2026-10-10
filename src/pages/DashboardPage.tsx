import React from 'react';
import {
  CheckSquare,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  Video,
  UserCheck,
  CheckCircle2,
  Hourglass,
  Users
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  getTodayString,
  isDatePast,
  formatHeaderDate,
  getGreeting,
  formatDisplayDate
} from '../utils/dateUtils';

export const DashboardPage: React.FC = () => {
  const {
    tasks,
    meetings,
    followUps,
    settings,
    setCurrentSection,
    setSelectedMeetingId,
    setQuickActionModal,
    toggleTaskComplete,
    toggleFollowUpComplete
  } = useWorkspace();

  const today = getTodayString();

  const tasksToday = tasks.filter(t => t.dueDate === today && t.status !== 'Completed');
  const meetingsToday = meetings.filter(m => m.date === today && m.status !== 'Cancelled');
  const followUpsDue = followUps.filter(f => f.status !== 'Closed' && (f.nextFollowUpDate === today || isDatePast(f.nextFollowUpDate)));
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && isDatePast(t.dueDate));
  const overdueFollowUps = followUps.filter(f => f.status !== 'Closed' && isDatePast(f.nextFollowUpDate));
  const overdueItemsCount = overdueTasks.length + overdueFollowUps.length;

  const priorityTasks = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => {
      const priorityScore = { High: 3, Medium: 2, Low: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority];
    })
    .slice(0, 5);

  const waitingOnItems = tasks.filter(t => t.status === 'Waiting');

  const greeting = getGreeting(settings.assistantName.split(' ')[0] || 'Alex');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 tracking-wider uppercase mb-1">
            <span>{formatHeaderDate()}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {greeting}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            You have <strong className="text-stone-900">{tasksToday.length}</strong> tasks due today,{' '}
            <strong className="text-stone-900">{meetingsToday.length}</strong> meetings scheduled, and{' '}
            <strong className="text-stone-900">{waitingOnItems.length}</strong> items awaiting external stakeholder input.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setQuickActionModal('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickActionModal('meeting')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4 text-stone-500" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setCurrentSection('Tasks')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5] shadow-xs hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Tasks Today</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{tasksToday.length}</span>
            <span className="text-xs text-stone-500">pending</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentSection('Meetings')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5] shadow-xs hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Meetings Today</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{meetingsToday.length}</span>
            <span className="text-xs text-stone-500">scheduled</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentSection('Follow-ups')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5] shadow-xs hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Follow-ups Due</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{followUpsDue.length}</span>
            <span className="text-xs text-stone-500">actionable</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentSection('Tasks')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5] shadow-xs hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Overdue Items</span>
            <div className={`p-2 rounded-lg ${overdueItemsCount > 0 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{overdueItemsCount}</span>
            <span className="text-xs text-stone-500">require attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-800" />
                <h2 className="text-base font-bold text-stone-900">Today's Schedule</h2>
              </div>
              <button
                type="button"
                onClick={() => setCurrentSection('Calendar')}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer"
              >
                Calendar View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {meetingsToday.length === 0 ? (
              <div className="p-8 text-center text-stone-400 bg-[#FAF8F5] rounded-lg border border-dashed border-stone-200">
                <p className="text-sm">No meetings scheduled for today.</p>
                <button
                  type="button"
                  onClick={() => setQuickActionModal('meeting')}
                  className="mt-2 text-xs font-medium text-amber-800 hover:underline cursor-pointer"
                >
                  + Schedule a meeting
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {meetingsToday.map(meeting => (
                  <div
                    key={meeting.id}
                    className="p-3.5 bg-[#FAF8F5] hover:bg-[#F5F0E6] transition-colors rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-center shrink-0">
                        <span className="text-xs font-bold text-stone-800 block">{meeting.startTime}</span>
                        <span className="text-[10px] text-stone-400 block">{meeting.endTime}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900">{meeting.title}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {meeting.client} • {meeting.attendees.join(', ')}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-900 font-medium mt-1">
                          {meeting.location || 'Virtual Conference'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {meeting.meetingLink && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-white rounded border border-transparent hover:border-stone-200 cursor-pointer"
                          title="Open meeting link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMeetingId(meeting.id);
                          setCurrentSection('Meetings');
                        }}
                        className="px-3 py-1.5 bg-white border border-stone-200 hover:border-amber-400 text-stone-700 text-xs font-medium rounded-md cursor-pointer transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-800" />
                <h2 className="text-base font-bold text-stone-900">Priority Tasks</h2>
              </div>
              <button
                type="button"
                onClick={() => setCurrentSection('Tasks')}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer"
              >
                All Tasks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {priorityTasks.length === 0 ? (
              <div className="p-8 text-center text-stone-400 bg-[#FAF8F5] rounded-lg border border-dashed border-stone-200">
                <p className="text-sm">No priority tasks outstanding. You are fully caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {priorityTasks.map(task => {
                  const isOverdue = isDatePast(task.dueDate);
                  return (
                    <div
                      key={task.id}
                      className="py-3 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleTaskComplete(task.id)}
                          className="mt-0.5 text-stone-400 hover:text-amber-800 cursor-pointer"
                          aria-label={`Mark ${task.title} as completed`}
                        >
                          <div className="w-4 h-4 rounded border border-stone-300 group-hover:border-amber-700 flex items-center justify-center transition-colors">
                            {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />}
                          </div>
                        </button>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500">
                            <span>{task.client}</span>
                            <span>•</span>
                            <span className={isOverdue ? 'text-amber-800 font-semibold' : ''}>
                              Due {formatDisplayDate(task.dueDate)}
                            </span>
                            {isOverdue && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            task.priority === 'High'
                              ? 'bg-amber-100 text-amber-900'
                              : task.priority === 'Medium'
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-stone-50 text-stone-500'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-amber-800" />
                <h2 className="text-base font-bold text-stone-900">Waiting On</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                {waitingOnItems.length}
              </span>
            </div>

            {waitingOnItems.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">No blocked decisions or pending approvals.</p>
            ) : (
              <div className="space-y-3">
                {waitingOnItems.map(item => (
                  <div key={item.id} className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs">
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <div className="mt-2 flex items-center justify-between text-stone-500">
                      <span>Responsible: <strong className="text-stone-700">{item.assignee}</strong></span>
                      <span>Target: {formatDisplayDate(item.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-800" />
                <h2 className="text-base font-bold text-stone-900">Follow-ups Requiring Attention</h2>
              </div>
              <button
                type="button"
                onClick={() => setCurrentSection('Follow-ups')}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
              >
                View
              </button>
            </div>

            {followUpsDue.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">No follow-ups due today.</p>
            ) : (
              <div className="space-y-2.5">
                {followUpsDue.map(fu => (
                  <div
                    key={fu.id}
                    className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-stone-900 truncate">{fu.subject}</p>
                      <p className="text-stone-500 mt-0.5">{fu.contactName} • {fu.company}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                        {fu.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollowUpComplete(fu.id)}
                      className="p-1 text-stone-400 hover:text-amber-800 rounded cursor-pointer shrink-0"
                      title="Mark Followed-up/Closed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E8E2D5] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuickActionModal('task')}
                className="p-2.5 bg-white border border-stone-200 hover:border-amber-300 rounded-lg text-left text-xs font-medium text-stone-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-800" />
                <span>New Task</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickActionModal('meeting')}
                className="p-2.5 bg-white border border-stone-200 hover:border-amber-300 rounded-lg text-left text-xs font-medium text-stone-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                <span>Meeting</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickActionModal('followup')}
                className="p-2.5 bg-white border border-stone-200 hover:border-amber-300 rounded-lg text-left text-xs font-medium text-stone-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>Follow-up</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickActionModal('contact')}
                className="p-2.5 bg-white border border-stone-200 hover:border-amber-300 rounded-lg text-left text-xs font-medium text-stone-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-amber-800" />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
