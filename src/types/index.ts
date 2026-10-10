export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Administrative' | 'Scheduling' | 'Travel' | 'Finance' | 'Email' | 'Research';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  client: string;
  assignee: string;
  category: TaskCategory;
  createdAt: string;
  completedAt?: string;
}

export type EventType = 'Meeting' | 'Call' | 'Deadline' | 'Travel' | 'Deep Work';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  client: string;
  location: string;
  type: EventType;
  notes: string;
}

export interface MeetingChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee: string;
  deadline: string;
  completed: boolean;
  taskId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  client: string;
  meetingLink: string;
  location: string;
  agenda: string;
  prepChecklist: MeetingChecklistItem[];
  notes: string;
  decisions: string[];
  actionItems: MeetingActionItem[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export type FollowUpStatus = 'Pending' | 'Due Today' | 'Followed Up' | 'Waiting Response' | 'Closed';

export interface FollowUp {
  id: string;
  contactName: string;
  company: string;
  subject: string;
  description: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  priority: PriorityLevel;
  status: FollowUpStatus;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  primaryContact: string;
  email: string;
  phone: string;
  companyDescription: string;
  industry: string;
  status: 'Active' | 'Onboarding' | 'Retainer' | 'Inactive';
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  category: 'Client' | 'Vendor' | 'Executive' | 'Partner' | 'Personal';
  notes: string;
}

export interface ItineraryItem {
  id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}

export interface TravelChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface TravelTrip {
  id: string;
  tripName: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  traveler: string;
  purpose: string;
  transportation: {
    airline: string;
    flightReference: string;
    departureAirport: string;
    arrivalAirport: string;
    departureDateTime: string;
    arrivalDateTime: string;
  };
  accommodation: {
    hotelName: string;
    address: string;
    checkIn: string;
    checkOut: string;
    confirmationReference: string;
  };
  itinerary: ItineraryItem[];
  checklist: TravelChecklistItem[];
}

export interface AppSettings {
  assistantName: string;
  assistantTitle: string;
  email: string;
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  timeZone: string;
}

export type NavigationSection = 
  | 'Dashboard' 
  | 'Calendar' 
  | 'Tasks' 
  | 'Meetings' 
  | 'Follow-ups' 
  | 'Clients' 
  | 'Contacts' 
  | 'Travel' 
  | 'Reports' 
  | 'Settings';
