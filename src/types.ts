export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Active' | 'Lead' | 'Churned' | 'Inactive';
  score: number;
  lastInteraction: string;
  tags: string[];
  avatar: string;
}

export interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed';
  probability: number;
  aiPrediction: 'High' | 'Medium' | 'Low';
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'info';
  message: string;
  action: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'call' | 'email' | 'meeting' | 'deal';
}
