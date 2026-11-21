(()=>{
if(window.__nebInit)return;window.__nebInit=1;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- loops + drawn demos: run only while 30% visible, never under reduced motion ----- */
if(!RM&&'IntersectionObserver'in window){
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    const el=en.target,v=el.tagName==='VIDEO'?el:null;
    if(en.isIntersecting){el.classList.add('on');if(v)v.play().catch(()=>{})}
    else{el.classList.remove('on');if(v)v.pause()}
  }),{threshold:.3});
  $$('video.loop,.demo,.mini').forEach(el=>io.observe(el));
}

/* ----- film lightbox ----- */
const lb=$('#lb'),lbv=$('#lbv'),bfilm=$('#b-film');
if(lb&&bfilm){
  const close=()=>{lbv.pause();lb.hidden=true;document.body.classList.remove('lb-open');bfilm.focus()};
  bfilm.addEventListener('click',()=>{
    lb.hidden=false;document.body.classList.add('lb-open');
    const t=lbv.textTracks&&lbv.textTracks[0];if(t)t.mode='showing';
    lbv.focus();lbv.play().catch(()=>{});
  });
  $('#lb-x').addEventListener('click',close);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  lb.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();close();return}
    if(e.key!=='Tab')return;
    const f=[lbv,$('#lb-x')],i=f.indexOf(document.activeElement);
    e.preventDefault();f[(i+(e.shiftKey?f.length-1:1))%f.length].focus();
  });
}

/* ----- waitlist (sources: hero, send-to-me, final_cta) ----- */
const ok=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function join(email,source){
  try{const r=await fetch('/api/waitlist',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source})});
    if(r.status===409)return'dup';if(!r.ok)return'err';const j=await r.json().catch(()=>({}));return j.emailed===false?'noemail':'ok'}catch(e){return'err'}
}
const FORMS={hero:{source:'hero',cta:'join the waitlist'},final:{source:'final_cta',cta:'join the waitlist'}};
const sendme=$('#sendme');
if(sendme)sendme.addEventListener('click',()=>{FORMS.hero.source='send-to-me';FORMS.hero.cta='send it to me';$('#b-hero').textContent='send it to me';$('#m-hero').textContent="we'll email you a link to open on your laptop.";$('#e-hero').focus()});
document.addEventListener('submit',async e=>{
  const id=(e.target.id||'').replace(/^f-/,''),cfg=FORMS[id];if(!cfg)return;e.preventDefault();
  const i=$('#e-'+id),m=$('#m-'+id),b=$('#b-'+id),email=i.value.trim();
  if(!ok(email)){m.textContent='that email looks off. check it and try again.';i.focus();return}
  b.disabled=true;b.textContent='joining…';const res=await join(email,cfg.source);
  if(res==='err'){b.disabled=false;b.textContent=cfg.cta;m.textContent="couldn't save that. check the email and try again.";return}
  const msg=res==='noemail'?"✓ you're on the list, but we couldn't send your email. we'll email you when neb is ready."
    :cfg.source==='send-to-me'?'✓ sent. open the link on your laptop.'
    :res==='dup'?"✓ you're already on the list.":"✓ you're on the list. we'll email you when neb is ready.";
  e.target.outerHTML=`<p class="done" role="status">${msg}</p>`;m.textContent='windows first · mac coming soon.';
});

/* ----- pro fake door (docs/PRO_TEST.md): counts the click, never charges ----- */
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
