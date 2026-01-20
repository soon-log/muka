
import { QuestionTemplate, CardTheme, ThemeId } from './types';

export const QUESTIONS: QuestionTemplate[] = [
  { id: 'q1', text: '나한테 어울리는 음악은?', type: 'relationship', emphasis: 'A' },
  { id: 'q2', text: '내가 힘들 때 들으면 좋을 음악은?', type: 'relationship', emphasis: 'A' },
  { id: 'q3', text: '나를 생각하면 떠오르는 음악은?', type: 'relationship', emphasis: 'B' },
  { id: 'q4', text: '요즘 네가 꽂힌 음악은?', type: 'situation', emphasis: 'light' },
  { id: 'q5', text: '아무 생각 없이 들을 수 있는 음악 추천해줘', type: 'situation', emphasis: 'light' },
  { id: 'q6', text: '인생 노래 하나만 추천해줘', type: 'situation', emphasis: 'serious' },
  { id: 'q7', text: '비 오는 날 듣기 좋은 음악은?', type: 'situation', emphasis: 'serious' },
];

export const THEMES: CardTheme[] = [
  { id: ThemeId.BRIGHT, name: '밝음/경쾌', bgColor: '#FEF3C7', accentColor: '#F59E0B', mood: 'Cheerful' },
  { id: ThemeId.CALM, name: '차분/평온', bgColor: '#E0F2FE', accentColor: '#0EA5E9', mood: 'Calm' },
  { id: ThemeId.DREAMY, name: '몽환적', bgColor: '#F3E8FF', accentColor: '#A855F7', mood: 'Dreamy' },
  { id: ThemeId.WARM, name: '따뜻함', bgColor: '#FFEDD5', accentColor: '#F97316', mood: 'Warm' },
  { id: ThemeId.RETRO, name: '레트로', bgColor: '#F5E6D3', accentColor: '#8B4513', mood: 'Retro' },
  { id: ThemeId.EMOTIONAL, name: '감성적', bgColor: '#F1F5F9', accentColor: '#475569', mood: 'Emotional' },
  { id: ThemeId.ROMANTIC, name: '로맨틱', bgColor: '#FCE7F3', accentColor: '#EC4899', mood: 'Romantic' },
];

export const MUKA_CORAL = '#FF6B6B';
export const BG_CREAM = '#FFF9F5';
export const TEXT_DARK = '#2D2D2D';
export const TEXT_MEDIUM = '#666666';
