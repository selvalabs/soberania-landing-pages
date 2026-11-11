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

const planTablist = document.querySelector('.offer-plan-tablist');

if (planTablist) {
  const plans = [...planTablist.querySelectorAll('[role="tab"]')].map((tab) => ({
    tab,
    panel: document.getElementById(tab.getAttribute('aria-controls')),
  }));

  function selectPlan(index) {
    plans.forEach(({ tab, panel }, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
    });
  }

  if (plans.length && plans.every(({ panel }) => panel)) {
    const shortViewport = window.matchMedia('(max-width: 800px) and (max-height: 850px), (max-height: 650px)');
    const benefitLists = plans.map(({ panel }) => panel.querySelector('.offer-plan-benefits'));
    const fitBenefits = () => {
      benefitLists.forEach((details) => {
        if (details) details.open = !shortViewport.matches;
      });
    };
    fitBenefits();
    shortViewport.addEventListener('change', fitBenefits);

    plans.forEach(({ tab, panel }, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      tab.addEventListener('click', () => selectPlan(index));
      tab.addEventListener('keydown', (event) => {
        let next;
        switch (event.key) {
          case 'ArrowLeft': next = (index + plans.length - 1) % plans.length; break;
          case 'ArrowRight': next = (index + 1) % plans.length; break;
          case 'Home': next = 0; break;
          case 'End': next = plans.length - 1; break;
          default: return;
        }
        event.preventDefault();
        selectPlan(next);
        plans[next].tab.focus();
      });
    });

    selectPlan(Math.max(0, plans.findIndex(({ tab }) => tab.getAttribute('aria-selected') === 'true')));
    planTablist.hidden = false;
  }
}

const faqItems = document.querySelectorAll('.faq-list details');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item && other.open) other.open = false;
    });
  });
});
