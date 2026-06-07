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
    const updateTargetText = () => {
      const current = langContext?.language || langContext?.locale || 'en';
      let mappedLang = 'en';

      if (current.includes('tw') || current.includes('hk')) {
        mappedLang = 'tw';
      } else if (current.includes('zh') || current.includes('cn')) {
        mappedLang = 'zh';
      } else if (current.includes('kr') || current.includes('ko')) {
        mappedLang = 'kr';
      }

      const targetText = translations[mappedLang] || 'Swap';
      const terminalContainers = document.querySelectorAll('#jupiter-terminal, .jupiter-terminal, [class*="terminal"]');
      
      const replaceText = (root: Element | ShadowRoot) => {
        const buttons = root.querySelectorAll('button');
        buttons.forEach((btn) => {
          if (btn.querySelector('svg') || btn.getAttribute('aria-label')) return;
          const txt = btn.textContent?.trim();
          if (txt === 'Swap' || txt === 'swap' || txt === '兑换' || txt === '兌換' || txt === '스왑') {
            btn.textContent = targetText;
          }
        });

        const textElements = root.querySelectorAll('div, span, p');
        textElements.forEach((el) => {
          if (el.children.length === 0) {
            const txt = el.textContent?.trim();
            if (txt === 'Swap' || txt === 'swap' || txt === '兑换' || txt === '兌換' || txt === '스왑') {
              el.textContent = targetText;
            }
          }
        });
      };

      replaceText(document.body);
      terminalContainers.forEach((container) => {
        replaceText(container);
        if (container.shadowRoot) {
          replaceText(container.shadowRoot);
        }
      });
    };

    updateTargetText();
    const timer = setInterval(updateTargetText, 100);

    const observer = new MutationObserver(() => {
      updateTargetText();
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
          svg.style.setProperty('display', 'none', 'important');
        });

        if (container.shadowRoot) {
          const shadowSvgs = container.shadowRoot.querySelectorAll('svg');
          shadowSvgs.forEach((svg) => {
            svg.style.setProperty('display', 'none', 'important');
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

  const ShouldWrapWalletProvider = useMemo(()
