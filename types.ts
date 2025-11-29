export enum SlideType {
  INTRO = 'INTRO',
  OBSOLESCENCE = 'OBSOLESCENCE',
  AWARENESS = 'AWARENESS',
  ECOSYSTEM = 'ECOSYSTEM',
  PROPOSAL = 'PROPOSAL'
}

export interface MarketingMetric {
  label: string;
  value: string;
  sub: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface AwarenessStage {
  id: number;
  label: string;
  mindset: string;
  strategy: string;
  active: boolean;
}

export interface ValueProp {
  title: string;
  desc: string;
}