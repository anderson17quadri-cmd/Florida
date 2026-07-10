/* ============================================================
   Lógica partilhada do protótipo (vanilla JS, sem dependências).
   - Menu mobile
   - Catálogo: filtros, pesquisa, ordenação
   - Ficha: render por ?ref=, seletor de temperatura, lightbox, JSON-LD
   - Lista de orçamento multi-produto (localStorage)
   ============================================================ */

const eur = (n) => n == null ? "Sob consulta" : n.toLocaleString("pt-PT",{style:"currency",currency:"EUR"});
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const catNome = (id) => (CATEGORIAS.find(c=>c.id===id)||{}).nome || id;
const prod = (ref) => PRODUTOS.find(x=>x.ref===ref);

function waLink(msg){ return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(msg)}`; }

/* ============================================================
   LISTA DE ORÇAMENTO (localStorage)
   ============================================================ */
const QKEY = "florida_orcamento";
const getQuote  = () => { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch { return []; } };
const saveQuote = (q) => { localStorage.setItem(QKEY, JSON.stringify(q)); updateQuoteBadges(); };
const quoteCount = () => getQuote().reduce((s,i)=>s+i.qtd, 0);

function addToQuote(ref){
  const p = prod(ref); if(!p) return;
  const q = getQuote();
  const found = q.find(i=>i.ref===ref);
  if(found) found.qtd++;
  else q.push({ ref:p.ref, nome:p.nome, sub:p.sub, qtd:1 });
  saveQuote(q);
  toast(`Adicionado ao orçamento: ${p.nome}`);
}
function setQty(ref, qtd){
  let q = getQuote();
  if(qtd<=0){ q = q.filter(i=>i.ref!==ref); }
  else { const it = q.find(i=>i.ref===ref); if(it) it.qtd = qtd; }
  saveQuote(q);
  renderQuote();
}
function clearQuote(){ saveQuote([]); renderQuote(); }

function updateQuoteBadges(){
  const n = quoteCount();
  $$("[data-quote-count]").forEach(el=>{
    el.textContent = n;
    const pill = el.closest(".quote-btn");
    if(pill) pill.classList.toggle("has-items", n>0);
  });
}

function quoteMessage(){
  const q = getQuote();
  if(!q.length) return "Olá! Gostaria de um orçamento.";
  const linhas = q.map(i=>`• ${i.qtd}× ${i.nome} (Ref. ${i.ref})`).join("\n");
  return `Olá Florida Light Solutions! Gostaria de um orçamento para:\n\n${linhas}\n\nObrigado.`;
}

/* Toast simples */
let toastT;
function toast(txt){
  let t = $("#toast");
  if(!t){ t = document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
  t.textContent = txt; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(()=> t.classList.remove("show"), 2200);
}

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
      <div class="card-actions">
        <a class="btn btn-dark card-btn" href="${href}">Ver ficha</a>
        <button class="btn btn-ghost card-add" data-add="${encodeURIComponent(p.ref)}" title="Adicionar ao orçamento" aria-label="Adicionar ao orçamento">＋</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Homepage ---------- */
function initHome(){
  const catEl = $("#homeCats");
  if(catEl){
    catEl.innerHTML = CATEGORIAS.map(c=>{
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
  if(params.get("q"))   { catalogState.q = params.get("q").toLowerCase(); const si=$("#search"); if(si) si.value=params.get("q"); }

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
  const p = prod(ref) || PRODUTOS[0];

  $("#crumbCat").innerHTML = `<a href="catalogo.html?cat=${p.cat}">${catNome(p.cat)}</a>`;
  $("#crumbSub").textContent = p.sub;
  document.title = `${p.nome} — ${EMPRESA.nome}`;

  // temperaturas disponíveis (ex.: "4000K/6400K")
  const temps = (p.temp && p.temp.includes("/")) ? p.temp.split("/").map(t=>t.trim()) : [];
  const tempSelector = temps.length
    ? `<div class="temp-select" aria-label="Temperatura de cor">
        ${temps.map((t,i)=>`<button class="temp-opt${i===0?' active':''}" data-temp="${t}">${t}</button>`).join("")}
       </div>` : "";

  const rows = [
    ["Referência", p.ref], ["EAN", p.ean], ["Categoria", `${catNome(p.cat)} › ${p.sub}`],
    ["Potência", p.potencia?`${p.potencia} W`:null], ["Fluxo luminoso", p.lumens?`${p.lumens} lm`:null],
    ["Temperatura de cor", p.temp && p.temp!=="—"?`<span id="specTemp">${p.temp}</span>`:null], ["Casquilho", p.casquilho],
    ["Proteção", p.ip], ["Tensão", p.tensao], ["Amperagem", p.amperagem],
    ["Sensor", p.sensor], ["Cor", p.cor && p.cor!=="—"?p.cor:null],
    ["Material", p.material && p.material!=="—"?p.material:null], ["Dimensões", p.dim],
  ].filter(r=>r[1]);

  const mainMedia = p.img
    ? `<img src="${p.img}" alt="${p.nome}">`
    : `<span class="ph">${p.emoji}</span>`;
  root.innerHTML = `
    <div class="gallery">
      <div class="main${p.img?' has-img zoomable':''}" id="galMain">${mainMedia}${p.img?'<span class="zoom-hint">🔍 Ampliar</span>':''}</div>
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
      ${temps.length?`<div class="temp-row"><span class="muted">Temperatura de cor:</span>${tempSelector}</div>`:""}
      <div class="actions">
        <button class="btn btn-primary btn-block" data-add="${encodeURIComponent(p.ref)}">＋ Adicionar ao orçamento</button>
        <a class="btn btn-wa btn-block" id="pdWa" href="#" target="_blank" rel="noopener">💬 WhatsApp</a>
      </div>
      <a class="pd-quote-link" href="orcamento.html">Ver o meu orçamento (<span data-quote-count>0</span>) →</a>
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

  // estado da temperatura selecionada → WhatsApp + spec
  let selTemp = temps[0] || (p.temp && p.temp!=="—" ? p.temp : "");
  const updateWa = () => {
    const extra = selTemp ? ` — ${selTemp}` : "";
    $("#pdWa").href = waLink(`Olá! Gostaria de um orçamento para: ${p.nome}${extra} (Ref. ${p.ref}). Quantidade: `);
  };
  updateWa();
  $$(".temp-opt", root).forEach(b=> b.addEventListener("click", ()=>{
    $$(".temp-opt", root).forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); selTemp = b.dataset.temp;
    const st = $("#specTemp"); if(st) st.textContent = selTemp;
    updateWa();
  }));

  // lightbox
  const gm = $("#galMain");
  if(p.img && gm) gm.addEventListener("click", ()=> openLightbox(p.img, p.nome));

  // JSON-LD (SEO)
  injectProductSchema(p);

  // relacionados
  const rel = $("#related");
  if(rel){
    const others = PRODUTOS.filter(x=>x.cat===p.cat && x.ref!==p.ref).slice(0,4);
    rel.innerHTML = others.map(productCard).join("");
  }
}

