import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. 定义支持的语言类型
export type Lang = 'en' | 'cn' | 'tw' | 'ko';

interface ILanguageContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  isReady: boolean; // 用于确保客户端初始化完成
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

// 2. Provider 组件
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取语言设置
    const savedLang = localStorage.getItem('lang') as Lang;
    if (savedLang && ['en', 'cn', 'tw', 'ko'].includes(savedLang)) {
      setLangState(savedLang);
    }
    setIsReady(true);
  }, []);

  // 修改语言并触发即时渲染
  const setLang = (l: Lang) => {
    setLangState(l); // 这一行是触发 UI 实时更新的关键
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. 自定义 Hook
export const useLanguage = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
