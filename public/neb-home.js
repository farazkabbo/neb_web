/* neb home: the desktop around the windows (docs/SITE_V3.md). Demos live in /demos/*.js and load
   when their window comes into view. No analytics, no network except the forms. */
(()=>{
if(window.__nebInit)return;window.__nebInit=1;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer: fine)').matches;
const ROOT=$('#neb-root');
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ----- ui sounds: off by default, tiny WebAudio blips ----- */
let soundOn=false,ac=null;
function sound(kind){
  if(!soundOn)return;
  try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
    o.type=kind==='warn'?'square':'triangle';o.frequency.value={click:660,pop:880,ok:520,warn:196}[kind]||600;
    g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+.15)}catch(e){}
}
const snd=$('#tb-snd');
snd.addEventListener('click',()=>{soundOn=!soundOn;snd.setAttribute('aria-pressed',String(soundOn));snd.textContent=soundOn?'🔊':'🔈';sound('pop')});

const live=(stage,text)=>{const l=stage.querySelector('.live');if(!l)return;l.textContent='';setTimeout(()=>{l.textContent=text},40)};
const wait=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,40):ms));
const API={RM,FINE,sound,live,wait};

/* ----- sky + clock: one night, 11:47 pm at the top to 7:00 am at the bottom ----- */
const dawn=$('.sky .dawn'),stars=$('.sky .stars'),clock=$('#tb-clock');
let lastP=-1;
function sky(){
  const max=document.documentElement.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
  if(Math.abs(p-lastP)<.0005)return;lastP=p;
  dawn.style.opacity=Math.min(1,Math.max(0,(p-.3)/.6)).toFixed(3);
  stars.style.opacity=(1-Math.min(1,p/.75)).toFixed(3);
  if(!RM)stars.style.transform=`translate3d(0,${(-p*140).toFixed(1)}px,0)`;
  const m=Math.round(1427+433*p)%1440,h=Math.floor(m/60);
  clock.textContent=`${(h%12)||12}:${String(m%60).padStart(2,'0')} ${h<12?'AM':'PM'}`;
}
let skyQ=false;
addEventListener('scroll',()=>{if(skyQ)return;skyQ=true;requestAnimationFrame(()=>{skyQ=false;sky()})},{passive:true});
addEventListener('resize',()=>{lastP=-1;sky()});sky();

/* ----- windows: front, open, minimize, maximize, drag ----- */
const wins=$$('[data-win]');let z=10;
const front=w=>{w.style.zIndex=String(++z)};
function openWin(w){
  if(!w)return;restore(w);front(w);
  w.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});
  w.setAttribute('tabindex','-1');setTimeout(()=>w.focus({preventScroll:true}),RM?0:450);
  w.classList.remove('flash');void w.offsetWidth;w.classList.add('flash');sound('pop');
}
function minimize(w){if(w.classList.contains('max'))toggleMax(w);w.classList.add('min');if(w.contains(document.activeElement)){const t=tabFor(w);t?t.focus():snd.focus()}renderTabs()}
function restore(w){w.classList.remove('min');renderTabs()}
let maxed=null;const back=$('#maxback');
function toggleMax(w){
  if(maxed&&maxed!==w)toggleMax(maxed);
  if(w.classList.contains('max')){w.classList.remove('max');w._ph&&w._ph.remove();w._ph=null;back.hidden=true;maxed=null;w.scrollIntoView({block:'center'});return}
  restore(w);const ph=document.createElement('div');ph.className='ph';ph.style.height=w.offsetHeight+'px';ph.style.width=w.offsetWidth+'px';w.before(ph);w._ph=ph;
  w.classList.add('max');back.hidden=false;maxed=w;front(w);w.setAttribute('tabindex','-1');w.focus({preventScroll:true});
  dispatchEvent(new Event('resize'));
}
back.addEventListener('click',()=>maxed&&toggleMax(maxed));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&maxed){toggleMax(maxed)}});
document.addEventListener('click',e=>{const b=e.target.closest('.ctl button');if(!b)return;const w=b.closest('[data-win]');sound('click');b.dataset.act==='max'?toggleMax(w):minimize(w)});
document.addEventListener('dblclick',e=>{const bar=e.target.closest('[data-drag]');if(bar&&!e.target.closest('button'))toggleMax(bar.closest('[data-win]'))});

