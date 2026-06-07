import React, { useEffect, useState } from 'react';

interface AppHeaderProps {
  isSideDrawerOpen?: boolean;
  setIsSideDrawerOpen?: (isOpen: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [lang, setLang] = useState<'en' | 'ko' | 'zh'>('en');

  const handleToggleMenu = () => setOpenMobileMenu(!openMobileMenu);

  const switchLanguage = (newLang: 'en' | 'ko' | 'zh') => {
    setLang(newLang);
    window.dispatchEvent(new CustomEvent('langChange', { detail: newLang }));
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (openMobileMenu) {
      body!.style.overflow = 'hidden';
    } else {
      body!.style.overflow = '';
    }
  }, [openMobileMenu]);

  return (
    <>
      <div className="flex items-center justify-between w-full bg-landing-bg p-4">
        <div className="flex items-center">
          <h1 className="flex items-center text-lg font-semibold text-white">
            <span className="ml-3">MERHelpDesk</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-white/50">
          <button 
            onClick={() => switchLanguage('en')} 
            className={lang === 'en' ? 'text-white font-bold' : ''}
          >
            EN
          </button>
          <span>|</span>
          <button 
            onClick={() => switchLanguage('ko')} 
            className={lang === 'ko' ? 'text-white font-bold' : ''}
          >
            KO
          </button>
          <span>|</span>
          <button 
            onClick={() => switchLanguage('zh')} 
            className={lang === 'zh' ? 'text-white font-bold' : ''}
          >
            ZH
          </button>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
