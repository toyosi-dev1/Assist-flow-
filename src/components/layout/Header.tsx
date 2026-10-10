import React from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getTodayString, isDatePast } from '../../utils/dateUtils';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    currentSection,
    setSearchOpen,
    setAttentionDrawerOpen,
    setQuickActionModal,
    tasks,
    followUps,
    meetings,
    settings
  } = useWorkspace();

  const today = getTodayString();
  const overdueTasksCount = tasks.filter(t => t.status !== 'Completed' && isDatePast(t.dueDate)).length;
  const followUpsDueCount = followUps.filter(f => f.status !== 'Closed' && (f.nextFollowUpDate === today || isDatePast(f.nextFollowUpDate))).length;
  const meetingsTodayCount = meetings.filter(m => m.date === today && m.status !== 'Cancelled').length;
  const attentionCount = overdueTasksCount + followUpsDueCount + meetingsTodayCount;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E8E2D5] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {currentSection}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-stone-500 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 text-stone-400" />
          <span className="hidden sm:inline">Search records</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-500 bg-white rounded border border-stone-200">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => setAttentionDrawerOpen(true)}
          aria-label="View attention notifications"
          className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {attentionCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {attentionCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setQuickActionModal('task')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>

        <div className="hidden sm:flex items-center pl-2 ml-1 border-l border-stone-200 gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 text-xs font-bold">
            AM
          </div>
          <span className="text-xs font-medium text-stone-700 max-w-[100px] truncate">
            {settings.assistantName}
          </span>
        </div>
      </div>
    </header>
  );
};
