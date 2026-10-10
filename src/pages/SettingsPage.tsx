import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Save,
  Check,
  HardDrive,
  User,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportDataJson,
    importDataJson,
    restoreDemoData,
    tasks,
    meetings,
    clients,
    contacts,
    followUps
  } = useWorkspace();

  const [name, setName] = useState(settings.assistantName);
  const [title, setTitle] = useState(settings.assistantTitle);
  const [email, setEmail] = useState(settings.email);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [timeZone, setTimeZone] = useState(settings.timeZone);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      assistantName: name.trim() || 'Alex Morgan',
      assistantTitle: title.trim() || 'Executive Assistant',
      email: email.trim(),
      dateFormat,
      timeZone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          setImportNotice({
            type: 'success',
            message: 'Workspace records imported and loaded into local storage successfully.'
          });
        } else {
          setImportNotice({
            type: 'error',
            message: 'Invalid workspace backup file format. Please upload a valid JSON exported from AssistFlow.'
          });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Configure executive assistant profile details, manage local data persistence, and export records.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <User className="w-4 h-4 text-amber-800" />
          <h2 className="text-sm font-bold text-stone-900">Executive Assistant Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date Format Preference
              </label>
              <select
                value={dateFormat}
                onChange={e => setDateFormat(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK/EU)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Operating Timezone
              </label>
              <input
                type="text"
                value={timeZone}
                onChange={e => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
                  <Check className="w-4 h-4 text-amber-700" /> Changes saved successfully
                </span>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <HardDrive className="w-4 h-4 text-amber-800" />
          <h2 className="text-sm font-bold text-stone-900">Local Browser Storage & Data Management</h2>
        </div>

        <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-stone-800">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Private Local Persistence Architecture</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            All records in AssistFlow (tasks, meetings, follow-ups, clients, contacts, and travel itineraries) are securely stored in your current web browser's <strong className="text-stone-800">localStorage</strong>.
            Data persists across sessions and page refreshes on this device without requiring external cloud accounts or server dependencies.
          </p>
          <div className="pt-1 flex flex-wrap gap-4 text-stone-500 font-medium text-[11px]">
            <span>• {tasks.length} tasks</span>
            <span>• {meetings.length} meetings</span>
            <span>• {followUps.length} follow-ups</span>
            <span>• {clients.length} clients</span>
            <span>• {contacts.length} contacts</span>
          </div>
        </div>

        {importNotice && (
          <div
            className={`p-3 rounded-lg text-xs ${
              importNotice.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {importNotice.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF7F2] space-y-2 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Export Backup</h3>
              <p className="text-xs text-stone-600 mt-1">
                Download a clean, structured JSON file of all your current tasks, meetings, clients, and preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={exportDataJson}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Export JSON File</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF7F2] space-y-2 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Import Workspace</h3>
              <p className="text-xs text-stone-600 mt-1">
                Load a previously exported AssistFlow JSON backup file to restore records on this browser.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="workspace-import-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-stone-600" />
                <span>Upload JSON Backup</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-2 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">Restore Demo Data</h3>
              <p className="text-xs text-stone-600 mt-1">
                Reset your workspace back to the original demonstration datasets for portfolio testing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRestoreConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-800" />
              <span>Reset Demo Records</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={restoreConfirmOpen}
        onClose={() => setRestoreConfirmOpen(false)}
        onConfirm={restoreDemoData}
        title="Restore Demonstration Data"
        message="This will reset all tasks, meetings, contacts, clients, and follow-ups to the original demonstration dataset. Any custom records created will be replaced."
        confirmLabel="Reset to Demonstration Data"
      />
    </div>
  );
};
