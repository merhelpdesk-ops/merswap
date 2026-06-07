import React, { useEffect } from 'react';

const IntegratedPlugin = ({ lang }: { lang?: string }) => {
  useEffect(() => {
    // 语言映射逻辑：将你的上下文语言码转换为 Jupiter 官方支持的 locale
    const getJupiterLocale = (l?: string) => {
      const lLower = l?.toLowerCase() || '';
      if (lLower.includes('tw') || lLower.includes('hk')) return 'zh-TW';
      if (lLower.includes('zh') || lLower.includes('cn')) return 'zh-CN';
      if (lLower.includes('ko') || lLower.includes('kr')) return 'ko';
      return 'en';
    };

    if (window.Jupiter) {
      window.Jupiter.init({
        endpoint: 'https://api.mainnet-beta.solana.com',
        displayMode: 'integrated',
        integratedTargetId: 'jupiter-terminal',
        // 关键配置：直接从插件初始化层面解决翻译
        locale: getJupiterLocale(lang),
      });
    }
  }, [lang]);

  return <div id="jupiter-terminal" className="w-full h-full" />;
};

export default IntegratedPlugin;
