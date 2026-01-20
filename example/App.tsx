
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from './components/Layout';
import { MusicCard } from './components/MusicCard';
import { QUESTIONS, THEMES, MUKA_CORAL, TEXT_MEDIUM } from './constants';
import { Song, ThemeId, CardTheme } from './types';
import { searchMusic } from './services/geminiService';

// Flow: LANDING -> CHOOSE_QUESTION -> SEARCH -> CUSTOMIZE -> VIEW (Share/Result)
type Page = 'LANDING' | 'CHOOSE_QUESTION' | 'SEARCH' | 'CUSTOMIZE' | 'VIEW';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('LANDING');
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentTheme, setCurrentTheme] = useState<CardTheme>(THEMES[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRequestMode, setIsRequestMode] = useState(false);

  // Initial load and hash handling
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      
      if (hash.startsWith('view/')) {
        const [_, qId, sId, tId] = hash.split('/');
        const q = QUESTIONS.find(x => x.id === qId) || QUESTIONS[0];
        const t = THEMES.find(x => x.id === Number(tId)) || THEMES[0];
        const mockSong: Song = {
          id: sId,
          title: 'Selected Vibe',
          artist: 'Special Friend',
          albumCover: `https://picsum.photos/seed/${sId}/400/400`
        };
        setSelectedQuestion(q);
        setCurrentTheme(t);
        setSelectedSong(mockSong);
        setPage('VIEW');
      } else if (hash.startsWith('search/')) {
        const qId = hash.split('/')[1];
        setSelectedQuestion(QUESTIONS.find(x => x.id === qId) || QUESTIONS[0]);
        setIsRequestMode(true);
        setPage('LANDING'); // Always start at Landing as requested
      } else {
        setIsRequestMode(false);
        setPage('LANDING');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    const results = await searchMusic(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery]);

  const startFlow = () => {
    if (isRequestMode) {
      setPage('SEARCH');
    } else {
      setPage('CHOOSE_QUESTION');
    }
  };

  const handleQuestionSelect = (qId: string) => {
    setSelectedQuestion(QUESTIONS.find(x => x.id === qId) || QUESTIONS[0]);
    setPage('SEARCH');
  };

  const navigateToCustomize = (song: Song) => {
    setSelectedSong(song);
    setPage('CUSTOMIZE');
  };

  const shareResult = () => {
    if (!selectedQuestion || !selectedSong || !currentTheme) return;
    const shareLink = `${window.location.origin}/#view/${selectedQuestion.id}/${selectedSong.id}/${currentTheme.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
        alert(`카드 링크가 복사되었습니다!\n친구에게 보여주세요!`);
    });
  };

  const renderLanding = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-[#FFF9F5] pb-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-[80px] font-black tracking-tighter leading-none mb-8" style={{ color: MUKA_CORAL }}>muka</h1>
        <div className="space-y-1">
          {isRequestMode ? (
            <>
              <p className="text-xl text-[#2D2D2D] font-bold opacity-70">친구가 당신에게</p>
              <p className="text-xl text-[#2D2D2D] font-bold opacity-70">음악을 추천받고 싶어해요.</p>
            </>
          ) : (
            <>
              <p className="text-xl text-[#2D2D2D] font-bold opacity-70">알고리즘이 아닌,</p>
              <p className="text-xl text-[#2D2D2D] font-bold opacity-70">친구가 골라준 진짜 음악.</p>
            </>
          )}
        </div>
      </div>
      
      <button 
        onClick={startFlow}
        className="w-full bg-[#FF6B6B] text-white py-5 rounded-[20px] text-xl font-bold shadow-xl shadow-orange-100 hover:brightness-105 active:scale-95 transition-all"
      >
        {isRequestMode ? "음악 골라주기" : "시작하기"}
      </button>
    </div>
  );

  const renderChooseQuestion = () => (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-8 mt-2 text-[#2D2D2D]">어떤 음악을 선물할까요?</h2>
      <div className="flex flex-col gap-3">
        {QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => handleQuestionSelect(q.id)}
            className="w-full bg-white border border-[#F0F0F0] p-5 rounded-2xl text-left hover:border-[#FF6B6B] hover:bg-orange-50 transition-all flex justify-between items-center group active:scale-[0.98]"
          >
            <span className="text-lg font-medium text-[#2D2D2D]">{q.text}</span>
            <span className="text-xl text-[#999999] group-hover:translate-x-1 group-hover:text-[#FF6B6B] transition-all">→</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="p-6 pt-2">
      <div className="mb-8">
        <p className="text-[#FF6B6B] font-bold text-xs uppercase tracking-widest mb-1">Selected Topic</p>
        <h2 className="text-2xl font-bold text-[#2D2D2D] leading-tight">{selectedQuestion.text}</h2>
      </div>
      
      <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="음악 제목 또는 아티스트 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-[#F5F5F5] border border-transparent focus:border-[#FF6B6B] focus:bg-white rounded-full px-8 py-4 outline-none transition-all pr-14 text-lg"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#999999] text-xl"
          >
            🔍
          </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] no-scrollbar">
        {isSearching && <p className="text-center text-[#999999]">Searching music...</p>}
        {!isSearching && searchResults.map((song) => (
          <div 
            key={song.id} 
            onClick={() => navigateToCustomize(song)}
            className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 cursor-pointer active:scale-[0.98] transition-all"
          >
            <img src={song.albumCover} className="w-16 h-16 rounded-lg object-cover shadow-sm" alt={song.title} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate text-[#2D2D2D]">{song.title}</h3>
              <p className="text-sm text-[#999999] truncate">{song.artist}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#EEE] flex items-center justify-center text-xl text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">+</div>
          </div>
        ))}
        {!isSearching && searchQuery && searchResults.length === 0 && (
          <p className="text-center text-[#999999] py-10">결과가 없어요. 다른 키워드로 검색해보세요!</p>
        )}
      </div>
    </div>
  );

  const renderCustomize = () => {
    if (!selectedSong) return null;
    return (
      <div className="flex-1 flex flex-col h-full px-6 pb-6">
          <div className="shrink-0 py-4 text-center">
             <h3 className="text-lg font-bold text-[#2D2D2D]">마음에 드는 분위기를 골라보세요</h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-0 py-2">
             <div className="w-full max-w-[280px] h-full flex items-center justify-center">
                <MusicCard song={selectedSong} theme={currentTheme} questionText={selectedQuestion.text} />
             </div>
          </div>

          <div className="shrink-0 flex flex-col gap-5 mt-2">
              <div className="flex gap-3 overflow-x-auto w-full no-scrollbar px-1 py-1 justify-center">
                  {THEMES.map((t) => (
                      <button
                          key={t.id}
                          onClick={() => setCurrentTheme(t)}
                          className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${currentTheme.id === t.id ? 'border-[#FF6B6B] scale-110 shadow-md' : 'border-transparent'}`}
                          style={{ backgroundColor: t.bgColor }}
                      />
                  ))}
              </div>

              <button 
                onClick={shareResult}
                className="w-full bg-[#FFEB3B] text-black py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <span className="text-2xl">💬</span> 카카오톡으로 전송하기
              </button>
          </div>
      </div>
    );
  };

  const renderView = () => {
    if (!selectedSong) return null;
    return (
      <div className="flex flex-col h-full bg-[#FFF9F5] p-6 overflow-y-auto no-scrollbar">
        <header className="flex justify-between items-center mb-8">
            <button onClick={() => { window.location.hash = ''; setPage('LANDING'); }} className="text-2xl">←</button>
            <span className="font-bold tracking-widest text-[#999999]">RECEIVED VIBE</span>
            <div className="text-2xl">•••</div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-[300px] mb-8">
                <MusicCard song={selectedSong} theme={currentTheme} questionText={selectedQuestion.text} />
            </div>
            
            <div className="w-full max-w-[300px] flex flex-col gap-3">
                <button className="w-full bg-[#FF6B6B] text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all">
                    <span>▶</span> 음악 감상하기
                </button>
                <button className="w-full bg-white border border-[#F0F0F0] text-[#666666] py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <span>📥</span> 이미지로 저장
                </button>
            </div>
            
            <p className="mt-8 text-xs text-[#999999] uppercase tracking-widest">Preview mode • Theme {currentTheme.id}</p>
        </div>
      </div>
    );
  };

  const backAction = useMemo(() => {
    if (page === 'CHOOSE_QUESTION') return () => setPage('LANDING');
    if (page === 'SEARCH') return () => {
        if (isRequestMode) setPage('LANDING');
        else setPage('CHOOSE_QUESTION');
    };
    if (page === 'CUSTOMIZE') return () => setPage('SEARCH');
    return undefined;
  }, [page, isRequestMode]);

  return (
    <Layout 
      showLogo={page !== 'VIEW' && page !== 'LANDING'} 
      onBack={backAction}
    >
      {page === 'LANDING' && renderLanding()}
      {page === 'CHOOSE_QUESTION' && renderChooseQuestion()}
      {page === 'SEARCH' && renderSearch()}
      {page === 'CUSTOMIZE' && renderCustomize()}
      {page === 'VIEW' && renderView()}
    </Layout>
  );
};

export default App;
