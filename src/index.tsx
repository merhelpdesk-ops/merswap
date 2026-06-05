import { Provider, useAtom } from 'jotai';
import JupiterApp from './components/Jupiter';
import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';
import { appProps } from './library';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [props] = useAtom(appProps);
  if (!props) return null;

  // ==================== 核心收费逻辑注入 ====================
  const modifiedProps = {
    ...props,
    formProps: {
      ...props.formProps,
      // 自动读取你在 .env 中配置的费用账户 FEMAPsicokoUG22cxZ5SXppvgqcuwTm8DfHKpq8FvE2u
      referralAccount: process.env.NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT,
      // 严格设置为 30 基点（即收取 0.3% 的交易手续费）
      referralFee: 30,
    }
  };
  // ========================================================

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider {...modifiedProps}>
        <WalletPassthroughProvider>
          <ScreenProvider>
            <JupiterApp {...modifiedProps} />
          </ScreenProvider>
        </WalletPassthroughProvider>
      </ContextProvider>
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
