
(()=>{
if(window.__nebInit)return;window.__nebInit=1;
const ROOT=document.getElementById('neb-root');
const MEDIA={loop:'/media/different-4k.mp4',teaser:'/media/teaser-16x9.mp4',teaserTall:'/media/teaser-9x16.mp4'};
const $=s=>document.querySelector(s), RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)), seg=(p,a,b)=>cl((p-a)/(b-a));
const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const win=(p,arr)=>Math.max(0,...arr.map(([a,b,c,d])=>Math.min(seg(p,a,b),1-seg(p,c,d))));
const story=$('#story'),pin=$('#pin'),stage=$('#stage'),jit=$('#jit'),LK=document.getElementById('lockd');
const E={}; ['w-hero','w-hw','w-ans','w-tab','w-quiz','w-err','note','ic-hw','ic-ans','ic-nb','ic-bin','you','neb','chip','pencil','typed','caret','mu','dots','mb','mm','pasted','act1','act2','l1','l2','l3','l4','l5','l6','p6','circ','strike','t1','t2','qv','qc','stamp','rwbtn','tip','ring','bub','binball','capt','rw','rwband','end','clock','prog','tasks','wpGrey','wpDawn','stars'].forEach(id=>E[id]=document.getElementById(id));

/* ----- layouts (stage units) ----- */
const LAY={
 L:{W:1280,H:800,home:[800,600],pos:{'w-hero':[330,92,620],'w-hw':[130,64,440],'note':[592,44,150],'w-ans':[730,176,460],'w-tab':[360,36,600],'w-quiz':[400,190,500],'w-err':[460,330,390],'ic-hw':[24,36],'ic-ans':[24,136],'ic-nb':[24,236],'ic-bin':[1170,660]}},
 P:{W:420,H:800,home:[300,600],pos:{'w-hero':[12,84,396],'w-hw':[12,78,396],'note':[262,52,136],'w-ans':[12,440,396],'w-tab':[12,78,396],'w-quiz':[22,230,376],'w-err':[30,440,360],'ic-hw':[14,690],'ic-ans':[104,690],'ic-nb':[194,690],'ic-bin':[324,690]}}
};
let LY='L',S=1;
function layout(){
  const vw=innerWidth,vh=pin.clientHeight,P=vw/vh<.85;LY=P?'P':'L';pin.classList.toggle('P',P);
  const l=LAY[LY],tb=46,top=P?54:0;
  S=Math.min(vw/l.W,(vh-tb-top)/l.H);
  const x=(vw-l.W*S)/2,y=top+Math.max(0,(vh-tb-top-l.H*S)/2);
  stage.style.width=l.W+'px';stage.style.height=l.H+'px';
  stage.style.transform=`translate(${x}px,${y}px) scale(${S})`;
  for(const[id,v]of Object.entries(l.pos)){const e=E[id];e.style.left=v[0]+'px';e.style.top=v[1]+'px';if(v[2])e.style.width=v[2]+'px'}
  const cap=$('#cap');if(P){cap.style.top='10px';cap.style.bottom='auto'}else{cap.style.top='auto';cap.style.bottom='64px'}
  let sh=[];for(let i=0;i<90;i++){const r=Math.sin(i*12.9898)*43758.5453;const a=r-Math.floor(r),b=(Math.sin(i*78.233)*43758.5453)%1;sh.push(`${Math.floor(a*vw)}px ${Math.floor(Math.abs(b)*vh*.8)}px 0 ${i%7?'0':'1px'} rgba(244,240,230,${.25+(i%5)*.12})`)}
  E.stars.style.boxShadow=sh.join(',');
}
/* point inside an element, in stage units */
function pt(el,fx=.5,fy=.5){const r=el.getBoundingClientRect(),s=stage.getBoundingClientRect();return[(r.left+r.width*fx-s.left)/S,(r.top+r.height*fy-s.top)/S]}
function tip(el,k){return pt(el,.04+.92*k,.62)}
function setWin(el,o,lift=0){el.style.opacity=o;el.style.visibility=o>.002?'visible':'hidden';el.style.transform=`translateY(${lift*(1-o)}px) scale(${.93+.07*o})`}
function track(p,kf,tm){
  if(p<=kf[0][0])return kf[0][1]();
  for(let i=1;i<kf.length;i++){if(p<=kf[i][0]){const[a,fa]=kf[i-1],[b,fb,lin]=kf[i];let k=seg(p,a,b);k=lin?k:ease(k);const A=fa(),B=fb();return[A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k]}}
  return kf[kf.length-1][1]();
}
const home=()=>LAY[LY].home, nebHome=()=>[LY==='L'?30:20,LAY[LY].H+40];
const youKF=[[0,home],[.09,home],[.152,()=>pt(E['ic-ans'],.5,.3)],[.17,()=>pt(E['ic-ans'],.5,.3)],[.188,()=>pt(E.typed.parentNode,.2,.5)],[.236,()=>pt(E.typed.parentNode,.75,.5)],[.27,()=>pt(E.mb,.5,.5)],[.287,()=>pt(E.mb,.5,.5)],[.333,()=>pt(E.pasted,.3,.5)],[.372,home],[.4,()=>pt(E.qv.parentNode,.5,.6)],[.412,()=>pt(E.qv.parentNode,.5,.6)],[.428,()=>pt(E['ic-ans'],.5,.3)],[.446,()=>pt(E['ic-ans'],.5,.3)],[.47,()=>pt(E.rwbtn,.5,.5)],[.49,()=>pt(E.rwbtn,.5,.5)],[.55,home],[.85,home],[.868,()=>pt(E.qv.parentNode,.6,.6)],[.95,()=>pt(E.qv.parentNode,.6,.6)]];
const nebKF=[[.572,nebHome],[.6,()=>pt(E.l1,1,.1)],[.645,()=>pt(E.l2,1.02,.1)],[.663,()=>pt(E.p6,.85,.95)],[.69,()=>pt(E.p6,.85,.95)],[.735,()=>pt(E.l3,1.02,.1)],[.752,()=>pt(E.l4,1,.3)],[.778,()=>pt(E.l4,1,.6)],[.784,()=>pt(E.l5,1.1,-.3)],[.80,()=>pt(E.l5,1.15,-.2)],[.826,()=>pt(E.l6,1,.1)],[.85,()=>pt(E.l6,1,.1)],[.876,()=>pt(E.qv.parentNode,1.25,.4)],[.95,()=>pt(E.qv.parentNode,1.25,.4)]];
const CAP=[[.066,.15,'11:47 pm. homework due at 8.'],[.155,.252,'the fastest way out.'],[.258,.345,'done in nine seconds.'],[.382,.44,'8:02 am. pop quiz.'],[.448,.488,'the answer was never yours.'],[.5,.552,'let’s try that again.'],[.558,.625,'same night. same homework. one difference.'],[.64,.71,'we can’t show you this part yet.'],[.74,.836,'but something changed.'],[.862,.93,'8:02 am. this time, it stayed.']];
const LINES=[['l1',.598,.618],['l2',.622,.645],['l3',.714,.735],['l4',.738,.75],['l5',.784,.80],['l6',.804,.826]];
const STUDENT=new Set(['l1','l2','l3','l4','l5','l6']);
let lastTasks='',lastCap='';
function clockStr(p){
  let m;
  if(p<.37)m=1427+9*seg(p,.06,.35);else if(p<.495)m=1922+2*seg(p,.38,.49);
  else if(p<.556)m=1922-495*ease(seg(p,.497,.55));else if(p<.845)m=1427+34*seg(p,.56,.84);else m=1922+3*seg(p,.85,1);
  m=Math.floor(m)%1440;const h=Math.floor(m/60),mm=m%60;return`${(h%12)||12}:${String(mm).padStart(2,'0')} ${h<12?'AM':'PM'}`;
}
function render(p,now){
  const wob=RM?0:1, P=LY==='P';
  E.wpGrey.style.opacity=win(p,[[.37,.392,.5,.54]]);
  E.wpDawn.style.opacity=seg(p,.845,.878);
  setWin(E['w-hero'],1-seg(p,.03,.062),60);
  E.note.style.opacity=win(p,[[.065,.082,.355,.37],[.56,.576,.835,.85]]);
  setWin(E['w-hw'],win(p,[[.065,.09,.355,.375],[.56,.58,.835,.85]]));
  setWin(E['w-ans'],win(p,[[.163,.18,.345,.362]]));
  setWin(E['w-tab'],Math.max(win(p,[[.255,.275,.35,.368]]),win(p,[[.585,.605,.838,.856]])));
  setWin(E['w-quiz'],win(p,[[.382,.4,.488,.5],[.852,.868,.925,.94]]));
  setWin(E['w-err'],win(p,[[.445,.455,.488,.497]]));
  ['ic-hw','ic-ans','ic-nb','ic-bin'].forEach(id=>E[id].style.opacity=E[id].classList.contains('dis')?'':1-seg(p,.925,.945));
  /* answers.exe */
  const q='just give me the answer',n=Math.round(q.length*seg(p,.19,.232));
  E.typed.textContent=p<.236?q.slice(0,n):'';E.caret.style.display=p>.18&&p<.236?'':'none';
  E.mu.style.opacity=p>=.236?1:0;E.dots.style.opacity=p>=.238&&p<.25?1:0;E.mb.style.opacity=p>=.25?1:0;E.mm.style.opacity=p>=.256?1:0;
  /* act 1 tablet */
  E.act1.style.display=p<.5?'':'none';E.act2.style.display=p>=.5?'':'none';
  E.pasted.style.opacity=seg(p,.333,.34);
  const lk=seg(p,.6,.616);E.act2.style.filter=p>=.5&&lk?`blur(${(8*lk).toFixed(1)}px) grayscale(${.4*lk})`:'';setWin(LK,p>.5?Math.min(lk,1-seg(p,.836,.852)):0);
  /* act 2 handwriting */
  let pen=null;
  for(const[id,a,b]of LINES){const k=seg(p,a,b),el=E[id];el.style.clipPath=k>=1?'none':`inset(-10% ${100-100*k}% -10% 0)`;if(STUDENT.has(id)&&p>=a&&p<=b+.004)pen=tip(el,k)}
  const sk=seg(p,.703,.712);E.strike.style.transform=`scaleX(${sk})`;if(p>=.703&&p<=.716)pen=pt(E.strike,sk,.5);
  E.circ.style.strokeDashoffset=1-seg(p,.664,.684);E.t1.style.strokeDashoffset=1-seg(p,.752,.76);E.t2.style.strokeDashoffset=1-seg(p,.828,.836);
  if(pen){E.pencil.style.opacity=1;E.pencil.style.transform=`translate(${pen[0]-4}px,${pen[1]-26}px)`}else E.pencil.style.opacity=0;
  /* quiz */
  const a2=p>.8;E.qv.textContent=a2&&p>=.874?'5':'';E.qc.style.display=(!a2||p<.874)?'':'none';
  const st=seg(p,.884,.894);E.stamp.style.opacity=a2?st:0;E.stamp.style.transform=`rotate(-8deg) scale(${1.5-.5*st})`;
  E['ic-ans'].classList.toggle('dis',p>.39&&p<.49);E.tip.style.opacity=p>.405&&p<.446?1:0;
  E.rwbtn.classList.toggle('press',p>.478&&p<.49);
  E.binball.style.opacity=p>.486&&p<.52?1:0;
  /* cursors */
  const w=t=>wob*Math.sin(now/700+t)*2.2;
  const y=track(p,youKF);E.you.style.transform=`translate(${y[0]+w(0)}px,${y[1]+w(2)}px)`;
  E.you.style.opacity=win(p,[[.06,.075,.565,.58],[.85,.862,.93,.945]]);
  const ck=[.161,.165,.288,.334,.484].reduce((m,t)=>Math.max(m,1-Math.abs(p-t)/.005),0);E.ring.style.opacity=cl(ck);E.ring.style.transform=`scale(${1+.8*(1-cl(ck))})`;
  const nb=track(p,nebKF);E.neb.style.transform=`translate(${nb[0]+w(1)}px,${nb[1]+w(3)}px)`;
  E.neb.style.opacity=win(p,[[.572,.585,.93,.945]]);
  const bt=p>.686&&p<.742?'shh.':p>.772&&p<.83?'launch day.':p>.88&&p<.93?'that one’s yours now.':'';
  if(E.bub.textContent!==bt&&bt)E.bub.textContent=bt;E.bub.classList.toggle('flip',nb[0]>LAY[LY].W-240);E.bub.style.opacity=bt?1:0;
  /* chip */
  if(p>.284&&p<.335){E.chip.style.opacity=1;E.chip.style.transform=`translate(${y[0]+14}px,${y[1]+16}px)`}
  else if(p>.455&&p<.487){const k=ease(seg(p,.456,.486)),A=pt(E['w-err'],.22,.92),B=pt(E['ic-bin'],.5,.15);E.chip.style.opacity=1-seg(p,.48,.487);E.chip.style.transform=`translate(${A[0]+(B[0]-A[0])*k-30}px,${A[1]+(B[1]-A[1])*k-16-80*Math.sin(Math.PI*k)}px) rotate(${260*k}deg) scale(${1-.65*k})`}
  else E.chip.style.opacity=0;
  /* rewind */
  const rw=win(p,[[.49,.5,.545,.556]]);E.rw.style.opacity=rw;E.rwband.style.top=((p*5200)%130-15)+'%';
  jit.style.transform=rw?`translateX(${Math.sin(p*2300)*6*rw}px) skewX(${Math.sin(p*900)*2*rw}deg)`:'';jit.style.filter=rw?`saturate(${1-.6*rw}) contrast(${1+.2*rw})`:'';
  /* caption */
  let ct='',co=0;for(const[a,b,t]of CAP){if(p>=a&&p<=b){ct=t;co=Math.min(seg(p,a,a+.006),1-seg(p,b-.006,b))}}
  if(ct&&ct!==lastCap){E.capt.textContent=ct;lastCap=ct}E.capt.style.opacity=co;
  /* end card + stage fade */
  const en=seg(p,.94,.965);E.end.style.opacity=en;E.end.style.pointerEvents=en>.5?'auto':'none';E.end.style.transform=`translateY(${12*(1-en)}px)`;
  /* taskbar */
  E.clock.textContent=clockStr(p);E.prog.style.width=(p*100).toFixed(2)+'%';
  const open=[['w-hero','neb.exe'],['w-hw','homework.pdf'],['w-ans','answers.exe'],['w-tab','notebook'],['w-quiz','pop_quiz.exe']].filter(([id])=>+E[id].style.opacity>.5).map(x=>x[1]);
  const key=open.join('|');if(key!==lastTasks){lastTasks=key;E.tasks.innerHTML='<span class="tbtn" id="start"><svg><use href="#mk"/></svg>neb</span>'+open.map((t,i)=>`<span class="tbtn${i===open.length-1?' on':''}">${t}</span>`).join('')}
}
function progress(){const r=story.getBoundingClientRect();return cl(-r.top/(story.offsetHeight-pin.clientHeight))}
function loop(now){render(progress(),now);requestAnimationFrame(loop)}
addEventListener('resize',layout);layout();requestAnimationFrame(loop);
window.__render=p=>render(p,0);window.__layout=layout;

