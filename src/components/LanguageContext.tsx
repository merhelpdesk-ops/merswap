import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'cn' | 'tw' | 'ko';

interface ILanguageContext {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  
  const [lang, setLangState] = useState<Lang>('en');

  
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Lang;
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);


  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
