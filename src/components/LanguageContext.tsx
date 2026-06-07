import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. 定义支持的语言
export type Lang = 'en' | 'cn' | 'tw' | 'ko';

interface ILanguageContext {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

// 2. 创建 Provider，增加持久化逻辑
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // 初始化状态时，尝试从 localStorage 获取，默认为 'en'
  const [lang, setLangState] = useState<Lang>('en');

  // 组件加载时读取一次本地存储
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Lang;
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  // 修改 setLang，使其同时更新 localStorage
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

// 3. 导出钩子
export const useLanguage = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