/* ----- boot (first visit only) ----- */
const boot=$('#boot');
const BL=['neb os 0.1','checking notebook ......... <span class="dim">ok</span>','checking pencil ........... <span class="dim">ok</span>','checking understanding .... <span class="bad">not found</span>','starting neb ...'];
let seen=false;try{seen=sessionStorage.getItem('neb-boot')==='1';sessionStorage.setItem('neb-boot','1')}catch(e){}
function endBoot(){if(!boot)return;boot.classList.add('off');setTimeout(()=>boot.remove(),400)}
if(!boot){}else if(RM||seen||location.hash){boot.remove()}else{boot.hidden=false;BL.forEach((l,i)=>setTimeout(()=>{if(boot.isConnected)boot.insertAdjacentHTML('beforeend',`<div>${l}</div>`)},120+i*260));setTimeout(endBoot,1750);['wheel','keydown','pointerdown','touchstart'].forEach(ev=>addEventListener(ev,endBoot,{once:true,passive:true}))}

/* ----- scroll buttons ----- */
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();const t=document.querySelector(g.dataset.go);if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})}});

/* ----- waitlist ----- */
const ok=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function join(email,source){
  try{const r=await fetch('/api/waitlist',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source})});
    if(r.status===409)return'dup';if(!r.ok)return'err';const j=await r.json().catch(()=>({}));return j.emailed===false?'noemail':'ok'}catch(e){return'err'}
}
let heroSource='hero';
$('#sendme').addEventListener('click',()=>{heroSource='send-to-me';$('#b-hero').textContent='send it to me';$('#m-hero').textContent="we'll email you a link to open on your laptop.";$('#e-hero').focus()});
$('#f-hero').addEventListener('submit',async e=>{e.preventDefault();const i=$('#e-hero'),m=$('#m-hero'),b=$('#b-hero');
  if(!ok(i.value.trim())){m.textContent='that email looks off. check it and try again.';i.focus();return}
  b.disabled=true;b.textContent='joining…';const res=await join(i.value.trim(),heroSource);
  if(res==='err'){b.disabled=false;b.textContent=heroSource==='send-to-me'?'send it to me':'join the waitlist';m.textContent="couldn't save that. check the email and try again.";return}
  const msg=res==='noemail'?"✓ you're on the list, but we couldn't send your email. we'll email you on launch day.":heroSource==='send-to-me'&&res==='ok'?'✓ sent. open the link on your laptop.':res==='dup'?"✓ you're already on the list.":"✓ you're on the list. we'll email you on launch day.";
  e.target.outerHTML=`<p class="done">${msg}</p>`;m.textContent='free at launch.'});
