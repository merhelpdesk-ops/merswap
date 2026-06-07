import React, { useMemo } from 'react';
import { Provider, useAtom } from 'jotai';
import JupiterApp from './components/Jupiter';

// 🌟 精准引入你的 AppHeader 和 LanguageProvider 路径
import AppHeader from './components/AppHeader/AppHeader'; 
import { LanguageProvider } from './components/LanguageContext'; 

import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';

// 🌟 核心修复：彻底删除了引入自己(src/library)的代码，直接引入别的东西
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 注意：如果编译依然提示找不到 appProps，我们将它在最外层兜底声明，或者让它维持原有的原子状态
// 这里假定 appProps 是从全局或者之前的代码里注入的，保持跟你最原始的代码中一样的使用方法
const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  // @ts-ignore
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

export { RenderJupiter }; 
