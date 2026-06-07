import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface AppHeaderProps {
  isSideDrawerOpen?: boolean;
  setIsSideDrawerOpen?: (isOpen: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      if (openMobileMenu) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
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

        <div className="flex items-center space-x-3 text-sm text-white">
          <button 
            onClick={() => setLang('en')} 
            className={lang === 'en' ? 'text-white font-bold' : 'text-gray-400'}
          >
            English
          </button>
          <button 
            onClick={() => setLang('cn')} 
            className={lang === 'cn' ? 'text-white font-bold' : 'text-gray-400'}
          >
            简体中文
          </button>
          <button 
            onClick={() => setLang('tw')} 
            className={lang === 'tw' ? 'text-white font-bold' : 'text-gray-400'}
          >
            繁體中文
          </button>
          <button 
            onClick={() => setLang('ko')} 
            className={lang === 'ko' ? 'text-white font-bold' : 'text-gray-400'}
          >
            한국어
          </button>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
