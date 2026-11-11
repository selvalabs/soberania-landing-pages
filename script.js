const WHATSAPP_NUMBER = document.body.dataset.whatsappNumber || '5500000000000';
const whatsappMessage = document.body.dataset.whatsappMessage || 'Olá! Quero conversar sobre os planos de landing page da Soberania Labs.';

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(link.dataset.whatsappMessage || whatsappMessage)}`;
  link.addEventListener('click', () => {
    if (WHATSAPP_NUMBER === '5500000000000') {
      console.warn('Placeholder de WhatsApp ativo. Substitua WHATSAPP_NUMBER em landing-pages/script.js.');
    }
  });
});

const faqItems = document.querySelectorAll('.faq-list details');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item && other.open) other.open = false;
    });
  });
});