/* ---------- SEO: schema.org Product em JSON-LD ---------- */
function injectProductSchema(p){
  const data = {
    "@context":"https://schema.org/","@type":"Product",
    name: p.nome, sku: p.ref, mpn: p.ref,
    brand: { "@type":"Brand", name:"Florida Light Solutions" },
    description: `${p.nome}. ${p.potencia?p.potencia+"W. ":""}${p.ip&&p.ip!=="—"?p.ip+". ":""}${p.temp&&p.temp!=="—"?p.temp+". ":""}`.trim(),
    image: p.img ? new URL(p.img, location.href).href : undefined,
    offers: {
      "@type":"Offer", priceCurrency:"EUR", availability:"https://schema.org/InStock",
      ...(p.preco!=null ? { price:p.preco } : { }),
      seller:{ "@type":"Organization", name:"Florida Light Solutions" }
    }
  };
  const s = document.createElement("script");
  s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/* ---------- Lightbox ---------- */
function openLightbox(src, alt){
  let lb = $("#lightbox");
  if(!lb){
    lb = document.createElement("div"); lb.id="lightbox"; lb.className="lightbox";
    lb.innerHTML = `<button class="lb-close" aria-label="Fechar">✕</button><img alt="">`;
    document.body.appendChild(lb);
    lb.addEventListener("click", e=>{ if(e.target===lb || e.target.classList.contains("lb-close")) lb.classList.remove("open"); });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") lb.classList.remove("open"); });
  }
  $("img", lb).src = src; $("img", lb).alt = alt || "";
  lb.classList.add("open");
}

/* ---------- Página de orçamento ---------- */
function initQuotePage(){
  const root = $("#quoteRoot"); if(!root) return;
  renderQuote();
  document.addEventListener("click", e=>{
    const b = e.target.closest("[data-qadd],[data-qsub],[data-qdel]");
    if(!b) return;
    const ref = decodeURIComponent(b.dataset.qadd || b.dataset.qsub || b.dataset.qdel);
    const it = getQuote().find(i=>i.ref===ref); if(!it && !b.dataset.qdel) return;
    if(b.dataset.qadd) setQty(ref, it.qtd+1);
    else if(b.dataset.qsub) setQty(ref, it.qtd-1);
    else if(b.dataset.qdel) setQty(ref, 0);
  });
  $("#quoteClear")?.addEventListener("click", ()=>{ if(confirm("Limpar o orçamento?")) clearQuote(); });
}

function renderQuote(){
  const root = $("#quoteRoot"); if(!root) return;
  const q = getQuote();
  const actions = $("#quoteActions");
  if(!q.length){
    root.innerHTML = `<div class="empty">O seu orçamento está vazio.<br><small>Adicione produtos com o botão ＋ no catálogo.</small><br><br><a class="btn btn-primary" href="catalogo.html">Ver catálogo</a></div>`;
    if(actions) actions.classList.add("hidden");
    return;
  }
  root.innerHTML = `
    <table class="quote-table">
      <thead><tr><th>Produto</th><th>Quantidade</th><th></th></tr></thead>
      <tbody>
      ${q.map(i=>`
        <tr>
          <td><strong>${i.nome}</strong><br><span class="muted" style="font-size:.82rem">${i.sub} · Ref. ${i.ref}</span></td>
          <td>
            <div class="qty">
              <button data-qsub="${encodeURIComponent(i.ref)}" aria-label="Menos">−</button>
              <span>${i.qtd}</span>
              <button data-qadd="${encodeURIComponent(i.ref)}" aria-label="Mais">＋</button>
            </div>
          </td>
          <td><button class="qdel" data-qdel="${encodeURIComponent(i.ref)}" aria-label="Remover">🗑️</button></td>
        </tr>`).join("")}
      </tbody>
    </table>
    <p class="muted" style="font-size:.85rem">Preços fornecidos por orçamento (condições de revenda). Envie a lista e respondemos em minutos.</p>`;
  if(actions){
    actions.classList.remove("hidden");
    $("#quoteWa").href = waLink(quoteMessage());
    const body = encodeURIComponent(quoteMessage());
    $("#quoteMail").href = `mailto:${EMPRESA.email}?subject=${encodeURIComponent("Pedido de orçamento — site")}&body=${body}`;
  }
}

/* ---------- Contacto ---------- */
function initContact(){
  const form = $("#contactForm"); if(!form) return;
  // pré-preencher com a lista de orçamento, se existir
  const msg = $("#msg");
  const q = getQuote();
  if(msg && !msg.value && q.length){
    msg.value = q.map(i=>`${i.qtd}× ${i.nome} (Ref. ${i.ref})`).join("\n");
  }
  form.addEventListener("submit", e=>{
    e.preventDefault();
    alert("Protótipo: pedido validado e pronto a gravar no Supabase / enviar por email. Obrigado!");
    form.reset();
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initMenu(); initHome(); initCatalog(); initProduct(); initContact(); initQuotePage();

  // delegação: botões "+ Orçamento" em qualquer sítio
  document.addEventListener("click", e=>{
    const b = e.target.closest("[data-add]");
    if(b){ e.preventDefault(); addToQuote(decodeURIComponent(b.dataset.add)); }
  });

  // links de contacto dinâmicos
  $$("[data-wa]").forEach(a=> a.href = waLink("Olá! Vim do site e gostaria de mais informações."));
  $$("[data-tel]").forEach(a=> a.href = "tel:"+EMPRESA.tel.replace(/\s/g,""));
  $$("[data-mail]").forEach(a=> a.href = "mailto:"+EMPRESA.email);

  updateQuoteBadges();
});
