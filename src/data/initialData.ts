import {
  Task,
  Meeting,
  CalendarEvent,
  FollowUp,
  Client,
  Contact,
  TravelTrip,
  AppSettings
} from '../types';
import { getDateOffset, getTodayString } from '../utils/dateUtils';

export function getInitialSettings(): AppSettings {
  return {
    assistantName: 'Alex Morgan',
    assistantTitle: 'Executive Virtual Assistant',
    email: 'alex.morgan@assistflow-workspace.internal',
    dateFormat: 'YYYY-MM-DD',
    timeZone: 'UTC+1 (West Africa / London GMT)'
  };
}

export function getInitialClients(): Client[] {
  return [
    {
      id: 'client-1',
      name: 'Apex Horizon Capital',
      primaryContact: 'Marcus Vance',
      email: 'm.vance@apexhorizon.example.com',
      phone: '+44 20 7946 0192',
      industry: 'Private Equity & Venture',
      status: 'Active',
      companyDescription: 'Mid-market private equity firm focusing on emerging markets technology and sustainable infrastructure.',
      notes: 'Prefers weekly executive summaries on Friday mornings by 09:00 GMT. Values concise bulleted updates.'
    },
    {
      id: 'client-2',
      name: 'Lumina Health Technologies',
      primaryContact: 'Dr. Elena Rostova',
      email: 'elena.rostova@luminahealth.example.com',
      phone: '+1 415 555 0188',
      industry: 'Digital Health & Biotech',
      status: 'Active',
      companyDescription: 'Series B healthcare diagnostics platform connecting clinical labs with point-of-care clinics.',
      notes: 'Executive calendar is heavily booked. Always buffer 15 minutes between clinical consultations.'
    },
    {
      id: 'client-3',
      name: 'Vanguard Media Group',
      primaryContact: 'Chloe Bennett',
      email: 'c.bennett@vanguardmedia.example.com',
      phone: '+1 212 555 0144',
      industry: 'Digital Publishing & Podcasting',
      status: 'Retainer',
      companyDescription: 'Independent media production house syndicating technology podcasts and digital newsletters.',
      notes: 'Requires coordination for studio booking and remote guest interview prep packages.'
    },
    {
      id: 'client-4',
      name: 'Solomon & Partners Legal',
      primaryContact: 'Arthur Solomon',
      email: 'asolomon@solomonpartners.example.com',
      phone: '+44 20 7183 9400',
      industry: 'Corporate Law & Governance',
      status: 'Active',
      companyDescription: 'Boutique corporate law practice managing cross-border transactions and regulatory compliance.',
      notes: 'All documents require explicit version tracking and redline comparisons before sign-off.'
    }
  ];
}

export function getInitialContacts(): Contact[] {
  return [
    {
      id: 'contact-1',
      name: 'Marcus Vance',
      jobTitle: 'Managing Partner',
      company: 'Apex Horizon Capital',
      email: 'm.vance@apexhorizon.example.com',
      phone: '+44 20 7946 0192',
      category: 'Client',
      notes: 'Key stakeholder for quarterly LP distributions.'
    },
    {
      id: 'contact-2',
      name: 'Dr. Elena Rostova',
      jobTitle: 'Chief Executive Officer',
      company: 'Lumina Health Technologies',
      email: 'elena.rostova@luminahealth.example.com',
      phone: '+1 415 555 0188',
      category: 'Client',
      notes: 'Speaker at London Health Summit next month.'
    },
    {
      id: 'contact-3',
      name: 'Chloe Bennett',
      jobTitle: 'VP Operations',
      company: 'Vanguard Media Group',
      email: 'c.bennett@vanguardmedia.example.com',
      phone: '+1 212 555 0144',
      category: 'Client',
      notes: 'Primary point of contact for media contracts.'
    },
    {
      id: 'contact-4',
      name: 'Arthur Solomon',
      jobTitle: 'Senior Counsel',
      company: 'Solomon & Partners Legal',
      email: 'asolomon@solomonpartners.example.com',
      phone: '+44 20 7183 9400',
      category: 'Partner',
      notes: 'Specializes in corporate structuring.'
    },
    {
      id: 'contact-5',
      name: 'David Sterling',
      jobTitle: 'Managing Director',
      company: 'Apex Horizon Capital',
      email: 'd.sterling@apexhorizon.example.com',
      phone: '+234 1 234 5678',
      category: 'Executive',
      notes: 'Lead traveler for upcoming London business week.'
    },
    {
      id: 'contact-6',
      name: 'Rachel Zimmerman',
      jobTitle: 'Finance Director',
      company: 'Apex Horizon Capital',
      email: 'r.zimmerman@apexhorizon.example.com',
      phone: '+44 20 7946 0881',
      category: 'Partner',
      notes: 'Manages flight reconciliations and wire transfers.'
    },
    {
      id: 'contact-7',
      name: 'Liam O\'Connor',
      jobTitle: 'Guest Relations Executive',
      company: 'The Berkeley London',
      email: 'loconnor@theberkeley.example.com',
      phone: '+44 20 7235 6000',
      category: 'Vendor',
      notes: 'VIP hotel liaison for Knightsbridge suite reservations.'
    }
  ];
}

