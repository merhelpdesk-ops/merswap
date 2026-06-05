import React, { useEffect } from 'react';
import { useUnifiedWalletContext, useUnifiedWallet } from '@jup-ag/wallet-adapter';
import WalletDisconnectedGraphic from 'src/icons/WalletDisconnectedGraphic';
import { useFormContext, useWatch } from 'react-hook-form';

const ModalPlugin = () => {
  const { control } = useFormContext();
  const simulateWalletPassthrough = useWatch({ control, name: 'simulateWalletPassthrough' });
  const formProps = useWatch({ control, name: 'formProps' });
  const defaultExplorer = useWatch({ control, name: 'defaultExplorer' });
  const branding = useWatch({ control: control, name: 'branding' });

  const passthroughWalletContextState = useUnifiedWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const launchPlugin = () => {
    window.Jupiter.init({
      formProps,
      enableWalletPassthrough: simulateWalletPassthrough,
      passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
      onRequestConnectWallet: () => setShowModal(true),
      defaultExplorer,
      branding,
    });
  };

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState]);

  // 监听全局 Body，当 Modal 弹窗蹦出来时，强行抓取并替换里面的 Powered by 文字
  useEffect(() => {
    const replacePoweredByText = () => {
      const elements = document.querySelectorAll('span, div, p');
      elements.forEach((el) => {
        if (el.textContent && (el.textContent.includes('Powered by') || el.textContent.includes('Jupiter'))) {
          // 如果是没有子标签的纯文字节点，直接替换内容
          if (el.children.length === 0 || el.tagName === 'SPAN') {
            el.textContent = 'MER DEX protects your assets';
          }
          // 隐藏旁边可能附带的官方 SVG 图标
          const siblingSvg = el.parentElement?.querySelector('svg');
          if (siblingSvg) siblingSvg.style.display = 'none';
          const siblingImg = el.parentElement?.querySelector('img');
          if (siblingImg) siblingImg.style.display = 'none';
        }
      });
    };

    // 持续监听 DOM 变化（因为弹窗是点击后动态生成的）
    const observer = new MutationObserver(() => {
      replacePoweredByText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    replacePoweredByText();

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="p-4 hover:bg-white/10 rounded-xl cursor-pointer flex h-full w-full flex-col items-center justify-center text-white"
      onClick={launchPlugin}
    >
      {/* 注入全局样式兜底，确保在 Modal 弹窗里彻底将“Powered by”转换为目标文案并防止样式闪烁 */}
      <style dangerouslySetInnerHTML={{__html: `
        div[class*="powered"] div, 
        div[class*="powered"] span,
        span[class*="powered"], 
        div:has(> span:contains('Powered by')) {
          visibility: hidden !important;
          position: relative;
        }
        span[class*="powered"]::after, 
        div[class*="powered"]::after {
          content: "MER DEX protects your assets" !important;
          visibility: visible !important;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          text-align: center;
          color: #9D9DA6;
          font-size: 12px;
        }
        div[class*="powered"] svg,
        span[class*="powered"] svg {
          display: none !important;
        }
      `}} />
      <WalletDisconnectedGraphic />
      <span className="text-xs mt-4">Launch Plugin Modal</span>
    </div>
  );
};

export default ModalPlugin;
