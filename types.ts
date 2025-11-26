import { LucideIcon } from 'lucide-react';

export type AppId = 'profile' | 'projects' | 'skills' | 'terminal' | 'resume' | 'contact';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: LucideIcon;
  defaultWidth: number;
  defaultHeight: number;
  defaultX: number;
  defaultY: number;
}

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  codename: string;
  client: string;
  description: string;
  tech: string[];
  status: 'CLASSIFIED' | 'DECRYPTED';
  url?: string;
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}