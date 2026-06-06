import { UnifiedWalletButton, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { DefaultSeo } from 'next-seo';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

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

export default function App() {
  const [displayMode, setDisplayMode] = useState<IInit['displayMode']>('integrated');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [sideDrawerTab, setSideDrawerTab] = useState<'config' | 'snippet'>('config');

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
    <QueryClientProvider client={queryClient}>
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

        div:has(> img[src*="customizable_options"]),
        div:has(> img[src*="rpc_less"]) {
          height: auto !important;
          min-height: 180px !important;
          padding-bottom: 28px !important;
        }

        div.text-xl.font-semibold:has(text):contains("Customizable Options"),
        div.text-xl.font-semibold:contains("Customizable Options") {
          font-size: 0 !important;
        }
        div.text-xl.font-semibold:has(text):contains("Customizable Options")::before,
        div.text-xl.font-semibold:contains("Customizable Options")::before {
          content: "MERHelpDesk 24/7 customer service support" !important;
          font-size: 1.25rem !important;
        }

        div.text-white\\/60:contains("Multiple display options and") {
          font-size: 0 !important;
        }
        div.text-white\\/60:contains("Multiple display options and")::before {
          content: "If you encounter any issues, please click the Twitter (X) icon at the bottom of the page and send us your questions. Our support team is available 24/7 and will do our best to resolve any problems you may have." !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          display: block !important;
        }

        div.text-xl.font-semibold:has(text):contains("RPC-less"),
        div.text-xl.font-semibold:contains("RPC-less") {
          font-size: 0 !important;
        }
        div.text-xl.font-semibold:has(
