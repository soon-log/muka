
import React from 'react';
import { Song, CardTheme } from '../types';
import { MUKA_CORAL } from '../constants';

interface MusicCardProps {
  song: Song;
  theme: CardTheme;
  questionText: string;
  senderName?: string;
}

export const MusicCard: React.FC<MusicCardProps> = ({ song, theme, questionText, senderName }) => {
  return (
    <div 
      className="w-full aspect-[9/13] rounded-[32px] p-6 flex flex-col shadow-2xl relative overflow-hidden transition-all"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl mix-blend-multiply" style={{ backgroundColor: theme.accentColor }} />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-20 blur-3xl mix-blend-multiply" style={{ backgroundColor: theme.accentColor }} />

      {/* Question */}
      <div className="z-10 mt-1 mb-5">
        <p className="text-[#2D2D2D] text-[15px] font-medium leading-relaxed opacity-80 break-keep">
          {questionText}
        </p>
      </div>

      {/* Album Cover - Clean Rounded Square */}
      <div className="relative z-10 w-full aspect-square rounded-2xl overflow-hidden shadow-lg mb-5 bg-white/20 ring-1 ring-black/5">
        <img src={song.albumCover} alt={song.title} className="w-full h-full object-cover" />
      </div>

      {/* Song Info */}
      <div className="z-10 mt-auto">
        <h2 className="text-2xl font-bold truncate text-[#2D2D2D] mb-1 leading-tight tracking-tight">{song.title}</h2>
        <p className="text-base text-[#2D2D2D] opacity-60 truncate font-medium">{song.artist}</p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-between items-center z-10 border-t border-black/5 pt-4">
        <div className="flex items-center gap-2">
            <div className="bg-[#2D2D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">FROM</div>
            <span className="text-sm font-bold text-[#2D2D2D]">{senderName || 'B'}</span>
        </div>
        <span className="text-xl font-black tracking-tighter" style={{ color: MUKA_CORAL }}>muka</span>
      </div>
    </div>
  );
};
