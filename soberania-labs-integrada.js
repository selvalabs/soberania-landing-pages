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
