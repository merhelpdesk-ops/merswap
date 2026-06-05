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
    if (intervalId) return () => clearInterval(intervalId);
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

    // 安全深度替换：只修改叶子节点文本，不破坏 HTML 节点和布局
    const findAndReplaceText = (currentRoot: Document | ShadowRoot | HTMLElement) => {
      const allElements = currentRoot.querySelectorAll('*');
      
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;

        // 穿透子 Shadow DOM (采用类型安全的方式，解决 pnpm build 报错问题)
        if (htmlEl.shadowRoot) {
          findAndReplaceText(htmlEl.shadowRoot);
        }

        // 1. 处理 Powered by
        if (htmlEl.textContent && htmlEl.textContent.includes('Powered by')) {
          // 只改动没有任何子元素的纯文本标签，防止顺带删掉外部大盒子
          if (htmlEl.children.length === 0) {
            htmlEl.textContent = 'MER DEX protects your assets';
          }
          if (htmlEl.parentElement) {
            const icons = htmlEl.parentElement.querySelectorAll('svg, img');
            icons.forEach(icon => ((icon as HTMLElement).style.display = 'none'));
          }
        }

        // 2. 处理 Ultra Swap 描述文案
        if (htmlEl.textContent && htmlEl.textContent.includes('Seamlessly integrate')) {
          // 核心修正：仅当它是一个最底层的纯文本容器时，才改写内容，确保不破坏包裹它的 UI 样式
          if (htmlEl.children.length === 0) {
            htmlEl.textContent = 'Aggregate multi-DEX services and capture token information MER DEX provides you with a safe and efficient trading experience!';
          }
        }
      });
    };

    const observer = new MutationObserver(() => {
      findAndReplaceText(document);
    });

    observer.observe(targetContainer, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
    
    findAndReplaceText(document);

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
          <div id="target-container" className={`flex h-full w-full overflow-auto justify-center bg-black rounded-xl border border-white/10 ${!isLoaded ? 'hidden' : ''}`} />
        </div>
      </div>
    </div>
  );
});

IntegratedPlugin.displayName = 'IntegratedPlugin';
export default IntegratedPlugin;
