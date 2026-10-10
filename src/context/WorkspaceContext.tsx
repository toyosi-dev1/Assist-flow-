import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Task,
  Meeting,
  CalendarEvent,
  FollowUp,
  Client,
  Contact,
  TravelTrip,
  AppSettings,
  NavigationSection,
  MeetingActionItem
} from '../types';
import {
  getInitialClients,
  getInitialContacts,
  getInitialMeetings,
  getInitialTasks,
  getInitialCalendarEvents,
  getInitialFollowUps,
  getInitialTravelTrip,
  getInitialSettings
} from '../data/initialData';
import { getTodayString } from '../utils/dateUtils';

interface WorkspaceData {
  tasks: Task[];
  meetings: Meeting[];
  calendarEvents: CalendarEvent[];
  followUps: FollowUp[];
  clients: Client[];
  contacts: Contact[];
  travelTrips: TravelTrip[];
  settings: AppSettings;
}

interface WorkspaceContextType {
  currentSection: NavigationSection;
  setCurrentSection: (section: NavigationSection) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (meeting: Meeting) => void;
  deleteMeeting: (id: string) => void;
  convertActionItemToTask: (meetingId: string, actionItemId: string) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  followUps: FollowUp[];
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  updateFollowUp: (followUp: FollowUp) => void;
  deleteFollowUp: (id: string) => void;
  toggleFollowUpComplete: (id: string) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  travelTrips: TravelTrip[];
  addTravelTrip: (trip: Omit<TravelTrip, 'id'>) => void;
  updateTravelTrip: (trip: TravelTrip) => void;
  deleteTravelTrip: (id: string) => void;
  toggleTripChecklist: (tripId: string, checklistItemId: string) => void;
  addItineraryItem: (tripId: string, item: Omit<import('../types').ItineraryItem, 'id'>) => void;
  deleteItineraryItem: (tripId: string, itemId: string) => void;
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  restoreDemoData: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonStr: string) => boolean;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  quickActionModal: 'task' | 'meeting' | 'followup' | 'contact' | null;
  setQuickActionModal: (type: 'task' | 'meeting' | 'followup' | 'contact' | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  attentionDrawerOpen: boolean;
  setAttentionDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'assistflow_workspace_v1';

function getStoredOrInitialData(): WorkspaceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.meetings) &&
        Array.isArray(parsed.clients)
      ) {
        return {
          tasks: parsed.tasks,
          meetings: parsed.meetings,
          calendarEvents: Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : getInitialCalendarEvents(),
          followUps: Array.isArray(parsed.followUps) ? parsed.followUps : getInitialFollowUps(),
          clients: parsed.clients,
          contacts: Array.isArray(parsed.contacts) ? parsed.contacts : getInitialContacts(),
          travelTrips: Array.isArray(parsed.travelTrips) ? parsed.travelTrips : [getInitialTravelTrip()],
          settings: parsed.settings || getInitialSettings()
        };
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    tasks: getInitialTasks(),
    meetings: getInitialMeetings(),
    calendarEvents: getInitialCalendarEvents(),
    followUps: getInitialFollowUps(),
    clients: getInitialClients(),
    contacts: getInitialContacts(),
    travelTrips: [getInitialTravelTrip()],
    settings: getInitialSettings()
  };
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WorkspaceData>(getStoredOrInitialData);
  const [currentSection, setCurrentSection] = useState<NavigationSection>('Dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [quickActionModal, setQuickActionModal] = useState<'task' | 'meeting' | 'followup' | 'contact' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [attentionDrawerOpen, setAttentionDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const addTask = (taskInput: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: getTodayString()
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
  };

  const updateTask = (updatedTask: Task) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const toggleTaskComplete = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== id) return t;
        const isCurrentlyCompleted = t.status === 'Completed';
        return {
          ...t,
          status: isCurrentlyCompleted ? 'To Do' : 'Completed',
          completedAt: isCurrentlyCompleted ? undefined : getTodayString()
        };
      })
    }));
  };

  const addMeeting = (meetingInput: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...meetingInput,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const associatedCalEvent: CalendarEvent = {
      id: `cal-${newMeeting.id}`,
      title: newMeeting.title,
      date: newMeeting.date,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      attendees: newMeeting.attendees,
      client: newMeeting.client,
      location: newMeeting.location || newMeeting.meetingLink || 'Virtual Meeting',
      type: 'Meeting',
      notes: newMeeting.agenda
    };
    setData(prev => ({
      ...prev,
      meetings: [newMeeting, ...prev.meetings],
      calendarEvents: [...prev.calendarEvents, associatedCalEvent]
    }));
  };

  const updateMeeting = (updatedMeeting: Meeting) => {
    setData(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => (m.id === updatedMeeting.id ? updatedMeeting : m)),
      calendarEvents: prev.calendarEvents.map(c => {
        if (c.id === `cal-${updatedMeeting.id}`) {
          return {
            ...c,
            title: updatedMeeting.title,
            date: updatedMeeting.date,
            startTime: updatedMeeting.startTime,
            endTime: updatedMeeting.endTime,
            attendees: updatedMeeting.attendees,
            client: updatedMeeting.client,
            location: updatedMeeting.location || updatedMeeting.meetingLink || 'Virtual Meeting'
          };
        }
        return c;
      })
    }));
  };

  const deleteMeeting = (id: string) => {
    setData(prev => ({
      ...prev,
      meetings: prev.meetings.filter(m => m.id !== id),
      calendarEvents: prev.calendarEvents.filter(c => c.id !== `cal-${id}`)
    }));
    if (selectedMeetingId === id) {
      setSelectedMeetingId(null);
    }
  };

  const convertActionItemToTask = (meetingId: string, actionItemId: string) => {
    const targetMeeting = data.meetings.find(m => m.id === meetingId);
    if (!targetMeeting) return;
    const actionItem = targetMeeting.actionItems.find(a => a.id === actionItemId);
    if (!actionItem || actionItem.taskId) return;

    const newTaskId = `task-from-action-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: actionItem.text,
      description: `Action item originated from meeting "${targetMeeting.title}".`,
      status: actionItem.completed ? 'Completed' : 'To Do',
      priority: 'High',
      dueDate: actionItem.deadline || getTodayString(),
      client: targetMeeting.client,
      assignee: actionItem.assignee || 'Alex Morgan',
      category: 'Administrative',
      createdAt: getTodayString()
    };

    const updatedMeeting: Meeting = {
      ...targetMeeting,
      actionItems: targetMeeting.actionItems.map(a =>
        a.id === actionItemId ? { ...a, taskId: newTaskId } : a
      )
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      meetings: prev.meetings.map(m => (m.id === meetingId ? updatedMeeting : m))
    }));
  };

  const addCalendarEvent = (eventInput: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventInput,
      id: `cal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, newEvent]
    }));
  };

  const updateCalendarEvent = (updatedEvent: CalendarEvent) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
    }));
  };

  const deleteCalendarEvent = (id: string) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter(e => e.id !== id)
    }));
  };

  const addFollowUp = (followUpInput: Omit<FollowUp, 'id'>) => {
    const newFollowUp: FollowUp = {
      ...followUpInput,
      id: `fu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      followUps: [newFollowUp, ...prev.followUps]
    }));
  };

  const updateFollowUp = (updatedFollowUp: FollowUp) => {
    setData(prev => ({
      ...prev,
      followUps: prev.followUps.map(f => (f.id === updatedFollowUp.id ? updatedFollowUp : f))
    }));
  };

  const deleteFollowUp = (id: string) => {
    setData(prev => ({
      ...prev,
      followUps: prev.followUps.filter(f => f.id !== id)
    }));
  };

  const toggleFollowUpComplete = (id: string) => {
    setData(prev => ({
      ...prev,
      followUps: prev.followUps.map(f => {
        if (f.id !== id) return f;
        const isClosed = f.status === 'Closed';
        return {
          ...f,
          status: isClosed ? 'Pending' : 'Closed'
        };
      })
    }));
  };

  const addClient = (clientInput: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientInput,
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
  };

  const updateClient = (updatedClient: Client) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => (c.id === updatedClient.id ? updatedClient : c))
    }));
  };

  const deleteClient = (id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
  };

  const addContact = (contactInput: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactInput,
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const updateContact = (updatedContact: Contact) => {
    setData(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => (c.id === updatedContact.id ? updatedContact : c))
    }));
  };

  const deleteContact = (id: string) => {
    setData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }));
  };

  const addTravelTrip = (tripInput: Omit<TravelTrip, 'id'>) => {
    const newTrip: TravelTrip = {
      ...tripInput,
      id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      travelTrips: [newTrip, ...prev.travelTrips]
    }));
  };

  const updateTravelTrip = (updatedTrip: TravelTrip) => {
    setData(prev => ({
      ...prev,
      travelTrips: prev.travelTrips.map(t => (t.id === updatedTrip.id ? updatedTrip : t))
    }));
  };

  const deleteTravelTrip = (id: string) => {
    setData(prev => ({
      ...prev,
      travelTrips: prev.travelTrips.filter(t => t.id !== id)
    }));
  };

  const toggleTripChecklist = (tripId: string, checklistItemId: string) => {
    setData(prev => ({
      ...prev,
      travelTrips: prev.travelTrips.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          checklist: t.checklist.map(c =>
            c.id === checklistItemId ? { ...c, completed: !c.completed } : c
          )
        };
      })
    }));
  };

  const addItineraryItem = (tripId: string, itemInput: Omit<import('../types').ItineraryItem, 'id'>) => {
    const newItem: import('../types').ItineraryItem = {
      ...itemInput,
      id: `itin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setData(prev => ({
      ...prev,
      travelTrips: prev.travelTrips.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          itinerary: [...t.itinerary, newItem]
        };
      })
    }));
  };

  const deleteItineraryItem = (tripId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      travelTrips: prev.travelTrips.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          itinerary: t.itinerary.filter(i => i.id !== itemId)
        };
      })
    }));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setData(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  const restoreDemoData = () => {
    const freshData: WorkspaceData = {
      tasks: getInitialTasks(),
      meetings: getInitialMeetings(),
      calendarEvents: getInitialCalendarEvents(),
      followUps: getInitialFollowUps(),
      clients: getInitialClients(),
      contacts: getInitialContacts(),
      travelTrips: [getInitialTravelTrip()],
      settings: getInitialSettings()
    };
    setData(freshData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
    } catch {}
  };

  const exportDataJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `assistflow_export_${getTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (
        parsed &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.meetings) &&
        Array.isArray(parsed.clients)
      ) {
        setData({
          tasks: parsed.tasks,
          meetings: parsed.meetings,
          calendarEvents: Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : [],
          followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
          clients: parsed.clients,
          contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
          travelTrips: Array.isArray(parsed.travelTrips) ? parsed.travelTrips : [],
          settings: parsed.settings || getInitialSettings()
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        tasks: data.tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        meetings: data.meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        convertActionItemToTask,
        calendarEvents: data.calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        followUps: data.followUps,
        addFollowUp,
        updateFollowUp,
        deleteFollowUp,
        toggleFollowUpComplete,
        clients: data.clients,
        addClient,
        updateClient,
        deleteClient,
        contacts: data.contacts,
        addContact,
        updateContact,
        deleteContact,
        travelTrips: data.travelTrips,
        addTravelTrip,
        updateTravelTrip,
        deleteTravelTrip,
        toggleTripChecklist,
        addItineraryItem,
        deleteItineraryItem,
        settings: data.settings,
        updateSettings,
        restoreDemoData,
        exportDataJson,
        importDataJson,
        selectedClientId,
        setSelectedClientId,
        selectedMeetingId,
        setSelectedMeetingId,
        quickActionModal,
        setQuickActionModal,
        searchOpen,
        setSearchOpen,
        attentionDrawerOpen,
        setAttentionDrawerOpen
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
