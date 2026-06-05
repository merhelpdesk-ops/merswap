const findAndReplaceText = (currentRoot: any) => {
  if (!currentRoot || typeof currentRoot.querySelectorAll !== 'function') return;

  const allElements = currentRoot.querySelectorAll('*');
  
  allElements.forEach((el: Element) => {
    const htmlEl = el as HTMLElement;

    // Use 'in' operator to safely check for shadowRoot
    if ('shadowRoot' in htmlEl && htmlEl.shadowRoot) {
      findAndReplaceText(htmlEl.shadowRoot);
    }

    const text = htmlEl.textContent || '';

    // Only process leaf nodes
    if (htmlEl.children.length === 0) {
      if (text.includes('Powered by')) {
        htmlEl.textContent = 'MER DEX protects your assets';
        if (htmlEl.parentElement) {
          const icons = htmlEl.parentElement.querySelectorAll('svg, img');
          icons.forEach((icon) => {
            (icon as HTMLElement).style.display = 'none';
          });
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
      if (text.trim() === "Multiple display options and other configurations to match your application's needs.") {
        htmlEl.textContent = 'Your transaction behavior is protected by MERDEX aggregator.';
      }
    }
  });
};