document.addEventListener('click',e=>{const c=e.target.closest('#cancel');if(c){c.textContent='nice try';setTimeout(()=>c.textContent='cancel',1400)}});
document.addEventListener('submit',async e=>{if(e.target.id!=='f-wiz')return;e.preventDefault();const i=$('#e-wiz'),email=i.value.trim();
  if(!ok(email)){let el=$('#wiz-err');if(!el){el=document.createElement('p');el.id='wiz-err';el.className='err-line';i.parentNode.after(el)}el.textContent='that email looks off. check it and try again.';i.focus();return}
  const wz=$('#wz'),keep=wz.innerHTML;wz.innerHTML='<h3>Installing neb…</h3><div class="pbar bevel-in"><i id="pb"></i></div><p class="plog" id="pl"></p>';
  const steps=['saving your spot on the list …','skipping nothing …','sending your confirmation email …'];
  const req=join(email,'setup');
  for(let s=0;s<steps.length;s++){$('#pl').innerHTML+=steps[s]+'<br>';$('#pb').style.width=((s+1)/steps.length*100)+'%';await new Promise(r=>setTimeout(r,600))}
  const res=await req;
  if(res==='err'){wz.innerHTML=keep;const f=$('#f-wiz');if(f){f.querySelector('input').value=email;const p=document.createElement('p');p.className='err-line';p.textContent="couldn't save that. check the email and try again.";f.querySelector('.wl').after(p)}return}
  wz.innerHTML=`<h3>neb is ready for launch day.</h3><p>${res==='dup'?"You're already on the list. ":res==='noemail'?"You're on the waitlist, but we couldn't send your confirmation email. ":"You're on the waitlist. Check your inbox for a confirmation. "}Your invite and the launch film arrive together.</p><div class="wbtns"><button class="btn go" type="button" data-go="#story">finish</button></div>`});

