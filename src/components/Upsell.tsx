import React from 'react';
import { useLanguage, LanguageProvider } from './LanguageContext';

const contentData = {
  en: {
    swap: { title: 'Swap fees', desc: 'Earn swap fees easily.', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: 'Around-the-Clock Customer Support', 
      desc: 'Contact Our Always-On Support Team!', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: 'The ultimate transaction', 
      desc: 'Best Rates Across the Network', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: 'One-stop service! MERDEX provides you with a global aggregator!', 
      desc: 'MERDEX has aggregated the whole network quotation for you! And try our best to bring you more market opportunities!', 
      img: '/upsell/rpc_less.svg', 
      bg: '#231B32' 
    },
  },
  cn: {
    swap: { title: '梅尔聚合器', desc: '梅尔聚合器让您的交易变得轻松！', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: '全天候支持团队', 
      desc: '任何问题均可联系我们全天候支持团队！', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: '极致交易', 
      desc: '让您获得网络优质报价！', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '一站式服务！梅尔为您提供全球聚合器！', 
      desc: '梅尔已为您聚合全网报价！我们将竭尽所能为您带来更多市场机会！', 
      img: '/upsell/rpc_less.svg', 
      bg: '#231B32' 
    },
  },
  tw: {
    swap: { title: '梅爾聚合器', desc: '梅爾聚合器讓您的交易變得輕鬆。', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: '全天候支援團隊', 
      desc: '任何問題均可聯繫我們的全天候支援團隊！', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: '極致交易', 
      desc: '讓您獲得網絡優質報價！', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '一站式服務！梅爾為您提供全球聚合器！', 
      desc: '梅爾已為您聚合全網報價！我們將竭盡所能為您帶來更多市場機會！', 
      img: '/upsell/rpc_less.svg', 
      bg: '#231B32' 
    },
  },
  ko: {
    swap: { title: '메르 애그리게이터', desc: '메르, 거래가 간편해집니다!', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: '스물네 시간 지원팀', 
      desc: '상시 고객 지원', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: '고품질 거래', 
      desc: '네트워크 최적의 가격을 제공합니다!', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '원스톱 서비스! 메르, 글로벌 거래 서비스를 제공합니다!', 
      desc: '메르가 전체 네트워크 가격을 제공합니다! 더 많은 시장 거래 기회를 제공하기 위해 최선을 다하겠습니다!', 
      img: '/upsell/rpc_less.svg', 
      bg: '#231B32' 
    },
  },
};

const sectionsOrder: Array<keyof typeof contentData.en> = ['swap', 'support', 'ultra', 'oneStop'];

const UpsellContent = () => {
  const { lang } = useLanguage();
  const content = contentData[lang as keyof typeof contentData] || contentData.en;

  return (
    <div className="text-white grid md:grid-cols-2 gap-4 px-2 mt-4 max-w-[700px] mx-auto">
      {sectionsOrder.map((key) => {
        const section = content[key];
        return (
          <div
            key={key}
            className={`rounded-xl p-4 relative flex flex-col gap-y-2 ${section.bg === '#182220' ? 'h-[160px]' : 'min-h-[160px] h-auto pb-6'}`}
            style={{ backgroundColor: section.bg }}
          >
            <div className="text-xl font-semibold w-[80%]">{section.title}</div>
            <div className="text-white/60 w-[80%] text-sm leading-relaxed">{section.desc}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={section.img} alt={key} className="absolute top-0 right-0" />
          </div>
        );
      })}
    </div>
  );
};

export const Upsell = () => (
  <LanguageProvider>
    <UpsellContent />
  </LanguageProvider>
);
