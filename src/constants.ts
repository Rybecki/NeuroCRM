import { Customer, Deal, Insight, Activity } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    company: 'Cyberdyne Systems',
    email: 'alex@cyberdyne.io',
    status: 'Active',
    score: 92,
    lastInteraction: '2024-03-24T10:00:00Z',
    tags: ['Enterprise', 'High Value'],
    avatar: 'https://picsum.photos/seed/alex/100/100'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    company: 'Neuralink Corp',
    email: 's.chen@neuralink.com',
    status: 'Lead',
    score: 78,
    lastInteraction: '2024-03-23T15:30:00Z',
    tags: ['Tech', 'Early Stage'],
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    company: 'Weyland-Yutani',
    email: 'm.thorne@weyland.com',
    status: 'Active',
    score: 85,
    lastInteraction: '2024-03-24T09:15:00Z',
    tags: ['Enterprise', 'Strategic'],
    avatar: 'https://picsum.photos/seed/marcus/100/100'
  },
  {
    id: '4',
    name: 'Elena Vance',
    company: 'Black Mesa',
    email: 'elena@blackmesa.org',
    status: 'Inactive',
    score: 45,
    lastInteraction: '2024-02-15T11:00:00Z',
    tags: ['Research'],
    avatar: 'https://picsum.photos/seed/elena/100/100'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Quantum Sales Cockpit',
    customer: 'NovaForge Dynamics',
    value: 310000,
    stage: 'Negotiation',
    probability: 85,
    aiPrediction: 'High'
  },
  {
    id: 'd2',
    title: 'Predictive Revenue Mesh',
    customer: 'Helixion Labs',
    value: 190000,
    stage: 'Proposal',
    probability: 60,
    aiPrediction: 'Medium'
  },
  {
    id: 'd3',
    title: 'Autonomous Client Journey',
    customer: 'StellarPeak Ventures',
    value: 420000,
    stage: 'Discovery',
    probability: 30,
    aiPrediction: 'Low'
  }
];

export const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'i1',
    type: 'opportunity',
    message: 'Cyberdyne Systems has increased usage by 40%. Potential upsell opportunity.',
    action: 'Create Expansion Deal'
  },
  {
    id: 'i2',
    type: 'warning',
    message: 'Black Mesa hasn\'t logged in for 30 days. High churn risk detected.',
    action: 'Schedule Outreach'
  },
  {
    id: 'i3',
    type: 'info',
    message: 'New industry trend: AI-driven logistics is peaking in your sector.',
    action: 'View Report'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    user: 'John Doe',
    action: 'Closed deal',
    target: 'Project Phoenix',
    timestamp: '2 hours ago',
    type: 'deal'
  },
  {
    id: 'a2',
    user: 'Jane Smith',
    action: 'Sent email to',
    target: 'Alex Rivera',
    timestamp: '4 hours ago',
    type: 'email'
  },
  {
    id: 'a3',
    user: 'AI Assistant',
    action: 'Scheduled meeting with',
    target: 'Sarah Chen',
    timestamp: '5 hours ago',
    type: 'meeting'
  }
];
