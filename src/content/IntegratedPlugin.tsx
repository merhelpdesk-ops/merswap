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

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState]);

  // 核心逻辑：动态监听并强制替换底层渲染的文字
  useEffect(() => {
    if (!isLoaded) return;

    const targetContainer = document.getElementById('target-container');
    if (!targetContainer) return;

    // 定义替换文字的函数
    const replacePoweredByText = () => {
      // 遍历容器内所有包含 "Powered by" 的节点
      const elements = targetContainer.querySelectorAll('span, div, p');
      elements.forEach((el) => {
        if (el.textContent && el.textContent.includes('Powered by')) {
          // 1. 替换文字内容
          el.textContent = 'MER DEX protects your assets';
          
          // 2. 尝试隐藏或美化文字旁边自带的 Jupiter 圆形 Logo 图标
          const siblingSvg = el.parentElement?.querySelector('svg');
          if (siblingSvg) {
            siblingSvg.style.display = 'none';
          }
          const siblingImg = el.parentElement?.querySelector('img');
          if (siblingImg) {
            siblingImg.style.display = 'none';
          }
        }
      });
    };

    // 开启页面节点监听器，防止组件内部重绘将文字又闪现变回 Jupiter
    const observer = new MutationObserver(() => {
      replacePoweredByText();
    });

    observer.observe(targetContainer, {
      childList: true,
      subtree: true,
    });

    // 首次加载先执行一次
    replacePoweredByText();

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <div className=" w-full rounded-2xl text-white flex flex-col items-center  mb-4 overflow-hidden  ">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className=" rounded-xl overflow-hidden flex justify-center  h-[555px] w-[360px]">
          {/* Loading state */}
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