export function getInitialTasks(): Task[] {
  const today = getTodayString();
  const yesterday = getDateOffset(-1);
  const twoDaysAgo = getDateOffset(-2);
  const tomorrow = getDateOffset(1);
  const nextWeek = getDateOffset(5);

  return [
    {
      id: 'task-1',
      title: 'Finalize Q4 board deck summary',
      description: 'Review slides 12-24, embed latest audited portfolio metrics, and export clean PDF for Marcus Vance.',
      status: 'In Progress',
      priority: 'High',
      dueDate: today,
      client: 'Apex Horizon Capital',
      assignee: 'Alex Morgan',
      category: 'Administrative',
      createdAt: getDateOffset(-3)
    },
    {
      id: 'task-2',
      title: 'Coordinate travel dossier for London business week',
      description: 'Compile flight tickets, hotel vouchers, chauffeur contact, and printed executive itinerary folder.',
      status: 'In Progress',
      priority: 'High',
      dueDate: today,
      client: 'Apex Horizon Capital',
      assignee: 'Alex Morgan',
      category: 'Travel',
      createdAt: getDateOffset(-4)
    },
    {
      id: 'task-3',
      title: 'Waiting for contract approval: Send revised SLA to Solomon Legal',
      description: 'Pending partner approval on section 4.2 data governance clause before final signature dispatch.',
      status: 'Waiting',
      priority: 'Medium',
      dueDate: tomorrow,
      client: 'Solomon & Partners Legal',
      assignee: 'Arthur Solomon',
      category: 'Administrative',
      createdAt: getDateOffset(-2)
    },
    {
      id: 'task-4',
      title: 'Awaiting client confirmation: Confirm keynote slot with Lumina Health',
      description: 'Awaiting Dr. Elena Rostova confirmation of keynote panel timing for the European Life Sciences forum.',
      status: 'Waiting',
      priority: 'Medium',
      dueDate: getDateOffset(2),
      client: 'Lumina Health Technologies',
      assignee: 'Dr. Elena Rostova',
      category: 'Scheduling',
      createdAt: getDateOffset(-1)
    },
    {
      id: 'task-5',
      title: 'Pending invoice approval: Reconcile September flight & lodging expenses',
      description: 'Cross-check AMEX receipts with British Airways and hotel billing statement. Blocked on Rachel Zimmerman sign-off.',
      status: 'Waiting',
      priority: 'Low',
      dueDate: yesterday,
      client: 'Apex Horizon Capital',
      assignee: 'Rachel Zimmerman',
      category: 'Finance',
      createdAt: getDateOffset(-5)
    },
    {
      id: 'task-6',
      title: 'Prepare briefing notes for weekly ops alignment',
      description: 'Gather weekly deliverables status from each departmental lead and draft structured bullet points.',
      status: 'To Do',
      priority: 'Medium',
      dueDate: today,
      client: 'Apex Horizon Capital',
      assignee: 'Alex Morgan',
      category: 'Administrative',
      createdAt: getDateOffset(-2)
    },
    {
      id: 'task-7',
      title: 'Review audio transcription from executive committee meeting',
      description: 'Proofread Otter.ai transcription, verify speaker names and extract preliminary commitments.',
      status: 'To Do',
      priority: 'Low',
      dueDate: twoDaysAgo,
      client: 'Vanguard Media Group',
      assignee: 'Alex Morgan',
      category: 'Research',
      createdAt: getDateOffset(-4)
    },
    {
      id: 'task-8',
      title: 'Archive completed Q3 vendor contracts and tax clearance forms',
      description: 'Sort approved PDF agreements into secure client shared drive and notify legal compliance.',
      status: 'Completed',
      priority: 'Low',
      dueDate: getDateOffset(-2),
      client: 'Apex Horizon Capital',
      assignee: 'Alex Morgan',
      category: 'Administrative',
      createdAt: getDateOffset(-7),
      completedAt: getDateOffset(-1)
    },
    {
      id: 'task-9',
      title: 'Schedule podcast guest recording session with series lead',
      description: 'Send Riverside.fm calendar invites and technical sound-check guidelines for Chloe Bennett episode.',
      status: 'To Do',
      priority: 'Medium',
      dueDate: nextWeek,
      client: 'Vanguard Media Group',
      assignee: 'Alex Morgan',
      category: 'Scheduling',
      createdAt: getDateOffset(-1)
    }
  ];
}

