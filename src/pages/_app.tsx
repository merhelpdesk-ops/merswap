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
          const shadowSvgs = container.shadowRoot