/* ----- launch tablet ----- */
const LAUNCH=(ROOT&&ROOT.dataset.launch)||'';
const scr=document.querySelector('.bigtab .scr'),loopv=$('#loopv'),bplay=$('#b-play');
if(LAUNCH){$('#ltext').textContent="it's here. watch the launch film.";bplay.textContent='▶ play the launch film';bplay.classList.add('go');$('#b-notify').textContent='join the waitlist'}
if(loopv&&'IntersectionObserver'in window){new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){if(!loopv.src){loopv.src=MEDIA.loop}loopv.play().catch(()=>{})}else loopv.pause()}),{threshold:.25}).observe(scr)}
if(loopv)loopv.addEventListener('error',()=>loopv.remove());
bplay.addEventListener('click',()=>{
  const v=document.createElement('video');v.className='playing';v.controls=true;v.playsInline=true;
  v.src=LAUNCH||(innerWidth<600?MEDIA.teaserTall:MEDIA.teaser);
  v.addEventListener('error',()=>{v.remove();$('#ldlg').hidden=false;bplay.disabled=true;bplay.textContent='video coming soon'});
  v.addEventListener('ended',()=>{v.remove();$('#ldlg').hidden=false});
  $('#ldlg').hidden=true;if(loopv)loopv.pause();scr.appendChild(v);v.play().catch(()=>{});
});
})();