export function getInitialMeetings(): Meeting[] {
  const today = getTodayString();
  const tomorrow = getDateOffset(1);
  const nextWeek = getDateOffset(4);

  return [
    {
      id: 'meeting-1',
      title: 'Q4 Portfolio Review & Executive Sync',
      date: today,
      startTime: '10:00',
      endTime: '11:00',
      attendees: ['Marcus Vance', 'Rachel Zimmerman', 'Alex Morgan'],
      client: 'Apex Horizon Capital',
      meetingLink: 'https://zoom.us/j/892104229',
      location: 'Zoom Conference #892-104-229',
      agenda: '1. Review Q3 realization metrics\n2. London LP summit schedule preview\n3. Budget approval for infrastructure buildout',
      prepChecklist: [
        { id: 'prep-1', label: 'Verify screen-sharing rights for Marcus', completed: true },
        { id: 'prep-2', label: 'Send updated portfolio slide deck 30 mins prior', completed: true },
        { id: 'prep-3', label: 'Ensure recording transcription is enabled', completed: false }
      ],
      notes: 'Discussed portfolio multiples. Marcus emphasized focus on UK institutional contacts for the November trip. Rachel confirmed expense approvals will be processed by EOD.',
      decisions: [
        'Approved proceeding with the London venue booking at The Berkeley',
        'Authorized 15% budget variance for European investor dinner'
      ],
      actionItems: [
        {
          id: 'act-1',
          text: 'Confirm private dining room reservation at Claridge\'s for 8 guests',
          assignee: 'Alex Morgan',
          deadline: getDateOffset(2),
          completed: false,
          taskId: 'task-auto-1'
        },
        {
          id: 'act-2',
          text: 'Circulate final Q3 portfolio summary to advisory council',
          assignee: 'Rachel Zimmerman',
          deadline: getDateOffset(3),
          completed: false
        }
      ],
      status: 'Scheduled'
    },
    {
      id: 'meeting-2',
      title: 'Lumina Product Roadmap & Regulatory Debrief',
      date: today,
      startTime: '14:30',
      endTime: '15:15',
      attendees: ['Dr. Elena Rostova', 'Arthur Solomon', 'Alex Morgan'],
      client: 'Lumina Health Technologies',
      meetingLink: 'https://meet.google.com/xyz-abtc-qwe',
      location: 'Google Meet Virtual Room A',
      agenda: '1. EU MDR compliance status\n2. Clinical pilot expansion in Manchester\n3. Timeline for advisory board briefing',
      prepChecklist: [
        { id: 'prep-4', label: 'Confirm Arthur has reviewed compliance memo', completed: true },
        { id: 'prep-5', label: 'Have previous meeting minutes ready for reference', completed: true }
      ],
      notes: 'Reviewing clinical timeline adjustments. Dr. Rostova will deliver the opening keynote in London if legal clearance is finalized.',
      decisions: [
        'Target EU MDR submission for end of November'
      ],
      actionItems: [
        {
          id: 'act-3',
          text: 'Draft speaker rider document for Dr. Elena Rostova',
          assignee: 'Alex Morgan',
          deadline: getDateOffset(2),
          completed: false
        }
      ],
      status: 'Scheduled'
    },
    {
      id: 'meeting-3',
      title: 'London Trip Briefing & Logistics Walkthrough',
      date: tomorrow,
      startTime: '09:30',
      endTime: '10:15',
      attendees: ['David Sterling', 'Alex Morgan'],
      client: 'Apex Horizon Capital',
      meetingLink: 'https://zoom.us/j/911029482',
      location: 'Executive Suite Office / Hybrid Zoom',
      agenda: '1. Review day-by-day itinerary\n2. Flight check-in and private chauffeur pickup details\n3. High-level investor meeting schedule',
      prepChecklist: [
        { id: 'prep-6', label: 'Print physical travel dossier & boarding passes', completed: false },
        { id: 'prep-7', label: 'Sync mobile calendar alerts with London local time (BST)', completed: false }
      ],
      notes: '',
      decisions: [],
      actionItems: [],
      status: 'Scheduled'
    },
    {
      id: 'meeting-4',
      title: 'Media Production & Content Strategy Review',
      date: nextWeek,
      startTime: '16:00',
      endTime: '16:45',
      attendees: ['Chloe Bennett', 'Alex Morgan'],
      client: 'Vanguard Media Group',
      meetingLink: 'https://zoom.us/j/442991002',
      location: 'Zoom Studio 2',
      agenda: '1. Production pipeline for Q4\n2. Sponsor agreement review\n3. Guest booking roster',
      prepChecklist: [
        { id: 'prep-8', label: 'Collate monthly listener engagement report', completed: false }
      ],
      notes: '',
      decisions: [],
      actionItems: [],
      status: 'Scheduled'
    }
  ];
}

