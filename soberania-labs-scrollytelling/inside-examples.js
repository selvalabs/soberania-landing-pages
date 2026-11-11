(() => {
  const gallery = document.querySelector('.inside-examples');
  if (!gallery) return;

  const methodKicker = document.querySelector('.method .section-kicker');
  if (methodKicker) methodKicker.textContent = '04 / o método Soberania Labs';

  const examples = [...gallery.querySelectorAll('[data-example]')].map((figure) => {
    const devices = [...figure.querySelectorAll('iframe')].map((frame) => ({
      frame,
      viewport: frame.parentElement,
      label: frame.dataset.device,
      doc: null,
      anchors: [],
    }));
    return {
      figure,
      id: figure.dataset.example,
      title: figure.getAttribute('aria-label'),
      pair: figure.querySelector('.inside-device-pair'),
      phone: figure.querySelector('.inside-device--phone'),
      devices,
      lastDevice: devices[0],
      notes: [...figure.querySelector('template').content.querySelectorAll('[data-target]')],
    };
  });
  const deck = gallery.querySelector('.inside-deck');
  const switcher = gallery.querySelector('.inside-switch');
  const buttons = [...switcher.querySelectorAll('[data-example-button]')];
  const project = gallery.querySelector('.inside-note-project');
  const noteIndex = gallery.querySelector('.inside-note-index');
  const noteCopy = gallery.querySelector('.inside-note-copy');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = examples[0];
  let rendered = '';
  let turn = null;
  let wheelDistance = 0;
  let lastWheelAt = 0;
  let wheelLockedUntil = 0;

  function fitViewport(viewport) {
    if (viewport.clientWidth) {
      const width = Number(viewport.firstElementChild.getAttribute('width'));
      viewport.style.setProperty('--inside-scale', String(viewport.clientWidth / width));
    }
  }

  function noteFor(example, device) {
    const root = device.doc?.scrollingElement;
    if (!root) return 0;

    const end = root.scrollHeight - root.clientHeight;
    if (end > 0 && root.scrollTop >= end - 1) return example.notes.length - 1;

    const readingLine = root.clientHeight * 0.32;
    let index = 0;
    device.anchors.forEach((anchor, position) => {
      if (anchor && anchor.getBoundingClientRect().top <= readingLine) index = position;
    });
    return index;
  }

  function showNote() {
    const device = active.lastDevice;
    const index = noteFor(active, device);
    const key = active.id + ':' + device.label + ':' + index;
    if (rendered === key) return;
    rendered = key;

    const number = String(index + 1).padStart(2, '0');
    const total = String(active.notes.length).padStart(2, '0');
    const note = active.notes[index].cloneNode(true);
    project.textContent = active.title + ' · ' + device.label;
    noteIndex.textContent = number + ' / ' + total + ' · ' + note.dataset.label;
    noteCopy.replaceChildren(...note.childNodes);
  }

  function finishTurn(state) {
    if (turn !== state) return;
    turn = null;
    state.animations.forEach((animation) => animation.cancel());
    state.from.figure.classList.remove('is-departing');
    state.from.figure.hidden = true;
  }

  function rotate(from, to, direction) {
    if (reducedMotion.matches) {
      from.figure.hidden = true;
      return;
    }

    from.figure.classList.add('is-departing');
    const timing = { duration: 460, easing: 'cubic-bezier(.22,.75,.26,1)', fill: 'both' };
    const animations = [
      from.pair.animate([
        { transform: 'translate3d(0, 0, 0) rotateY(0)', opacity: 1 },
        { transform: 'translate3d(' + (-direction * 13) + '%, 0, -100px) rotateY(' + (direction * 42) + 'deg)', opacity: 0 },
      ], timing),
      to.pair.animate([
        { transform: 'translate3d(' + (direction * 16) + '%, 0, -120px) rotateY(' + (-direction * 48) + 'deg)', opacity: 0 },
        { transform: 'translate3d(0, 0, 0) rotateY(0)', opacity: 1 },
      ], timing),
      to.phone.animate([
        { transform: 'translate3d(' + (direction * 12) + 'px, -14px, 60px) rotateY(' + (direction * 14) + 'deg)' },
        { transform: 'translate3d(0, 0, 0) rotateY(0)' },
      ], timing),
    ];
    const state = { from, animations };
    turn = state;
    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => finishTurn(state));
  }

  function select(example) {
    if (example === active) return;
    if (turn) finishTurn(turn);

    const previous = active;
    const direction = examples.indexOf(example) > examples.indexOf(previous) ? 1 : -1;
    active = example;
    previous.figure.inert = true;
    example.figure.hidden = false;
    example.figure.inert = false;
    example.devices.forEach(({ viewport }) => fitViewport(viewport));
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.exampleButton === example.id));
    });
    rotate(previous, example, direction);
    showNote();
  }

  function connectFrame(example, device) {
    const doc = device.frame.contentDocument;
    if (!doc || !doc.querySelector(example.notes[0].dataset.target) || doc === device.doc) return;

    device.doc = doc;
    device.anchors = example.notes.map((note) => doc.querySelector(note.dataset.target));
    const styles = doc.createElement('style');
    styles.textContent = 'html, body { overscroll-behavior-y: contain; } html { scroll-behavior: auto; } .sticky-cta { display: none !important; }';
    doc.head.append(styles);

    doc.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && !link.getAttribute('href').startsWith('#')) event.preventDefault();
    });

    let queued = false;
    function queueNote() {
      if (queued || example !== active) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (example !== active) return;
        example.lastDevice = device;
        showNote();
      });
    }
    doc.defaultView.addEventListener('scroll', queueNote, { passive: true });
    doc.addEventListener('wheel', queueNote, { passive: true });

    if (active === example && example.lastDevice === device) showNote();
  }

  function turnOnWheel(event) {
    if (event.ctrlKey || !event.cancelable) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;

    const now = performance.now();
    if (now < wheelLockedUntil) {
      event.preventDefault();
      return;
    }
    const next = examples[examples.indexOf(active) + Math.sign(delta)];
    if (!next) {
      wheelDistance = 0;
      return;
    }

    event.preventDefault();
    if (now - lastWheelAt > 160 || Math.sign(wheelDistance) !== Math.sign(delta)) wheelDistance = 0;
    lastWheelAt = now;
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? deck.clientHeight : 1;
    wheelDistance += delta * units;
    if (Math.abs(wheelDistance) < 32) return;

    wheelDistance = 0;
    wheelLockedUntil = now + 500;
    select(next);
  }

  const resize = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => fitViewport(target));
  });
  examples.forEach((example) => {
    example.figure.hidden = example !== active;
    example.figure.inert = example !== active;
    example.devices.forEach((device) => {
      resize.observe(device.viewport);
      device.frame.addEventListener('load', () => connectFrame(example, device));
      connectFrame(example, device);
    });
  });
  buttons.forEach((button) => {
    const example = examples.find((item) => item.id === button.dataset.exampleButton);
    button.addEventListener('click', () => select(example));
  });
  [deck, switcher].forEach((area) => area.addEventListener('wheel', turnOnWheel, { passive: false }));

  gallery.classList.add('is-enhanced');
  switcher.hidden = false;
  active.devices.forEach(({ viewport }) => fitViewport(viewport));
  showNote();
})();
