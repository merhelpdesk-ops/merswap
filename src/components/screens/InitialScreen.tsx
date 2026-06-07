import React, { useCallback, useState } from 'react';

import { useSwapContext } from 'src/contexts/SwapContext';
import Form from '../../components/Form';
import FormPairSelector from '../../components/FormPairSelector';
import { cn } from 'src/misc/cn';
import { Asset } from 'src/entity/SearchResponse';

// 🌟 1. 成功引入多语言状态中心
import { useLanguage } from '../LanguageContext'; 

const InitialScreen = () => {
  const { form, setForm, loading } = useSwapContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectPairSelector, setSelectPairSelector] = useState<'fromMint' | 'toMint' | null>(null);

  // 🌟 2. 拿到当前的语言变量 (en, cn, tw, ko)
  const { lang } = useLanguage(); 

  // 🌟 3. 定义你需要的本地化文字翻译字典
  const swapTextMap: Record<string, string> = {
    en: 'Swap',
    cn: '兑换',
    tw: '兌換',
    ko: '교환'
  };

  const onSelectMint = useCallback(
    async (tokenInfo: Asset) => {
      if (selectPairSelector === 'fromMint') {
        setForm((prev) => ({
          ...prev,
          fromMint: tokenInfo.id,
          fromValue: '',
          ...(prev.toMint === tokenInfo.id ? { toMint: prev.fromMint } : undefined),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          toMint: tokenInfo.id,
          toValue: '',
          ...(prev.fromMint === tokenInfo.id ? { fromMint: prev.toMint } : undefined),
        }));
      }
      setSelectPairSelector(null);
    },
    [selectPairSelector, setForm],
  );

  return (
    <>
      {/* Body */}
      <form
        className={cn({
          hidden: Boolean(selectPairSelector),
        })}
      >
        {/* 🌟 4. 把翻译好的本地文字（兑换/兌換/교환）直接当成参数硬塞给 Form 组件 */}
        <Form 
          isDisabled={isDisabled} 
          setSelectPairSelector={setSelectPairSelector} 
          swapText={swapTextMap[lang] || swapTextMap['en']} 
        />
      </form>

      {selectPairSelector !== null ? (
        <div className="absolute top-0 left-0 h-full w-full bg-black rounded-lg overflow-hidden">
          <FormPairSelector onSubmit={onSelectMint} onClose={() => setSelectPairSelector(null)} />
        </div>
      ) : null}
    </>
  );
};

export default InitialScreen;
