import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CheckSquare, Calendar, Users, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    tasks,
    meetings,
    clients,
    contacts,
    followUps,
    setCurrentSection,
    setSelectedClientId,
    setSelectedMeetingId
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const normalized = query.trim().toLowerCase();

  const matchingTasks = normalized
    ? tasks.filter(t => t.title.toLowerCase().includes(normalized) || t.client.toLowerCase().includes(normalized) || t.description.toLowerCase().includes(normalized)).slice(0, 5)
    : [];

  const matchingMeetings = normalized
    ? meetings.filter(m => m.title.toLowerCase().includes(normalized) || m.client.toLowerCase().includes(normalized) || m.agenda.toLowerCase().includes(normalized)).slice(0, 4)
    : [];

  const matchingClients = normalized
    ? clients.filter(c => c.name.toLowerCase().includes(normalized) || c.primaryContact.toLowerCase().includes(normalized) || c.industry.toLowerCase().includes(normalized)).slice(0, 4)
    : [];

  const matchingContacts = normalized
    ? contacts.filter(c => c.name.toLowerCase().includes(normalized) || c.company.toLowerCase().includes(normalized) || c.email.toLowerCase().includes(normalized) || c.jobTitle.toLowerCase().includes(normalized)).slice(0, 4)
    : [];

  const matchingFollowUps = normalized
    ? followUps.filter(f => f.contactName.toLowerCase().includes(normalized) || f.subject.toLowerCase().includes(normalized) || f.company.toLowerCase().includes(normalized)).slice(0, 4)
    : [];

  const totalResults = matchingTasks.length + matchingMeetings.length + matchingClients.length + matchingContacts.length + matchingFollowUps.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/40 backdrop-blur-xs"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-stone-200 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, meetings, clients, contacts, follow-ups..."
            className="w-full bg-transparent border-0 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-stone-500 bg-stone-200 rounded border border-stone-300">
              ESC
            </kbd>
          )}
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {!normalized ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              <p>Type keywords to search across your workspace records.</p>
              <p className="text-xs text-stone-400 mt-1">Quick filter by title, client name, contact, company, or agenda.</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-stone-500 text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {matchingTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                    Tasks ({matchingTasks.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingTasks.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setCurrentSection('Tasks');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-stone-800 truncate group-hover:text-amber-900">{t.title}</p>
                          <p className="text-xs text-stone-500">{t.client} • Due {t.dueDate}</p>
                        </div>
                        <span className="text-xs font-medium text-stone-400 group-hover:text-stone-600 shrink-0 flex items-center gap-1">
                          {t.status}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingMeetings.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    Meetings ({matchingMeetings.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingMeetings.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMeetingId(m.id);
                          setCurrentSection('Meetings');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-stone-800 truncate group-hover:text-amber-900">{m.title}</p>
                          <p className="text-xs text-stone-500">{m.client} • {m.date} at {m.startTime}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingClients.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    Clients ({matchingClients.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingClients.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setCurrentSection('Clients');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-stone-800 truncate group-hover:text-amber-900">{c.name}</p>
                          <p className="text-xs text-stone-500">Contact: {c.primaryContact} • {c.industry}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingContacts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    Contacts ({matchingContacts.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingContacts.map(con => (
                      <button
                        key={con.id}
                        type="button"
                        onClick={() => {
                          setCurrentSection('Contacts');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-stone-800 truncate group-hover:text-amber-900">{con.name}</p>
                          <p className="text-xs text-stone-500">{con.jobTitle} at {con.company}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingFollowUps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <CornerDownLeft className="w-3.5 h-3.5 text-amber-700" />
                    Follow-ups ({matchingFollowUps.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingFollowUps.map(fu => (
                      <button
                        key={fu.id}
                        type="button"
                        onClick={() => {
                          setCurrentSection('Follow-ups');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-stone-800 truncate group-hover:text-amber-900">{fu.subject}</p>
                          <p className="text-xs text-stone-500">{fu.contactName} ({fu.company}) • Status: {fu.status}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-stone-200 bg-[#FAF8F5] text-xs text-stone-400 flex items-center justify-between">
          <span>Search calculated across live workspace storage</span>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1 py-0.5 font-mono text-[10px] bg-white border border-stone-300 rounded">ESC</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
