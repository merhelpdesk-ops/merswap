import { useUnifiedWalletContext, useUnifiedWallet } from '@jup-ag/wallet-adapter';
import React, { useCallback, useEffect, useState, memo } from 'react';
import JupButton from 'src/components/JupButton';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import { cn } from 'src/misc/cn';
import { WidgetPosition, WidgetSize } from 'src/types';

import { useFormContext, useWatch } from 'react-hook-form';

const WidgetPlugin = memo(() => {
  const { control } = useFormContext();
  const simulateWalletPassthrough = useWatch({ control, name: 'simulateWalletPassthrough' });
  const formProps = useWatch({ control, name: 'formProps' });
  const defaultExplorer = useWatch({ control, name: 'defaultExplorer' });
  const branding = useWatch({ control: control, name: 'branding' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState<WidgetPosition>('bottom-right');
  const [size, setSize] = useState<WidgetSize>('default');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const passthroughWalletContextState = useUnifiedWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const launchPlugin = useCallback(() => {
    window.Jupiter.init({
      displayMode: 'integrated',
      integratedTargetId: 'jupiter-plugin',
      formProps,
      enableWalletPassthrough: simulateWalletPassthrough,
      passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
      onRequestConnectWallet: () => setShowModal(true),
      defaultExplorer,
      branding,
    });
  }, [
    defaultExplorer,
    formProps,
    passthroughWalletContextState,
    setShowModal,
    simulateWalletPassthrough,
    branding,
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (!isLoaded || !window.Jupiter.init || !intervalId) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Jupiter.init));
      }, 500);
    }

    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [isLoaded]);

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded && Boolean(window.Jupiter.init)) {
        launchPlugin();
      }
    }, 200);
  }, [isLoaded, launchPlugin]);

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col ">
        <div className="relative mt-8 md:mt-0">
            <div className="bg-white/10 rounded-xl flex items-center justify-center w-full h-[216px]">
              <span className="text-xs text-white/50 text-center w-[70%]">
                Widget mode disabled. The swap box is now integrated into the container directly.
              </span>
            </div>
          </div>
      </div>

      <div>
        <div className="border-b border-white/10" />
      </div>
    </div>
  );
});

WidgetPlugin.displayName = 'WidgetPlugin';

export default WidgetPlugin;
