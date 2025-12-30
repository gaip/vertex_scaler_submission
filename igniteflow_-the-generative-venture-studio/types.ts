
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MARKET_INTEL = 'MARKET_INTEL',
  PITCH_LAB = 'PITCH_LAB',
  BRAND_STUDIO = 'BRAND_STUDIO',
  STRATEGY_ROOM = 'STRATEGY_ROOM'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface IdeaState {
  name: string;
  description: string;
  industry: string;
  stage: 'Idea' | 'MVP' | 'Growth';
}
