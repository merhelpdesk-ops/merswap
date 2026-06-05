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

    // 核心重写：深度优先递归穿透所有潜在的 Shadow DOM 节点
    const findAndReplaceText = (currentRoot: Document | ShadowRoot | HTMLElement) => {
      // 1. 获取当前层级下的所有子元素
      const allElements = currentRoot.querySelectorAll('*');
      
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;

        // 2. 检查是否有子 Shadow DOM，如果有，递归钻进去
        if (htmlEl.shadowRoot) {
          findAndReplaceText(htmlEl.shadowRoot);
        }

        // 3. 处理 "Powered by" 文字及图标隐藏
        if (htmlEl.textContent && htmlEl.textContent.includes('Powered by')) {
          htmlEl.textContent = 'MER DEX protects your assets';
          if (htmlEl.parentElement) {
            const icons = htmlEl.parentElement.querySelectorAll('svg, img');
            icons.forEach(icon => ((icon as HTMLElement).style.display = 'none'));
          }
        }

        // 4. 精准捕获并强制修改 Ultra Swap 的核心描述文案
        if (htmlEl.textContent && htmlEl.textContent.includes('Seamlessly integrate')) {
          // 清空子元素直接赋文本内容，防止由于内部标签导致匹配断开
          htmlEl.innerText = 'Aggregate multi-DEX services and capture token information MER DEX provides you with a safe and efficient trading experience!';
        }
      });
    };

    // 监听整个文档和插件容器的树形变化，确保在加载、切页、异步渲染时文字随时被捕获替换
    const observer = new MutationObserver(() => {
      findAndReplaceText(document);
    });

    observer.observe(targetContainer, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
    
    // 初始化时立刻执行一次
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