export function getInitialCalendarEvents(): CalendarEvent[] {
  const today = getTodayString();
  const tomorrow = getDateOffset(1);
  const yesterday = getDateOffset(-1);
  const inThreeDays = getDateOffset(3);
  const nextWeek = getDateOffset(6);

  return [
    {
      id: 'cal-meeting-1',
      title: 'Q4 Portfolio Review & Executive Sync',
      date: today,
      startTime: '10:00',
      endTime: '11:00',
      attendees: ['Marcus Vance', 'Rachel Zimmerman', 'Alex Morgan'],
      client: 'Apex Horizon Capital',
      location: 'Zoom Conference #892-104-229',
      type: 'Meeting',
      notes: 'Key quarterly partner review.'
    },
    {
      id: 'cal-meeting-2',
      title: 'Lumina Product Roadmap & Regulatory Debrief',
      date: today,
      startTime: '14:30',
      endTime: '15:15',
      attendees: ['Dr. Elena Rostova', 'Arthur Solomon', 'Alex Morgan'],
      client: 'Lumina Health Technologies',
      location: 'Google Meet Virtual Room A',
      type: 'Meeting',
      notes: 'EU MDR compliance walkthrough.'
    },
    {
      id: 'cal-3',
      title: 'Focus Block: Travel Dossier & Briefings',
      date: today,
      startTime: '16:00',
      endTime: '17:30',
      attendees: ['Alex Morgan'],
      client: 'Apex Horizon Capital',
      location: 'Dedicated Deep Work',
      type: 'Deep Work',
      notes: 'Organizing travel tickets, vouchers, and printed schedules.'
    },
    {
      id: 'cal-meeting-3',
      title: 'London Trip Briefing & Logistics Walkthrough',
      date: tomorrow,
      startTime: '09:30',
      endTime: '10:15',
      attendees: ['David Sterling', 'Alex Morgan'],
      client: 'Apex Horizon Capital',
      location: 'Executive Office / Zoom',
      type: 'Meeting',
      notes: 'Final pre-departure briefing.'
    },
    {
      id: 'cal-meeting-4',
      title: 'Media Production & Content Strategy Review',
      date: nextWeek,
      startTime: '16:00',
      endTime: '16:45',
      attendees: ['Chloe Bennett', 'Alex Morgan'],
      client: 'Vanguard Media Group',
      location: 'Zoom Studio 2',
      type: 'Meeting',
      notes: 'Production pipeline and sponsor agreements.'
    },
    {
      id: 'cal-5',
      title: 'Deadline: Submit Revised Retainer to Solomon',
      date: tomorrow,
      startTime: '17:00',
      endTime: '17:30',
      attendees: ['Arthur Solomon'],
      client: 'Solomon & Partners Legal',
      location: 'Email Submission',
      type: 'Deadline',
      notes: 'Signed retainer copy required.'
    },
    {
      id: 'cal-6',
      title: 'Quarterly Vendor Invoices Filing Deadline',
      date: yesterday,
      startTime: '12:00',
      endTime: '13:00',
      attendees: ['Alex Morgan', 'Rachel Zimmerman'],
      client: 'Apex Horizon Capital',
      location: 'Finance Portal',
      type: 'Deadline',
      notes: 'Filing quarterly invoices.'
    },
    {
      id: 'cal-7',
      title: 'Claridge\'s Private Dining Confirmation Call',
      date: inThreeDays,
      startTime: '11:00',
      endTime: '11:20',
      attendees: ['Alex Morgan', 'Maitre d\' Office'],
      client: 'Apex Horizon Capital',
      location: 'Phone Call +44 20 7629 8860',
      type: 'Call',
      notes: 'Reconfirm dietary requirements and table flowers.'
    },
    {
      id: 'cal-8',
      title: 'BA 074 Departure: Lagos to London Heathrow',
      date: nextWeek,
      startTime: '22:50',
      endTime: '05:35',
      attendees: ['David Sterling'],
      client: 'Apex Horizon Capital',
      location: 'LOS -> LHR Terminal 5',
      type: 'Travel',
      notes: 'Flight BA 074 Club World.'
    }
  ];
}

