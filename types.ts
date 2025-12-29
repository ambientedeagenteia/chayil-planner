
export enum AppView {
  DASHBOARD = 'dashboard',
  BUSINESS_HUB = 'business_hub',
  MARKETING_HUB = 'marketing_hub',
  CRM_HUB = 'crm_hub',
  PLANNER_HUB = 'planner_hub',
  WHEEL_OF_LIFE = 'wheel_of_life',
  HABIT_TRACKER = 'habit_tracker',
  TASKS_HUB = 'tasks_hub',
  SELF_CARE = 'self_care',
  FAMILY_HUB = 'family_hub',
  FINANCE_PERSONAL = 'finance_personal',
  FINANCE_BUSINESS = 'finance_business',
  FINANCE_CONSOLIDATED = 'finance_consolidated',
  HEALTH_DIARY = 'health_diary',
  SETTINGS = 'settings'
}

export type HealthPerson = 'Eu' | 'Filho/Filha' | 'Esposo' | 'Namorado' | 'Pai/Mãe' | 'Irmão/Irmã';

export interface HealthRecord {
  id: string;
  person: HealthPerson;
  date: string; 
  description: string;
  tookMedication: boolean;
  medicationName?: string;
}

export interface Habit {
  id: string;
  name: string;
  days: boolean[]; 
}

export interface WheelCategory {
  name: string;
  score: number;
}

export interface WheelEntry {
  date: string;
  categories: WheelCategory[];
}

export interface NotionTask {
  id: string;
  text: string;
  completed: boolean;
  recurrence?: 'diario' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'semestral' | 'anual';
}

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'funcionario' | 'freelancer' | 'terceiro' | 'parceiro';
  role: string;
  responsibilities: string;
  paymentType: 'dia' | 'semana' | 'mes' | 'co-producao';
}

export interface StatusLog {
  type: 'inactivation' | 'reactivation';
  date: string;
  reason: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ativa' | 'inativa';
  lastContact: string;
  notes: string;
  history?: StatusLog[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string;
  agenda: string;
  link: string;
}

export interface SelfCareItem {
  id: string;
  label: string;
  completed: boolean;
  lastDate?: string;
}

export interface FamilyRecord {
  id: string;
  type: 'consulta' | 'exame' | 'lazer';
  title: string;
  date: string;
  notes: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface AppState {
  userName: string;
  tasks: NotionTask[];
  habits: Habit[];
  wheel: WheelCategory[];
  wheelHistory: WheelEntry[];
  ideas: string;
  notes: string;
  dailyAffirmation: string;
  focoHoje: string;
  team: TeamMember[];
  clients: Client[];
  meetings: Meeting[];
  planning: {
    diario: string;
    semanal: string;
    mensal: string;
    anual: string;
  };
  selfCare: SelfCareItem[];
  family: FamilyRecord[];
  financePersonal: Transaction[];
  financeBusiness: Transaction[];
  healthRecords: HealthRecord[];
}
