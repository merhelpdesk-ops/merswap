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

// 核心多语言字典
const globalTranslations: Record<string, string> = {
  en: 'Swap',
  zh: '兑换',
  tw: '兌換',
  kr: '스왑',
};

// 动态获取当前应该显示的语系文字
const getCurrentTargetText = (): string => {
  if (typeof window === 'undefined') return 'Swap';
  
  // 1. 尝试从本页面的语言提供商的 Session/Local 或者 DOM 标记中嗅探用户点选的语言
  const htmlLang = document.documentElement.lang || '';
  const browserLang = window.navigator.language || '';
  
  // 2. 深度扫描头部导航栏是否有处于激活状态的语言文本指示，兜底匹配
  const pageContent = document.body ? document.body.innerHTML : '';
  
  let currentLang = 'en';
  
  // 动态匹配优先级
  if (htmlLang.includes('tw') || htmlLang.includes('hk') || window.location.search.includes('tw')) {
    currentLang = 'tw';
  } else if (htmlLang.includes('zh') || htmlLang.includes('cn')) {
    currentLang = 'zh';
  } else if (htmlLang.includes('ko') || htmlLang.includes('kr')) {
    currentLang = 'kr';
  } else {
    // 兜底策略：如果 html 标记没变，通过检测当前页面上切换语言按钮的点击痕迹或全局 window 变量
    const activeLangText = (window as any).__CURRENT_LANG__ || '';
    if (activeLangText === 'tw') currentLang = 'tw';
    else if (activeLangText === 'zh') currentLang = 'zh';
    else if (activeLangText === 'kr') currentLang = 'kr';
    else {
      // 从浏览器语言兜底
      const combined = browserLang.toLowerCase();
      if (combined.includes('tw') || combined.includes('hk')) currentLang = 'tw';
      else if (combined.includes('zh') || combined.includes('cn')) currentLang = 'zh';
      else if (combined.includes('ko') || combined.includes('kr')) currentLang = 'kr';
    }
  }

  return globalTranslations[currentLang] || 'Swap';
};

// 核心内核注入：动态拦截并完美掉包成当前对应语系的“兑换”
if (typeof window !== 'undefined') {
  const interceptAndTranslate = (val: any): any => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === 'Swap' || trimmed === 'swap' || trimmed === '兑换' || trimmed === '兌換' || trimmed === '스왑') {
        return getCurrentTargetText(); // 动态翻译成当前语言
      }
    }
    return val;
  };

  // 1. 拦截 textContent
  const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  if (originalTextContentDescriptor && originalTextContentDescriptor.set) {
    Object.defineProperty(Node.prototype, 'textContent', {
      ...originalTextContentDescriptor,
      set: function (value) {
        originalTextContentDescriptor.set!.call(this, interceptAndTranslate(value));
      }
    });
  }

  // 2. 拦截 innerHTML
  const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (originalInnerHTMLDescriptor && originalInnerHTMLDescriptor.set) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      ...originalInnerHTMLDescriptor,
      set: function (value) {
        let newValue = value;
        if (typeof value === 'string' && (value.trim() === 'Swap' || value.trim() === 'swap')) {
          newValue = getCurrentTargetText();
        }
        originalInnerHTMLDescriptor.set!.call(this, newValue);
      }
    });
  }
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

function AppContent() {
  const [displayMode, setDisplayMode] = useState<IInit['displayMode']>('integrated');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [sideDrawerTab, setSideDrawerTab] = useState<'config' | 'snippet'>('config');
  
  const langContext = useLanguage() as any;

  // 将当前上下文语言实时绑定到全局变量，以便底层的原型链拦截器能够秒级同步感知语言切换
  useEffect(() => {
    if (typeof window !== 'undefined' && langContext) {
      const current = langContext.language || langContext.locale || 'en';
      let mapped = 'en';
      if (current.includes('tw') || current.includes('hk')) mapped = 'tw';
      else if (current.includes('zh') || current.includes('cn')) mapped = 'zh';
      else if (current.includes('kr') || current.includes('ko')) mapped = 'kr';
      (window as any).__CURRENT_LANG__ = mapped;
    }
  }, [langContext]);

  useEffect(() => {
    // 强
