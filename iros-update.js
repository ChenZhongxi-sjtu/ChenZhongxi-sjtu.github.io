(() => {
  const PREPRINT = 'IROS 2026 (Accepted)';
  const PUBLICATION_LINKS = new Map([
    ['DexHiL: A Human-in-the-Loop Framework for Vision-Language-Action Model Post-Training in Dexterous Manipulation', 'https://arxiv.org/abs/2603.09121'],
    ['BORA: Bridging Offline Reinforcement Learning and Online Residual Adaptation for Real-World Dexterous VLA Models', 'https://arxiv.org/abs/2605.30226']
  ]);

  function linkPublicationTitles(root = document) {
    root.querySelectorAll('h3').forEach((heading) => {
      const title = heading.textContent.trim();
      const arxivUrl = PUBLICATION_LINKS.get(title);
      if (!arxivUrl || heading.querySelector('a')) return;

      const link = document.createElement('a');
      link.className = 'publication-arxiv-link';
      link.href = arxivUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${title} (arXiv)`);
      link.textContent = title;
      heading.replaceChildren(link);
    });
  }

  function decorateVenue(root = document) {
    root.querySelectorAll('p').forEach((paragraph) => {
      if (paragraph.dataset.irosDecorated || !paragraph.textContent.includes(PREPRINT)) return;

      const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const index = node.nodeValue.indexOf(PREPRINT);
        if (index < 0) continue;

        const before = node.nodeValue.slice(0, index);
        const after = node.nodeValue.slice(index + PREPRINT.length);
        const venue = document.createElement('span');
        venue.className = 'iros-venue';
        venue.innerHTML = '<span class="iros-badge">IROS 2026</span><span class="iros-accepted">Accepted</span>';

        const fragment = document.createDocumentFragment();
        if (before) fragment.append(before);
        fragment.append(venue);
        if (after) fragment.append(after);
        node.replaceWith(fragment);
        paragraph.dataset.irosDecorated = 'true';
        break;
      }
    });
  }

  function addAcceptanceNews(root = document) {
    root.querySelectorAll('section').forEach((section) => {
      const heading = section.querySelector(':scope > h2');
      if (!heading || !['News', '动态'].includes(heading.textContent.trim())) return;

      const isChinese = document.documentElement.dataset.locale === 'zh';
      const locale = isChinese ? 'zh' : 'en';
      const list = section.querySelector(':scope > .space-y-3');
      if (!list) return;

      const existing = list.querySelector('.iros-acceptance-news');
      if (existing?.dataset.locale === locale) return;
      existing?.remove();

      const item = document.createElement('div');
      item.className = 'iros-acceptance-news flex items-start space-x-3';
      item.dataset.locale = locale;
      item.innerHTML = `
        <span class="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">2026-06</span>
        <span class="iros-news-dot" aria-hidden="true"></span>
        <p class="text-sm text-neutral-700">${isChinese
          ? '我们的工作 <strong>DexHiL</strong> 被 <strong>IROS 2026</strong> 录用 🎉'
          : 'Our work <strong>DexHiL</strong> has been accepted to <strong>IROS 2026</strong> 🎉'}</p>`;
      list.prepend(item);
    });
  }

  function updateFooter(root = document) {
    root.querySelectorAll('footer p').forEach((paragraph) => {
      if (!paragraph.textContent.trim().startsWith('Last updated') &&
          !paragraph.textContent.trim().startsWith('最后更新')) return;
      const updated = document.documentElement.dataset.locale === 'zh'
        ? '最后更新：2026年6月20日'
        : 'Last updated: June 20, 2026';
      if (paragraph.textContent !== updated) paragraph.textContent = updated;
    });
  }

  let scheduled = false;
  function applyUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      linkPublicationTitles();
      decorateVenue();
      addAcceptanceNews();
      updateFooter();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyUpdate, { once: true });
  } else {
    applyUpdate();
  }
  new MutationObserver(applyUpdate).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-locale']
  });
})();
