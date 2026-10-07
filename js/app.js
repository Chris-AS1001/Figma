(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LS={get(k,d){try{const v=localStorage.getItem('prumo_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('prumo_'+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const p=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
const fmtD=k=>k?k.split('-').reverse().join('/'):'';
const MES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],MESL=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],WD=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const PN={g:'Regular',y:'Moderada',r:'Obrigatório'};
const brl=n=>'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const num=s=>+(String(s).replace(/\./g,'').replace(/[^\d,-]/g,'').replace(',','.'))||0;
const DEF={name:'AbsoluteSolver',img:'img/avatar-padrao.webp'};
const user=()=>Object.assign({},DEF,LS.get('user',{}));
window.PRUMO={$,$$,LS,esc,toast,dlg,confirmBox,photo,user,DEF,applyUser,brl,num};

let tt;function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.append(t)}t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,3000)}
function dlg(html,cls=''){const m=document.createElement('div');m.className='modal open';m.innerHTML=`<div class="in ${cls}" role="dialog" aria-modal="true">${html}</div>`;document.body.append(m);m.close=()=>m.remove();const f=$('input,button',m);f&&f.focus();return m}
function confirmBox(title,text,ok,cb){const m=dlg(`<h3 style="font-size:20px;border:0;margin-bottom:8px">${title}</h3><p class="mu">${text}</p><div class="fo"><button class="bt" data-x>Cancelar</button><button class="bt s" data-ok>${ok}</button></div>`);$('[data-x]',m).onclick=m.close;$('[data-ok]',m).onclick=()=>{m.close();cb()};return m}
function applyUser(){const u=user();$$('.av').forEach(i=>i.src=u.img);$$('.uname').forEach(e=>e.textContent=u.name)}
const mask=i=>i.addEventListener('input',()=>{const d=i.value.replace(/\D/g,'').slice(0,11);i.value=d?brl(+d/100):''});

/* foto de perfil (compartilhado: tela inicial e Configurações) */
function photo(root,init,onChange){let cur=init;const img=$('.pimg',root),box=img.parentElement,cap=$('.pcap',root),f=$('input[type=file]',root);
 const show=()=>{img.src=cur;const d=cur===DEF.img;box.classList.toggle('isdef',d);cap.textContent=d?'Foto padrão':'Foto personalizada';onChange&&onChange(cur)};
 $('[data-up]',root).onclick=()=>f.click();$('[data-rst]',root).onclick=()=>{cur=DEF.img;f.value='';show()};
 f.onchange=()=>{const file=f.files[0];if(!file)return;if(!/^image\//.test(file.type))return toast('Escolha um arquivo de imagem.');
  const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=256;const s=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,256,256);cur=c.toDataURL('image/jpeg',.85);show()};im.onerror=()=>toast('Não foi possível ler essa imagem.');im.src=fr.result};fr.readAsDataURL(file)};
 show();return()=>cur}

/* barra de navegação: engrenagem, sino, menu do perfil */
function nav(){const ic=$('.ic');if(!ic)return;const [g,b,av]=ic.children;
 const wrap=(el,tag,at)=>{const x=document.createElement(tag);Object.assign(x,at);x.className='ib';el.replaceWith(x);x.append(el);return x};
 wrap(g,'a',{href:'settings.html',title:'Configurações'});
 wrap(b,'button',{type:'button',title:'Notificações',onclick:()=>toast('Sem novas notificações. (Notificações ainda em desenvolvimento)')});
 const ab=wrap(av,'button',{type:'button',title:'Perfil'});ab.setAttribute('aria-haspopup','true');
 ab.onclick=e=>{e.stopPropagation();const old=$('.pm');if(old)return old.remove();const u=user(),r=ab.getBoundingClientRect();
  const m=document.createElement('div');m.className='pm';m.setAttribute('role','menu');
  m.innerHTML=`<div class="pmh"><img src="${esc(u.img)}" alt=""><b>${esc(u.name)}</b></div><a role="menuitem" href="settings.html#conta">Conta</a><a role="menuitem" href="settings.html#perfil">Perfil</a>`;
  m.style.top=r.bottom+scrollY+8+'px';m.style.right=document.documentElement.clientWidth-r.right-scrollX+'px';document.body.append(m)}}
document.addEventListener('click',e=>{if(!e.target.closest('.pm'))$('.pm')?.remove();
 const d=e.target.closest('[data-rm]');if(d){e.preventDefault();askRm(d.dataset.rm)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.modal.open').forEach(m=>m.remove());$('.pm')?.remove();if(location.hash)location.hash=''}
 if(e.key==='Enter'&&e.target.classList?.contains('del'))e.target.click()});

/* login / cadastro: aviso + tela de perfil */
function authGate(){$$('a[href="home.html"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();
 confirmBox('Sistema em desenvolvimento','O sistema de login/cadastro ainda não está pronto. Deseja continuar e testar o protótipo?','Continuar',onboarding)}))}
function onboarding(){const m=dlg(`<h2 style="font-size:24px">Monte seu perfil</h2><p class="mu">Escolha como você vai aparecer no protótipo. Dá para mudar depois em Configurações.</p>
<div class="pr2"><div class="pw"><img class="pimg" alt="Foto de perfil"><span class="pbadge">FOTO PADRÃO</span></div><div><button type="button" class="bt sb" data-up>Escolher foto</button> <button type="button" class="bt" data-rst>Usar a padrão</button><p class="pcap mu"></p></div><input type="file" accept="image/*" hidden></div>
<label class="fld" for="obn">Nome de usuário</label><input class="inp ghost" id="obn" maxlength="24" placeholder="AbsoluteSolver" autocomplete="off"><small class="mu">Em branco = <b>AbsoluteSolver</b></small>
<div class="fo" style="margin-top:18px"><button type="button" class="bt s" data-go>Entrar no protótipo</button></div>`,'ob');
 const get=photo(m,DEF.img),go=()=>{LS.set('user',{name:$('#obn',m).value.trim()||DEF.name,img:get()});location.href='home.html'};
 $('[data-go]',m).onclick=go;$('#obn',m).onkeydown=e=>{if(e.key==='Enter')go()}}

/* calendário */
function cal(el,sel,pick){const ti=iso(new Date());let [y,m]=(sel||ti).split('-').map(Number);m--;
 const draw=()=>{const first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
  let h=`<div class="hd"><button type="button" data-a="-1" aria-label="Mês anterior">‹</button><span>${MESL[m]} ${y}</span><button type="button" data-a="1" aria-label="Próximo mês">›</button></div><div class="g">`+WD.map(w=>`<span class="w">${w[0]}</span>`).join('')+'<span></span>'.repeat(first);
  for(let d=1;d<=n;d++){const k=`${y}-${p(m+1)}-${p(d)}`;h+=`<span class="d${k===ti?' t':''}${k===sel?' s':''}" data-v="${k}" role="button" tabindex="0">${d}</span>`}
  el.innerHTML=h+'</div>'};
 el.onclick=e=>{const a=e.target.closest('[data-a]');if(a){m+=+a.dataset.a;if(m<0){m=11;y--}if(m>11){m=0;y++}return draw()}const d=e.target.closest('[data-v]');if(d){sel=d.dataset.v;pick(sel);draw()}};
 el.onkeydown=e=>{if(e.key==='Enter')e.target.click()};draw()}

