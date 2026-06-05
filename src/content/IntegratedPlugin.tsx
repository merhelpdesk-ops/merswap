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
    const win = window as any;
    if (win.Jupiter?.init) {
      win.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'target-container',
        formProps,
        enableWalletPassthrough: simulateWalletPassthrough,
        passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
        onRequestConnectWallet: () => setShowModal(true),
        defaultExplorer,
        branding,
      });
    }
  }, [defaultExplorer, formProps, passthroughWalletContextState, setShowModal, simulateWalletPassthrough, branding]);

  useEffect(() => {
    const interval = setInterval(() => {
      const win = window as any;
      if (win.Jupiter?.init) {
        setIsLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoaded) launchPlugin();
  }, [isLoaded, launchPlugin]);

  useEffect(() => {
    if (!isLoaded) return;

    const replaceText = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent || '';
        if (text.includes('Customizable Options')) node.textContent = 'MERDEX top security';
        if (text.includes('Multiple display options and other configurations to match your application\'s needs.')) 
          node.textContent = 'MER DEX Provide you with an excellent experience through a variety of audited codes!';
        if (text.trim() === 'Swap fees') node.textContent = 'MER DEX';
        if (text.trim() === 'Earn swap fees easily.') node.textContent = 'MER DEX makes it easy for you to trade!';
      }
    };
    
    const obs = new MutationObserver(replaceText);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    replaceText();
    return () => obs.disconnect();
  }, [isLoaded]);

  return (
    <div className="w-full rounded-2xl text-white flex flex-col items-center mb-4 overflow-hidden">
      <div id="target-container" className="h-[555px] w-[360px] bg-black rounded-xl border border-white/10" />
    </div>
  );
});

IntegratedPlugin.displayName = 'IntegratedPlugin';
export default IntegratedPlugin;
