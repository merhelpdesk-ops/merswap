import React, { useMemo } from 'react';
import { Provider, useAtom } from 'jotai';
import JupiterApp from './components/Jupiter';

// 🌟 注意：这里精确引入了你的 AppHeader 和 LanguageProvider 路径
import AppHeader from './components/AppHeader/AppHeader'; 
import { LanguageProvider } from './components/LanguageContext'; 

import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';
import { appProps } from './library';
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
            {/* 🌟 将大导航栏放入这里，确保它显示在整个交易框的最上方 */}
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
    // 🌟 将多语言控制中心包裹在最外层，打通全站状态信号
    <LanguageProvider>
      <Provider store={typeof window !== 'undefined' ? window.Jupiter.store : undefined}>
        <App />
      </Provider>
    </LanguageProvider>
  );
};

export { RenderJupiter };
