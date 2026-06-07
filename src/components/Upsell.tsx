import React from 'react';
// 导入 LanguageProvider 和 useLanguage
import { useLanguage, LanguageProvider } from './LanguageContext'; 

// 将原来的逻辑拆分为一个内部组件
const UpsellContent = () => {
  const { lang } = useLanguage(); 

  const t = {
    en: {
      swap: { title: 'Swap fees', desc: 'Earn swap fees easily.' },
      support: { title: 'MERHelpDesk 24/7 customer service support', desc: 'If you encounter any issues, please click the Twitter (X) icon at the bottom of the page and send us your questions. Our support team is available 24/7 and will do our best to resolve any problems you may have.' },
      ultra: { title: 'Ultra Swap', desc: 'Seamlessly integrate end to end jup.ag swap experience with all Ultra features' },
      oneStop: { title: 'One-stop service! MERDEX provides you with a global aggregator!', desc: 'MERDEX has aggregated the whole network quotation for you! And try our best to bring you more market opportunities!' }
    },
    cn: {
      swap: { title: '交易手续费', desc: '轻松赚取交易手续费。' },
      support: { title: 'MERHelpDesk 24/7 客户支持', desc: '如果您遇到任何问题，请点击页面底部的 Twitter (X) 图标发送您的问题。我们的支持团队 24/7 全天候在线，并将竭尽全力为您解决问题。' },
      ultra: { title: '极致交易', desc: '无缝集成 jup.ag 交易体验，尽享所有 Ultra 功能。' },
      oneStop: { title: '一站式服务！MERDEX 为您提供全球聚合器！', desc: 'MERDEX 已为您聚合全网报价！我们将竭尽所能为您带来更多市场机会！' }
    },
    tw: {
      swap: { title: '交易手續費', desc: '輕鬆賺取交易手續費。' },
      support: { title: 'MERHelpDesk 24/7 客戶支持', desc: '如果您遇到任何問題，請點擊頁面底部的 Twitter (X) 圖標發送您的問題。我們的支持團隊 24/7 全天候在線，並將竭盡全力為您解決問題。' },
      ultra: { title: '極致交易', desc: '無縫集成 jup.ag 交易體驗，盡享所有 Ultra 功能。' },
      oneStop: { title: '一站式服務！MERDEX 為您提供全球聚合器！', desc: 'MERDEX 已為您聚合全網報價！我們將竭盡所能為您帶來更多市場機會！' }
    },
    ko: {
      swap: { title: '스왑 수수료', desc: '스왑 수수료를 쉽게 벌어보세요.' },
      support: { title: 'MERHelpDesk 24/7 고객 서비스 지원', desc: '문제가 발생하면 페이지 하단의 Twitter (X) 아이콘을 클릭하여 문의해 주세요. 고객 지원 팀이 24/7 대기 중이며 문제를 해결하기 위해 최선을 다하겠습니다.' },
      ultra: { title: '울트라 스왑', desc: '모든 울트라 기능을 갖춘 jup.ag 스왑 경험을 완벽하게 통합하세요.' },
      oneStop: { title: '원스톱 서비스! MERDEX가 글로벌 애그리게이터를 제공합니다!', desc: 'MERDEX가 전체 네트워크 견적을 통합했습니다! 더 많은 시장 기회를 제공하기 위해 최선을 다하겠습니다!' }
    }
  };

  const content = t[lang as keyof typeof t] || t.en;

  return (
    <div className="text-white grid md:grid-cols-2 gap-4 px-2 mt-4 max-w-[700px] mx-auto">
      <div className="bg-[#182220] rounded-xl p-4 relative h-[160px] flex flex-col gap-y-2 ">
        <div className="text-xl font-semibold">{content.swap.title}</div>
        <div className="text-white/60 text-sm">{content.swap.desc}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/swap_fee.svg" alt="swap-fees" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#151E31] rounded-xl p-4 relative gap-y-2 flex flex-col min-h-[160px] h-auto pb-6">
        <div className="text-xl font-semibold w-[80%]">{content.support.title}</div>
        <div className="text-white/60 w-[80%] text-sm leading-relaxed">{content.support.desc}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/customizable_options.svg" alt="customizable-options" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#002F25] rounded-xl p-4 relative h-[160px] flex flex-col gap-y-2">
        <div className="text-xl font-semibold w-[80%]">{content.ultra.title}</div>
        <div className="text-white/60 w-[80%] text-sm">{content.ultra.desc}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/seemless_integration.svg" alt="ultra-swap" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#231B32] rounded-xl p-4 relative gap-y-2 flex flex-col min-h-[160px] h-auto pb-6">
        <div className="text-xl font-semibold w-[80%]">{content.oneStop.title}</div>
        <div className="text-white/60 w-[80%] text-sm leading-relaxed">{content.oneStop.desc}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/rpc_less.svg" alt="rpc-less" className="absolute top-0 right-0" />
      </div>
    </div>
  );
};

// 导出包装后的组件，确保它被 LanguageProvider 包裹
export const Upsell = () => (
  <LanguageProvider>
    <UpsellContent />
  </LanguageProvider>
);
