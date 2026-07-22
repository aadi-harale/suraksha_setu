export type EntityType = 'UPI' | 'Phone' | 'Bank Account' | 'Email';
export type RiskLevel = 'Critical' | 'High' | 'Suspicious' | 'Clean';

export interface SuspectRecord {
  id: string;
  entity: string;
  type: EntityType;
  linkedComplaints: number;
  risk: RiskLevel;
  lastSeen?: string;
  scamTypes?: string;
  role?: string;
  linkedCluster?: string;
}

export const MOCK_SUSPECT_REPOSITORY: Record<string, SuspectRecord> = {
  'rbi.verify@okaxis': {
    id: 'suspect_001',
    entity: 'rbi.verify@okaxis',
    type: 'UPI',
    linkedComplaints: 7,
    risk: 'Critical',
    lastSeen: 'Mumbai, Pune, Jaipur',
    scamTypes: 'Digital Arrest, Aadhaar Money Laundering'
  },
  '+91-9876543210': {
    id: 'suspect_002',
    entity: '+91-9876543210',
    type: 'Phone',
    linkedComplaints: 4,
    risk: 'High',
    linkedCluster: 'DA-MH-0726-A',
    scamTypes: 'Digital Arrest'
  },
  'HDFC-1122': {
    id: 'suspect_003',
    entity: 'HDFC-1122',
    type: 'Bank Account',
    linkedComplaints: 7,
    risk: 'Critical',
    role: 'Suspected mule account',
    lastSeen: 'Mumbai'
  },
  'support@realbank.in': {
    id: 'suspect_004',
    entity: 'support@realbank.in',
    type: 'Email',
    linkedComplaints: 0,
    risk: 'Clean',
    role: 'Verified Support'
  },
  '+91-9998887776': {
    id: 'suspect_005',
    entity: '+91-9998887776',
    type: 'Phone',
    linkedComplaints: 12,
    risk: 'Critical',
    linkedCluster: 'DA-RJ-0826-B',
    scamTypes: 'Police Impersonation'
  },
  'police.verify@sbi': {
    id: 'suspect_006',
    entity: 'police.verify@sbi',
    type: 'UPI',
    linkedComplaints: 15,
    risk: 'Critical',
    lastSeen: 'Jaipur, Delhi',
    scamTypes: 'Digital Arrest'
  }
};

export function lookupEntity(entityValue: string): SuspectRecord | null {
  return MOCK_SUSPECT_REPOSITORY[entityValue] || null;
}

export function getAllSuspects(): SuspectRecord[] {
  return Object.values(MOCK_SUSPECT_REPOSITORY);
}
