import React from 'react';
import {
  X,
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentSection, setCurrentSection, tasks, meetings, followUps, settings } = useWorkspace();

  if (!isOpen) return null;

  const overdueOrPendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const pendingFollowUps = followUps.filter(f => f.status !== 'Closed').length;

  const navItems: { id: NavigationSection; label: string; icon: React.ElementType; badge?: number }[] = [
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

  const handleSelect = (section: NavigationSection) => {
    setCurrentSection(section);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
      className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex lg:hidden"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-xs bg-[#FAF7F2] h-full border-r border-[#E8E2D5] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E8E2D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-900 flex items-center justify-center text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-bold text-stone-900">AssistFlow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
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
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 m-3 bg-white border border-[#E8E2D5] rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-xs">
              AM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-900 truncate">{settings.assistantName}</p>
              <p className="text-[11px] text-stone-500 truncate">{settings.assistantTitle}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              Fictional Profile
            </span>
            <span className="px-1.5 py-0.2 bg-stone-100 rounded text-stone-600 font-medium">Demo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
