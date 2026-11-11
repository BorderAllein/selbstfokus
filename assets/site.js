(function(){
 var b=document.querySelector('.burger'),n=document.getElementById('nav');
 if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Menü schließen':'Menü öffnen');});}
 var q=document.getElementById('q');if(!q)return;
 var res=document.getElementById('sres'),info=document.getElementById('sinfo'),idx=null;
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function norm(s){return s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')}
 function run(){
  var t=norm(q.value.trim()).split(/\s+/).filter(Boolean);
  if(!idx||!t.length){res.innerHTML='';info.textContent=t.length?'':'Gib einen Suchbegriff ein.';return}
  var out=idx.map(function(a){var h=norm(a.t),r=norm(a.d+' '+a.k+' '+a.s+' '+a.p),sc=0;for(var i=0;i<t.length;i++){if(h.indexOf(t[i])>-1)sc+=3;else if(r.indexOf(t[i])>-1)sc+=1;else return null}return {a:a,s:sc}}).filter(Boolean).sort(function(x,y){return y.s-x.s});
  info.textContent=out.length+(out.length===1?' Treffer':' Treffer');
  res.innerHTML=out.map(function(o){var a=o.a;return '<article class="card"><p class="kicker">'+esc(a.p)+' · '+esc(a.s)+'</p><h3><a href="'+a.u+'">'+esc(a.t)+'</a></h3><p>'+esc(a.d)+'</p></article>'}).join('');
 }
 fetch('/search-index.json').then(function(r){return r.json()}).then(function(j){idx=j;var p=new URLSearchParams(location.search).get('q');if(p){q.value=p}run()}).catch(function(){info.textContent='Die Suche konnte nicht geladen werden.'});
 q.addEventListener('input',run);
})();
