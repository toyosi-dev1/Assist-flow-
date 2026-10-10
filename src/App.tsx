import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { QuickActionModal } from './components/common/QuickActionModal';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { TasksPage } from './pages/TasksPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ContactsPage } from './pages/ContactsPage';
import { TravelPage } from './pages/TravelPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function WorkspaceLayout() {
  const { currentSection } = useWorkspace();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderActiveSection = () => {
    switch (currentSection) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Calendar':
        return <CalendarPage />;
      case 'Tasks':
        return <TasksPage />;
      case 'Meetings':
        return <MeetingsPage />;
      case 'Follow-ups':
        return <FollowUpsPage />;
      case 'Clients':
        return <ClientsPage />;
      case 'Contacts':
        return <ContactsPage />;
      case 'Travel':
        return <TravelPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex">
      <Sidebar />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveSection()}
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationsDrawer />
      <QuickActionModal />
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceLayout />
    </WorkspaceProvider>
  );
}
