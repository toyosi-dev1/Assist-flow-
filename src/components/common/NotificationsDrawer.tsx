import React from 'react';
import { X, AlertCircle, Clock, Calendar, CheckSquare, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getTodayString, isDatePast } from '../../utils/dateUtils';

export const NotificationsDrawer: React.FC = () => {
  const {
    attentionDrawerOpen,
    setAttentionDrawerOpen,
    tasks,
    meetings,
    followUps,
    setCurrentSection,
    setSelectedMeetingId
  } = useWorkspace();

  if (!attentionDrawerOpen) return null;

  const today = getTodayString();

  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && isDatePast(t.dueDate));
  const followUpsDueToday = followUps.filter(f => f.status !== 'Closed' && (f.nextFollowUpDate === today || isDatePast(f.nextFollowUpDate)));
  const meetingsToday = meetings.filter(m => m.date === today && m.status !== 'Cancelled');
  const waitingApprovalTasks = tasks.filter(t => t.status === 'Waiting');

  const totalAttentionCount = overdueTasks.length + followUpsDueToday.length + meetingsToday.length + waitingApprovalTasks.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Attention center"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end"
      onClick={() => setAttentionDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">Attention Center</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-900 rounded-full">
              {totalAttentionCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAttentionDrawerOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            aria-label="Close attention drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {totalAttentionCount === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-sm">All clear! No overdue tasks or pressing follow-ups require immediate attention.</p>
            </div>
          ) : (
            <>
              {overdueTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      Overdue Tasks ({overdueTasks.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {overdueTasks.map(t => (
                      <div
                        key={t.id}
                        className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-amber-950">{t.title}</p>
                          <p className="text-stone-600 mt-0.5">{t.client} • Due {t.dueDate}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentSection('Tasks');
                            setAttentionDrawerOpen(false);
                          }}
                          className="shrink-0 text-amber-800 hover:text-amber-950 font-medium flex items-center gap-0.5 cursor-pointer"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {followUpsDueToday.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      Follow-ups Due ({followUpsDueToday.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {followUpsDueToday.map(f => (
                      <div
                        key={f.id}
                        className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-stone-900">{f.subject}</p>
                          <p className="text-stone-600 mt-0.5">{f.contactName} ({f.company}) • {f.nextFollowUpDate}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentSection('Follow-ups');
                            setAttentionDrawerOpen(false);
                          }}
                          className="shrink-0 text-amber-800 hover:text-amber-950 font-medium flex items-center gap-0.5 cursor-pointer"
                        >
                          Review <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meetingsToday.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      Today's Meetings ({meetingsToday.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {meetingsToday.map(m => (
                      <div
                        key={m.id}
                        className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-stone-900">{m.title}</p>
                          <p className="text-stone-600 mt-0.5">{m.startTime} - {m.endTime} • {m.client}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMeetingId(m.id);
                            setCurrentSection('Meetings');
                            setAttentionDrawerOpen(false);
                          }}
                          className="shrink-0 text-amber-800 hover:text-amber-950 font-medium flex items-center gap-0.5 cursor-pointer"
                        >
                          Open <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {waitingApprovalTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-stone-500" />
                      Waiting On Approval / Input ({waitingApprovalTasks.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {waitingApprovalTasks.map(t => (
                      <div
                        key={t.id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-medium text-stone-800">{t.title}</p>
                          <p className="text-stone-500 mt-0.5">Responsible: {t.assignee} • {t.client}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentSection('Tasks');
                            setAttentionDrawerOpen(false);
                          }}
                          className="shrink-0 text-stone-700 hover:text-stone-900 font-medium flex items-center gap-0.5 cursor-pointer"
                        >
                          Check <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-stone-200 bg-[#FAF8F5] text-xs text-stone-500 text-center">
          Attention states are computed live from your local workspace records.
        </div>
      </div>
    </div>
  );
};
