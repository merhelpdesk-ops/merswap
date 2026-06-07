import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义支持的语言
export type Lang = 'en' | 'cn' | 'tw' | 'ko';

// 定义 Context 的数据结构
interface ILanguageContext {
  lang: Lang;
  setLang: (l: Lang) => void;
}

// 创建上下文，明确泛型
const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

// 创建 Provider
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en'); 
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 创建钩子
export const useLanguage = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
