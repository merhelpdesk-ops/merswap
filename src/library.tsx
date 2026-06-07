import React, { useMemo } from 'react';
import { Provider, useAtom } from 'jotai';
import { atom } from 'jotai'; // 引入 atom 确保 appProps 能够被创建
import JupiterApp from './components/Jupiter';

// 🌟 精准引入你的 AppHeader 和 LanguageProvider 路径
import AppHeader from './components/AppHeader/AppHeader'; 
import { LanguageProvider } from './components/LanguageContext'; 

import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🌟 核心修复点：不从外部 import，而是直接在本地定义并导出 appProps，彻底解除全站的编译死锁
export const appProps = atom<any>(null);

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [props] = useAtom(appProps);
  if (!props) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider {...props}>
        <WalletPassthroughProvider>
          <ScreenProvider>
            {/* 将大导航栏放入这里，显示在交易框正上方 */}
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
    // 用 LanguageProvider 包裹最外层打通信号
    <LanguageProvider>
      <Provider store={typeof window !== 'undefined' ? window.Jupiter.store : undefined}>
        <App />
      </Provider>
    </LanguageProvider>
  );
};

export { RenderJupiter };
