import React, { useCallback, useEffect, useState, memo } from 'react';
import { useUnifiedWallet, useUnifiedWalletContext } from '@jup-ag/wallet-adapter';
import { useFormContext, useWatch } from 'react-hook-form';

const IntegratedPlugin = memo(() => {
  const { control } = useFormContext();
  const simulateWalletPassthrough = useWatch({ control, name: 'simulateWalletPassthrough' });
  const formProps = useWatch({ control, name: 'formProps' });
  const defaultExplorer = useWatch({ control, name: 'defaultExplorer' });
  const branding = useWatch({ control: control, name: 'branding' });
  const [isLoaded, setIsLoaded] = useState(false);

  const passthroughWalletContextState = useUnifiedWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const launchPlugin = useCallback(async () => {
    window.Jupiter.init({
      displayMode: 'integrated',
      integratedTargetId: 'target-container',

      formProps,
      enableWalletPassthrough: simulateWalletPassthrough,
      passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
      onRequestConnectWallet: () => setShowModal(true),
      defaultExplorer,
      branding,
    });
  }, [defaultExplorer, formProps, passthroughWalletContextState, setShowModal, simulateWalletPassthrough, branding]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (!isLoaded || !window.Jupiter.init) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Jupiter.init));
      }, 100);
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
    }, 100);
  }, [isLoaded, simulateWalletPassthrough, launchPlugin]);

  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState]);

  useEffect(() => {
    if (!isLoaded) return;

    const targetContainer = document.getElementById('target-container');
    if (!targetContainer) return;

    const replacePoweredByText = () => {
      const elements = targetContainer.querySelectorAll('span, div, p');
      elements.forEach((el) => {
        if (el.textContent && el.textContent.includes('Powered by')) {
          el.textContent = 'MER DEX protects your assets';
          
          const siblingSvg = el.parentElement?.querySelector('svg');
          if (siblingSvg) {
            siblingSvg.style.display = 'none';
          }
          const siblingImg = el.parentElement?.querySelector('img');
          if (siblingImg) {
            siblingImg.style.display = 'none';
          }
        }

        if (el.textContent && el.textContent.includes('Seamlessly integrate end to end jup.ag swap experience with all Ultra features')) {
          el.textContent = 'Aggregate multi-DEX services and capture token information MER DEX provides you with a safe and efficient trading experience!';
        }
      });
    };

    const observer = new MutationObserver(() => {
      replacePoweredByText();
    });

    observer.observe(targetContainer, {
      childList: true,
      subtree: true,
    });

    replacePoweredByText();

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <div className="w-full rounded-2xl text-white flex flex-col items-center mb-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className="rounded-xl overflow-hidden flex justify-center h-[555px] w-[360px]">
          {!isLoaded ? (
            <div className="h-full animate-pulse mt-4 lg:mt-0 lg:ml-4 flex items-center justify-center rounded-xl">
              <p>Loading...</p>
            </div>
          ) : null}

          <div
            id="target-container"
            className={`flex h-full w-full overflow-auto justify-center bg-black rounded-xl border border-white/10 ${!isLoaded ? 'hidden' : ''}`}
          />
        </div>
      </div>
    </div>
  );
});

IntegratedPlugin.displayName = 'IntegratedPlugin';

export default IntegratedPlugin;
