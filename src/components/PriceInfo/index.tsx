import Decimal from 'decimal.js';
import { useMemo } from 'react';
import { formatNumber } from 'src/misc/utils';
import ExchangeRate from '../ExchangeRate';
import TransactionFee from './TransactionFee';
import { QuoteResponse } from 'src/contexts/SwapContext';
import { cn } from 'src/misc/cn';
import { Asset } from 'src/entity/SearchResponse';

type Language = 'en' | 'ko' | 'zh';

const i18n = {
  en: {
    rate: 'Rate',
    priceImpact: 'Price Impact',
  },
  ko: {
    rate: '교환 비율',
    priceImpact: '가격 영향',
  },
  zh: {
    rate: '匯率',
    priceImpact: '價格衝擊',
  },
};

const Index = ({
  quoteResponse,
  fromTokenInfo,
  toTokenInfo,
  loading,
  containerClassName,
  lang = 'en',
}: {
  quoteResponse: QuoteResponse;
  fromTokenInfo: Asset;
  toTokenInfo: Asset;
  loading: boolean;
  containerClassName?: string;
  lang?: Language;
}) => {
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
  
  const fee = useMemo(() => {
    if (!quoteResponse) {
      return 0;
    }
    return quoteResponse.quoteResponse.platformFee.feeBps / 100;
  }, [quoteResponse]);

  const gasFee = useMemo(() => {
    if (quoteResponse) {
      const { prioritizationFeeLamports, signatureFeeLamports } = quoteResponse.quoteResponse;
      let totalFeeLamports = 0;
      if (prioritizationFeeLamports) {
        totalFeeLamports += prioritizationFeeLamports;
      }
      if (signatureFeeLamports) {
        totalFeeLamports += signatureFeeLamports;
      }
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
