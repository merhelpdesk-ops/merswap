import React from 'react';
import { useLanguage, LanguageProvider } from './LanguageContext';

const contentData = {
  en: {
    swap: { title: 'Swap fees', desc: 'Earn swap fees easily.', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: '24/7 Customer Support', 
      desc: 'Contact 24/7 Support!', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: 'The ultimate transaction', 
      desc: 'Seamlessly integrate end to end jup.ag swap experience with all Ultra features', 
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
      desc: '聚合多DEX服务和捕获代币信息MER DEX为您提供安全高效的交易体验！', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '一站式服务！MERDEX 为您提供全球聚合器！', 
      desc: 'MERDEX 已为您聚合全网报价！我们将竭尽所能为您带来更多市场机会！', 
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
      desc: '聚合多DEX服务和捕獲代幣資訊MER DEX 為您提供安全高效的交易體驗！', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '一站式服務！MERDEX 為您提供全球聚合器！', 
      desc: 'MERDEX 已為您聚合全網報價！我們將竭盡所能為您帶來更多市場機會！', 
      img: '/upsell/rpc_less.svg', 
      bg: '#231B32' 
    },
  },
  ko: {
    swap: { title: 'MER DEX', desc: 'MER DEX, 트레이딩이 쉬워집니다.', img: '/upsell/swap_fee.svg', bg: '#182220' },
    support: { 
      title: '24시간 지원팀', 
      desc: '24시간 지원 문의', 
      img: '/upsell/customizable_options.svg', 
      bg: '#151E31' 
    },
    ultra: { 
      title: '울트라 스왑', 
      desc: '다중 DEX 서비스를 통합하고 토큰 정보를 포획하여 MER DEX가 안전하고 효율적인 거래 경험을 제공합니다!', 
      img: '/upsell/seemless_integration.svg', 
      bg: '#002F25' 
    },
    oneStop: { 
      title: '원스톱 서비스! MERDEX가 글로벌 애그리게이터를 제공합니다!', 
      desc: 'MERDEX가 전체 네트워크 견적을 통합했습니다! 더 많은 시장 기회를 제공하기 위해 최선을 다하겠습니다!', 
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
