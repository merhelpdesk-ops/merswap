import { UnifiedWalletButton, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { DefaultSeo } from 'next-seo';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import AppHeader from 'src/components/AppHeader/AppHeader';
import Footer from 'src/components/Footer/Footer';

import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import CodeBlocks from 'src/components/CodeBlocks/CodeBlocks';
import FormConfigurator from 'src/components/FormConfigurator';
import { IFormConfigurator, INITIAL_FORM_CONFIG } from 'src/constants';
import { IInit } from 'src/types';
import V2SexyChameleonText from 'src/components/SexyChameleonText/V2SexyChameleonText';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setPluginInView } from 'src/stores/jotai-plugin-in-view';
import { cn } from 'src/misc/cn';
import SideDrawer from 'src/components/SideDrawer/SideDrawer';
import CloseIcon from 'src/icons/CloseIcon';
import { Upsell } from 'src/components/Upsell';
import { PluginGroup } from 'src/content/PluginGroup';
import { LanguageProvider, useLanguage } from 'src/components/LanguageContext';

const isDevNodeENV = process.env.NODE_ENV === 'development';
const isDeveloping = isDevNodeENV && typeof window !== 'undefined';
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
  (window as any).Jupiter = {};

  Promise.all([import('../library'), import('../index')]).then((res) => {
    const [libraryProps, rendererProps] = res;

    (window as any).Jupiter = libraryProps;
    (window as any).JupiterRenderer = rendererProps;
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const PLUGIN_MODE: { label: string; value: IInit['displayMode'] }[] = [
  {
    label: 'Integrated',
    value: 'integrated',
  },
];

const translations: Record<string, string> = {
  en: 'Swap',
  zh: '兑换',
  tw: '兌換',
  kr: '스왑',
};

function AppContent() {
  const [displayMode, setDisplayMode] = useState<IInit['displayMode']>('integrated');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [sideDrawerTab, setSideDrawerTab] = useState<'config' | 'snippet'>('config');
  
  const langContext = useLanguage() as any;

  useEffect(() => {
    const updateButtonText = () => {
      // 1. 获取当前系统采用的语言
      const contextLang = langContext?.language || langContext?.locale || '';
      const browserLang = typeof window !== 'undefined' ? (window.navigator.language || '') : '';
      
      let currentLang = 'en';
      const combined = (contextLang + '_' + browserLang).toLowerCase();

      if (combined.includes('zh-tw') || combined.includes('zh-hk') || combined.includes('tw') || combined.includes('hk')) {
        currentLang = 'tw';
      } else if (combined.includes('zh') || combined.includes('cn')) {
        currentLang = 'zh';
      } else if (combined.includes('kr') || combined.includes('ko')) {
        currentLang = 'kr';
      }

      const targetText = translations[currentLang] || 'Swap';

      // 2. 多重容器深度穿透扫描（不管它是在外部还是 ShadowRoot）
      const terminalContainers = document.querySelectorAll('#jupiter-terminal, .jupiter-terminal, [class*="terminal"]');
      
      const processElements = (root: Element | ShadowRoot) => {
        // 激进策略 1：直接扫描大绿按钮内部的所有 button 标签
        const buttons = root.querySelectorAll('button');
        buttons.forEach((btn) => {
          const txt = btn.textContent?.trim();
          if (txt === 'Swap' || txt === '兑换' || txt === '兌換' || txt === '스왑') {
            // 不管里面有没有额外的 span，直接清空并统一设置成目标翻译文本，打破任何旧有的内部节点干扰
            btn.textContent = targetText;
          }
        });

        // 激进策略 2：针对可能存在的内联文字节点进行深度定向清洗
        const allElements = root.querySelectorAll('div, span, p');
        allElements.forEach((el) => {
          if (el.children.length === 0) { // 仅处理最底层的文字叶子节点
            const txt = el.textContent?.trim();
            if (txt === 'Swap' || txt === '兑换' || txt === '兌換' || txt === '스왑') {
              el.textContent = targetText;
            }
          }
        });
      };

      // 兜底扫描：先处理页面全局环境
      processElements(document.body);

      // 容器级独立扫描
      terminalContainers.forEach((container) => {
        processElements(container);
        if (container.shadowRoot) {
          processElements(container.shadowRoot);
        }
      });
    };

    // 立即执行
    updateButtonText();

    // 毫秒级防闪烁高频轮询计时器（专门对付异步 React 重新渲染覆盖 DOM）
    const timer = setInterval(updateButtonText, 100);

    const observer = new MutationObserver(() => {
      updateButtonText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [langContext, displayMode]);

  useEffect(() => {
    const cleanJupiterAssets = () => {
      const terminalContainers = document.querySelectorAll('#jupiter-terminal, .jupiter-terminal, [class*="terminal"]');
      terminalContainers.forEach((container) => {
        const svgs = container.querySelectorAll('svg');
        svgs.forEach((svg) => {
          if (svg.innerHTML.includes('path') || svg.closest('[class*="header"]') || svg.closest('[class*="Header"]')) {
            svg.style.setProperty('display', 'none', 'important');
            svg.style.setProperty('width', '0px', 'important');
            svg.style.setProperty('height', '0px', 'important');
            svg.style.setProperty('opacity', '0', 'important');
          }
        });

        if (container.shadowRoot) {
          const shadowSvgs = container.shadowRoot.querySelectorAll('svg');
          shadowSvgs.forEach((svg) => {
            svg.style.setProperty('display', 'none', 'important');
            svg.style.setProperty('width', '0px', 'important');
            svg.style.setProperty('opacity', '0', 'important');
          });
        }
      });

      const elements = document.querySelectorAll('span, p, div');
      elements.forEach((el) => {
        if (el.textContent && el.textContent.includes('Jupiter renders as')) {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          el.textContent = '';
        }
      });
    };

    cleanJupiterAssets();

    const observer = new MutationObserver(() => {
      cleanJupiterAssets();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [displayMode]);

  useEffect(() => {
    if (window.Jupiter._instance) {
      window.Jupiter._instance = null;
    }

    setPluginInView(false);
  }, [displayMode]);

  const methods = useForm<IFormConfigurator>({
    defaultValues: INITIAL_FORM_CONFIG,
  });

  const { control } = methods;
  const simulateWalletPassthrough = useWatch({ control, name: 'simulateWalletPassthrough' });

  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()], []);

  const ShouldWrapWalletProvider = useMemo(() => {
    return simulateWalletPassthrough
      ? ({ children }: { children: ReactNode }) => (
          <UnifiedWalletProvider
            wallets={wallets}
            config={{
              env: 'mainnet-beta',
              autoConnect: true,
              metadata: {
                name: 'MERDEX',
                description: '',
                url: 'https://plugin.jup.ag',
                iconUrls: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'],
              },
              theme: 'jupiter',
            }}
          >
            {children}
          </UnifiedWalletProvider>
        )
      : React.Fragment;
  }, [wallets, simulateWalletPassthrough]);

  return (
    <FormProvider {...methods}>
      <div className="bg-landing-bg h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between gap-y-10">
        <SideDrawer isOpen={isSideDrawerOpen} setIsOpen={setIsSideDrawerOpen}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center py-4 px-4 text-white gap-2 border-b border-white/10">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent tracking-wide">
                MERDEX
              </h1>
              <button
                className="p-2 text-white/50 hover:text-gray-300 transition-colors"
                onClick={() => setIsSideDrawerOpen(false)}
                aria-label="Close drawer"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <div className="flex justify-between items-center my-4 mx-4 text-white gap-2 border border-white/10 rounded-full">
              <button
                className={cn('flex-1 p-2 rounded-full text-landing-primary', {
                  'bg-landing-primary/20 ': sideDrawerTab === 'config',
                })}
                onClick={() => setSideDrawerTab('config')}
              >
                Config
              </button>
              <button
                className={cn('flex-1 p-2 rounded-full text-landing-primary', {
                  'bg-landing-primary/20 ': sideDrawerTab === 'snippet',
                })}
                onClick={() => setSideDrawerTab('snippet')}
              >
                Snippet
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {sideDrawerTab === 'config' ? <FormConfigurator /> : <CodeBlocks displayMode={'integrated'} />}
            </div>
          </div>
        </SideDrawer>
        <AppHeader/>
        <div>
          <div className="px-2">
            <div className="flex flex-col items-center h-full w-full md:mt-5">
              <div className="flex flex-col justify-center items-center text-center">
                <div className="flex space-x-2">
                  <V2SexyChameleonText animate={false} className="text-4xl md:text-[60px] md:h-[66px] font-semibold flex flex-row items-center ">
                    MERDEX
                  </V2SexyChameleonText>
                </div>
                <p className="text-[#9D9DA6] text-md mt-4 heading-[24px]">
                  MERDEX is a secure and high-speed aggregate platform.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="max-w-[420px] mt-8 rounded-3xl flex flex-col md:flex-row w-full relative border border-white/10">
                <ShouldWrapWalletProvider>
                  <div className=" h-full w-full rounded-xl flex flex-col">
                    
                    <div className="hidden flex-row justify-between py-3 px-2 border-b border-white/10">
                      {PLUGIN_MODE.map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() => setDisplayMode(mode.value)}
                          type="button"
                          className={cn(
                            'relative px-4 py-2 justify-center text-white/20  rounded-full text-sm flex-1 ',
                            {
                              'bg-landing-primary/10 text-landing-primary': displayMode === mode.value,
                            },
                          )}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-grow justify-center text-white/75 flex-col mx-auto px-2">
                      <div className="flex flex-row justify-end min-h-[24px] mt-2 items-center">
                        <div
                          className={cn('text-white text-center', {
                            hidden: !simulateWalletPassthrough,
                          })}
                        >
                          <UnifiedWalletButton />
                        </div>
                      </div>
                      <PluginGroup tab={displayMode} />
                    </div>
                    <span className="flex justify-center text-center text-xs text-[#9D9DA6] mb-2"></span>
                  </div>
                </ShouldWrapWalletProvider>
              </div>
            </div>
          </div>
        </div>

        <Upsell/>

        <Footer />
      </div>
    </FormProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <style dangerouslySetInnerHTML={{__html: `
          #jupiter-terminal svg:first-of-type,
          .jupiter-terminal svg:first-of-type,
          [class*="terminal"] div[class*="header"] svg,
          [class*="terminal"] div[class*="Header"] svg,
          div[class*="header"] > div > svg:first-child,
          span[class*="text-white/20"] + div svg {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          .bg-landing-bg > div span.text-xs {
            display: none !important;
            opacity: 0 !important;
          }

          .overflow-y-auto div:has(input[name="referralAccount"]),
          .overflow-y-auto div:has(input[name="referralFeeBps"]),
          .overflow-y-auto div:has(a[href*="referral"]),
          .overflow-y-auto div:has(> input[name*="referral"]),
          .overflow-y-auto p:contains("Referral"),
          .overflow-y-auto div.border-b:has(+ div input[name*="referral"]) {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
          }
        `}} />

        <DefaultSeo
          title={'MERDEX'}
          openGraph={{
            type: 'website',
            locale: 'en',
            title: 'MERDEX: secure and high-speed aggregate platform',
            description: 'MERDEX is a secure and high-speed aggregate platform.',
            url: 'https://plugin.jup.ag/',
            site_name: 'MERDEX',
            images: [
              {
                url: `https://plugin.jup.ag/meta-og/jupiter-meta-plugin.webp`,
                alt: 'MERDEX Aggregator',
              },
            ],
          }}
          twitter={{
            cardType: 'summary_large_image',
            site: 'jup.ag',
            handle: '@JupiterExchange',
          }}
        />
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
