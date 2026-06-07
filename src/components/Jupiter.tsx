import { useScreenState } from 'src/contexts/ScreenProvider';
import { SwapContextProvider } from 'src/contexts/SwapContext';
import { IInit } from 'src/types';

import Header from '../components/Header';
import InitialScreen from './screens/InitialScreen';
import SwappingScreen from './screens/SwappingScreen';
import WalletScreen from './screens/WalletScreen';
import { BrandingProvider } from 'src/contexts/BrandingProvider';

// 🌟 1. 仅引入多语言状态核心，不乱加原本不存在的导航条组件
import { LanguageProvider, useLanguage } from './LanguageContext'; 

const Content = () => {
  const { screen } = useScreenState();
  
  // 🌟 2. 顺畅拿到当前的语言（en, cn, tw, ko）
  const { lang } = useLanguage(); 

  // 🌟 3. 让最底部的安全提示文案也支持多语言
  const textMap: Record<string, { brand: string }> = {
    en: {
      brand: 'MERDEX protects the safety of your assets',
    },
    cn: {
      brand: 'MERDEX 保护您的资产安全',
    },
    tw: {
      brand: 'MERDEX 保護您的資產安全',
    },
    ko: {
      brand: 'MERDEX는 귀하의 자산 안전을 보호합니다',
    }
  };

  // ID is required for scoped preflight by tailwind to work
  return (
    <div id="jupiter-plugin" className=" h-full bg-background relative flex flex-col justify-between">
      <div>
        {screen === 'Initial' ? (
          <>
            <Header />
            <InitialScreen />
          </>
        ) : null}
        {screen === 'Swapping' ? <SwappingScreen /> : null}
        {screen === 'Wallet' ? <WalletScreen /> : null}
      </div>
      
      {/* 🌟 4. 底部安全文案完美绑定语言切换 */}
      <span className="text-primary-text/50 text-xs p-2 flex-row flex gap-1 justify-center">
        {textMap[lang]?.brand || textMap['en'].brand}
      </span>
    </div>
  );
};

const JupiterApp = (props: IInit) => {
  return (
    // 🌟 5. 把 LanguageProvider 牢牢包裹在最外层，向下游所有组件（Form、SubmitButton）源源不断地输送语言信号
    <LanguageProvider>
      <SwapContextProvider {...props}>
        <BrandingProvider {...props}>
          <Content />
        </BrandingProvider>
      </SwapContextProvider>
    </LanguageProvider>
  );
};

export default JupiterApp;