/* formulário de tarefa/cartão (Personal e Cartões) */
function taskForm(host,save,opt={}){const s={date:'',time:'',rep:'',prio:'',rem:'',remDate:''};
 host.insertAdjacentHTML('beforeend',`<small class="mu"><b>${opt.lbl||'Adicione um nome'}</b></small><input class="tf big" data-n maxlength="80" placeholder="Clube amanhã depois do trabalho"><small class="mu"><b>Descrição :</b></small><textarea class="tf" data-d rows="2" maxlength="300"></textarea><p style="margin-top:14px"><button type="button" class="chip" data-k="data">Data</button><button type="button" class="chip" data-k="prio">Prioridade</button><button type="button" class="chip" data-k="lemb">Lembretes</button></p><div class="pop inl" data-pop hidden></div><div class="fo" style="margin-top:14px"><button type="button" class="bt" data-c>Cancelar</button><button type="button" class="bt sb" data-s>Salvar</button></div>`);
 const pop=$('[data-pop]',host),nm=$('[data-n]',host),ds=$('[data-d]',host),X='<button type="button" class="x" data-x aria-label="Fechar">✕</button>';let open='';
 const label=()=>{$('[data-k=data]',host).textContent=s.date?`Data: ${fmtD(s.date)}${s.time?' '+s.time:''}`:'Data';$('[data-k=prio]',host).textContent=s.prio?'Prioridade: '+PN[s.prio]:'Prioridade';$('[data-k=lemb]',host).textContent=s.rem?'Lembrete: '+s.rem:'Lembretes';$$('[data-k]',host).forEach(c=>c.classList.toggle('on',c.dataset.k===open))};
 const D=n=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d},wd=new Date().getDay();
 const R={data(){const Q=[['Hoje',D(0)],['Amanhã',D(1)],['Fim dessa semana',D(6-wd)],['Próxima semana',D((8-wd)%7||7)]];
   pop.innerHTML=X+Q.map(([n,d])=>`<button type="button" class="q" data-q="${iso(d)}">${n}<span class="mu">${WD[d.getDay()]} ${p(d.getDate())}/${p(d.getMonth()+1)}</span></button>`).join('')+`<div class="cal" data-cal></div><label>Horário<input type="time" class="tf" data-t value="${s.time}"></label><label>Repetir<select class="tf" data-r>${['','Todo dia','Toda semana','Todo dia útil','Todo mês','Todo ano'].map(o=>`<option value="${o}"${o===s.rep?' selected':''}>${o||'Não repetir'}</option>`).join('')}</select></label>`;
   cal($('[data-cal]',pop),s.date,v=>{s.date=v;label()})},
  prio(){pop.innerHTML=X+Object.entries(PN).map(([c,n])=>`<button type="button" class="pq${s.prio===c?' on':''}" data-pr="${c}"><b>${n}:</b><span class="pr ${c}"></span></button>`).join('')},
  lemb(){pop.innerHTML=X+`<label>Quando<select class="tf" data-rem>${['','15 min antes','1h antes','1 dia antes'].map(o=>`<option value="${o}"${o===s.rem?' selected':''}>${o||'Sem lembrete'}</option>`).join('')}</select></label><label>Data<input type="date" class="tf" data-rd value="${s.remDate}"></label>`}};
 const set=k=>{open=open===k?'':k;pop.hidden=!open;if(open)R[open]();label()};
 host.addEventListener('click',e=>{const k=e.target.closest('[data-k]');if(k)return set(k.dataset.k);if(e.target.closest('[data-x]'))return set(open);
  const q=e.target.closest('[data-q]');if(q){s.date=q.dataset.q;R.data();label()}const pr=e.target.closest('[data-pr]');if(pr){s.prio=s.prio===pr.dataset.pr?'':pr.dataset.pr;R.prio();label()}});
 host.addEventListener('change',e=>{const t=e.target;if(t.matches('[data-t]'))s.time=t.value;if(t.matches('[data-r]'))s.rep=t.value;if(t.matches('[data-rem]'))s.rem=t.value;if(t.matches('[data-rd]'))s.remDate=t.value;label()});
 const reset=()=>{nm.value=ds.value='';Object.assign(s,{date:'',time:'',rep:'',prio:'',rem:'',remDate:''});open='';pop.hidden=true;nm.classList.remove('err');label()};
 const submit=()=>{const n=nm.value.trim();if(!n){nm.classList.add('err');nm.focus();return toast('Dê um nome antes de salvar.')}save({n,d:ds.value.trim(),...s});reset()};
 $('[data-s]',host).onclick=submit;nm.onkeydown=e=>{if(e.key==='Enter')submit()};nm.oninput=()=>nm.classList.remove('err');
 $('[data-c]',host).onclick=()=>{reset();opt.cancel&&opt.cancel()};label()}
/* =====================================================================
   DADOS PERSISTENTES
   Tudo que o usuário cria ou remove (tarefas, cartões, contas, lançamentos,
   limites…) fica no localStorage. Os exemplos são gravados UMA vez, na
   primeira visita; depois disso o que está salvo manda — se o usuário
   apagar, continua apagado.
   ===================================================================== */
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const r2=n=>Math.round((+n||0)*100)/100;
const load=(k,seed)=>{let v=LS.get(k,null);if(v==null||typeof v!=='object'){v=seed();LS.set(k,v)}return v};
const WDL=['Domingo','Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado'];
const dayName=k=>WDL[new Date(k+'T12:00:00').getDay()];

/* remoção genérica: <a data-rm="tipo:id"> → confirmação → RM[tipo](id) devolve {t,x,run} */
const RM={};
const rmBtn=(ty,id,cls='')=>`<a class="del ${cls}" role="button" tabindex="0" title="Remover" aria-label="Remover" data-rm="${ty}:${esc(id)}">✕</a>`;
function askRm(spec,after){const i=spec.indexOf(':'),h=RM[spec.slice(0,i)]?.(spec.slice(i+1));if(!h)return;
 confirmBox(h.t,h.x,h.ok||'Remover',()=>{h.run();toast(h.done||'Removido.');after&&after()})}
const exBar=(el,has,text,fn)=>{if(!el)return;el.innerHTML=has?'<a href="#" class="lnk" data-ex>Remover exemplos</a>':'';const a=$('[data-ex]',el);
 if(a)a.onclick=e=>{e.preventDefault();confirmBox('Remover exemplos?',text,'Remover',()=>{fn();toast('Exemplos removidos.')})}};
