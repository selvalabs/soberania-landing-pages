(() => {
  const scrolly = document.querySelector('.inside-scrolly');
  const frameSticky = document.querySelector('.inside-frame-sticky');
  const frame = document.querySelector('#inside-site');
  const notes = [...document.querySelectorAll('.inside-note')];
  const count = document.querySelector('#inside-count');
  const methodKicker = document.querySelector('.method .section-kicker');
  if (!scrolly || !frameSticky || !frame || !notes.length || !count) return;
  if (methodKicker) methodKicker.textContent = '04 / o método Soberania Labs';
  // A explicação faz parte do mesmo palco fixo do frame. No desktop ela fica
  // ao lado; no mobile, abaixo. Em ambos os casos é o mesmo scroll externo.
  const notesPanel = document.querySelector('.inside-notes');
  const presentation = document.createElement('div');
  presentation.className = 'inside-presentation';
  [...frameSticky.children].forEach((part) => presentation.append(part));
  frameSticky.append(presentation, notesPanel);

  let frameReady = false;
  let activeIndex = -1;
  let ticking = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const innerWindow = () => frame.contentWindow;

  function setFrameMode() {
    const viewport = frame.closest('.inside-viewport');
    if (!viewport) return;
    const desktopPreview = window.matchMedia('(min-width: 1101px)').matches;
    frame.classList.toggle('is-desktop-preview', desktopPreview);
    if (!desktopPreview) {
      frame.removeAttribute('style');
      return;
    }
    // O exemplo troca para layout mobile abaixo de 900px. Mantemos o iframe
    // com viewport de desktop e o escalamos visualmente dentro da moldura.
    const sourceWidth = 1440;
    const scale = viewport.clientWidth / sourceWidth;
    frame.style.width = `${sourceWidth}px`;
    frame.style.height = `${Math.ceil(viewport.clientHeight / scale)}px`;
    frame.style.transformOrigin = 'top left';
    frame.style.transform = `scale(${scale})`;
  }

  function maxInnerScroll() {
    const doc = frame.contentDocument;
    const win = innerWindow();
    if (!doc || !win) return 0;
    return Math.max(0, Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0) - win.innerHeight);
  }

  function stepForInnerScroll(innerScroll) {
    const doc = frame.contentDocument;
    const win = innerWindow();
    if (!doc || !win) return 0;
    let next = 0;
    notes.forEach((note, index) => {
      if (!index) return;
      const anchor = doc.querySelector(note.dataset.target);
      if (!anchor) return;
      const anchorTop = anchor.getBoundingClientRect().top + win.scrollY;
      // A explicação entra pouco antes da nova dobra ocupar o centro do frame.
      const trigger = Math.max(0, anchorTop - win.innerHeight * 0.35);
      if (innerScroll >= trigger) next = index;
    });
    return next;
  }

  function activate(index) {
    const next = clamp(index, 0, notes.length - 1);
    if (next === activeIndex) return;
    activeIndex = next;
    notes.forEach((note, noteIndex) => note.classList.toggle('is-active', noteIndex === next));
    count.textContent = String(next + 1).padStart(2, '0');
  }

  function syncExperience() {
    ticking = false;
    if (!frameReady) return;

    const stageHeight = frameSticky.offsetHeight;
    const track = Math.max(1, scrolly.offsetHeight - stageHeight);
    const progress = clamp((window.scrollY - scrolly.offsetTop) / track, 0, 1);
    const win = innerWindow();
    const target = maxInnerScroll() * progress;
    if (Math.abs(win.scrollY - target) > 1) win.scrollTo(0, target);

    activate(stepForInnerScroll(target));
  }

  function requestSync() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncExperience);
  }

  frame.addEventListener('load', () => {
    frameReady = true;
    setFrameMode();
    const doc = frame.contentDocument;
    if (doc?.documentElement) doc.documentElement.style.scrollBehavior = 'auto';
    if (doc?.body) doc.body.style.scrollBehavior = 'auto';
    // O CTA sticky pertence à página original, mas sobrepõe a prévia dentro
    // desta apresentação. Aqui ele é apenas ocultado, sem afetar o site fonte.
    if (doc && !doc.querySelector('#soberania-preview-overrides')) {
      const previewOverrides = doc.createElement('style');
      previewOverrides.id = 'soberania-preview-overrides';
      previewOverrides.textContent = '.sticky-cta{display:none!important}';
      doc.head.append(previewOverrides);
    }
    activate(0);
    requestSync();
  });

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', () => {
    setFrameMode();
    requestSync();
  }, { passive: true });
})();

(() => {
  const modal = document.getElementById('community-offer');
  if (!modal) return;
  let previousOverflow = '';
  document.querySelectorAll('[data-community-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (modal.open) return;
      previousOverflow = document.body.style.overflow;
      modal.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  modal.querySelector('[data-community-close]').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  });
  modal.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
})();
