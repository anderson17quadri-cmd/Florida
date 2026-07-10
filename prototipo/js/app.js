/* ============================================================
   Lógica partilhada do protótipo (vanilla JS).
   - Menu mobile
   - Homepage: categorias + produtos populares
   - Catálogo: filtros, pesquisa, ordenação
   - Ficha: render por ?ref=
   - Botões de orçamento / WhatsApp
   ============================================================ */

const eur = (n) => n == null ? "Sob consulta" : n.toLocaleString("pt-PT",{style:"currency",currency:"EUR"});
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const catNome = (id) => (CATEGORIAS.find(c=>c.id===id)||{}).nome || id;

function waLink(msg){ return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(msg)}`; }

/* ---------- Menu mobile ---------- */
function initMenu(){
  const t = $("#menuToggle"), m = $("#mobileMenu");
  if(t && m) t.addEventListener("click", ()=> m.classList.toggle("open"));
}

/* ---------- Cartão de produto ---------- */
function productCard(p){
  const href = `produto.html?ref=${encodeURIComponent(p.ref)}`;
  const specs = [
    p.potencia ? `${p.potencia}W` : null,
    p.ip && p.ip!=="—" ? p.ip : null,
    p.casquilho && p.casquilho!=="—" && p.casquilho!=="Integrado" ? p.casquilho : null,
    p.temp && p.temp!=="—" ? p.temp : null,
  ].filter(Boolean);
  const media = p.img
    ? `<img src="${p.img}" alt="${p.nome}" loading="lazy">`
    : `<span class="ph">${p.emoji}</span>`;
  return `
  <article class="card">
    <a class="thumb${p.img?' has-img':''}" href="${href}" aria-label="${p.nome}">
      ${p.pop ? '<span class="tag">Popular</span>' : ''}
      ${media}
    </a>
    <div class="body">
      <span class="cat">${p.sub}</span>
      <h3><a href="${href}">${p.nome}</a></h3>
      <div class="specs">${specs.map(s=>`<span class="chip">${s}</span>`).join("")}</div>
      <div class="price">${eur(p.preco)} ${p.preco!=null?'<small>+IVA</small>':''}</div>
      <a class="btn btn-dark btn-block card-btn" href="${href}">Ver ficha</a>
    </div>
  </article>`;
}

/* ---------- Homepage ---------- */
function initHome(){
  const catEl = $("#homeCats");
  if(catEl){
    catEl.innerHTML = CATEGORIAS.map(c=>{
      const n = PRODUTOS.filter(p=>p.cat===c.id).length;
      return `<a class="cat-card" href="catalogo.html?cat=${c.id}">
        <div class="ico">${c.icon}</div>
        <h3>${c.nome}</h3>
        <span>${c.subs.slice(0,3).join(" · ")}…</span>
      </a>`;
    }).join("");
  }
  const popEl = $("#homePopular");
  if(popEl){
    popEl.innerHTML = PRODUTOS.filter(p=>p.pop).slice(0,8).map(productCard).join("");
  }
}

/* ---------- Catálogo ---------- */
const catalogState = { cat:"", sub:"", q:"", ip:new Set(), casq:new Set(), maxP:250, sort:"pop" };

function initCatalog(){
  const grid = $("#catGrid");
  if(!grid) return;

  const params = new URLSearchParams(location.search);
  if(params.get("cat")) catalogState.cat = params.get("cat");
  if(params.get("q"))   { catalogState.q = params.get("q"); const si=$("#search"); if(si) si.value=catalogState.q; }

  buildFilters();
  render();

  $("#search")?.addEventListener("input", e=>{ catalogState.q = e.target.value.toLowerCase(); render(); });
  $("#sort")?.addEventListener("change", e=>{ catalogState.sort = e.target.value; render(); });
  $("#filtersToggle")?.addEventListener("click", ()=> $("#filters").classList.toggle("mobile-hidden"));
}

function buildFilters(){
  const box = $("#filters"); if(!box) return;
  const cats = CATEGORIAS.map(c=>`
    <label class="filter-opt">
      <input type="radio" name="cat" value="${c.id}" ${catalogState.cat===c.id?"checked":""}>
      ${c.nome} <span class="muted" style="margin-left:auto">${PRODUTOS.filter(p=>p.cat===c.id).length}</span>
    </label>`).join("");
  const ips = [...new Set(PRODUTOS.map(p=>p.ip).filter(x=>x&&x!=="—"))].sort();
  const casqs = [...new Set(PRODUTOS.map(p=>p.casquilho).filter(x=>x&&x!=="—"&&x!=="Integrado"))].sort();

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h4 style="margin:0">Categoria</h4>
      <button id="clearF" class="btn btn-ghost" style="padding:.3rem .6rem;font-size:.78rem">Limpar</button>
    </div>
    <label class="filter-opt"><input type="radio" name="cat" value="" ${!catalogState.cat?"checked":""}> Todas</label>
    ${cats}
    <h4>Preço máximo</h4>
    <div>até <span class="range-val" id="priceOut">${catalogState.maxP}€</span></div>
    <input type="range" id="priceR" min="0" max="250" step="10" value="${catalogState.maxP}">
    <h4>Proteção (IP)</h4>
    ${ips.map(v=>`<label class="filter-opt"><input type="checkbox" class="fip" value="${v}"> ${v}</label>`).join("")}
    <h4>Casquilho</h4>
    ${casqs.map(v=>`<label class="filter-opt"><input type="checkbox" class="fcasq" value="${v}"> ${v}</label>`).join("")}
  `;

  $$('input[name=cat]', box).forEach(r=> r.addEventListener("change", e=>{ catalogState.cat=e.target.value; render(); }));
  $("#priceR", box).addEventListener("input", e=>{ catalogState.maxP=+e.target.value; $("#priceOut").textContent=e.target.value+"€"; render(); });
  $$(".fip", box).forEach(c=> c.addEventListener("change", ()=>{ toggle(catalogState.ip,c.value,c.checked); render(); }));
  $$(".fcasq", box).forEach(c=> c.addEventListener("change", ()=>{ toggle(catalogState.casq,c.value,c.checked); render(); }));
  $("#clearF", box).addEventListener("click", ()=>{
    catalogState.cat=""; catalogState.q=""; catalogState.ip.clear(); catalogState.casq.clear(); catalogState.maxP=250;
    const si=$("#search"); if(si) si.value=""; buildFilters(); render();
  });
}
function toggle(set,val,on){ on?set.add(val):set.delete(val); }

