# Diagnóstico — florida.pt (Florida Light Solutions)

> Engenharia reversa do site atual, feita em julho de 2026, como base para uma proposta comercial de site novo.
> Empresa: **J. Flórido – Comércio Internacional, Lda.** — importador/distribuidor de iluminação e material elétrico, +25 anos de mercado, Carregal do Sal (Viseu).

---

## 1. O que é o site atual

Não é um site institucional simples: é um **catálogo online B2B/B2C** com mais de 1.000 referências ativas (o catálogo em PDF anuncia "+1500 produtos"). O objetivo real do negócio é **gerar contactos/encomendas de instaladores, eletricistas e revendedores**, não vendas anónimas de e-commerce puro.

### Stack técnica detetada
| Camada | Tecnologia |
|---|---|
| CMS | **WordPress** |
| E-commerce | **WooCommerce** (+ WooCommerce Payments) |
| Tema | **Kadence** + Kadence Blocks |
| Filtros de catálogo | **WOOF – WooCommerce Products Filter** |
| Cache | **LiteSpeed Cache** |
| Tradução | **GTranslate** |
| Imagens | WebP com placeholders SVG |
| Cookies | Consentimento TCF |

**Leitura:** stack pesada e cara de manter para o que entrega. WooCommerce completo (carrinho + pagamentos) está instalado, mas **o funil de compra não funciona** (ver ponto 3). Paga-se a complexidade de uma loja sem colher o benefício de uma loja.

### Arquitetura de navegação
Menu principal minimalista: **Produtos · Contactos · Sobre Nós · Artigos · Conta**.

Catálogo organizado em **2 níveis** (categoria → subcategoria):

- **Interior** (389 produtos) → Apliques, Armaduras, Downlights, Fitas LED, Lâmpadas, Painéis LED, Smart
- **Material Elétrico** (505 produtos) → Caixas, Condutores Elétricos, Disjuntores, Fichas e Tomadas, Interruptores
- **Exterior** (124 produtos) → Apliques, Projetores, Solares
- **Outros** (34 produtos) → Ar Condicionado, Bombas de Água, Painéis Fotovoltaicos

Filtros disponíveis (via WOOF): Casquilho, Cor, Material, Potência (1W–1500W), Proteção (IP20–IP67), Sensor, Tensão, Amperagem.

### Contactos e presença
- **Morada:** Centro Comercial Flórida, Av. Nossa Sra. das Febres, 3430-039 Carregal do Sal
- **Tel.:** (+351) 232 968 811 · **Telemóvel:** (+351) 927 957 641
- **Email:** geral@florida.pt
- **Redes:** Facebook, Instagram, LinkedIn
- **PDF:** `Catalogo-2025-Web-single.pdf` (+ versão 2022)
- Portes grátis: >160€ Portugal / >350€ Espanha

---

## 2. Métricas rápidas observadas
- Homepage: **~191 KB de HTML** só de markup (muito CSS inline do Kadence Blocks), ~1,6 s de resposta base.
- Catálogo: **16 produtos por página → 66 páginas** para percorrer 1.049 resultados.
- Ficha de produto: **1 imagem apenas** e specs mínimas.

---

## 3. Fragilidades (o diagnóstico "antes")

### 🔴 Bloqueadores de conversão (crítico)
1. **Não há forma clara de comprar nem de pedir orçamento.** A ficha de produto **não tem botão de carrinho nem de orçamento**. O WooCommerce está lá, mas o caminho "vi o produto → quero-o" está partido. O visitante fica sem ação.
2. **Preços totalmente escondidos** em todo o catálogo. Numa loja B2B esconder preço é defensável — mas então tem de haver um **"Pedir orçamento" imediato** em cada produto. Não há. Resultado: o cliente tem de sair do site, procurar o telefone e ligar. Perde-se a maioria.
3. **Ficha de produto pobre.** Exemplo real (`Foco LED Teto 12W 2700K`): mostra só Potência, Temperatura de cor, Cor, Referência, EAN e embalagem. **Faltam IP, casquilho, tensão, lúmens, dimensões, ângulo, ficha técnica em PDF.** Um instalador não consegue decidir — e um site que não deixa decidir não converte.

### 🟠 Experiência e catálogo
4. **1 única foto por produto**, sem zoom, sem variações, sem contexto de aplicação.
5. **66 páginas de paginação** clássica: descoberta lenta. Sem ordenação útil nem "produtos populares" credíveis.
6. **Pesquisa fraca.** Os filtros WOOF existem mas estão soterrados; não há uma pesquisa por texto proeminente (referência/EAN), que é como o profissional procura.

### 🟠 Confiança e SEO
7. **Sem sinais de confiança:** nenhuma certificação (CE/RoHS), garantia, prazo de entrega, avaliações ou logótipos de marcas visíveis na jornada de compra. Para B2B, confiança = conversão.
8. **SEO técnico frágil:** títulos e meta descriptions genéricos, sem dados estruturados de Produto (schema.org), o que desperdiça 1.000+ páginas que podiam ranquear por referência/tipo de armadura.
9. **Sem WhatsApp / contacto rápido** — o canal que instaladores realmente usam no terreno.

### 🟡 Performance / técnico
10. **Peso e scripts a mais** por causa da soma tema + WooCommerce + WOOF + GTranslate + LiteSpeed a compensar. Muito CSS inline por bloco.
11. **Dependência de plugins pagos** (WooCommerce Payments, WOOF, GTranslate) que oneram manutenção sem servir o objetivo real (gerar leads).

---

## 4. Conclusão do diagnóstico
O site atual **paga o custo de uma loja completa mas comporta-se como um folheto**: mostra produtos, esconde preços e **não oferece ação nenhuma** ao visitante interessado. O maior ganho não está em "mais design" — está em **fechar o funil**: cada produto tem de ter specs completas + um botão de orçamento/WhatsApp num clique.

A proposta (ver `../prototipo/` e `argumentos-de-venda.md`) reconstrói exatamente isso, numa stack leve (HTML/CSS/JS + Supabase) que consigo manter e evoluir sem custos de plugins.
</content>
</invoke>
