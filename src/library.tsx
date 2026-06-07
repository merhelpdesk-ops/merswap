import React, { useMemo } from 'react';
import { Provider, useAtom } from 'jotai';
import JupiterApp from './components/Jupiter';

// 🌟 精准引入你的 AppHeader 和 LanguageProvider 路径
import AppHeader from './components/AppHeader/AppHeader'; 
import { LanguageProvider } from './components/LanguageContext'; 

import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';

// 🌟 核心修复点：将 './library' 改为项目统一的 'src/library' 确保编译通过
import { appProps } from 'src/library'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [props] = useAtom(appProps);
  if (!props) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider {...props}>
        <WalletPassthroughProvider>
          <ScreenProvider>
            {/* 将大导航栏放入这里，显示在交易框上方 */}
            <AppHeader /> 
            
            <JupiterApp {...props} />
          </ScreenProvider>
        </WalletPassthroughProvider>
      </ContextProvider>
    </QueryClientProvider>
  );
};

const RenderJupiter = () => {
  return (
    // 用 LanguageProvider 包裹最外层
    <LanguageProvider>
      <Provider store={typeof window !== 'undefined' ? window.Jupiter.store : undefined}>
        <App />
      </Provider>
    </LanguageProvider>
  );
};

// 🌟 必须导出，保证全站不报错
export { RenderJupiter, appProps }; 