function render(){
  const grid = $("#catGrid"); if(!grid) return;
  let list = PRODUTOS.filter(p=>{
    if(catalogState.cat && p.cat!==catalogState.cat) return false;
    if(catalogState.q){
      const hay = (p.nome+" "+p.ref+" "+p.ean+" "+p.sub).toLowerCase();
      if(!hay.includes(catalogState.q)) return false;
    }
    if(catalogState.ip.size && !catalogState.ip.has(p.ip)) return false;
    if(catalogState.casq.size && !catalogState.casq.has(p.casquilho)) return false;
    if(p.preco!=null && p.preco>catalogState.maxP) return false;
    return true;
  });
  const s = catalogState.sort;
  list.sort((a,b)=>{
    if(s==="pop")     return (b.pop?1:0)-(a.pop?1:0);
    if(s==="preco-a") return (a.preco??1e9)-(b.preco??1e9);
    if(s==="preco-d") return (b.preco??-1)-(a.preco??-1);
    if(s==="pot")     return (b.potencia??0)-(a.potencia??0);
    return 0;
  });

  const title = $("#catTitle");
  if(title) title.textContent = catalogState.cat ? catNome(catalogState.cat) : "Todos os produtos";
  const count = $("#resultCount");
  if(count) count.textContent = `${list.length} produto${list.length!==1?"s":""}`;

  grid.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<div class="empty" style="grid-column:1/-1">Sem resultados para estes filtros.<br><small>Experimente limpar os filtros.</small></div>`;
}

/* ---------- Ficha de produto ---------- */
function initProduct(){
  const root = $("#pd"); if(!root) return;
  const ref = new URLSearchParams(location.search).get("ref");
  const p = PRODUTOS.find(x=>x.ref===ref) || PRODUTOS[0];

  $("#crumbCat").innerHTML = `<a href="catalogo.html?cat=${p.cat}">${catNome(p.cat)}</a>`;
  $("#crumbSub").textContent = p.sub;
  document.title = `${p.nome} — ${EMPRESA.nome}`;

  const rows = [
    ["Referência", p.ref], ["EAN", p.ean], ["Categoria", `${catNome(p.cat)} › ${p.sub}`],
    ["Potência", p.potencia?`${p.potencia} W`:null], ["Fluxo luminoso", p.lumens?`${p.lumens} lm`:null],
    ["Temperatura de cor", p.temp && p.temp!=="—"?p.temp:null], ["Casquilho", p.casquilho],
    ["Proteção", p.ip], ["Tensão", p.tensao], ["Amperagem", p.amperagem],
    ["Sensor", p.sensor], ["Cor", p.cor && p.cor!=="—"?p.cor:null],
    ["Material", p.material && p.material!=="—"?p.material:null], ["Dimensões", p.dim],
  ].filter(r=>r[1]);

  const msg = `Olá! Gostaria de um orçamento para: ${p.nome} (Ref. ${p.ref}). Quantidade: `;

  const mainMedia = p.img
    ? `<img src="${p.img}" alt="${p.nome}">`
    : `<span class="ph">${p.emoji}</span>`;
  root.innerHTML = `
    <div class="gallery">
      <div class="main${p.img?' has-img':''}" id="galMain">${mainMedia}</div>
      <div class="thumbs">
        <div class="active">${p.img?`<img src="${p.img}" alt="">`:p.emoji}</div>
        <div>📐</div><div>🔧</div><div>🏠</div>
      </div>
      <a class="datasheet" href="#" onclick="alert('No site real: descarrega a ficha técnica em PDF deste produto.');return false;">📄 Descarregar ficha técnica (PDF)</a>
    </div>
    <div class="pd-info">
      <span class="cat">${p.sub}</span>
      <h1 style="margin:.2rem 0">${p.nome}</h1>
      <div class="ref">Ref. ${p.ref}${p.ean?` · EAN ${p.ean}`:""}${p.real?` · <span style="color:var(--amber-600);font-weight:600">catálogo florida.pt</span>`:""}</div>
      <div class="price-row">
        <span class="big">${eur(p.preco)}</span>
        ${p.preco!=null?'<span class="muted">+ IVA · preço para revenda</span>':''}
      </div>
      <div class="actions">
        <a class="btn btn-primary btn-block" href="#orcamento" onclick="pedirOrcamento('${p.ref}')">✉️ Pedir orçamento</a>
        <a class="btn btn-wa btn-block" href="${waLink(msg)}" target="_blank" rel="noopener">💬 WhatsApp</a>
      </div>
      <div class="badges">
        <span class="badge">✅ Certificação CE / RoHS</span>
        <span class="badge">🚚 Envio 24–48h</span>
        <span class="badge">🛡️ Garantia 2 anos</span>
        <span class="badge">📦 Emb. por unidade</span>
      </div>
      <h3 style="margin-top:1.8rem">Especificações técnicas</h3>
      <table class="spec-table">
        ${rows.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}
      </table>
    </div>`;

  // relacionados
  const rel = $("#related");
  if(rel){
    const others = PRODUTOS.filter(x=>x.cat===p.cat && x.ref!==p.ref).slice(0,4);
    rel.innerHTML = others.map(productCard).join("");
  }
}

function pedirOrcamento(ref){
  const p = PRODUTOS.find(x=>x.ref===ref);
  setTimeout(()=> alert(`Protótipo: o pedido de orçamento de "${p.nome}" (Ref. ${ref}) seria registado no Supabase e enviado para ${EMPRESA.email}.`), 50);
}

/* ---------- Contacto ---------- */
function initContact(){
  const form = $("#contactForm"); if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    alert("Protótipo: mensagem validada e pronta a gravar no Supabase / enviar por email. Obrigado!");
    form.reset();
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initMenu(); initHome(); initCatalog(); initProduct(); initContact();
  // preencher links de contacto dinâmicos
  $$("[data-wa]").forEach(a=> a.href = waLink("Olá! Vim do site e gostaria de mais informações."));
  $$("[data-tel]").forEach(a=> a.href = "tel:"+EMPRESA.tel.replace(/\s/g,""));
  $$("[data-mail]").forEach(a=> a.href = "mailto:"+EMPRESA.email);
});
