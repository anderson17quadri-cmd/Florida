/* ============================================================
   Dados de exemplo do catálogo (protótipo).
   Numa versão real, isto vem do Supabase (tabela `produtos`).
   Estrutura pensada para migrar por CSV/EAN do catálogo atual.
   ============================================================ */

const CATEGORIAS = [
  { id: "interior",  nome: "Interior",         icon: "🏠", subs: ["Downlights","Painéis LED","Apliques","Fitas LED","Lâmpadas","Smart"] },
  { id: "exterior",  nome: "Exterior",         icon: "🌧️", subs: ["Projetores","Apliques","Solares"] },
  { id: "eletrico",  nome: "Material Elétrico", icon: "🔌", subs: ["Disjuntores","Interruptores","Fichas e Tomadas","Condutores","Caixas"] },
  { id: "outros",    nome: "Outros",           icon: "☀️", subs: ["Fotovoltaicos","Ar Condicionado","Bombas de Água"] },
];

/* emoji = placeholder visual (offline). Para fotos reais, ver README.
   ── PILOTO: Downlights REAIS extraídos de florida.pt ──
   Nomes, referências e specs verdadeiros. Preço "Sob consulta" (como no site
   deles) para demonstrar o fluxo "Pedir orçamento". Ref. 6W/12W confirmadas;
   restantes seguem o padrão da série (4011·PP·CC). `real:true`. */
