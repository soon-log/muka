
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
}

export interface QuestionTemplate {
  id: string;
  text: string;
  type: 'relationship' | 'situation';
  emphasis: 'A' | 'B' | 'light' | 'serious';
}

export enum ThemeId {
  BRIGHT = 1,
  CALM = 2,
  DREAMY = 3,
  WARM = 4,
  RETRO = 5,
  EMOTIONAL = 6,
  ROMANTIC = 7
}

export interface CardTheme {
  id: ThemeId;
  name: string;
  bgColor: string;
  accentColor: string;
  mood: string;
}

export interface MukaContext {
  questionId: string;
  song?: Song;
  themeId?: ThemeId;
}