function formDlg(title,body,ok,submit){const m=dlg(`<h3 style="border:0;font-size:20px;margin-bottom:6px">${title}</h3>${body}<div class="fo" style="margin-top:18px"><button type="button" class="bt" data-x>Cancelar</button><button type="button" class="bt s" data-ok>${ok}</button></div>`,'lt');
 const go=()=>{if(submit(m)!==false)m.close()};$('[data-x]',m).onclick=m.close;$('[data-ok]',m).onclick=go;
 m.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input:not([type=date]):not([type=time])'))go()});return m}
const prOpts='<option value="">Sem prioridade</option><option value="g">Regular</option><option value="y">Moderada</option><option value="r">Obrigatório</option>';

/* ---------- exemplos: Personal ---------- */
const LOREM='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam harum repellat iure, nulla necessitatibus similique deserunt nihil iusto.';
const seedTasks=()=>[
 {id:uid(),n:'Empresa B',d:LOREM,date:'2026-03-26',time:'13:00',end:'15:30',rep:'',prio:'r',rem:'',ex:1},
 {id:uid(),n:'Empresa C',d:LOREM,date:'2026-10-18',time:'20:00',end:'21:00',rep:'',prio:'g',rem:'',ex:1},
 {id:uid(),n:'Empresa D',d:LOREM,date:'2026-09-11',time:'15:25',end:'18:55',rep:'',prio:'y',rem:'',ex:1},
 {id:uid(),n:'Empresa E',d:'',date:'',time:'',end:'',rep:'',prio:'',rem:'',ex:1}];
const seedCards=()=>{const I=a=>a.map(x=>({id:uid(),date:'',time:'',rep:'',prio:'',...x}));return[
 {id:uid(),title:'Reuniões',kind:'table',c:'p1',home:0,ex:1,items:I([{n:'Empresa B',date:'2026-03-26',time:'13:00',prio:'r'},{n:'Empresa C',date:'2026-10-18',time:'20:00',prio:'g'},{n:'Empresa D',date:'2026-09-11',time:'15:25',prio:'y'},{n:'Empresa E'}])},
 {id:uid(),title:'Atividades semanais',kind:'list',c:'p3',home:1,ex:1,items:I([{n:'Caminhada de 5km'},{n:'Lavar banheiro'}])},
 {id:uid(),title:'Outros compromissos',kind:'list',c:'p4',home:0,ex:1,items:I([{n:'Sair com a família'},{n:'Ir ao Brás'}])},
 {id:uid(),title:'Outros compromissos',kind:'list',c:'p4',home:0,ex:1,items:I([{n:'Sair com a família'},{n:'Ir ao Brás'}])},
 {id:uid(),title:'Atividades diárias',kind:'table',c:'p2',home:1,ex:1,items:I([{n:'Arrumar a cama',rep:'Diário',prio:'g'},{n:'Lavar a louça',rep:'Diário',prio:'r'},{n:'Varrer a casa',rep:'Diário',prio:'y'}])},
 {id:uid(),title:'Pular de paraquedas',kind:'list',c:'p4',home:1,ex:1,items:[]}]};

/* ---------- exemplos: Finance ---------- */
const BANK={bradesco:'Bradesco',bb:'Banco do Brasil',inter:'Inter',caixa:'Caixa',nubank:'Nubank'};
const CATCOL={aluguel:'var(--rd)',mercado:'#065845','empréstimo':'var(--bl)',emprestimo:'var(--bl)',contas:'var(--ye)',lazer:'#8c0c5c',outros:'#ddd','salário':'var(--or)',salario:'var(--or)',vendas:'var(--bl)'};
const PAL=['#a78bfa','#34d399','#f472b6','#60a5fa','#fbbf24','#fb923c','#2dd4bf'];
const catColor=n=>{const k=String(n).trim().toLowerCase();if(CATCOL[k])return CATCOL[k];let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))>>>0;return PAL[h%PAL.length]};
function seedFin(){const now=new Date(),td=now.getDate(),tx=[],rnd=s=>{s=Math.sin(s*12.9898)*43758.5453;return s-Math.floor(s)};
 const when=(off,day)=>{const b=new Date(now.getFullYear(),now.getMonth()-off,1),dim=new Date(b.getFullYear(),b.getMonth()+1,0).getDate();return iso(new Date(b.getFullYear(),b.getMonth(),Math.min(day,off?dim:td)))};
 const add=(t,off,day,val,cat)=>tx.push({id:uid(),t,date:when(off,day),val:r2(val),cat,desc:'',acc:'',acc2:'',ex:1});
 /* mês atual: mesmos totais do protótipo (receita 5.897,41 · despesa 3.242,42) */
 [['r',1,3497.85,'Salário'],['r',3,2399.56,'Vendas'],['d',1,1200,'Aluguel'],['d',2,465.09,'Empréstimo'],['d',3,400,'Contas'],['d',5,300,'Contas'],['d',8,326.89,'Contas'],['d',4,150.12,'Mercado'],['d',9,120,'Mercado'],['d',13,182.2,'Mercado'],['d',6,48.12,'Lazer'],['d',11,50,'Lazer']].forEach(([t,d,v,c])=>add(t,0,d,v,c));
 /* 4 meses anteriores (alimentam "Relatórios passados"; o de 2 meses atrás fecha no vermelho) */
 for(let o=1;o<=4;o++){const k=o*100;add('r',o,5,3497.85,'Salário');add('r',o,10,800+rnd(k)*1800,'Vendas');add('d',o,1,1200,'Aluguel');add('d',o,2,465.09,'Empréstimo');
  ['Contas','Mercado','Mercado','Lazer','Contas','Lazer'].forEach((c,j)=>add('d',o,4+j*4,(c==='Lazer'?40:c==='Mercado'?120:200)+rnd(k+j+1)*(c==='Lazer'?90:300),c));
  if(o===2)add('d',o,20,4200,'Reforma')}
 const A=(bank,name,bal)=>({id:uid(),bank,name,bal,ex:1}),F=(n,v)=>({id:uid(),n,v,ex:1}),L=(name,limit)=>({id:uid(),name,limit,ex:1});
 return{accounts:[A('bradesco','Oivato',265.69),A('bb','Lazer',51.52),A('inter','Vendas',150),A('caixa','Salário',1260.46),A('nubank','Reserva de Em.',176.29)],tx,
  fixR:[F('Salário',1621),F('Dividendos',561.49),F('Empréstimo',100)],fixD:[F('Empréstimo',480),F('Conta de Luz',100),F('Conta de água',100)],
  limits:[L('Lazer',100),L('Contas',1300),L('Mercado',300)]}}
