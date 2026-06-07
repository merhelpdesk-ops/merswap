import { Provider, useAtom } from 'jotai';
import JupiterApp from './components/Jupiter';
import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';
import { LanguageProvider } from './contexts/LanguageContext'; // 1. 引入 Provider
import { appProps } from './library';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [props] = useAtom(appProps);
  if (!props) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* 2. 在这里包裹 LanguageProvider，确保全站共享语言状态 */}
      <LanguageProvider>
        <ContextProvider {...props}>
          <WalletPassthroughProvider>
            <ScreenProvider>
              <JupiterApp {...props} />
            </ScreenProvider>
          </WalletPassthroughProvider>
        </ContextProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

const RenderJupiter = () => {
  return (
    <Provider store={typeof window !== 'undefined' ? window.Jupiter.store : undefined}>
      <App />
    </Provider>
  );
};

export { RenderJupiter };
