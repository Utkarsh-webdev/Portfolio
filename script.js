(function(){
  // draw thread as sections come into view
  const svg = document.getElementById('threadSvg');
  const path = document.getElementById('threadPath');
  const total = path.getTotalLength();
  path.style.strokeDasharray = total;
  path.style.strokeDashoffset = total;

  function updateThread(){
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollH = doc.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, scrollTop/scrollH));
    path.style.strokeDashoffset = total - (total*progress);
  }
  window.addEventListener('scroll', updateThread, {passive:true});
  window.addEventListener('resize', updateThread);
  updateThread();

  // section counter + stamps
  const logNum = document.getElementById('logNum');
  const sections = Array.from(document.querySelectorAll('[data-idx]'));
  const seen = new Set();
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        seen.add(parseInt(e.target.getAttribute('data-idx'),10));
        logNum.textContent = String(seen.size).padStart(2,'0');
        e.target.querySelectorAll('.js-stamp').forEach(s=>s.classList.add('show'));
      }
    });
  }, {threshold:0.35});
  sections.forEach(s=>obs.observe(s));

  // ---- Contact form -> WhatsApp ----
  // Your WhatsApp number in international format, no + or spaces.
  const WHATSAPP_NUMBER = "919569080353";

  window.sendDispatch = function(){
    const nameEl = document.getElementById('f-name');
    const emailEl = document.getElementById('f-email');
    const msgEl = document.getElementById('f-msg');
    const statusEl = document.getElementById('f-status');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg = msgEl.value.trim();

    if(!name || !msg){
      statusEl.textContent = 'Please add your name and a message before sending.';
      statusEl.classList.add('show','error');
      (name ? msgEl : nameEl).focus();
      return;
    }

    const lines = [
      `New dispatch from ${name}`,
      email ? `Email: ${email}` : null,
      '',
      msg
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;

    statusEl.textContent = 'Opening WhatsApp — hit send there to deliver your message.';
    statusEl.classList.remove('error');
    statusEl.classList.add('show');

    window.open(url, '_blank', 'noopener');
  };
})();