function loadFin(){const f=load('fin',seedFin);['accounts','tx','fixR','fixD','limits'].forEach(k=>{if(!Array.isArray(f[k]))f[k]=[]});return f}
const curYM=()=>iso(new Date()).slice(0,7);
const inM=(x,ym)=>x.date.slice(0,7)===ym;
const sumTx=(fin,ym,t)=>r2(fin.tx.filter(x=>x.t===t&&inM(x,ym)).reduce((a,x)=>a+x.val,0));
const catSum=(fin,ym,t)=>{const m={};fin.tx.forEach(x=>{if(x.t===t&&inM(x,ym)){const c=x.cat||'Sem categoria';m[c]=(m[c]||0)+x.val}});return Object.entries(m).map(([k,v])=>[k,r2(v)]).sort((a,b)=>b[1]-a[1])};
const spentOf=(fin,l,ym)=>r2(fin.tx.filter(x=>x.t==='d'&&inM(x,ym)&&(x.cat||'').toLowerCase()===l.name.toLowerCase()).reduce((a,x)=>a+x.val,0));
const bankSel=cur=>`<select class="tf" data-bank>${Object.entries(BANK).map(([k,v])=>`<option value="${k}"${k===cur?' selected':''}>${v}</option>`).join('')}</select>`;

/* =====================================================================
   HOME
   ===================================================================== */
function homePage(){const tasks=load('tasks',seedTasks),cards=load('cards',seedCards),fin=loadFin();
 const li=(c,t)=>`<div class="li ${c}">${esc(t)}</div>`,more=(h,t)=>`<a class="mu" style="display:inline-block;margin-top:8px;font-size:12px" href="${h}">+ ${t}</a>`;
 $('#hp').innerHTML=`<div class="box"><h3>Reuniões Marcadas</h3>${tasks.length?tasks.slice(0,6).map(t=>li('p1',t.n)).join(''):'<p class="mu">Nenhuma reunião marcada.</p>'}${more('personal.html#form','Adicionar')}</div>`
  +cards.filter(c=>c.home!==0).slice(0,3).map(c=>`<div class="box"><h3>${esc(c.title)}</h3>${c.items.length?c.items.slice(0,4).map(i=>li(c.c||'p4',i.n)).join(''):'<p class="mu">Sem itens ainda.</p>'}${more('nova-tarefa.html','Ver cartões')}</div>`).join('');
 $('#hf').innerHTML=`<div class="box"><h3>Contas a pagar</h3>${fin.fixD.length?`<b>${fin.fixD.slice(0,5).map(x=>esc(x.n)).join('<br>')}</b>`:'<p class="mu">Nenhuma conta a pagar.</p>'}</div>`
  +'<div class="box"><h3>Receitas</h3><a href="finance.html#receita" class="circ gr" style="margin:24px auto">+</a></div><div class="box"><h3>Despesas</h3><a href="finance.html#despesa" class="circ rd" style="margin:24px auto">−</a></div>'
  +`<div class="box"><h3>Limites de gastos</h3>${fin.limits.length?`<p>${fin.limits.map(l=>`● <span style="color:${catColor(l.name)}">${esc(l.name)}</span>`).join('<br>')}</p>`:'<p class="mu">Nenhum limite definido.</p>'}</div>`;
 const nw=$('#news');if(nw){if(LS.get('newsClosed',0))nw.remove();else $('a',nw).addEventListener('click',()=>LS.set('newsClosed',1))}}

/* =====================================================================
   PERSONAL — tarefas / reuniões
   ===================================================================== */
function personalPage(){let tasks=load('tasks',seedTasks);const host=$('#tasks'),save=()=>LS.set('tasks',tasks);
 const html=t=>`<div class="box task">${rmBtn('task',t.id)}<h3 style="margin-left:12px">${esc(t.n)}</h3><div class="cols" style="margin-left:12px"><div><h4>Data:</h4>${t.date?dayName(t.date)+' '+fmtD(t.date)+(t.rep?'<br>'+esc(t.rep):''):'<span class="mu">NA</span>'}</div><div><h4>Horário:</h4>Início: ${t.time||'NA'}${t.end?'<br><br>Término: '+t.end:''}${t.rem?'<br><br>Lembrete: '+esc(t.rem):''}</div><div><h4>Prioridade:</h4>${t.prio?PN[t.prio]+':':'NA :'}<br><span class="pr ${t.prio||''}" style="margin:8px 0 0 14px"></span></div><div><h4>Descrição:</h4>${t.d?esc(t.d):'<span class="mu">NA</span>'}</div></div></div>`;
 const draw=()=>{host.innerHTML=tasks.length?tasks.map(html).join(''):'<p class="mu center" style="margin:20px 0 30px">Nenhuma tarefa por aqui ainda. Use “Adicionar tarefa” abaixo.</p>';
  exBar($('#exbar'),tasks.some(t=>t.ex),'As tarefas de exemplo serão removidas. As que você criou ficam.',()=>{tasks=tasks.filter(t=>!t.ex);save();draw()})};
 RM.task=id=>{const t=tasks.find(x=>x.id===id);return t&&{t:'Remover tarefa?',x:`Tem certeza que deseja remover <b>${esc(t.n)}</b>? Essa ação não pode ser desfeita.`,run:()=>{tasks=tasks.filter(x=>x.id!==id);save();draw()}}};
 taskForm($('#form'),t=>{tasks.push({id:uid(),end:'',...t});save();draw();toast('Tarefa adicionada.')});draw()}

/* =====================================================================
   PERSONAL — cartões (nova-tarefa.html)
   ===================================================================== */