export function getInitialFollowUps(): FollowUp[] {
  const today = getTodayString();
  const yesterday = getDateOffset(-1);
  const tomorrow = getDateOffset(1);
  const inThreeDays = getDateOffset(3);

  return [
    {
      id: 'fu-1',
      contactName: 'Marcus Vance',
      company: 'Apex Horizon Capital',
      subject: 'Q4 Term Sheet & LP Capital Calls',
      description: 'Follow up on signatory sign-off for the updated co-investment structure before London meetings.',
      lastContactDate: getDateOffset(-2),
      nextFollowUpDate: today,
      priority: 'High',
      status: 'Due Today',
      notes: 'He asked to touch base immediately following morning meeting.'
    },
    {
      id: 'fu-2',
      contactName: 'Arthur Solomon',
      company: 'Solomon & Partners Legal',
      subject: 'Revised Retainer Agreement & SLA',
      description: 'Verify receipt of adjusted clause 4.2 redline document and confirm billing rate alignment.',
      lastContactDate: getDateOffset(-4),
      nextFollowUpDate: yesterday,
      priority: 'High',
      status: 'Pending',
      notes: 'Overdue by 1 day. Need written confirmation before Friday.'
    },
    {
      id: 'fu-3',
      contactName: 'Dr. Elena Rostova',
      company: 'Lumina Health Technologies',
      subject: 'Speaker Rider & Travel Stipend',
      description: 'Check whether conference organizers accepted our requested presentation AV requirements.',
      lastContactDate: getDateOffset(-1),
      nextFollowUpDate: tomorrow,
      priority: 'Medium',
      status: 'Pending',
      notes: 'Awaiting response from conference director.'
    },
    {
      id: 'fu-4',
      contactName: 'Liam O\'Connor',
      company: 'The Berkeley London',
      subject: 'VIP Room Amenity & Late Check-in Note',
      description: 'Ensure early check-in guarantee at 08:00 AM on arrival day and arrange quiet executive work desk.',
      lastContactDate: getDateOffset(-3),
      nextFollowUpDate: inThreeDays,
      priority: 'Medium',
      status: 'Waiting Response',
      notes: 'Email sent with flight arrival details.'
    },
    {
      id: 'fu-5',
      contactName: 'Chloe Bennett',
      company: 'Vanguard Media Group',
      subject: 'Podcast Sponsorship Agreement',
      description: 'Confirm sponsor logo approvals and final ad reads copy for November episodes.',
      lastContactDate: getDateOffset(-6),
      nextFollowUpDate: getDateOffset(4),
      priority: 'Low',
      status: 'Followed Up',
      notes: 'Sent initial contract; awaiting their marketing director feedback.'
    }
  ];
}

