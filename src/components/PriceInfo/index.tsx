import Decimal from 'decimal.js';
import { useMemo, useState, useEffect } from 'react';
import { formatNumber } from 'src/misc/utils';
import ExchangeRate from '../ExchangeRate';
import TransactionFee from './TransactionFee';
import { QuoteResponse } from 'src/contexts/SwapContext';
import { cn } from 'src/misc/cn';
import { Asset } from 'src/entity/SearchResponse';

type Language = 'en' | 'cn' | 'tw' | 'ko';

const i18n = {
  en: { rate: 'Rate', priceImpact: 'Price Impact' },
  cn: { rate: '汇率', priceImpact: '价格冲击' },
  tw: { rate: '匯率', priceImpact: '價格衝擊' },
  ko: { rate: '교환 비율', priceImpact: '가격 영향' },
};

const Index = ({
  quoteResponse,
  fromTokenInfo,
  toTokenInfo,
  loading,
  containerClassName,
}: {
  quoteResponse: QuoteResponse;
  fromTokenInfo: Asset;
  toTokenInfo: Asset;
  loading: boolean;
  containerClassName?: string;
}) => {
  // 核心改动：初始化时强制读取 localStorage
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLang(e.detail);
    };
    window.addEventListener('langChange', handleLangChange);
    return () => window.removeEventListener('langChange', handleLangChange);
  }, []);

  const rateParams = {
    inAmount: quoteResponse?.quoteResponse.inAmount || BigInt(0),
    inputAsset: fromTokenInfo,
    outAmount: quoteResponse?.quoteResponse.outAmount || BigInt(0),
    outputAsset: toTokenInfo,
  };

  const priceImpact = formatNumber.format(
    new Decimal(quoteResponse?.quoteResponse.priceImpactPct || 0).mul(100).toDP(2),
  );

  const priceImpactText = Number(priceImpact) < 0.01 ? undefined : `-${priceImpact}%`;
  
  const gasFee = useMemo(() => {
    if (quoteResponse) {
      const { prioritizationFeeLamports, signatureFeeLamports } = quoteResponse.quoteResponse;
      let totalFeeLamports = 0;
      if (prioritizationFeeLamports) totalFeeLamports += prioritizationFeeLamports;
      if (signatureFeeLamports) totalFeeLamports += signatureFeeLamports;
      return totalFeeLamports / 1e9;
    }
    return 0;
  }, [quoteResponse]);

  return (
    <div className={cn('mt-4 space-y-4 ', containerClassName)}>
      <div className="flex items-center justify-between text-xs">
        <div className="text-primary-text/50"><span>{i18n[lang].rate}</span></div>
        {rateParams.inAmount > BigInt(0) &&
        rateParams.outAmount > BigInt(0) ? (
          <ExchangeRate
            loading={loading}
            rateParams={rateParams}
            fromTokenInfo={fromTokenInfo}
            toTokenInfo={toTokenInfo}
            reversible={true}
          />
        ) : (
          <span className="text-primary-text/50">{'-'}</span>
        )}
      </div>

      {priceImpactText && (
        <div className="flex items-center justify-between text-xs text-primary-text/50">
          <div>
            <span>{i18n[lang].priceImpact}</span>
          </div>
          <div className="text-primary-text">{priceImpactText}</div>
        </div>
      )}

      <TransactionFee gasFee={gasFee} gasless={quoteResponse?.quoteResponse.gasless} />
    </div>
  );
};

export default Index;
