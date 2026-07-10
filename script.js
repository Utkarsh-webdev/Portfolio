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

  // toolbelt dots fill on view
  const dotRows = document.querySelectorAll('.dots');
  const dotObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const n = parseInt(e.target.getAttribute('data-n'),10);
        e.target.innerHTML='';
        for(let i=0;i<5;i++){
          const d = document.createElement('i');
          d.style.setProperty('--d', (i*0.08)+'s');
          if(i<n) setTimeout(()=>d.classList.add('on'), i*90);
          e.target.appendChild(d);
        }
        dotObs.unobserve(e.target);
      }
    });
  }, {threshold:0.4});
  dotRows.forEach(d=>dotObs.observe(d));
});