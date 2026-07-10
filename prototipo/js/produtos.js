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

/* emoji só como placeholder visual do protótipo (sem imagens externas) */
const PRODUTOS = [
  { ref:"1351227", ean:"5604581135127", nome:"Foco LED de Teto Orientável 12W 2700K Branco", cat:"interior", sub:"Downlights", emoji:"💡", preco:8.90, potencia:12, ip:"IP20", casquilho:"Integrado", temp:"2700K", lumens:960, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Ø90×60mm", pop:true },
  { ref:"1351228", ean:"5604581135134", nome:"Foco LED de Teto Orientável 2×12W 2700K Preto", cat:"interior", sub:"Downlights", emoji:"💡", preco:16.50, potencia:24, ip:"IP20", casquilho:"Integrado", temp:"2700K", lumens:1920, tensao:"230V", cor:"Preto", material:"Alumínio", dim:"175×90×60mm", pop:true },
  { ref:"2210044", ean:"5604581220041", nome:"Painel LED Slim 40W 4000K 60×60 Branco", cat:"interior", sub:"Painéis LED", emoji:"⬜", preco:19.90, potencia:40, ip:"IP20", casquilho:"Integrado", temp:"4000K", lumens:4000, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"595×595×9mm", pop:true },
  { ref:"2210051", ean:"5604581220058", nome:"Painel LED Redondo 18W 6500K Encastrar", cat:"interior", sub:"Painéis LED", emoji:"⚪", preco:6.40, potencia:18, ip:"IP20", casquilho:"Integrado", temp:"6500K", lumens:1800, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"Ø225mm", pop:false },
  { ref:"3120088", ean:"5604581312088", nome:"Aplique LED 6W 3000K Alumínio Branco", cat:"interior", sub:"Apliques", emoji:"🔆", preco:12.30, potencia:6, ip:"IP20", casquilho:"Integrado", temp:"3000K", lumens:480, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"100×100mm", pop:false },
  { ref:"3120090", ean:"5604581312095", nome:"Aplique Vintage E27 Ouro Velho", cat:"interior", sub:"Apliques", emoji:"🏮", preco:24.00, potencia:60, ip:"IP20", casquilho:"E27", temp:"—", lumens:null, tensao:"230V", cor:"Dourado", material:"Metal", dim:"120×200mm", pop:false },
  { ref:"4405012", ean:"5604581440512", nome:"Fita LED 230V 2700K 10m IP65", cat:"interior", sub:"Fitas LED", emoji:"➰", preco:29.90, potencia:80, ip:"IP65", casquilho:"—", temp:"2700K", lumens:800, tensao:"230V", cor:"Branco Quente", material:"Silicone", dim:"10000×8mm", pop:true },
  { ref:"4405020", ean:"5604581440529", nome:"Controlador Smart Fita LED WiFi RGB", cat:"interior", sub:"Smart", emoji:"📶", preco:15.50, potencia:null, ip:"IP20", casquilho:"—", temp:"RGB", lumens:null, tensao:"12-24V", cor:"Branco", material:"PVC", dim:"60×40×22mm", pop:false },
  { ref:"5501033", ean:"5604581550133", nome:"Lâmpada LED E27 A60 10W 4000K", cat:"interior", sub:"Lâmpadas", emoji:"💡", preco:2.20, potencia:10, ip:"IP20", casquilho:"E27", temp:"4000K", lumens:1055, tensao:"230V", cor:"—", material:"PC", dim:"Ø60×110mm", pop:true },
  { ref:"5501040", ean:"5604581550140", nome:"Lâmpada LED GU10 6W 6500K", cat:"interior", sub:"Lâmpadas", emoji:"🔦", preco:1.90, potencia:6, ip:"IP20", casquilho:"GU10", temp:"6500K", lumens:520, tensao:"230V", cor:"—", material:"Alumínio/PC", dim:"Ø50×55mm", pop:false },

  { ref:"6601077", ean:"5604581660177", nome:"Projetor LED 50W 6500K IP65 Preto", cat:"exterior", sub:"Projetores", emoji:"🔲", preco:17.80, potencia:50, ip:"IP65", casquilho:"Integrado", temp:"6500K", lumens:4500, tensao:"230V", cor:"Preto", material:"Alumínio", dim:"190×170×40mm", pop:true },
  { ref:"6601085", ean:"5604581660184", nome:"Projetor LED 100W 4000K IP66 c/ Sensor", cat:"exterior", sub:"Projetores", emoji:"🎯", preco:34.90, potencia:100, ip:"IP66", casquilho:"Integrado", temp:"4000K", lumens:9000, tensao:"230V", cor:"Preto", material:"Alumínio", dim:"290×210×45mm", sensor:"Movimento", pop:true },
  { ref:"6701099", ean:"5604581670199", nome:"Aplique Exterior IP44 Duplo GU10 Branco", cat:"exterior", sub:"Apliques", emoji:"🔳", preco:14.20, potencia:14, ip:"IP44", casquilho:"GU10", temp:"—", lumens:null, tensao:"230V", cor:"Branco", material:"Alumínio", dim:"100×180mm", pop:false },
  { ref:"6701105", ean:"5604581670205", nome:"Aplique IP54 Oval c/ Grelha E27 Preto", cat:"exterior", sub:"Apliques", emoji:"🪟", preco:9.60, potencia:60, ip:"IP54", casquilho:"E27", temp:"—", lumens:null, tensao:"230V", cor:"Preto", material:"PVC", dim:"245×170mm", pop:false },
  { ref:"6801120", ean:"5604581680120", nome:"Candeeiro Solar LED 200W c/ Comando", cat:"exterior", sub:"Solares", emoji:"🔆", preco:39.90, potencia:200, ip:"IP67", casquilho:"Integrado", temp:"6500K", lumens:2000, tensao:"Solar", cor:"Preto", material:"Alumínio", dim:"320×230mm", sensor:"Movimento", pop:true },

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
