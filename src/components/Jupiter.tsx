import { useScreenState } from 'src/contexts/ScreenProvider';
import { SwapContextProvider } from 'src/contexts/SwapContext';
import { IInit } from 'src/types';

import Header from '../components/Header';
import InitialScreen from './screens/InitialScreen';
import SwappingScreen from './screens/SwappingScreen';
import WalletScreen from './screens/WalletScreen';
import { BrandingProvider } from 'src/contexts/BrandingProvider';

// 🌟 1. 成功引入大导航栏和多语言 Provider（注意路径已为您调至完美）
import AppHeader from './AppHeader/AppHeader'; 
import { LanguageProvider } from './LanguageContext'; 

const Content = () => {
  const { screen } = useScreenState();

  return (
    <div id="jupiter-plugin" className=" h-full bg-background relative flex flex-col justify-between">
      <div>
        {/* 🌟 2. 在这里渲染大导航栏，让它雷打不动地出现在最顶端 */}
        <AppHeader />

        {screen === 'Initial' ? (
          <>
            <Header />
            <InitialScreen />
          </>
        ) : null}
        {screen === 'Swapping' ? <SwappingScreen /> : null}
        {screen === 'Wallet' ? <WalletScreen /> : null}
      </div>
      
      {/* 修改后的品牌文案 */}
      <span className="text-primary-text/50 text-xs p-2 flex-row flex gap-1 justify-center">
        MERDEX protects the safety of your assets
      </span>
    </div>
  );
};

const JupiterApp = (props: IInit) => {
  return (
    // 🌟 3. 用 LanguageProvider 完美包覆最外层，注入全局多语言信号
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