export function getInitialTravelTrip(): TravelTrip {
  const departure = getDateOffset(5);
  const returnDate = getDateOffset(12);

  return {
    id: 'trip-1',
    tripName: 'Lagos to London Business Week',
    destination: 'London, United Kingdom',
    departureDate: departure,
    returnDate: returnDate,
    traveler: 'David Sterling, Managing Director',
    purpose: 'European Institutional Investor Summit & Cross-border Partner Strategic Consultations',
    transportation: {
      airline: 'British Airways',
      flightReference: 'BA 074 / Club World Class',
      departureAirport: 'Murtala Muhammed Intl (LOS)',
      arrivalAirport: 'London Heathrow (LHR) Terminal 5',
      departureDateTime: `${departure} 22:50 WAT`,
      arrivalDateTime: `${getDateOffset(6)} 05:35 BST`
    },
    accommodation: {
      hotelName: 'The Berkeley',
      address: 'Wilton Place, Knightsbridge, London SW1X 7RL, United Kingdom',
      checkIn: `${getDateOffset(6)} (Guaranteed Early Check-in 08:00)`,
      checkOut: `${returnDate} 12:00`,
      confirmationReference: 'BK-99428-UK / Executive Park Suite'
    },
    itinerary: [
      {
        id: 'itin-1',
        date: getDateOffset(6),
        time: '06:30 BST',
        activity: 'Chauffeur Meet & Greet at LHR Terminal 5 Arrivals',
        location: 'Heathrow Airport Terminal 5 VIP Lane',
        notes: 'Driver: James Wright (+44 7700 900123) with Mercedes S-Class. Direct transfer to The Berkeley.'
      },
      {
        id: 'itin-2',
        date: getDateOffset(6),
        time: '12:30 BST',
        activity: 'Private Working Lunch with UK Advisory Leads',
        location: 'The Berkeley Dining Room, Knightsbridge',
        notes: 'Discussion of London financial regulations and Brexit tax treaties.'
      },
      {
        id: 'itin-3',
        date: getDateOffset(7),
        time: '09:00 - 15:00 BST',
        activity: 'European Institutional Investor Summit',
        location: 'The Savoy, Strand, London WC2R 0EZ',
        notes: 'David is speaking at 11:15 AM on Africa-Europe venture capital corridors. Badge pre-registered.'
      },
      {
        id: 'itin-4',
        date: getDateOffset(8),
        time: '19:30 BST',
        activity: 'Executive Dinner for 8 Partners & LPs',
        location: 'Claridge\'s, Brook Street, Mayfair, London W1K 4HR',
        notes: 'Private Room reserved. Wine pairings and tasting menu pre-authorized.'
      }
    ],
    checklist: [
      { id: 'chk-1', label: 'Passport & UK visa validity verified (> 6 months validity)', completed: true },
      { id: 'chk-2', label: 'Flight electronic ticket issued and Seat 2A selected', completed: true },
      { id: 'chk-3', label: 'The Berkeley Knightsbridge reservation & guaranteed early check-in confirmed', completed: true },
      { id: 'chk-4', label: 'Airport chauffeur service reserved (Executive S-Class)', completed: true },
      { id: 'chk-5', label: 'Investor summit registration badge and VIP lounge access confirmed', completed: true },
      { id: 'chk-6', label: 'Printed physical executive travel pack and USB offline backups ready', completed: false },
      { id: 'chk-7', label: 'International roaming and UK eSIM pre-configured on executive devices', completed: false },
      { id: 'chk-8', label: 'Emergency medical and corporate travel insurance policy printed', completed: true }
    ]
  };
}
