import { useScreenState } from 'src/contexts/ScreenProvider';
import { SwapContextProvider } from 'src/contexts/SwapContext';
import { IInit } from 'src/types';

import Header from '../components/Header';
import InitialScreen from './screens/InitialScreen';
import SwappingScreen from './screens/SwappingScreen';
import WalletScreen from './screens/WalletScreen';
import { BrandingProvider } from 'src/contexts/BrandingProvider';

const Content = () => {
  const { screen } = useScreenState();

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
      
      {/* 修改后的品牌文案 */}
      <span className="text-primary-text/50 text-xs p-2 flex-row flex gap-1 justify-center">
        MERDEX protects the safety of your assets
      </span>
    </div>
  );
};

const JupiterApp = (props: IInit) => {
  return (
    <SwapContextProvider {...props}>
      <BrandingProvider {...props}>
        <Content />
      </BrandingProvider>
    </SwapContextProvider>
  );
};

export default JupiterApp;
