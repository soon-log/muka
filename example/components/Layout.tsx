
import React from 'react';
import { MUKA_CORAL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  showLogo?: boolean;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, header, showLogo = true, onBack }) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#FFF9F5]">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-xl flex flex-col relative overflow-hidden">
        {header ? header : (
          showLogo && (
            <div className="pt-8 pb-4 px-6 flex justify-center items-center bg-white z-10 relative">
              {onBack && (
                <button 
                  onClick={onBack} 
                  className="absolute left-6 p-2 text-2xl text-[#2D2D2D] hover:opacity-70 active:scale-95 transition-all"
                  aria-label="Back"
                >
                  ←
                </button>
              )}
              <span className="text-3xl font-black tracking-tighter" style={{ color: MUKA_CORAL }}>muka</span>
            </div>
          )
        )}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