const PRODUTOS = [
  { ref:"40110340 / 40110364", ean:"", nome:"Downlight LED 3W Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-3w-redondo.png", preco:null, potencia:3, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:270, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø85×21mm · corte Ø68mm", pop:false, real:true },
  { ref:"40110640 / 40110664", ean:"", nome:"Downlight LED 6W Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-6w-redondo.png", preco:null, potencia:6, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:540, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø120×21mm · corte Ø108mm", pop:true, real:true },
  { ref:"40110940 / 40110964", ean:"", nome:"Downlight LED 9W Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-9w-redondo.png", preco:null, potencia:9, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:800, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø145×21mm · corte Ø125mm", pop:false, real:true },
  { ref:"40111240 / 40111264", ean:"", nome:"Downlight LED 12W Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-12w-redondo.png", preco:null, potencia:12, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:1000, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø170×21mm · corte Ø158mm", pop:true, real:true },
  { ref:"40111840 / 40111864", ean:"", nome:"Downlight LED 18W Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-18w-redondo.png", preco:null, potencia:18, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:1500, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø225×21mm · corte Ø205mm", pop:true, real:true },
  { ref:"40112464", ean:"", nome:"Downlight LED 24W Redondo Branco 6400K", cat:"interior", sub:"Downlights", emoji:"⚪", img:"img/dl-24w-redondo.png", preco:null, potencia:24, ip:"IP44", casquilho:"Integrado", temp:"6400K", lumens:2000, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø285×21mm · corte Ø255mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Downlight LED 6W Quadrado Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⬜", img:"img/dl-6w-quadrado.png", preco:null, potencia:6, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:540, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"120×120×21mm · corte 108mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Downlight LED 12W Quadrado Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"⬜", img:"img/dl-12w-quadrado.png", preco:null, potencia:12, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:1000, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"170×170×21mm · corte 158mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Downlight LED 12W Superfície Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"🔘", img:"img/dl-12w-superficie.png", preco:null, potencia:12, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:1000, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø170×36mm · saliente", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Downlight LED 18W Superfície Redondo Branco 4000K/6400K", cat:"interior", sub:"Downlights", emoji:"🔘", img:"img/dl-18w-superficie.png", preco:null, potencia:18, ip:"IP44", casquilho:"Integrado", temp:"4000K/6400K", lumens:1500, tensao:"230V · 50/60Hz", cor:"Branco", material:"Alumínio/PC", dim:"Ø225×36mm · saliente", pop:false, real:true },
  // ── Painéis LED (reais) ──
  { ref:"Sob consulta", ean:"", nome:"Painel LED Backlit 60×60cm 40W 6400K (Aro Branco)", cat:"interior", sub:"Painéis LED", emoji:"⬜", img:"img/pn-backlit-40w.png", preco:null, potencia:40, ip:"IP20", casquilho:"Integrado", temp:"6400K", lumens:4400, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"595×595×25mm", pop:true, real:true },
  { ref:"Sob consulta", ean:"", nome:"Painel LED 60×60cm Aro Branco 40W 4000K/6400K", cat:"interior", sub:"Painéis LED", emoji:"⬜", img:"img/pn-60x60-40w.png", preco:null, potencia:40, ip:"IP20", casquilho:"Integrado", temp:"4000K/6400K", lumens:4000, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"595×595×9mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Painel LED 60×30cm Aro Alumínio 20W 4000K", cat:"interior", sub:"Painéis LED", emoji:"⬜", img:"img/pn-60x30-20w.png", preco:null, potencia:20, ip:"IP20", casquilho:"Integrado", temp:"4000K", lumens:2000, tensao:"230V", cor:"Alumínio", material:"Alumínio", dim:"595×295×9mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Painel LED 120×30cm 40W 4000K (Aro Alumínio)", cat:"interior", sub:"Painéis LED", emoji:"⬜", img:"img/pn-120x30-40w.png", preco:null, potencia:40, ip:"IP20", casquilho:"Integrado", temp:"4000K", lumens:4000, tensao:"230V", cor:"Alumínio", material:"Alumínio", dim:"1195×295×9mm", pop:false, real:true },
  // ── Lâmpadas (reais) ──
  { ref:"Sob consulta", ean:"", nome:"Lâmpada LED Esférica G45 E14 3W 2700K/6400K", cat:"interior", sub:"Lâmpadas", emoji:"💡", img:"img/lp-g45-e14.png", preco:null, potencia:3, ip:"IP20", casquilho:"E14", temp:"2700K/6400K", lumens:250, tensao:"230V", cor:"—", material:"PC", dim:"Ø45×80mm", pop:true, real:true },
  { ref:"Sob consulta", ean:"", nome:"Lâmpada LED Esférica G45 E27 3W 250lm 2700K/6400K", cat:"interior", sub:"Lâmpadas", emoji:"💡", img:"img/lp-g45-e27.png", preco:null, potencia:3, ip:"IP20", casquilho:"E27", temp:"2700K/6400K", lumens:250, tensao:"230V", cor:"—", material:"PC", dim:"Ø45×80mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Lâmpada LED Vela C37 E14 3W/4.5W 3000K/4000K/6400K", cat:"interior", sub:"Lâmpadas", emoji:"🕯️", img:"img/lp-c37-e14.png", preco:null, potencia:4.5, ip:"IP20", casquilho:"E14", temp:"3000K/4000K/6400K", lumens:470, tensao:"230V", cor:"—", material:"PC", dim:"Ø37×100mm", pop:false, real:true },
  // ── Fitas LED (reais) ──
  { ref:"Sob consulta", ean:"", nome:"Fita LED 12V SMD3528 120LED/m 9.6W/m 2700K IP20 5m", cat:"interior", sub:"Fitas LED", emoji:"➰", img:"img/ft-3528-ip20.png", preco:null, potencia:48, ip:"IP20", casquilho:"—", temp:"2700K", lumens:600, tensao:"12V", cor:"Branco Quente", material:"—", dim:"5000×8mm", pop:true, real:true },
  { ref:"Sob consulta", ean:"", nome:"Fita LED 12V SMD5050 60LED/m 14.4W/m IP20 2700K/4000K", cat:"interior", sub:"Fitas LED", emoji:"➰", img:"img/ft-5050-ip20.png", preco:null, potencia:72, ip:"IP20", casquilho:"—", temp:"2700K/4000K", lumens:900, tensao:"12V", cor:"Branco", material:"—", dim:"5000×10mm", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Fita LED 12V SMD3528 IP65 Cor (Azul/Vermelho/Verde) 5m", cat:"interior", sub:"Fitas LED", emoji:"🌈", img:"img/ft-rgb-ip65.png", preco:null, potencia:24, ip:"IP65", casquilho:"—", temp:"Cor", lumens:null, tensao:"12V", cor:"RGB", material:"Silicone", dim:"5000×8mm", pop:false, real:true },
  { ref:"4405020", ean:"", nome:"Controlador Smart Fita LED WiFi RGB", cat:"interior", sub:"Smart", emoji:"📶", preco:null, potencia:null, ip:"IP20", casquilho:"—", temp:"RGB", lumens:null, tensao:"12-24V", cor:"Branco", material:"PVC", dim:"60×40×22mm", pop:false },

  // ── Projetores (reais) ──
  { ref:"25901064", ean:"", nome:"Projetor LED Ultra Fino 10W 6400K Branco c/ Sensor", cat:"exterior", sub:"Projetores", emoji:"🔲", img:"img/pj-10w-sensor.png", preco:null, potencia:10, ip:"IP65", casquilho:"Integrado", temp:"6400K", lumens:900, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Ultra fino", sensor:"Movimento", pop:true, real:true },
  { ref:"25902064", ean:"", nome:"Projetor LED Ultra Fino 20W 6400K Branco c/ Sensor", cat:"exterior", sub:"Projetores", emoji:"🔲", img:"img/pj-20w-sensor.png", preco:null, potencia:20, ip:"IP65", casquilho:"Integrado", temp:"6400K", lumens:1800, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Ultra fino", sensor:"Movimento", pop:true, real:true },
  { ref:"25903064", ean:"", nome:"Projetor LED Ultra Fino 30W 6400K Branco c/ Sensor", cat:"exterior", sub:"Projetores", emoji:"🔲", img:"img/pj-30w-sensor.png", preco:null, potencia:30, ip:"IP65", casquilho:"Integrado", temp:"6400K", lumens:2700, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Ultra fino", sensor:"Movimento", pop:false, real:true },
  { ref:"26102064", ean:"", nome:"Projetor LED Portátil 20W 6400K c/ Bateria 8000mAh", cat:"exterior", sub:"Projetores", emoji:"🔋", img:"img/pj-20w-bateria.png", preco:null, potencia:20, ip:"IP65", casquilho:"Integrado", temp:"6400K", lumens:1800, tensao:"Bateria 8000mAh", cor:"Preto", material:"Alumínio", dim:"Portátil", pop:false, real:true },
  // ── Apliques exterior (reais) ──
  { ref:"1041WH", ean:"", nome:"Aplique IP44 Redondo Branco E27", cat:"exterior", sub:"Apliques", emoji:"🔳", img:"img/ap-redondo-e27.png", preco:null, potencia:60, ip:"IP44", casquilho:"E27", temp:"—", lumens:null, tensao:"230V", cor:"Branco", material:"PP/Vidro", dim:"Ø fixação teto/parede", pop:false, real:true },
  { ref:"1043A", ean:"", nome:"Aplique IP44 Oval Branco com Grelha Metal E27", cat:"exterior", sub:"Apliques", emoji:"🔳", img:"img/ap-oval-metal.png", preco:null, potencia:60, ip:"IP44", casquilho:"E27", temp:"—", lumens:null, tensao:"230V", cor:"Branco", material:"PP/Metal", dim:"Oval", pop:false, real:true },
  { ref:"12001BK", ean:"", nome:"Aplique Alumínio GU10 IP44 Preto", cat:"exterior", sub:"Apliques", emoji:"🔳", img:"img/ap-gu10-preto.png", preco:null, potencia:35, ip:"IP44", casquilho:"GU10", temp:"—", lumens:null, tensao:"230V", cor:"Preto", material:"Alumínio", dim:"Cubo parede", pop:true, real:true },
  { ref:"12001WH", ean:"", nome:"Aplique Alumínio GU10 IP44 Branco", cat:"exterior", sub:"Apliques", emoji:"🔳", img:"img/ap-gu10-branco.png", preco:null, potencia:35, ip:"IP44", casquilho:"GU10", temp:"—", lumens:null, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Cubo parede", pop:false, real:true },
  { ref:"Sob consulta", ean:"", nome:"Candeeiro Solar LED 200W c/ Comando e Sensor", cat:"exterior", sub:"Solares", emoji:"🔆", preco:null, potencia:200, ip:"IP67", casquilho:"Integrado", temp:"6500K", lumens:2000, tensao:"Solar", cor:"Preto", material:"Alumínio", dim:"320×230mm", sensor:"Movimento", pop:false, real:true },

  { ref:"7702011", ean:"5604581770211", nome:"Disjuntor DIN 1P 16A Curva C 6kA", cat:"eletrico", sub:"Disjuntores", emoji:"⚡", preco:3.40, potencia:null, ip:"IP20", casquilho:"—", temp:"—", lumens:null, tensao:"230V", amperagem:"16A", cor:"Branco", material:"PC", dim:"1 módulo DIN", pop:false },
  { ref:"7702028", ean:"5604581770228", nome:"Diferencial 2P 40A 30mA", cat:"eletrico", sub:"Disjuntores", emoji:"🔋", preco:18.90, potencia:null, ip:"IP20", casquilho:"—", temp:"—", lumens:null, tensao:"230V", amperagem:"40A", cor:"Branco", material:"PC", dim:"2 módulos DIN", pop:false },
  { ref:"7803033", ean:"5604581780333", nome:"Interruptor Simples Branco Encastrar", cat:"eletrico", sub:"Interruptores", emoji:"🔘", preco:1.10, potencia:null, ip:"IP20", casquilho:"—", temp:"—", lumens:null, tensao:"250V", amperagem:"10A", cor:"Branco", material:"PC", dim:"86×86mm", pop:false },
  { ref:"7904044", ean:"5604581790444", nome:"Tomada Schuko c/ Terra Branca", cat:"eletrico", sub:"Fichas e Tomadas", emoji:"🔌", preco:1.60, potencia:null, ip:"IP20", casquilho:"—", temp:"—", lumens:null, tensao:"250V", amperagem:"16A", cor:"Branco", material:"PC", dim:"86×86mm", pop:true },
  { ref:"7905050", ean:"5604581790505", nome:"Cabo H07V-K 2,5mm² Azul (rolo 100m)", cat:"eletrico", sub:"Condutores", emoji:"🧵", preco:42.00, potencia:null, ip:"—", casquilho:"—", temp:"—", lumens:null, tensao:"450/750V", amperagem:"—", cor:"Azul", material:"Cobre/PVC", dim:"2,5mm²", pop:false },

  { ref:"8801061", ean:"5604581880161", nome:"Kit Fotovoltaico 3kW Autoconsumo", cat:"outros", sub:"Fotovoltaicos", emoji:"🔆", preco:1490.00, potencia:3000, ip:"IP67", casquilho:"—", temp:"—", lumens:null, tensao:"230V", cor:"—", material:"—", dim:"Kit", pop:true },
  { ref:"8802070", ean:"5604581880270", nome:"Bomba de Água Submersível 750W", cat:"outros", sub:"Bombas de Água", emoji:"💧", preco:89.00, potencia:750, ip:"IP68", casquilho:"—", temp:"—", lumens:null, tensao:"230V", cor:"Inox", material:"Inox", dim:"—", pop:false },
  { ref:"8803088", ean:"5604581880388", nome:"Ar Condicionado Split 9000 BTU A++", cat:"outros", sub:"Ar Condicionado", emoji:"❄️", preco:349.00, potencia:2600, ip:"—", casquilho:"—", temp:"—", lumens:null, tensao:"230V", cor:"Branco", material:"—", dim:"—", pop:false },
];

/* Empresa / configuração — num único sítio, fácil de editar */
const EMPRESA = {
  nome: "Florida Light Solutions",
  legal: "J. Flórido – Comércio Internacional, Lda.",
  tel: "+351 232 968 811",
  telExib: "(+351) 232 968 811",
  movel: "+351 927 957 641",
  whatsapp: "351927957641",
  email: "geral@florida.pt",
  morada: "Centro Comercial Flórida, Av. Nossa Sra. das Febres, 3430-039 Carregal do Sal",
};

if (typeof module !== "undefined") module.exports = { CATEGORIAS, PRODUTOS, EMPRESA };
