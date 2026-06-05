    // Secure depth replacement: Modify leaf node text only to maintain DOM structure and layout
    const findAndReplaceText = (currentRoot: Document | ShadowRoot | HTMLElement) => {
      const allElements = currentRoot.querySelectorAll('*');
      
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;

        // Traverse into Shadow DOM
        if (htmlEl.shadowRoot) {
          findAndReplaceText(htmlEl.shadowRoot);
        }

        const text = htmlEl.textContent || '';

        // 1. Handle "Powered by" text
        if (text.includes('Powered by') && htmlEl.children.length === 0) {
          htmlEl.textContent = 'MER DEX protects your assets';
          if (htmlEl.parentElement) {
            const icons = htmlEl.parentElement.querySelectorAll('svg, img');
            icons.forEach(icon => ((icon as HTMLElement).style.display = 'none'));
          }
        }

        // 2. Handle "Ultra Swap" description
        if (text.includes('Seamlessly integrate') && htmlEl.children.length === 0) {
          htmlEl.textContent = 'Aggregate multi-DEX services and capture token information MER DEX provides you with a safe and efficient trading experience!';
        }

        // 3. Handle "Swap fees" and its subtext
        if (text.trim() === 'Swap fees' && htmlEl.children.length === 0) {
          htmlEl.textContent = 'MER DEX';
        }
        if (text.trim() === 'Earn swap fees easily.' && htmlEl.children.length === 0) {
          htmlEl.textContent = 'MER DEX makes it easy for you to trade!';
        }

        // 4. NEW: Handle "Customizable Options"
        if (text.trim() === 'Customizable Options' && htmlEl.children.length === 0) {
          htmlEl.textContent = 'MERDEX top security';
        }
        if (text.trim() === 'Multiple display options and other configurations to match your application\'s needs.' && htmlEl.children.length === 0) {
          htmlEl.textContent = 'Your transaction behavior is protected by MERDEX aggregator.';
        }
      });
    };