const canDrag=()=>FINE&&innerWidth>=900;
document.addEventListener('pointerdown',e=>{
  const w=e.target.closest('[data-win]');if(w)front(w);
  const bar=e.target.closest('[data-drag]');
  if(!bar||!canDrag()||e.button!==0||e.target.closest('button'))return;
  const win=bar.closest('[data-win]');if(win.classList.contains('max'))return;
  const p=win._pos||{x:0,y:0},sx=e.clientX-p.x,sy=e.clientY-p.y;
  win.classList.add('dragging');bar.setPointerCapture(e.pointerId);
  const mv=ev=>{win._pos={x:ev.clientX-sx,y:ev.clientY-sy};win.style.setProperty('--dx',win._pos.x+'px');win.style.setProperty('--dy',win._pos.y+'px')};
  const up=()=>{win.classList.remove('dragging');bar.removeEventListener('pointermove',mv);bar.removeEventListener('pointerup',up);bar.removeEventListener('pointercancel',up);dispatchEvent(new Event('resize'))};
  bar.addEventListener('pointermove',mv);bar.addEventListener('pointerup',up);bar.addEventListener('pointercancel',up);
});

/* open animation for windows below the first screen */
if(!RM&&'IntersectionObserver'in window){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('pre');en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:0,rootMargin:'0px 0px -8% 0px'});
  wins.forEach(w=>{if(w.getBoundingClientRect().top>innerHeight){w.classList.add('pre');io.observe(w)}});
}

/* ----- taskbar: one tab per window, the one in view is pressed ----- */
const tabs=$('#tb-tabs');
const tabFor=w=>tabs.querySelector(`[data-for="${w.id}"]`);
function renderTabs(){
  if(!tabs.children.length)tabs.innerHTML=wins.map(w=>`<button type="button" class="tab" data-for="${w.id}">${w.dataset.win}</button>`).join('');
  wins.forEach(w=>{const t=tabFor(w);if(t)t.classList.toggle('min',w.classList.contains('min'))});
}
renderTabs();
tabs.addEventListener('click',e=>{const t=e.target.closest('.tab');if(t)openWin(document.getElementById(t.dataset.for))});
if('IntersectionObserver'in window){
  const seen=new IntersectionObserver(es=>es.forEach(en=>{const t=tabFor(en.target);if(t)t.classList.toggle('on',en.isIntersecting)}),{threshold:.35});
  wins.forEach(w=>seen.observe(w));
}
$('#tb-top').addEventListener('click',()=>{scrollTo({top:0,behavior:RM?'auto':'smooth'});sound('click')});

/* ----- desktop icons: double-click (tap / Enter) opens the window ----- */
$$('.icon').forEach(b=>{
  const go=()=>openWin(document.getElementById(b.dataset.open));
  b.addEventListener('click',e=>{if(!FINE||e.detail===0)return go();$$('.icon').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')});
  b.addEventListener('dblclick',go);
});

/* ----- demos: load each one when its window is in view ----- */
const booted=new WeakSet();
function boot(stage){
  if(booted.has(stage))return;booted.add(stage);
  import(`/demos/${stage.dataset.demo}.js`).then(m=>m.init(stage,API)).then(()=>stage.classList.add('ready')).catch(err=>console.warn('neb demo',stage.dataset.demo,err));
}
if('IntersectionObserver'in window){
  const dio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){dio.unobserve(en.target);boot(en.target)}}),{threshold:.2});
  $$('[data-demo]').forEach(s=>dio.observe(s));
}else $$('[data-demo]').forEach(boot);