function cardsPage(){let cards=load('cards',seedCards),q='';const host=$('#cards'),save=()=>LS.set('cards',cards);
 const meta=i=>[i.date?fmtD(i.date):'',i.time||''].filter(Boolean).join(' · ');
 const bar=p=>`<span class="pr ${p||''}" style="width:60px"></span>`;
 const body=c=>{if(!c.items.length)return'<p class="mu">Sem itens ainda.</p>';
  if(c.kind==='table')return`<table><tr><th>Compromisso</th><th>Data</th><th>Horário</th><th>Prioridade</th><th></th></tr>${c.items.map(i=>`<tr><td>${esc(i.n)}</td><td>${i.date?fmtD(i.date):esc(i.rep||'NA')}</td><td>${i.time||'NA'}</td><td>${bar(i.prio)}</td><td style="width:26px">${rmBtn('item',c.id+'|'+i.id,'sm')}</td></tr>`).join('')}</table>`;
  return'<b>Compromissos</b>'+c.items.map(i=>`<div class="li ${c.c||'p4'}">${esc(i.n)}${meta(i)?` <span class="mu" style="font-weight:500">${meta(i)}</span>`:''}${i.prio?` <span class="pr ${i.prio}" style="display:inline-block;width:26px;height:6px;vertical-align:middle;margin-left:4px"></span>`:''}${rmBtn('item',c.id+'|'+i.id,'sm')}</div>`).join('')};
 const hit=c=>!q||(c.title+' '+c.items.map(i=>i.n).join(' ')).toLowerCase().includes(q);
 const draw=()=>{host.innerHTML=cards.map(c=>`<div class="box"${hit(c)?'':' hidden'}>${rmBtn('card',c.id)}<h3 style="font-size:20px">${esc(c.title)}</h3>${body(c)}<a class="mu" href="#" data-add="${c.id}" style="display:inline-block;margin-top:8px;font-size:12px">+ Adicionar item</a></div>`).join('')+'<a class="box add" href="#novo"><span>Adicionar cartão<br><b>+</b></span></a>';
  exBar($('#exbar'),cards.some(c=>c.ex),'Os cartões de exemplo serão removidos. Os que você criou ficam.',()=>{cards=cards.filter(c=>!c.ex);save();draw()})};
 RM.card=id=>{const c=cards.find(x=>x.id===id);return c&&{t:'Remover cartão?',x:`Tem certeza que deseja remover <b>${esc(c.title)}</b>? Essa ação não pode ser desfeita.`,run:()=>{cards=cards.filter(x=>x.id!==id);save();draw()}}};
 RM.item=s=>{const [cid,iid]=s.split('|'),c=cards.find(x=>x.id===cid),i=c?.items.find(x=>x.id===iid);return i&&{t:'Remover item?',x:`Remover <b>${esc(i.n)}</b> de ${esc(c.title)}?`,run:()=>{c.items=c.items.filter(x=>x.id!==iid);save();draw()}}};
 host.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(!a)return;e.preventDefault();const c=cards.find(x=>x.id===a.dataset.add);if(!c)return;
  formDlg(`Novo item em ${esc(c.title)}`,`<label class="fld">Nome</label><input class="tf" data-n maxlength="80"><label class="fld">Data</label><input type="date" class="tf" data-dt><label class="fld">Horário</label><input type="time" class="tf" data-tm><label class="fld">Prioridade</label><select class="tf" data-pr>${prOpts}</select>`,'Adicionar',m=>{
   const n=$('[data-n]',m).value.trim();if(!n){toast('Dê um nome ao item.');return false}
   c.items.push({id:uid(),n,date:$('[data-dt]',m).value,time:$('[data-tm]',m).value,rep:'',prio:$('[data-pr]',m).value});save();draw();toast('Item adicionado.')})});
 taskForm($('#novo-in'),t=>{const it=(t.d||t.date||t.time||t.prio)?[{id:uid(),n:t.d||'Compromisso',date:t.date,time:t.time,rep:t.rep,prio:t.prio}]:[];
  cards.push({id:uid(),title:t.n,kind:'list',c:'p4',home:1,items:it});save();draw();location.hash='';toast('Cartão adicionado.')},{lbl:'Adicione um nome para o cartão:',cancel:()=>location.hash=''});
 const ps=$$('.sub a').find(a=>/Pesquisa/.test(a.textContent));
 ps.onclick=e=>{e.preventDefault();let i=$('#q');if(i){i.remove();q='';draw();return}
  i=document.createElement('input');i.id='q';i.type='search';i.className='inp';i.placeholder='Pesquisar cartões…';i.style.cssText='max-width:240px;padding:5px 10px';ps.after(i);i.focus();
  i.oninput=()=>{q=i.value.trim().toLowerCase();draw()}};
 draw()}

/* =====================================================================
   FINANCE — Visão Geral, Relatórios e Limites partilham o mesmo dado (fin)
   ===================================================================== */
