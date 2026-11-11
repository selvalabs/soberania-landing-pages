(() => {
  const gallery = document.querySelector('.inside-examples');
  if (!gallery) return;

  const methodKicker = document.querySelector('.method .section-kicker');
  if (methodKicker) methodKicker.textContent = '04 / o método Soberania Labs';

  const examples = [...gallery.querySelectorAll('[data-example]')].map((figure) => ({
    figure,
    id: figure.dataset.example,
    title: figure.querySelector('figcaption strong').textContent,
    frame: figure.querySelector('iframe'),
    notes: [...figure.querySelector('template').content.querySelectorAll('[data-target]')],
    doc: null,
    anchors: [],
  }));
  const switcher = gallery.querySelector('.inside-switch');
  const buttons = [...switcher.querySelectorAll('[data-example-button]')];
  const project = gallery.querySelector('.inside-note-project');
  const noteIndex = gallery.querySelector('.inside-note-index');
  const noteCopy = gallery.querySelector('.inside-note-copy');
  let active = examples[0];
  let rendered = '';

  function noteFor(example) {
    if (!example.doc) return 0;
    const root = example.doc.scrollingElement;
    if (!root) return 0;

    const scrollEnd = root.scrollHeight - root.clientHeight;
    if (scrollEnd > 0 && root.scrollTop >= scrollEnd - 1) return example.notes.length - 1;

    const readingLine = root.clientHeight * 0.32;
    let index = 0;
    example.anchors.forEach((anchor, position) => {
      if (anchor && anchor.getBoundingClientRect().top <= readingLine) index = position;
    });
    return index;
  }

  function showNote(example) {
    const index = noteFor(example);
    const key = example.id + ':' + index;
    if (rendered === key) return;
    rendered = key;

    const number = String(index + 1).padStart(2, '0');
    const total = String(example.notes.length).padStart(2, '0');
    const note = example.notes[index].cloneNode(true);
    project.textContent = example.title;
    noteIndex.textContent = number + ' / ' + total + ' · ' + note.dataset.label;
    noteCopy.replaceChildren(...note.childNodes);
  }

  function select(example) {
    if (active !== example) {
      active.figure.classList.remove('is-current');
      example.figure.classList.add('is-current');
      active = example;
      buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.exampleButton === example.id));
      });
    }
    showNote(example);
  }

  function connectFrame(example) {
    const doc = example.frame.contentDocument;
    if (!doc || !doc.querySelector(example.notes[0].dataset.target) || doc === example.doc) return;

    example.doc = doc;
    example.anchors = example.notes.map((note) => doc.querySelector(note.dataset.target));
    const styles = doc.createElement('style');
    styles.textContent = 'html, body { overscroll-behavior-y: contain; } html { scroll-behavior: auto; } .sticky-cta { display: none !important; }';
    doc.head.append(styles);

    // The original checkout buttons remain visible in the example without opening checkout.
    doc.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && !link.getAttribute('href').startsWith('#')) event.preventDefault();
    });

    let queued = false;
    function queueNote() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (example.figure.getClientRects().length) select(example);
      });
    }
    doc.defaultView.addEventListener('scroll', queueNote, { passive: true });
    doc.addEventListener('wheel', queueNote, { passive: true });

    if (active === example) showNote(example);
  }

  examples.forEach((example) => {
    example.frame.addEventListener('load', () => connectFrame(example));
    connectFrame(example);
  });
  buttons.forEach((button) => {
    const example = examples.find((item) => item.id === button.dataset.exampleButton);
    button.addEventListener('click', () => select(example));
  });

  gallery.classList.add('is-enhanced');
  switcher.hidden = false;
  showNote(active);
})();
