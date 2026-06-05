const findAndReplaceText = (currentRoot: Document | ShadowRoot | HTMLElement) => {
  // 使用 ElementList 类型明确声明
  const allElements = currentRoot.querySelectorAll('*');
  
  allElements.forEach((el) => {
    // 确保 el 被正确识别为 HTMLElement
    const htmlEl = el as HTMLElement;

    // 严谨的 Shadow DOM 类型处理
    if (htmlEl.shadowRoot) {
      findAndReplaceText(htmlEl.shadowRoot as ShadowRoot);
    }

    const text = htmlEl.textContent || '';

    // 使用简单的 if 逻辑替换文本，减少复杂判断
    if (htmlEl.children.length === 0) {
      if (text.includes('Powered by')) {
        htmlEl.textContent = 'MER DEX protects your assets';
        // 隐藏相关图标
        if (htmlEl.parentElement) {
          const icons = htmlEl.parentElement.querySelectorAll('svg, img');
          icons.forEach((icon) => (icon as HTMLElement).style.display = 'none');
        }
      }
      
      if (text.includes('Seamlessly integrate')) {
        htmlEl.textContent = 'Aggregate multi-DEX services and capture token information MER DEX provides you with a safe and efficient trading experience!';
      }

      if (text.trim() === 'Swap fees') {
        htmlEl.textContent = 'MER DEX';
      }
      if (text.trim() === 'Earn swap fees easily.') {
        htmlEl.textContent = 'MER DEX makes it easy for you to trade!';
      }
      
      if (text.trim() === 'Customizable Options') {
        htmlEl.textContent = 'MERDEX top security';
      }
      if (text.trim() === 'Multiple display options and other configurations to match your application\'s needs.') {
        htmlEl.textContent = 'Your transaction behavior is protected by MERDEX aggregator.';
      }
    }
  });
};
