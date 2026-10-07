(()=>{
const {$,$$,LS,esc,toast,confirmBox,photo,user,DEF,applyUser}=window.PRUMO;
const f=location.pathname.split('/').pop();

if(f==='settings.html'){
 const secs=['perfil','conta','notificacoes','privacidade','temas'];
 const show=()=>{let h=location.hash.slice(1);if(!secs.includes(h))h='perfil';$$('.sp').forEach(s=>s.hidden=s.id!=='sec-'+h);$$('#snav a').forEach(a=>{const on=a.getAttribute('href')==='#'+h;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')})};
 addEventListener('hashchange',show);show();
 // busca na barra lateral
 $('#sbusca').oninput=e=>{const t=e.target.value.trim().toLowerCase();let n=0;$$('#snav a').forEach(a=>{const v=!t||a.textContent.toLowerCase().includes(t);a.hidden=!v;n+=v});$('#snone').hidden=n>0};
 // perfil
 const u=user(),pn=$('#pn');pn.value=u.name===DEF.name?'':u.name;const sec=$('#sec-perfil');let get=photo(sec,u.img);
 $('#ps').onclick=()=>{LS.set('user',{name:pn.value.trim()||DEF.name,img:get()});applyUser();toast('Perfil salvo.')};
 $('#pc').onclick=()=>{const o=user();pn.value=o.name===DEF.name?'':o.name;get=photo(sec,o.img);toast('Alterações descartadas.')};
 // conta
 const ac=LS.get('acc',{});$('#cn').value=ac.nome||'';$('#ce').value=ac.email||'';
 $('#cs').onclick=()=>{const e=$('#ce').value.trim();if(e&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){$('#ce').focus();return toast('Digite um e-mail válido.')}LS.set('acc',{nome:$('#cn').value.trim(),email:e});toast('Dados salvos neste navegador. (Contas reais ainda em desenvolvimento)')};
 $('#cp').onclick=()=>{const [a,b,c]=['s0','s1','s2'].map(i=>$('#'+i).value);if(!a||!b||!c)return toast('Preencha os três campos de senha.');if(b.length<8)return toast('A nova senha precisa ter ao menos 8 caracteres.');if(b!==c)return toast('A confirmação não confere com a nova senha.');
  ['s0','s1','s2'].forEach(i=>$('#'+i).value='');toast('Senha validada, mas não alterada: o login ainda está em desenvolvimento.')};
 // notificações
 const N=[['lemb','Lembretes de tarefas','Avisos antes dos prazos e reuniões.'],['lim','Alertas de limite de gastos','Aviso ao chegar perto do limite de uma categoria.'],['nov','Novidades do PRUMO','Atualizações da fase Alpha.'],['mail','Resumo semanal por e-mail','Receba um resumo das suas finanças e tarefas.']];
 const sv=LS.get('notif',{lemb:1,lim:1,nov:1,mail:0});
 $('#nlist').innerHTML=N.map(([k,t,d])=>`<div class="row"><div>${t}<small>${d}</small></div><label class="sw"><input type="checkbox" data-n="${k}" aria-label="${t}"${sv[k]?' checked':''}><span></span></label></div>`).join('')+'<p class="mu" style="margin-top:14px">Por enquanto, as notificações não são enviadas de verdade: sua escolha só fica salva.</p>';
 $('#nlist').onchange=e=>{const k=e.target.dataset.n;if(!k)return;sv[k]=e.target.checked?1:0;LS.set('notif',sv);toast('Preferência salva.')};
 // privacidade
 $('#rst').onclick=()=>confirmBox('Restaurar exemplos?','Tarefas, cartões e dados do Finance voltam para os exemplos originais. O que você criou nessas áreas será apagado. Perfil e preferências não mudam.','Restaurar',()=>{try{['tasks','cards','fin','newsClosed'].forEach(k=>localStorage.removeItem('prumo_'+k))}catch(e){}toast('Exemplos restaurados.')});
 $('#clr').onclick=()=>confirmBox('Limpar dados do protótipo?','Nome de usuário, foto, preferências, tarefas, cartões e dados do Finance salvos neste navegador serão apagados e voltarão ao padrão.','Limpar',()=>{try{Object.keys(localStorage).filter(k=>k.startsWith('prumo_')).forEach(k=>localStorage.removeItem(k))}catch(e){}location.href='settings.html#perfil';location.reload()});
}

if(f==='suporte.html'){
 const S=[
 ['finance','Finance','R$',[['Como registro uma receita ou despesa?','Na Visão Geral do Finance, use os atalhos Receita, Despesa e Transferência. Escolha a conta, digite o valor e clique em Salvar.'],['Como funcionam os limites de gastos?','Em Limites de Gastos você define um teto por categoria. Cada cartão mostra o limite, o gasto e o que resta, e o restante fica vermelho quando o limite é ultrapassado.'],['Como leio os relatórios?','Em Relatórios você vê os gastos dia a dia e o resumo de receitas e gastos do mês. Use as setas ‹ › para trocar de mês.'],['Posso ter mais de uma conta?','Sim. Em Suas contas, clique em Adicionar conta, dê um nome, informe o saldo e escolha o banco.']]],
 ['guia','Guia rápido','?',[['1. Entre no PRUMO','Faça login ou cadastro (no protótipo, o acesso é livre) e defina seu nome e foto.'],['2. Explore a Home','O Acesso rápido leva ao Uso rápido, Lembretes, Finance e Personal.'],['3. Crie sua primeira tarefa','Em Personal, dê um nome, adicione data, prioridade ou lembrete e salve.'],['4. Ajuste seu perfil','Clique na sua foto no topo e escolha Perfil ou Conta, ou abra a engrenagem para Configurações.']]],
 ['personal','Personal','✓',[['Como crio uma tarefa ou cartão?','Preencha o nome e, se quiser, a descrição. Os botões Data, Prioridade e Lembretes abrem as opções; depois clique em Salvar.'],['O que significam as cores de prioridade?','Verde é Regular, amarelo é Moderada e vermelho é Obrigatório.'],['Como removo uma tarefa ou cartão?','Clique no X no canto do cartão e confirme na tela.'],['Como encontro um cartão?','Na tela de cartões, use Pesquisa para filtrar pelo nome ou conteúdo.']]],
 ['novidades','Novidades do PRUMO','★',[['Fase Alpha','Estamos trabalhando na Alpha do PRUMO. Se encontrar algum bug, avise para corrigirmos.'],['Finance em retrabalho','O Finance está sendo retrabalhado e pode mudar bastante.'],['Em construção','Configurações e Suporte já estão disponíveis em versão inicial; várias opções ainda estão em desenvolvimento.']]],
 ['contato','Contato','✉',null],['sugestoes','Sugestões','✎',null]];
 const T=$('#tiles'),P=$('#spanel');
 T.innerHTML=S.map(([k,n,g])=>`<button type="button" class="tile" data-k="${k}"><i aria-hidden="true">${g}</i><span>${n}</span></button>`).join('');
 const acc=its=>its.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');
 const form=(k)=>k==='contato'
  ?`<h2>Contato</h2><p class="mu">Telefone: <a class="lnk" href="tel:+5511999999999">+55 11 99999-9999</a><br>E-mail: <a class="lnk" href="mailto:prumo@outlook.com">prumo@outlook.com</a></p><div class="frm"><label for="fa">Assunto</label><input class="inp" id="fa" maxlength="80"><label for="fb">Mensagem</label><textarea class="tf" id="fb" rows="4" maxlength="500"></textarea><div class="fo" style="margin-top:14px"><button type="button" class="bt s" id="fs">Enviar</button></div></div>`
  :`<h2>Sugestões</h2><p class="mu">Valorizamos cada sugestão para corrigir falhas e criar novos recursos.</p><div class="frm"><label for="fc">Sobre o quê?</label><select class="tf" id="fc"><option>Finance</option><option>Personal</option><option>Visual / design</option><option>Outro</option></select><label for="fb">Sua sugestão</label><textarea class="tf" id="fb" rows="4" maxlength="500"></textarea><div class="fo" style="margin-top:14px"><button type="button" class="bt s" id="fs">Enviar</button></div></div>`;
 const open=k=>{const s=S.find(x=>x[0]===k);$$('.tile').forEach(t=>t.classList.toggle('on',t.dataset.k===k));
  P.innerHTML=s[3]?`<h2>${s[1]}</h2>`+acc(s[3]):form(k);if(!s[3]){const b=$('#fs');b.onclick=()=>{const m=$('#fb');if(!m.value.trim()){m.focus();return toast('Escreva sua mensagem antes de enviar.')}
   if(k==='contato'&&!$('#fa').value.trim()){$('#fa').focus();return toast('Informe o assunto.')}m.value='';k==='contato'&&($('#fa').value='');toast('Registrado no protótipo. Ainda não é enviado à equipe (em desenvolvimento).')}}
  P.scrollIntoView({behavior:'smooth',block:'nearest'})};
 T.onclick=e=>{const t=e.target.closest('.tile');if(t){$('#sq').value='';open(t.dataset.k)}};
 $('#sq').oninput=e=>{const q=e.target.value.trim().toLowerCase();$$('.tile').forEach(t=>t.classList.remove('on'));if(!q){P.innerHTML='';return}
  const hits=S.flatMap(s=>(s[3]||[]).filter(([a,b])=>(a+' '+b).toLowerCase().includes(q)));
  P.innerHTML=hits.length?`<h2>Resultados</h2>`+acc(hits):'<p class="mu center">Nada encontrado. Tente outra palavra ou fale com a gente em <b>Contato</b>.</p>'};
}
})();