/* ----- the film: loop until played, custom skin, chapter sync with the demo windows ----- */
const film=$('#film'),loop=$('#loop'),fwin=$('#w-film');
const CH=$$('.mark').map(el=>({id:el.dataset.chapter,at:+el.dataset.at,el}));
const fmt=t=>{t=Math.max(0,Math.floor(t||0));return`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`};
let started=false;
function startFilm(at){
  if(!film)return;
  if(!started){
    started=true;if(loop){loop.pause();loop.hidden=true}
    film.hidden=false;$('#b-film').hidden=true;$('#muted-tag').hidden=true;$('#skin').hidden=false;film.muted=false;setCC(true);
  }
  const go=()=>{try{film.currentTime=at||0}catch(e){}};
  film.readyState>=1?go():film.addEventListener('loadedmetadata',go,{once:true});
  film.play().catch(()=>{});
}
function seekChapter(id){
  const c=CH.find(x=>x.id===id);
  fwin.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});
  if(!film){fwin.classList.remove('flash');void fwin.offsetWidth;fwin.classList.add('flash');return}
  startFilm(c?c.at:0);
}
document.addEventListener('click',e=>{const s=e.target.closest('[data-seek]');if(s){e.stopPropagation();sound('click');seekChapter(s.dataset.seek)}});
function setCC(on){if(!film)return;const t=film.textTracks&&film.textTracks[0],b=$('#sk-cc');if(t)t.mode=on?'showing':'hidden';if(b)b.setAttribute('aria-pressed',String(on))}
if(film){
  if(loop&&!RM&&'IntersectionObserver'in window){
    new IntersectionObserver(es=>es.forEach(en=>{if(started)return;en.isIntersecting?loop.play().catch(()=>{}):loop.pause()}),{threshold:.3}).observe(loop);
  }
  const fill=$('#sk-fill'),time=$('#sk-time'),trk=$('#sk-track'),play=$('#sk-play'),mute=$('#sk-mute');
  $('#b-film').addEventListener('click',()=>{sound('pop');startFilm(0)});
  const toggle=()=>{film.paused?film.play().catch(()=>{}):film.pause()};
  play.addEventListener('click',toggle);
  film.addEventListener('click',toggle);
  film.addEventListener('play',()=>{play.textContent='❚❚';play.setAttribute('aria-label','pause')});
  film.addEventListener('pause',()=>{play.textContent='▶';play.setAttribute('aria-label','play');sync()});
  film.addEventListener('loadedmetadata',()=>{const d=film.duration;if(d&&isFinite(d)){trk.setAttribute('aria-valuemax',String(Math.round(d)));CH.forEach(c=>{c.el.style.left=(c.at/d*100)+'%'})}});
  function sync(){
    const d=film.duration||59,t=film.currentTime;
    fill.style.width=(t/d*100).toFixed(2)+'%';time.textContent=`${fmt(t)} / ${fmt(d)}`;
    trk.setAttribute('aria-valuenow',String(Math.round(t)));trk.setAttribute('aria-valuetext',fmt(t));
    let cur=null;for(const c of CH)if(t>=c.at)cur=c;
    const on=!!cur&&!film.paused;
    CH.forEach(c=>c.el.classList.toggle('lit',on&&c===cur));
    $$('.feat[data-chapter]').forEach(w=>w.classList.toggle('glow',on&&w.dataset.chapter===cur.id));
  }
  film.addEventListener('timeupdate',sync);
  film.addEventListener('ended',()=>{sync();$('#b-film').hidden=false;$('#muted-tag').hidden=false;$('#b-film').childNodes[1].textContent=' watch again · 59s ';started=false;film.hidden=true;if(loop){loop.hidden=false}});
  trk.addEventListener('click',e=>{if(e.target.closest('.mark'))return;const r=trk.getBoundingClientRect();film.currentTime=(film.duration||59)*Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))});
  trk.addEventListener('keydown',e=>{const k={ArrowRight:5,ArrowLeft:-5}[e.key];if(k){e.preventDefault();film.currentTime=Math.max(0,film.currentTime+k)}if(e.key==='Home'){e.preventDefault();film.currentTime=0}});
  CH.forEach(c=>c.el.addEventListener('click',()=>startFilm(c.at)));
  mute.addEventListener('click',()=>{film.muted=!film.muted;mute.setAttribute('aria-pressed',String(film.muted));mute.textContent=film.muted?'🔇':'🔊';mute.setAttribute('aria-label',film.muted?'unmute':'mute');if(!film.muted)setCC(true)});
  const ccb=$('#sk-cc');if(ccb)ccb.addEventListener('click',()=>{const t=film.textTracks[0];setCC(!(t&&t.mode==='showing'))});
  $('#sk-fs').addEventListener('click',()=>{document.fullscreenElement?document.exitFullscreen():fwin.requestFullscreen&&fwin.requestFullscreen().catch(()=>{})});
  fwin.addEventListener('keydown',e=>{
    if(!started||e.target.closest('input'))return;
    const k=e.key.toLowerCase();
    if(k===' '||k==='k'){if(e.target.tagName==='BUTTON'&&k===' ')return;e.preventDefault();toggle()}
    else if(k==='m')mute.click();else if(k==='c'&&ccb)ccb.click();else if(k==='f')$('#sk-fs').click();
    else if(e.key==='ArrowRight'&&e.target!==trk)film.currentTime+=5;else if(e.key==='ArrowLeft'&&e.target!==trk)film.currentTime-=5;
  });
}

