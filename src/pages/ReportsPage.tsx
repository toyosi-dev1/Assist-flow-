import React, { useState } from 'react';
import {
  Printer,
  FileBarChart,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Building,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { getTodayString, isDatePast, formatDisplayDate, formatHeaderDate } from '../utils/dateUtils';

export const ReportsPage: React.FC = () => {
  const {
    tasks,
    meetings,
    followUps,
    settings,
    clients
  } = useWorkspace();

  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const today = getTodayString();

  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;
  const tasksOutstanding = tasks.filter(t => t.status !== 'Completed').length;
  const tasksOverdue = tasks.filter(t => t.status !== 'Completed' && isDatePast(t.dueDate)).length;

  const meetingsCompleted = meetings.filter(m => m.date < today || m.status === 'Completed').length;
  const meetingsUpcoming = meetings.filter(m => m.date >= today && m.status !== 'Cancelled').length;

  const followUpsCompleted = followUps.filter(f => f.status === 'Closed' || f.status === 'Followed Up').length;
  const followUpsPending = followUps.filter(f => f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Waiting Response').length;
  const followUpsOverdue = followUps.filter(f => f.status !== 'Closed' && isDatePast(f.nextFollowUpDate)).length;

  const waitingDecisions = tasks.filter(t => t.status === 'Waiting').length;

  const generateExecutiveSummary = () => {
    const periodLabel = period === 'week' ? 'For the current weekly cycle' : period === 'month' ? 'For the current monthly operational window' : 'Across active workspace records';
    return `${periodLabel}, ${tasksCompleted} administrative tasks were completed, with ${tasksOutstanding} tasks currently outstanding. ${
      tasksOverdue > 0
        ? `${tasksOverdue} task${tasksOverdue > 1 ? 's require' : ' requires'} immediate prioritization because deadlines have passed.`
        : 'All active deliverables remain on schedule with zero overdue items.'
    } On the executive calendar, ${meetingsUpcoming} upcoming session${meetingsUpcoming !== 1 ? 's are' : ' is'} prepared and scheduled, while ${meetingsCompleted} prior session${meetingsCompleted !== 1 ? 's have' : ' has'} been concluded. In stakeholder communications, ${followUpsCompleted} follow-up threads have been addressed, and ${followUpsPending} pending outreach item${followUpsPending !== 1 ? 's remain' : ' remains'} active, with ${waitingDecisions} item${waitingDecisions !== 1 ? 's' : ''} currently awaiting external stakeholder approval.`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Executive Workload Report</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Operational debrief, deliverable summaries, and client activity logs ready for executive export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as any)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg text-stone-700 font-medium cursor-pointer focus:outline-none focus:border-amber-700"
          >
            <option value="week">Current Weekly Cycle</option>
            <option value="month">Current Month to Date</option>
            <option value="all">All Operational Records</option>
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print Report (PDF)</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-8 space-y-8 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-800" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                AssistFlow Executive Workspace
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              Executive Weekly Status Report
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Generated on {formatHeaderDate()}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-stone-600 space-y-0.5 bg-[#FAF8F5] sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-stone-200">
            <p className="font-semibold text-stone-900">{settings.assistantName}</p>
            <p className="text-stone-500">{settings.assistantTitle}</p>
            <p className="text-stone-400">{settings.email}</p>
            <p className="text-stone-400 font-mono text-[11px]">{settings.timeZone}</p>
          </div>
        </div>

        <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Executive Workload Summary
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
            {generateExecutiveSummary()}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Key Performance Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Tasks Completed</span>
              <p className="text-2xl font-bold text-stone-900 mt-1">{tasksCompleted}</p>
              <span className="text-[10px] text-stone-400">of {tasks.length} total tasks</span>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Outstanding Tasks</span>
              <p className="text-2xl font-bold text-stone-900 mt-1">{tasksOutstanding}</p>
              <span className="text-[10px] text-stone-400">{tasksOverdue} overdue</span>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Upcoming Meetings</span>
              <p className="text-2xl font-bold text-stone-900 mt-1">{meetingsUpcoming}</p>
              <span className="text-[10px] text-stone-400">{meetingsCompleted} completed</span>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Pending Follow-ups</span>
              <p className="text-2xl font-bold text-stone-900 mt-1">{followUpsPending}</p>
              <span className="text-[10px] text-stone-400">{followUpsCompleted} processed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-stone-200 rounded-xl p-4 bg-[#FAF8F5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-200 flex items-center justify-between">
              <span>Active Priority Tasks</span>
              <span className="text-stone-500">{tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length} items</span>
            </h4>
            <div className="space-y-2 text-xs">
              {tasks.filter(t => t.status !== 'Completed').slice(0, 5).map(t => (
                <div key={t.id} className="p-2.5 bg-white rounded-lg border border-stone-200 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-stone-900">{t.title}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{t.client} • Due {formatDisplayDate(t.dueDate)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.priority === 'High' ? 'bg-amber-100 text-amber-950' : 'bg-stone-100 text-stone-700'}`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl p-4 bg-[#FAF8F5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-200 flex items-center justify-between">
              <span>Scheduled Executive Sessions</span>
              <span className="text-stone-500">{meetings.length} sessions</span>
            </h4>
            <div className="space-y-2 text-xs">
              {meetings.slice(0, 5).map(m => (
                <div key={m.id} className="p-2.5 bg-white rounded-lg border border-stone-200 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-stone-900">{m.title}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{m.client} • {formatDisplayDate(m.date)} ({m.startTime})</p>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 rounded text-stone-600">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <p>Confidential Internal Administrative Report • AssistFlow Workspace</p>
          <p>Storage Verification: Browser Local Storage State</p>
        </div>
      </div>
    </div>
  );
};
