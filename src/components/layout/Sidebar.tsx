import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Video,
  CornerDownLeft,
  Users,
  Contact2,
  Plane,
  FileBarChart,
  Settings,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { NavigationSection } from '../../types';

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentSection, setCurrentSection, tasks, meetings, followUps, settings } = useWorkspace();

  const overdueOrPendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const pendingFollowUps = followUps.filter(f => f.status !== 'Closed').length;

  const navItems: NavItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, badge: overdueOrPendingTasks },
    { id: 'Meetings', label: 'Meetings', icon: Video, badge: meetings.length },
    { id: 'Follow-ups', label: 'Follow-ups', icon: CornerDownLeft, badge: pendingFollowUps },
    { id: 'Clients', label: 'Clients', icon: Users },
    { id: 'Contacts', label: 'Contacts', icon: Contact2 },
    { id: 'Travel', label: 'Travel', icon: Plane },
    { id: 'Reports', label: 'Reports', icon: FileBarChart },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-[#FAF7F2] border-r border-[#E8E2D5] h-screen sticky top-0 shrink-0 select-none">
      <div className="p-5 border-b border-[#E8E2D5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-900 flex items-center justify-center text-amber-200 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">
              AssistFlow
            </h1>
            <span className="text-[11px] font-medium text-amber-900/80 uppercase tracking-wider block mt-1">
              Executive Workspace
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          Core Workflows
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentSection(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-[#F0EBE1]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3.5 m-3 rounded-xl bg-white border border-[#E8E2D5] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300/60 flex items-center justify-center text-amber-900 font-bold text-sm shrink-0">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-stone-900 truncate">
              {settings.assistantName}
            </p>
            <p className="text-xs text-stone-500 truncate">
              {settings.assistantTitle}
            </p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Fictional Profile
          </span>
          <span className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] text-stone-600 font-medium">
            Demo
          </span>
        </div>
      </div>
    </aside>
  );
};