/* ----- companion cursor: trails the pointer, at most 3 hints a visit ----- */
const HINTS={circle:'psst — hold alt and circle that',show:'try putting the logo on the back',catch:'go on. try running it.',do:'let neb rename those'};
if(FINE&&!RM&&store.get('neb-hints-off')!=='1'){
  const bud=$('#buddy'),hint=$('#buddy-hint'),txt=hint.firstElementChild;let tx=-80,ty=-80,x=-80,y=-80,raf=0,shown=0,hideT=0;
  const step=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;bud.style.transform=`translate3d(${(x+16).toFixed(1)}px,${(y+14).toFixed(1)}px,0)`;hint.style.transform=`translate3d(${(x+40).toFixed(1)}px,${(y+20).toFixed(1)}px,0)`;raf=Math.abs(tx-x)+Math.abs(ty-y)>.4?requestAnimationFrame(step):0};
  addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;if(bud.hidden&&store.get('neb-hints-off')!=='1'){bud.hidden=false;x=e.clientX;y=e.clientY}tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(step)},{passive:true});
  const said=new Set();
  $$('[data-demo]').forEach(s=>s.addEventListener('pointerenter',()=>{
    const k=s.dataset.demo;if(shown>=3||said.has(k)||s.classList.contains('used'))return;said.add(k);shown++;
    txt.textContent=HINTS[k];hint.hidden=false;clearTimeout(hideT);hideT=setTimeout(()=>{hint.hidden=true},4200);
  }));
  hint.querySelector('button').addEventListener('click',()=>{store.set('neb-hints-off','1');hint.hidden=true;bud.hidden=true});
}

/* ----- forms: waitlist (hero / send-to-me / final_cta), mac email, pro ----- */
const ok=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function post(url,body){
  try{const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    if(r.status===409)return'dup';if(!r.ok)return'err';const j=await r.json().catch(()=>({}));return j.emailed===false?'noemail':'ok'}catch(e){return'err'}
}
const FORMS={hero:{url:'/api/waitlist',source:'hero',cta:'join the waitlist'},final:{url:'/api/waitlist',source:'final_cta',cta:'join the waitlist'},
  'mac-hero':{url:'/api/download-link',source:'download_mac',cta:'email me'},'mac-final':{url:'/api/download-link',source:'download_mac',cta:'email me'}};
const sendme=$('#sendme');
if(sendme)sendme.addEventListener('click',()=>{Object.assign(FORMS.hero,{source:'send-to-me',cta:'send it to me'});$('#b-hero').textContent='send it to me';$('#m-hero').textContent="we'll email you a link to open on your laptop.";$('#e-hero').focus()});
document.addEventListener('submit',async e=>{
  const id=(e.target.id||'').replace(/^f-/,''),cfg=FORMS[id];if(!cfg)return;e.preventDefault();
  const i=$('#e-'+id),m=$('#m-'+id),b=$('#b-'+id),email=i.value.trim(),company=e.target.company?e.target.company.value:'';
  if(!ok(email)){m.textContent='that email looks off. check it and try again.';i.focus();return}
  b.disabled=true;b.textContent='sending…';
  const res=await post(cfg.url,{email,source:cfg.source,company});
  if(res==='err'){b.disabled=false;b.textContent=cfg.cta;m.textContent="couldn't save that. check the email and try again.";return}
  const msg=cfg.url==='/api/download-link'?"✓ sent. check your inbox."
    :res==='noemail'?"✓ you're on the list, but we couldn't send your email. we'll email you when neb is ready."
    :cfg.source==='send-to-me'?'✓ sent. open the link on your laptop.'
    :res==='dup'?"✓ you're already on the list.":"✓ you're on the list. we'll email you when neb is ready.";
  e.target.outerHTML=`<p class="done" role="status">${msg}</p>`;sound('ok');
});

const pro=body=>fetch('/api/pro',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true});
const bpro=$('#b-pro');
if(bpro)bpro.addEventListener('click',()=>{
  pro({action:'click'}).catch(()=>{});
  $('#pro-b').innerHTML=`<h2 id="pro-h">pro is launching next month.</h2><p>add your email and you're in early access, at no charge. nothing to pay today.</p><form class="wl" id="f-pro" novalidate><label class="sr" for="e-pro">email</label><input id="e-pro" type="email" placeholder="you@email.com" autocomplete="email" required><input name="company" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp"><button class="btn go" id="b-pro2">get early access</button></form><p class="micro" id="m-pro" role="status"></p>`;
  $('#e-pro').focus();
});
document.addEventListener('submit',async e=>{if(e.target.id!=='f-pro')return;e.preventDefault();
  const i=$('#e-pro'),m=$('#m-pro'),b=$('#b-pro2'),email=i.value.trim();
  if(!ok(email)){m.textContent='that email looks off. check it and try again.';i.focus();return}
  b.disabled=true;b.textContent='adding…';
  const r=await pro({action:'join',email,company:e.target.company.value}).catch(()=>null);
  if(!r||!r.ok){b.disabled=false;b.textContent='get early access';const j=r?await r.json().catch(()=>({})):{};m.textContent=(j.error||"couldn't save that. try again.").toLowerCase();return}
  $('#pro-b').innerHTML='<h2 id="pro-h">you’re in.</h2><p class="done" role="status">✓ pro is launching next month. you’ve been added to early access at no charge today.</p>';
});
})();
