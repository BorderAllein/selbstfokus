(function(){
 var d=document,root=d.documentElement,b=d.body;
 function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}
 var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 var bg=$('.burger'),nv=$('#nav');
 if(bg&&nv)bg.addEventListener('click',function(){var o=nv.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');bg.setAttribute('aria-label',o?'Menü schließen':'Menü öffnen')});
 var tb=$('.themebtn');
 function dark(){var t=root.getAttribute('data-theme');return t?t==='dark':(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)}
 if(tb)tb.addEventListener('click',function(){var n=dark()?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('sf-theme',n)}catch(e){}});
 var bar=$('.progress i'),top=d.createElement('button');top.className='totop';top.type='button';top.setAttribute('aria-label','Nach oben');top.textContent='↑';b.appendChild(top);
 top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
 var art=$('.article .prose');
 function onScroll(){var y=window.scrollY||root.scrollTop;top.classList.toggle('show',y>700);
  if(bar&&art){var r=art.getBoundingClientRect(),h=art.offsetHeight-window.innerHeight*.5,p=Math.min(1,Math.max(0,(-r.top+window.innerHeight*.3)/h));bar.style.width=(p*100)+'%'}
  else if(bar){var m=root.scrollHeight-window.innerHeight;bar.style.width=(m>0?y/m*100:0)+'%'}}
 window.addEventListener('scroll',onScroll,{passive:true});onScroll();
 var hero=$('#hero');
 if(hero&&!reduce)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});
 if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
  $$('.pillar,.card,.principles>div,.auth,.netcard,.qcard,.stats,.sec,.kurz,.faq details,.authorbox,.cta,.netz').forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=Math.min(i%6,5)*60+'ms';io.observe(el)});
 }
 var tl=$$('.toc a');
 if(tl.length&&'IntersectionObserver' in window){
  var map={};tl.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tl.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}})},{rootMargin:'-15% 0px -70% 0px'});
  $$('.prose h2[id]').forEach(function(h){so.observe(h)});
 }
 var fs=1.125;try{var s=parseFloat(localStorage.getItem('sf-fs'));if(s>=1&&s<=1.5)fs=s}catch(e){}
 function setFs(v){fs=Math.min(1.5,Math.max(1,v));root.style.setProperty('--fs',fs+'rem');try{localStorage.setItem('sf-fs',fs)}catch(e){}}
 if(fs!==1.125)setFs(fs);
 var focusIO=null;
 function focusOn(on){b.classList.toggle('focus',on);var btn=$('[data-act=focus]');if(btn)btn.setAttribute('aria-pressed',on?'true':'false');
  if(focusIO){focusIO.disconnect();focusIO=null;$$('.prose>.cur').forEach(function(x){x.classList.remove('cur')})}
  if(on&&'IntersectionObserver' in window){focusIO=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('cur',e.isIntersecting)})},{rootMargin:'-38% 0px -38% 0px'});$$('.prose>*').forEach(function(x){focusIO.observe(x)})}}
 $$('.tool[data-act]').forEach(function(t){t.addEventListener('click',function(){var a=t.getAttribute('data-act');if(a==='focus')focusOn(!b.classList.contains('focus'));if(a==='bigger')setFs(fs+.0625);if(a==='smaller')setFs(fs-.0625)})});
 $$('.stats strong').forEach(function(el){var n=parseInt(el.textContent,10);if(!n||reduce)return;var suf=el.textContent.replace(/[0-9]/g,''),t0=null;el.textContent='0'+suf;var go=function(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(go)};if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){requestAnimationFrame(go);o.disconnect()}});o.observe(el)}else el.textContent=n+suf});
 var qd=$('#qdata');
 if(qd){var Q=[];try{Q=JSON.parse(qd.textContent)}catch(e){}
  var qt=$('#qtext'),ql=$('#qlink'),qn=$('#qnext'),last=-1;
  var show=function(first){if(!Q.length)return;var i;do{i=Math.floor(Math.random()*Q.length)}while(i===last&&Q.length>1);last=i;var f=function(){qt.textContent=Q[i].q;ql.href=Q[i].u;ql.textContent='Aus: '+Q[i].t;qt.classList.remove('out')};if(first||reduce)f();else{qt.classList.add('out');setTimeout(f,280)}};
  show(true);if(qn)qn.addEventListener('click',function(){show(false)});}
 var q=$('#q');if(!q)return;
 var res=$('#sres'),info=$('#sinfo'),idx=null;
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function norm(s){return s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')}
 function run(){var t=norm(q.value.trim()).split(/\s+/).filter(Boolean);
  if(!idx||!t.length){res.innerHTML='';info.textContent=t.length?'':'Gib einen Suchbegriff ein.';return}
  var out=idx.map(function(a){var h=norm(a.t),r=norm(a.d+' '+a.k+' '+a.s+' '+a.p),sc=0;for(var i=0;i<t.length;i++){if(h.indexOf(t[i])>-1)sc+=3;else if(r.indexOf(t[i])>-1)sc+=1;else return null}return {a:a,s:sc}}).filter(Boolean).sort(function(x,y){return y.s-x.s});
  info.textContent=out.length+' Treffer';
  res.innerHTML=out.map(function(o){var a=o.a;return '<article class="card"><p class="kicker">'+esc(a.p)+' · '+esc(a.s)+'</p><h3><a href="'+a.u+'">'+esc(a.t)+'</a></h3><p>'+esc(a.d)+'</p></article>'}).join('')}
 fetch('/search-index.json').then(function(r){return r.json()}).then(function(j){idx=j;var p=new URLSearchParams(location.search).get('q');if(p)q.value=p;run()}).catch(function(){info.textContent='Die Suche konnte nicht geladen werden.'});
 q.addEventListener('input',run);
})();
