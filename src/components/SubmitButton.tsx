import { cn } from 'src/misc/cn';
import JupButton from './JupButton';
import { useMemo } from 'react';
import { useSwapContext } from 'src/contexts/SwapContext';

// 🌟 1. 成功引入多语言状态
import { useLanguage } from './LanguageContext'; 

interface SubmitButtonProps {
  onSubmit: VoidFunction;
}

export const SubmitButton = ({ onSubmit }: SubmitButtonProps) => {
  const {
    quoteResponseMeta,
    loading,
    errors,
    swapping: { txStatus },
    form
  } = useSwapContext();

  // 🌟 2. 拿到当前的语言变量 (en, cn, tw, ko)
  const { lang } = useLanguage(); 

  // 🌟 3. 准备状态文案的翻译字典
  const statusTranslation: Record<string, { loading: string; sending: string; pending: string; swap: string }> = {
    en: {
      loading: 'Loading',
      sending: 'Sending',
      pending: 'Pending Approval',
      swap: 'Swap',
    },
    cn: {
      loading: '加载中',
      sending: '发送中',
      pending: '等待批准',
      swap: '兑换',
    },
    tw: {
      loading: '載入中',
      sending: '發送中',
      pending: '等待批准',
      swap: '兌換',
    },
    ko: {
      loading: '로딩 중',
      sending: '전송 중',
      pending: '승인 대기 중',
      swap: '교환',
    }
  };

  const currentText = statusTranslation[lang] || statusTranslation['en'];

  const shouldButtonDisabled = useMemo(() => {
    if (
      !quoteResponseMeta ||
      loading ||
      !!errors.fromValue ||
      txStatus?.status === 'loading' ||
      txStatus?.status === 'sending' ||
      txStatus?.status === 'pending-approval'
    ) {
      return true;
    }
    return false;
  }, [quoteResponseMeta, loading, errors.fromValue, txStatus]);

  const buttonText = useMemo(() => {
    if (errors.fromValue) return errors.fromValue.title;
    if (quoteResponseMeta?.quoteResponse?.errorMessage) return quoteResponseMeta.quoteResponse.errorMessage;        
    
    // 🌟 4. 把原本写死的英文状态全部替换成对应语言的状态
    if (loading) return currentText.loading;
    if (txStatus?.status === 'sending') return currentText.sending;
    if (txStatus?.status === 'pending-approval') return currentText.pending;
    
    return currentText.swap;
  }, [txStatus, errors.fromValue, loading, quoteResponseMeta, currentText]);

  return (
    <JupButton
      size="lg"
      className={cn('w-full mt-4 disabled:opacity-50 !text-uiv2-text/75 !bg-primary ')}
      onClick={onSubmit}
      disabled={shouldButtonDisabled}
    >
      <span>{buttonText}</span>
    </JupButton>
  );
};
