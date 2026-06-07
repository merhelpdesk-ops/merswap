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

        {/* 语言切换按钮组，增加了更清晰的高亮和鼠标悬停效果 */}
        <div className="flex items-center space-x-4 text-sm">
          <button 
            type="button"
            onClick={() => setLang('en')} 
            className={`transition-colors cursor-pointer ${lang === 'en' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            English
          </button>
          <button 
            type="button"
            onClick={() => setLang('cn')} 
            className={`transition-colors cursor-pointer ${lang === 'cn' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            简体中文
          </button>
          <button 
            type="button"
            onClick={() => setLang('tw')} 
            className={`transition-colors cursor-pointer ${lang === 'tw' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            繁體中文
          </button>
          <button 
            type="button"
            onClick={() => setLang('ko')} 
            className={`transition-colors cursor-pointer ${lang === 'ko' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            한국어
          </button>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
