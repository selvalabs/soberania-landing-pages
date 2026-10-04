
(()=>{
 const progress=document.querySelector('.progress');
 const sticky=document.querySelector('.sticky-cta');
 const offer=document.querySelector('#oferta');
 const central=document.querySelector('#central');
 const hero=document.querySelector('.hero');
 const update=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  const pct=max>0?(scrollY/max)*100:0; progress.style.width=pct+'%';
  const show=scrollY>hero.offsetHeight*.72 && scrollY<central.offsetTop-innerHeight*.55;
  sticky.classList.toggle('show',show); sticky.setAttribute('aria-hidden',show?'false':'true');
 };
 addEventListener('scroll',update,{passive:true}); update();
 const els=[...document.querySelectorAll('.reveal:not(.is-visible)')];
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  els.forEach(el=>io.observe(el));
 }else els.forEach(el=>el.classList.add('is-visible'));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const t=document.querySelector(id);if(t){e.preventDefault();t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}}));
})();