function financeApp(page){let fin=loadFin();const cm=curYM();
 const save=()=>{LS.set('fin',fin);render()};
 const accOf=id=>fin.accounts.find(a=>a.id===id);
 const bal=(t,s)=>{const a=accOf(t.acc),b=accOf(t.acc2);if(t.t==='r'&&a)a.bal=r2(a.bal+s*t.val);if(t.t==='d'&&a)a.bal=r2(a.bal-s*t.val);if(t.t==='t'){if(a)a.bal=r2(a.bal-s*t.val);if(b)b.bal=r2(b.bal+s*t.val)}};
 const canon=s=>{s=s.trim().replace(/\s+/g,' ');if(!s)return'';const k=s.toLowerCase(),all=fin.tx.map(x=>x.cat).concat(fin.limits.map(l=>l.name)).filter(Boolean);return all.find(c=>c.toLowerCase()===k)||s[0].toUpperCase()+s.slice(1)};
 const hasEx=()=>['accounts','tx','fixR','fixD','limits'].some(k=>fin[k].some(x=>x.ex));
 const txLabel=t=>t.t==='t'?`transferência ${esc(accOf(t.acc)?.name||'?')} → ${esc(accOf(t.acc2)?.name||'?')}`:`${t.t==='r'?'receita':'despesa'} <b>${esc(t.cat)}</b>`;
 const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};
 const ymName=k=>MESL[+k.slice(5)-1]+(k.slice(0,4)!==cm.slice(0,4)?' '+k.slice(0,4):'');
 const dropMonth=k=>{fin.tx.filter(x=>inM(x,k)).forEach(t=>bal(t,-1));fin.tx=fin.tx.filter(x=>!inM(x,k))};

 /* ----- remoções (todas com confirmação) ----- */
 RM.acc=id=>{const a=accOf(id);return a&&{t:'Excluir conta?',x:`Tem certeza que deseja excluir <b>${esc(a.name)}</b>? Os lançamentos já feitos continuam nos relatórios. Essa ação não pode ser desfeita.`,ok:'Excluir',done:'Conta excluída.',run:()=>{fin.accounts=fin.accounts.filter(x=>x.id!==id);save()}}};
 RM.tx=id=>{const t=fin.tx.find(x=>x.id===id);return t&&{t:'Remover lançamento?',x:`Remover ${txLabel(t)} de <b>${brl(t.val)}</b>?${t.acc&&accOf(t.acc)?' O saldo da conta será ajustado de volta.':''}`,run:()=>{bal(t,-1);fin.tx=fin.tx.filter(x=>x!==t);save()}}};
 RM.cat=enc=>{const c=decodeURIComponent(enc),l=fin.tx.filter(x=>x.t==='d'&&inM(x,cm)&&(x.cat||'Sem categoria')===c);return l.length&&{t:'Remover gastos?',x:`Remover ${l.length>1?`os <b>${l.length}</b> lançamentos`:'o lançamento'} de <b>${esc(c)}</b> deste mês (${brl(l.reduce((a,x)=>a+x.val,0))})? Isso também atualiza Relatórios e Limites de Gastos.`,run:()=>{l.forEach(t=>bal(t,-1));fin.tx=fin.tx.filter(x=>!l.includes(x));save()}}};
 RM.fixR=id=>{const x=fin.fixR.find(v=>v.id===id);return x&&{t:'Remover receita fixa?',x:`Remover <b>${esc(x.n)}</b>?`,run:()=>{fin.fixR=fin.fixR.filter(v=>v.id!==id);save()}}};
 RM.fixD=id=>{const x=fin.fixD.find(v=>v.id===id);return x&&{t:'Remover despesa fixa?',x:`Remover <b>${esc(x.n)}</b>?`,run:()=>{fin.fixD=fin.fixD.filter(v=>v.id!==id);save()}}};
 RM.lim=id=>{const l=fin.limits.find(v=>v.id===id);return l&&{t:'Remover limite?',x:`Tem certeza que deseja remover o limite <b>${esc(l.name)}</b>? Os lançamentos dessa categoria não são apagados.`,run:()=>{fin.limits=fin.limits.filter(v=>v.id!==id);save()}}};
 RM.mes=k=>{const n=fin.tx.filter(x=>inM(x,k)).length;return n&&{t:'Remover relatório?',x:`Isso apaga os <b>${n}</b> lançamentos de <b>${ymName(k)}</b> (e o relatório do mês). Essa ação não pode ser desfeita.`,run:()=>{dropMonth(k);save()}}};

 /* ----- lançar receita / despesa / transferência ----- */
 function openTx(type,accId){const m=dlg('','lt'),inn=$('.in',m);
  const paint=ty=>{type=ty;const opts=sel=>'<option value="">Selecionar conta</option>'+fin.accounts.map(a=>`<option value="${a.id}"${a.id===sel?' selected':''}>${esc(a.name)} — ${brl(a.bal)}</option>`).join('');
   const cats=[...new Set(fin.tx.filter(x=>x.t===ty).map(x=>x.cat).concat(ty==='d'?fin.limits.map(l=>l.name):[]))].filter(Boolean);
   const acc=fin.accounts.length?(ty==='t'?`<label class="fld">Conta de origem</label><select class="tf" data-ac>${opts(accId)}</select><label class="fld">Conta de destino</label><select class="tf" data-ac>${opts('')}</select>`:`<label class="fld">Conta</label><select class="tf" data-ac>${opts(accId)}</select>`):`<p class="mu">Você ainda não tem contas. ${ty==='t'?'Crie ao menos duas contas para transferir.':'O lançamento será salvo sem conta (não altera saldos).'}</p>`;
   const cat=ty==='t'?'':`<label class="fld">${ty==='r'?'Origem da receita':'Categoria'}</label><input class="tf" data-cat maxlength="24" list="dl-cat" placeholder="${ty==='r'?'Ex.: Salário':'Ex.: Mercado'}"><datalist id="dl-cat">${cats.map(c=>`<option value="${esc(c)}">`).join('')}</datalist>`;
   inn.innerHTML=`<a href="#" data-close style="float:right" aria-label="Fechar">✕</a><div class="acts" style="margin-top:0">${[['r','gr','+','RECEITA'],['d','rd','−','DESPESA'],['t','bl','⇄','TRANSF.']].map(([k,c,s,n])=>`<a href="#" data-tab="${k}" style="opacity:${k===ty?1:.45};color:${k===ty?'#fff':'inherit'}"><span class="circ ${c}">${s}</span>${n}</a>`).join('')}</div>${acc}${cat}<label class="fld">Valor</label><div class="center"><input class="val" inputmode="decimal" placeholder="R$ 0,00" aria-label="Valor"></div><label class="fld">Data</label><input type="date" class="tf" data-dt value="${iso(new Date())}"><div class="fo" style="margin-top:18px"><button type="button" class="bt" data-x>Cancelar</button><button type="button" class="bt s" data-ok>Salvar</button></div>`;
   mask($('.val',inn));($('[data-ac],[data-cat],.val',inn)||{}).focus?.()};
  const go=()=>{const sel=$$('[data-ac]',inn).map(x=>x.value),v=num($('.val',inn).value);
   if(type==='t'){if(fin.accounts.length<2)return toast('Crie ao menos duas contas para transferir.');if(sel.some(x=>!x))return toast('Selecione as contas.');if(sel[0]===sel[1])return toast('Escolha contas diferentes.')}
   else if(fin.accounts.length&&!sel[0])return toast('Selecione a conta.');
   if(!v)return toast('Digite um valor maior que zero.');
   const t={id:uid(),t:type,date:$('[data-dt]',inn).value||iso(new Date()),val:v,cat:type==='t'?'':canon($('[data-cat]',inn).value)||(type==='r'?'Receita':'Outros'),desc:'',acc:sel[0]||'',acc2:type==='t'?sel[1]:''};
   fin.tx.push(t);bal(t,1);m.close();save();toast(`${type==='r'?'Receita':type==='d'?'Despesa':'Transferência'} de ${brl(v)} registrada.`)};
  inn.addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){e.preventDefault();return paint(t.dataset.tab)}
   if(e.target.closest('[data-close],[data-x]')){e.preventDefault();return m.close()}if(e.target.closest('[data-ok]'))go()});
  inn.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input:not([type=date])'))go()});paint(type)}

 /* ----- contas ----- */
 function openAcc(id){const a=accOf(id);if(!a)return;
  const m=dlg(`<a href="#" data-close style="float:right" aria-label="Fechar">✕</a><div class="acc"><img src="img/${a.bank}.png" alt="">${esc(a.name)}</div><p style="display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px">Saldo atual:<b class="${a.bal<0?'rd':'gr'}">${brl(a.bal)}</b>Banco atual:<b class="bl">${BANK[a.bank]||'NA'}</b></p><div class="fo" style="justify-content:center"><button type="button" class="bt" data-edit>Editar conta</button><button type="button" class="bt" data-del style="color:var(--rd)">Excluir conta</button></div><div class="acts">${[['r','gr','+','RECEITA'],['d','rd','−','DESPESA'],['t','bl','⇄','TRANSF.']].map(([k,c,s,n])=>`<a href="#" data-tx="${k}"><span class="circ ${c}">${s}</span>${n}</a>`).join('')}</div>`);
  m.addEventListener('click',e=>{const c=e.target.closest('[data-close],[data-edit],[data-del],[data-tx]');if(!c)return;e.preventDefault();
   if(c.matches('[data-close]'))return m.close();
   if(c.matches('[data-tx]')){m.close();return openTx(c.dataset.tx,id)}
   if(c.matches('[data-del]'))return askRm('acc:'+id,()=>m.close());
   m.close();formDlg('Editar conta',`<label class="fld">Nome da conta</label><input class="tf" data-nn maxlength="20" value="${esc(a.name)}"><label class="fld">Banco</label>${bankSel(a.bank)}`,'Salvar',m2=>{
    const n=$('[data-nn]',m2).value.trim();if(!n){toast('Dê um nome para a conta.');return false}a.name=n;a.bank=$('[data-bank]',m2).value;save();toast('Conta atualizada.')})})}
 function newAcc(){formDlg('Nova conta',`<label class="fld">Nome da conta</label><input class="tf" data-nn maxlength="20" placeholder="Ex.: Viagem"><label class="fld">Saldo inicial</label><input class="val" inputmode="decimal" placeholder="R$ 0,00" style="margin:4px 0 12px"><label class="fld">Banco</label>${bankSel('nubank')}`,'Salvar',m=>{
   const n=$('[data-nn]',m).value.trim();if(!n){toast('Dê um nome para a conta.');return false}
   fin.accounts.push({id:uid(),name:n,bank:$('[data-bank]',m).value,bal:num($('.val',m).value)});save();toast('Conta adicionada.')});mask($('.val',$$('.modal').pop()))}

 /* ----- limites / fixas ----- */
 function openLimit(id){const l=id&&fin.limits.find(x=>x.id===id);
  const m=formDlg(l?'Editar limite':'Novo limite',`<label class="fld">Categoria</label><input class="tf" data-ln maxlength="24" placeholder="Ex.: Mercado" value="${l?esc(l.name):''}"><small class="mu">O gasto vem das despesas lançadas com essa mesma categoria.</small><label class="fld">Limite do mês</label><input class="val" inputmode="decimal" placeholder="R$ 0,00" value="${l?brl(l.limit):''}" style="margin:4px 0 12px">`,'Salvar',m=>{
   const n=canon($('[data-ln]',m).value),v=num($('.val',m).value);if(!n){toast('Dê um nome ao limite.');return false}if(!v){toast('Digite o valor do limite.');return false}
   if(fin.limits.some(x=>x!==l&&x.name.toLowerCase()===n.toLowerCase())){toast('Já existe um limite com esse nome.');return false}
   if(l){l.name=n;l.limit=v}else fin.limits.push({id:uid(),name:n,limit:v});save();toast(l?'Limite atualizado.':'Limite adicionado.')});mask($('.val',m))}
 function addFix(k){formDlg(k==='fixR'?'Nova receita fixa':'Nova despesa fixa',`<label class="fld">Pertencente a</label><input class="tf" data-fn maxlength="30" placeholder="${k==='fixR'?'Ex.: Salário':'Ex.: Internet'}"><label class="fld">Valor</label><input class="val" inputmode="decimal" placeholder="R$ 0,00" style="margin:4px 0 12px">`,'Adicionar',m=>{
   const n=$('[data-fn]',m).value.trim(),v=num($('.val',m).value);if(!n){toast('Dê um nome.');return false}if(!v){toast('Digite um valor maior que zero.');return false}
   fin[k].push({id:uid(),n,v});save();toast('Adicionado.')});mask($('.val',$$('.modal').pop()))}

 /* ----- Visão Geral ----- */
 const link=(a,t,x='')=>`<a class="mu" href="#" ${a} style="float:right;font-size:11px;font-weight:600;${x}">${t}</a>`;
 const fixBox=(k,title,cl)=>`<div class="box"><h3>${title}${link('data-addfix="'+k+'"','+ Adicionar')}</h3>${fin[k].length?`<table><tr><th>Pertencente a:</th><th>Valor:</th><th></th></tr>${fin[k].map(x=>`<tr><td>${esc(x.n)}</td><td><span class="${cl}">${brl(x.v)}</span></td><td style="width:26px">${rmBtn(k,x.id,'sm')}</td></tr>`).join('')}</table>`:'<p class="mu">Nada cadastrado ainda.</p>'}</div>`;
 function visao(){set('hr',brl(sumTx(fin,cm,'r')));set('hd',brl(sumTx(fin,cm,'d')));
  const gs=catSum(fin,cm,'d'),mx=Math.max(1,...gs.map(g=>g[1])),mes=fin.tx.filter(x=>inM(x,cm)).sort((a,b)=>b.date.localeCompare(a.date));
  const past=[...new Set(fin.tx.map(x=>x.date.slice(0,7)))].filter(k=>k<cm).sort().reverse();
  $('#col1').innerHTML=`<div class="box"><h3>Suas contas</h3><div class="grid2" style="gap:14px">${fin.accounts.map(a=>`<div style="position:relative"><a class="acc" href="#" data-acc="${a.id}"><img src="img/${a.bank}.png" alt=""><span>${esc(a.name)}<small>${brl(a.bal)}</small></span></a>${rmBtn('acc',a.id)}</div>`).join('')}<a class="acc mu" href="#" data-addacc><span class="circ" style="margin:0;width:34px;height:34px">+</span>Adicionar conta</a></div></div>`
   +`<div class="box"><h3>Gastos do mês atual</h3>${gs.length?`<div class="vb">${gs.map(([c,v])=>`<i style="height:${v/mx*100}%;background:${catColor(c)}" title="${esc(c)}"></i>`).join('')}</div><table>${gs.map(([c,v])=>`<tr><td>${esc(c)}</td><td class="rd">${brl(v)}</td><td style="width:26px">${rmBtn('cat',encodeURIComponent(c),'sm')}</td></tr>`).join('')}</table>`:'<p class="mu">Nenhum gasto neste mês.</p>'}</div>`
   +`<div class="box"><h3>Lançamentos do mês${link('data-addtx','+ Adicionar')}</h3>${mes.length?`<div style="max-height:260px;overflow:auto"><table>${mes.map(t=>`<tr><td class="mu" style="white-space:nowrap">${fmtD(t.date).slice(0,5)}</td><td>${t.t==='t'?`${esc(accOf(t.acc)?.name||'?')} → ${esc(accOf(t.acc2)?.name||'?')}`:esc(t.cat)}</td><td class="${t.t==='r'?'gr':t.t==='d'?'rd':'bl'}" style="white-space:nowrap">${t.t==='r'?'+':t.t==='d'?'−':'⇄'} ${brl(t.val)}</td><td style="width:26px">${rmBtn('tx',t.id,'sm')}</td></tr>`).join('')}</table></div>`:'<p class="mu">Nenhum lançamento neste mês.</p>'}</div>`;
  $('#col2').innerHTML=fixBox('fixR','Receitas fixas','gr')+fixBox('fixD','Despesas fixas','rd')
   +`<div class="box"><h3>Limites de gastos${link('data-addlim','+ Adicionar')}</h3>${fin.limits.length?`<table>${fin.limits.map(l=>{const s=spentOf(fin,l,cm);return`<tr><td style="color:${catColor(l.name)}">● ${esc(l.name)}</td><td class="${s>l.limit?'rd':s>=l.limit*.8?'or':''}">${brl(s)}</td><td class="gr">${brl(l.limit)}</td><td style="width:26px">${rmBtn('lim',l.id,'sm')}</td></tr>`}).join('')}</table>`:'<p class="mu">Nenhum limite definido.</p>'}</div>`
   +`<div class="box"><h3>Relatórios passados</h3>${past.length?past.map(k=>`<div style="display:flex;justify-content:space-between;align-items:center"><a class="${sumTx(fin,k,'d')>sumTx(fin,k,'r')?'rd':'gr'}" href="relatorios.html?m=${k}"><b>${ymName(k)}</b></a>${rmBtn('mes',k,'sm')}</div>`).join(''):'<p class="mu">Nenhum relatório passado.</p>'}</div>`}

 /* ----- Limites de Gastos ----- */
 function limites(){const sp=fin.limits.map(l=>spentOf(fin,l,cm));set('hl',brl(r2(fin.limits.reduce((a,l)=>a+l.limit,0))));set('hg',brl(r2(sp.reduce((a,v)=>a+v,0))));
  $('#lims').innerHTML=fin.limits.map((l,i)=>{const s=sp[i],rest=r2(l.limit-s);return`<div class="box">${rmBtn('lim',l.id)}<h3 style="border:0;border-left:4px solid ${catColor(l.name)};padding-left:8px;font-size:18px">${esc(l.name)}</h3><a class="mu" style="float:right;font-size:10px" href="#" data-editlim="${l.id}">Editar limite</a><small>Limite:</small><br><b class="gr">${brl(l.limit)}</b><hr style="border-color:var(--line)"><div style="display:flex;gap:40px"><div><small>Gasto:</small><br><b class="${s>l.limit?'rd':s>=l.limit*.8?'or':''}">${brl(s)}</b></div><div><small>Restante:</small><br><b class="${rest<0?'rd':'gr'}">${brl(rest)}</b></div></div></div>`}).join('')
   +'<a class="box add" href="#novo-limite"><span>Adicionar limite<br><b>+</b></span></a>'}

 /* ----- Relatórios ----- */
 const qm=new URLSearchParams(location.search).get('m');let [ry,rm]=(/^\d{4}-(0[1-9]|1[0-2])$/.test(qm||'')?qm:cm).split('-').map(Number);rm--;
 function relat(){const k=`${ry}-${p(rm+1)}`,fut=k>cm,days=new Date(ry,rm+1,0).getDate(),by={};
  fin.tx.filter(x=>x.t==='d'&&inM(x,k)).forEach(x=>(by[+x.date.slice(8)]=by[+x.date.slice(8)]||[]).push(x));
  const last=Math.max(fut?0:k===cm?new Date().getDate():days,...Object.keys(by).map(Number)),has=fin.tx.some(x=>inM(x,k));
  set('hr',brl(sumTx(fin,k,'r')));set('hd',brl(sumTx(fin,k,'d')));$('[data-mes]').textContent=`${MESL[rm]} ${ry}`;
  const tot=d=>(by[d]||[]).reduce((a,x)=>a+x.val,0),mx=Math.max(1,...Array.from({length:last},(_,i)=>tot(i+1)));let rows='';
  if(!has)rows='<p class="mu center" style="margin:20px">Sem lançamentos para este mês.</p>';
  else for(let d=1;d<=last;d++){const t=tot(d),cs={};(by[d]||[]).forEach(x=>cs[x.cat]=(cs[x.cat]||0)+x.val);
   rows+=`<div class="hb"><b>${d} ${MES[rm].toLowerCase()}</b><div style="display:flex;gap:8px;align-items:center"><span style="display:flex;width:${t?Math.max(t/mx*85,3):0}%;height:14px">${Object.entries(cs).map(([c,v])=>`<i style="flex:${v};background:${catColor(c)}" title="${esc(c)}"></i>`).join('')}</span><small>${t?brl(r2(t)):''}</small></div></div>`}
  $('[data-rows]').innerHTML=rows;
  const pie=(el,t,cl)=>{const L=catSum(fin,k,t),T=L.reduce((a,x)=>a+x[1],0);let acc=0;
   el.innerHTML=T?`<div class="pie" style="background:conic-gradient(${L.map(([c,v])=>{const a=acc/T*100;acc+=v;return`${catColor(c)} ${a}% ${acc/T*100}%`}).join(',')})"></div><div><p>${L.map(([c,v])=>`<span style="color:${catColor(c)}">■</span> ${esc(c)} <b class="${cl}">${brl(v)}</b>`).join('<br>')}<br>Total${t==='d'?':':''} <b class="${cl}">${brl(r2(T))}</b></p></div>`:'<div class="pie" style="background:#333"></div><div><span class="mu">Sem dados</span></div>'};
  pie($('#pie-r'),'r','gr');pie($('#pie-g'),'d','rd');
  $('#delmes').innerHTML=has?'<a href="#" class="lnk" data-delmes style="font-size:12px">Apagar lançamentos deste mês</a>':'';
  try{history.replaceState(null,'',`?m=${k}`)}catch(e){}}

 function render(){({'finance.html':visao,'limites.html':limites,'relatorios.html':relat})[page]();
  exBar($('#exbar'),hasEx(),'Todos os exemplos do Finance (contas, lançamentos, receitas e despesas fixas e limites) serão removidos — inclusive em Relatórios e Limites de Gastos. O que você criou fica.',()=>{['accounts','tx','fixR','fixD','limits'].forEach(k=>fin[k]=fin[k].filter(x=>!x.ex));save()})}

 /* ----- cliques ----- */
 const ROUTES={'#receita':()=>openTx('r'),'#despesa':()=>openTx('d'),'#transf':()=>openTx('t'),'#nova-conta':newAcc,'#novo-limite':()=>openLimit()};
 document.addEventListener('click',e=>{const t=e.target;let c;
  if(c=t.closest('[data-acc]')){e.preventDefault();return openAcc(c.dataset.acc)}
  if(t.closest('[data-addacc]')){e.preventDefault();return newAcc()}
  if(t.closest('[data-addtx]')){e.preventDefault();return openTx('d')}
  if(t.closest('[data-addlim]')){e.preventDefault();return openLimit()}
  if(c=t.closest('[data-editlim]')){e.preventDefault();return openLimit(c.dataset.editlim)}
  if(c=t.closest('[data-addfix]')){e.preventDefault();return addFix(c.dataset.addfix)}
  if(t.closest('[data-delmes]')){e.preventDefault();return askRm('mes:'+`${ry}-${p(rm+1)}`)}
  if(c=t.closest('a[href^="#"]')){const f=ROUTES[c.getAttribute('href')];if(f){e.preventDefault();f()}}});
 if(page==='relatorios.html')$('h3 .arr').addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;rm+=+a.dataset.a;if(rm<0){rm=11;ry--}if(rm>11){rm=0;ry++}relat()});
 render();
 if(ROUTES[location.hash]){const h=location.hash;try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}ROUTES[h]()}}

applyUser();nav();
const f=location.pathname.split('/').pop()||'index.html';
if(/^(login|cadastro)/.test(f))authGate();
if(f==='home.html')homePage();
if(f==='personal.html')personalPage();
if(f==='nova-tarefa.html')cardsPage();
if(f==='finance.html'||f==='relatorios.html'||f==='limites.html')financeApp(f);
})();
