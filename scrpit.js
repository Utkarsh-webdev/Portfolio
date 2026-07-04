
(function(){
  "use strict";

  /* ============ CONFIG / CONTENT (edit me!) ============ */
  const TRAINER_NAME = "ALEX";
  const CONTACT = {
    email: "mailto:you@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://x.com/yourusername"
  };
  document.getElementById('githubLink').href = CONTACT.github;
  document.getElementById('linkedinLink').href = CONTACT.linkedin;

  const SKILLS = [
    {icon:"🟨", name:"JavaScript", lvl:"Lv. 92"},
    {icon:"⚛️", name:"React", lvl:"Lv. 88"},
    {icon:"🟩", name:"Node.js", lvl:"Lv. 85"},
    {icon:"🐍", name:"Python", lvl:"Lv. 78"},
    {icon:"🐘", name:"PostgreSQL", lvl:"Lv. 80"},
    {icon:"☁️", name:"AWS", lvl:"Lv. 70"},
    {icon:"🐳", name:"Docker", lvl:"Lv. 74"},
    {icon:"🔺", name:"TypeScript", lvl:"Lv. 86"},
    {icon:"🧪", name:"Testing", lvl:"Lv. 72"}
  ];

  const PROJECTS = [
    {icon:"🛒", name:"ShopMon Storefront", desc:"Full-stack e-commerce app with cart, checkout and an admin dashboard.", tags:["React","Node","Stripe","PostgreSQL"], demo:"#", code:"#"},
    {icon:"📊", name:"TrainerStats Dashboard", desc:"Realtime analytics dashboard with websocket-powered live charts.", tags:["Next.js","WebSockets","D3"], demo:"#", code:"#"},
    {icon:"🗺️", name:"RouteFinder API", desc:"A geospatial route-planning REST API with caching and rate limiting.", tags:["Python","FastAPI","Redis"], demo:"#", code:"#"}
  ];

  const EXPERIENCE = [
    {role:"Senior Full Stack Engineer", company:"Cerulean Tech", dates:"2023 — Present", desc:"Leading a team building internal tooling and customer-facing web apps."},
    {role:"Full Stack Developer", company:"Viridian Labs", dates:"2021 — 2023", desc:"Built and shipped features across the stack for a SaaS analytics product."},
    {role:"Frontend Developer", company:"Pallet Studio", dates:"2019 — 2021", desc:"Owned the component library and design system used across 6 products."}
  ];

  const ABOUT = {
    tagline: "Full Stack Developer · Frontend/Backend Specialist",
    bio: "I build reliable, well-crafted web applications from database to pixel. I like clean APIs, thoughtful UI, and the occasional side quest into game dev.",
    stats: [
      {label:"FRONTEND", pct:90},
      {label:"BACKEND", pct:85},
      {label:"DEVOPS", pct:65},
      {label:"UI / UX", pct:78}
    ]
  };

  const TYPE_COLORS = {
    Fire:"#e0463f", Water:"#3b6fd4", Grass:"#5cae2e", Electric:"#e8c22a",
    Psychic:"#e26cb0", Normal:"#a6a380", Bug:"#a6c72a", Rock:"#b8a355",
    Ghost:"#6a5aa8", Dragon:"#5a5ad4", Ice:"#7fd6e0", Dark:"#5a4a3a",
    Fairy:"#f0a8d0", Fighting:"#c25a3a", Steel:"#a0a8b8"
  };

  /* ============ MAP ============ */
  const TILE = 32;
  const COLS = 15, ROWS = 11;
  // grid values: 0 grass 1 tree 2 water 3 path 4 tallgrass 5 building-solid 6 door(object)
  const grid = [];
  for(let r=0;r<ROWS;r++){ grid.push(new Array(COLS).fill(0)); }
  function setRect(x,y,w,h,val){ for(let j=y;j<y+h;j++) for(let i=x;i<x+w;i++){ if(grid[j] && grid[j][i]!==undefined) grid[j][i]=val; } }
  // border trees
  for(let i=0;i<COLS;i++){ grid[0][i]=1; grid[ROWS-1][i]=1; }
  for(let j=0;j<ROWS;j++){ grid[j][0]=1; grid[j][COLS-1]=1; }
  // pond
  setRect(1,1,3,3,2);
  // paths
  setRect(1,5,13,1,3);
  setRect(7,1,1,9,3);
  // tall grass patches
  setRect(2,7,2,2,4);
  setRect(11,2,2,2,4);

  const BUILDINGS = [
    {id:"about",  label:"HOME",   cls:"b-home",   x:2,  y:2, doorX:2, doorY:3, title:"YOUR HOUSE — About Me"},
    {id:"lab",    label:"LAB",    cls:"b-lab",    x:11, y:6, doorX:11,doorY:7, title:"RESEARCH LAB — Contact"},
    {id:"gym",    label:"GYM",    cls:"b-gym",    x:6,  y:8, doorX:6, doorY:9, title:"TOWN GYM — Skills"},
    {id:"mart",   label:"MART",   cls:"b-mart",   x:9,  y:2, doorX:9, doorY:3, title:"POKÉ MART — Projects"},
    {id:"center", label:"CENTER", cls:"b-center", x:2,  y:8, doorX:2, doorY:9, title:"POKÉMON CENTER — Experience"}
  ];
  BUILDINGS.forEach(b=>{
    setRect(b.x,b.y,2,2,5);
    grid[b.doorY][b.doorX] = {door:b.id};
  });

  function tileAt(x,y){ return grid[y] && grid[y][x] !== undefined ? grid[y][x] : 1; }
  function isSolid(x,y){
    const t = tileAt(x,y);
    if(t===1||t===2||t===5) return true;
    return false;
  }
  function doorAt(x,y){ const t=tileAt(x,y); return (t && typeof t==='object' && t.door) ? t.door : null; }
  function isTallGrass(x,y){ return tileAt(x,y)===4; }

  /* ============ RENDER MAP ============ */
  const worldEl = document.getElementById('world');
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      const t = grid[y][x];
      const div = document.createElement('div');
      div.style.left = (x*TILE)+"px";
      div.style.top = (y*TILE)+"px";
      let cls = "tile ";
      if(t===1) cls += "t-tree";
      else if(t===2) cls += "t-water";
      else if(t===3) cls += "t-path";
      else if(t===4) cls += "t-tallgrass";
      else cls += ((x+y)%2===0) ? "t-grass-0" : "t-grass-1";
      div.className = cls;
      worldEl.appendChild(div);
    }
  }
  BUILDINGS.forEach(b=>{
    const el = document.createElement('div');
    el.className = "building "+b.cls;
    el.style.left = (b.x*TILE)+"px";
    el.style.top = ((b.y-1)*TILE)+"px"; // roof pokes up one tile
    el.innerHTML = '<div class="sign">'+b.label+'</div><div class="roof"></div><div class="window l"></div><div class="window r"></div><div class="wall"></div><div class="door"></div>';
    worldEl.appendChild(el);
  });

  /* ============ PLAYER ============ */
  let px = 7, py = 5; // start on path
  const playerEl = document.getElementById('player');
  function placePlayer(){
    playerEl.style.left = (px*TILE)+"px";
    playerEl.style.top = (py*TILE)+"px";
  }
  placePlayer();

  let moving = false;
  let gameStarted = false;
  const visited = new Set();

  function setDialogue(text, ms){
    const d = document.getElementById('dialogue');
    document.getElementById('dialogueText').textContent = text;
    d.style.display = 'block';
    if(ms){ clearTimeout(setDialogue._t); setDialogue._t = setTimeout(function(){ d.style.display='none'; }, ms); }
  }

  function updateHud(){
    document.getElementById('hudBadges').textContent = "VISITED "+visited.size+"/5";
    document.getElementById('dexBtn').textContent = "POKÉDEX ("+pokedex.length+")";
  }

  function tryMove(dx,dy,dir){
    if(!gameStarted || moving) return;
    playerEl.className = "dir-"+dir+" walking";
    const nx = px+dx, ny = py+dy;
    if(isSolid(nx,ny)){
      beep(120,0.05,"square");
      setTimeout(function(){ playerEl.classList.remove('walking'); }, 140);
      return;
    }
    moving = true;
    px = nx; py = ny;
    placePlayer();
    beep(220,0.03,"square");
    setTimeout(function(){
      moving = false;
      playerEl.classList.remove('walking');
      const doorId = doorAt(px,py);
      if(doorId){ openBuilding(doorId); return; }
      if(isTallGrass(px,py)){
        if(Math.random() < 0.32){ startEncounter(); }
      }
    }, 150);
  }

  document.addEventListener('keydown', function(e){
    const map = {ArrowUp:['up',0,-1], ArrowDown:['down',0,1], ArrowLeft:['left',-1,0], ArrowRight:['right',1,0],
                 w:['up',0,-1], s:['down',0,1], a:['left',-1,0], d:['right',1,0]};
    if(map[e.key]){
      e.preventDefault();
      if(!gameStarted){ startGame(); return; }
      if(modalOpen || encounterOpen) return;
      const dir = map[e.key][0], dx = map[e.key][1], dy = map[e.key][2];
      tryMove(dx,dy,dir);
    }
    if(e.key==="Enter"){ if(!gameStarted){ startGame(); } else if(modalOpen){ closeModal(); } }
    if(e.key==="Escape"){ if(modalOpen) closeModal(); }
  });

  document.querySelectorAll('.dpad button').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!gameStarted){ startGame(); return; }
      if(modalOpen || encounterOpen) return;
      const dir = btn.dataset.dir;
      const deltas = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};
      tryMove(deltas[dir][0], deltas[dir][1], dir);
    });
  });
  document.getElementById('startBtn').addEventListener('click', function(){ if(!gameStarted) startGame(); });
  document.getElementById('selectBtn').addEventListener('click', function(){ openPokedex(); });
  document.getElementById('aBtn').addEventListener('click', function(){ if(!gameStarted) startGame(); });
  document.getElementById('bBtn').addEventListener('click', function(){ if(modalOpen) closeModal(); if(encounterOpen) endEncounter(); });

  /* ============ BOOT ============ */
  function startGame(){
    if(gameStarted) return;
    gameStarted = true;
    document.getElementById('bootScreen').style.display = 'none';
    beep(440,0.08,"square");
    setTimeout(function(){ setDialogue("Welcome to PORTFOLIO TOWN! Walk into any building to explore.", 3200); }, 250);
  }
  document.getElementById('bootScreen').addEventListener('click', startGame);

  /* ============ MODALS ============ */
  let modalOpen = false;
  const overlay = document.getElementById('modalOverlay');
  const panel = document.getElementById('modalPanel');

  function closeModal(){
    modalOpen = false;
    overlay.style.display = 'none';
    beep(180,0.05,"square");
  }
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });

  function panelHeader(title){
    return '<div class="modal-head"><span class="modal-title pixel">'+title+'</span><button class="btn-b" id="modalCloseBtn">B BACK</button></div>';
  }

  function wireCloseBtn(){
    const b = document.getElementById('modalCloseBtn');
    if(b) b.addEventListener('click', closeModal);
  }

  function openBuilding(id){
    const b = BUILDINGS.find(function(x){ return x.id===id; });
    visited.add(id);
    updateHud();
    beep(300,0.06,"triangle");
    let html = panelHeader(b.title);

    if(id==="about"){
      html += '<div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;">'
        + '<div style="font-size:52px;">🧑‍💻</div>'
        + '<div style="flex:1;min-width:180px;">'
        + '<div style="font-family:\'Press Start 2P\';font-size:10px;margin-bottom:4px;">'+TRAINER_NAME+' RIVERA</div>'
        + '<div style="font-size:15px;color:#555;margin-bottom:8px;">'+ABOUT.tagline+'</div>'
        + '<p style="font-size:16px;line-height:1.4;">'+ABOUT.bio+'</p>'
        + '</div></div><div style="margin-top:12px;">'
        + ABOUT.stats.map(function(s){
            return '<div class="stat-row"><span class="label">'+s.label+'</span>'
              + '<span class="stat-bar"><span style="width:'+s.pct+'%;"></span></span>'
              + '<span style="font-size:13px;width:30px;text-align:right;">'+s.pct+'</span></div>';
          }).join('')
        + '</div>';
    }
    if(id==="gym"){
      html += '<p style="font-size:15px;margin-top:0;">Badges earned through hands-on experience:</p><div class="badge-grid">'
        + SKILLS.map(function(s){
            return '<div class="badge"><div class="icon">'+s.icon+'</div><div class="name">'+s.name+'</div><div class="lvl">'+s.lvl+'</div></div>';
          }).join('')
        + '</div>';
    }
    if(id==="mart"){
      html += '<p style="font-size:15px;margin-top:0;">Items in stock — take a look around:</p>'
        + PROJECTS.map(function(p){
            return '<div class="project-card"><div class="icon">'+p.icon+'</div><div style="flex:1;">'
              + '<h4>'+p.name+'</h4><p>'+p.desc+'</p>'
              + '<div>'+p.tags.map(function(t){ return '<span class="tag">'+t+'</span>'; }).join('')+'</div>'
              + '<div class="project-links"><a href="'+p.demo+'" target="_blank" rel="noopener">▶ View Demo</a>'
              + '<a href="'+p.code+'" target="_blank" rel="noopener">⌘ View Code</a></div>'
              + '</div></div>';
          }).join('');
    }
    if(id==="center"){
      html += '<p style="font-size:15px;margin-top:0;">Nurse Joy has healed your party! Here\'s the journey so far:</p>'
        + EXPERIENCE.map(function(e){
            return '<div class="exp-item"><h4>'+e.role+'</h4><div class="meta">'+e.company+' · '+e.dates+'</div><p>'+e.desc+'</p></div>';
          }).join('')
        + '<button class="btn-a" id="resumeBtn">⬇ DOWNLOAD RÉSUMÉ</button>';
    }
    if(id==="lab"){
      html += '<p style="font-size:15px;margin-top:0;">Professor\'s note: "Choose how you\'d like to reach out!"</p>'
        + '<div class="starter-grid">'
        + '<a class="starter" href="'+CONTACT.email+'"><div class="ball">📧</div><div class="name">EMAIL</div></a>'
        + '<a class="starter" href="'+CONTACT.github+'" target="_blank" rel="noopener"><div class="ball">🐙</div><div class="name">GITHUB</div></a>'
        + '<a class="starter" href="'+CONTACT.linkedin+'" target="_blank" rel="noopener"><div class="ball">💼</div><div class="name">LINKEDIN</div></a>'
        + '<a class="starter" href="'+CONTACT.twitter+'" target="_blank" rel="noopener"><div class="ball">🐦</div><div class="name">TWITTER</div></a>'
        + '</div>';
    }

    panel.innerHTML = html;
    overlay.style.display = 'flex';
    modalOpen = true;
    wireCloseBtn();
    const resumeBtn = document.getElementById('resumeBtn');
    if(resumeBtn) resumeBtn.addEventListener('click', function(){ alert('Hook this button up to your real résumé file!'); });
  }

  /* ============ POKÉDEX (in-memory, session only) ============ */
  const pokedex = [];

  function openPokedex(){
    if(!gameStarted) return;
    beep(300,0.06,"triangle");
    let html = panelHeader("VISITOR POKÉDEX ("+pokedex.length+")");
    if(pokedex.length===0){
      html += '<p style="font-size:16px;">No Pokémon caught yet! Walk into the tall grass patches to find one.</p>';
    } else {
      html += pokedex.slice().reverse().map(function(p){
        return '<div class="pokedex-entry"><div class="row1">'
          + '<span class="nick">'+escapeHtml(p.nickname)+'</span>'
          + '<span class="type-pill" style="background:'+(TYPE_COLORS[p.type]||'#888')+';">'+p.type+'</span>'
          + '</div><div class="from">caught by '+(escapeHtml(p.trainer)||'a mysterious trainer')+'</div>'
          + (p.message ? '<div class="msg">"'+escapeHtml(p.message)+'"</div>' : '')
          + '</div>';
      }).join('');
      html += '<p style="font-size:12px;color:#888;margin-top:10px;">Note: entries live only for this browser session (no backend hooked up yet). Wire this to a real API/database to persist them for every visitor!</p>';
    }
    panel.innerHTML = html;
    overlay.style.display = 'flex';
    modalOpen = true;
    wireCloseBtn();
  }
  document.getElementById('dexBtn').addEventListener('click', openPokedex);

  function escapeHtml(str){
    return (str||"").replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }

  /* ============ ENCOUNTER MINI-GAME ============ */
  let encounterOpen = false;
  const encounterEl = document.getElementById('encounter');
  const wildMonEl = document.getElementById('wildMon');
  const ballEl = document.getElementById('ballThrow');
  const encText = document.getElementById('encounterText');
  const encActions = document.getElementById('encounterActions');

  function startEncounter(){
    encounterOpen = true;
    encounterEl.style.display = 'flex';
    encounterEl.classList.add('flashing');
    wildMonEl.className = "wild-mon hidden-mon";
    wildMonEl.textContent = "❔";
    ballEl.className = "ball-throw";
    ballEl.style.left = "20px"; ballEl.style.bottom = "10px";
    ballEl.textContent = "⚫";
    encText.textContent = "A wild VISITOR-MON appeared!";
    encActions.innerHTML = '<button class="btn-a" id="throwBtn">THROW POKÉ BALL</button><button class="btn-b" id="runBtn">RUN</button>';
    document.getElementById('throwBtn').addEventListener('click', throwBall);
    document.getElementById('runBtn').addEventListener('click', endEncounter);
    beep(500,0.05,"sawtooth");
    setTimeout(function(){ encounterEl.classList.remove('flashing'); }, 1000);
  }

  function endEncounter(){
    encounterOpen = false;
    encounterEl.style.display = 'none';
  }

  function throwBall(){
    encActions.innerHTML = '';
    encText.textContent = "You threw a POKÉ BALL!";
    ballEl.textContent = "⚫";
    ballEl.classList.add('animate');
    beep(300,0.08,"square");
    setTimeout(function(){
      wildMonEl.classList.add('shaking');
      beep(200,0.06,"square");
      setTimeout(function(){
        wildMonEl.classList.remove('shaking');
        encText.textContent = "Gotcha! It's time to name your catch!";
        beep(660,0.12,"triangle");
        showCatchForm();
      }, 650);
    }, 700);
  }

  function showCatchForm(){
    encActions.innerHTML = '<div class="catch-form" style="width:100%;">'
      + '<label>NICKNAME</label><input type="text" id="fNick" maxlength="20" placeholder="e.g. Buggy McByteface" />'
      + '<label>TYPE</label><select id="fType">'
      + Object.keys(TYPE_COLORS).map(function(t){ return '<option value="'+t+'">'+t+'</option>'; }).join('')
      + '</select>'
      + '<label>YOUR NAME (optional)</label><input type="text" id="fTrainer" maxlength="24" placeholder="Trainer name" />'
      + '<label>LEAVE A MESSAGE</label><textarea id="fMsg" maxlength="140" placeholder="Say hi, leave feedback, whatever you like!"></textarea>'
      + '<div style="display:flex;gap:8px;margin-top:10px;">'
      + '<button class="btn-a" id="submitCatch">CATCH & SAVE</button>'
      + '<button class="btn-b" id="cancelCatch">CANCEL</button>'
      + '</div></div>';
    document.getElementById('cancelCatch').addEventListener('click', endEncounter);
    document.getElementById('submitCatch').addEventListener('click', function(){
      const nick = document.getElementById('fNick').value.trim() || "Mystery Mon";
      const type = document.getElementById('fType').value;
      const trainer = document.getElementById('fTrainer').value.trim();
      const msg = document.getElementById('fMsg').value.trim();
      pokedex.push({nickname:nick, type:type, trainer:trainer, message:msg, ts:Date.now()});
      updateHud();
      beep(880,0.15,"triangle");
      wildMonEl.classList.remove('hidden-mon');
      wildMonEl.textContent = "✨";
      encText.textContent = nick + " was added to the Visitor Pokédex! Thanks for stopping by.";
      encActions.innerHTML = '<button class="btn-a" id="doneCatch">NICE!</button>';
      document.getElementById('doneCatch').addEventListener('click', endEncounter);
    });
  }

  /* ============ SOUND ============ */
  let actx;
  function beep(freq, dur, type){
    try{
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type || 'square';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g); g.connect(actx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur||0.05));
      o.stop(actx.currentTime + (dur||0.05) + 0.02);
    }catch(e){ /* audio not available */ }
  }

  updateHud();

  /* ============ RESPONSIVE SCALE ============ */
  const outer = document.getElementById('scaleOuter');
  const inner = document.getElementById('scaleInner');
  const CONSOLE_W = 604, CONSOLE_H = 620;
  function rescale(){
    const avail = Math.min(window.innerWidth - 24, 604);
    const scale = Math.min(1, avail / CONSOLE_W);
    inner.style.transform = "scale("+scale+")";
    outer.style.width = (CONSOLE_W*scale)+"px";
    outer.style.height = (CONSOLE_H*scale)+"px";
  }
  window.addEventListener('resize', rescale);
  rescale();

})();
