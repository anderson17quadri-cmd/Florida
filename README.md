# Florida Light Solutions — Proposta de site novo

Engenharia reversa do site atual (**florida.pt**) + proposta de um marketplace/catálogo novo, leve e orientado a conversão, para apresentar à empresa como cliente.

> **Nota ética:** o protótipo usa dados de exemplo (produtos, referências e preços inventados). Os dados de contacto são públicos, retirados do site oficial. As páginas estão marcadas como protótipo.

## Estrutura do repositório

```
.
├── docs/
│   ├── diagnostico.md          # Fase 1+2: levantamento e problemas do site atual ("antes")
│   └── argumentos-de-venda.md  # Fase 4: o que perde vs. o que resolve + guião de venda
├── prototipo/                  # Fase 3+4: protótipo navegável (HTML/CSS/JS puro)
│   ├── index.html              # Homepage — categorias + produtos populares
│   ├── catalogo.html           # Catálogo com filtros reais, pesquisa e ordenação
│   ├── produto.html            # Ficha de produto completa (specs, PDF, orçamento, WhatsApp)
│   ├── contacto.html           # Pedido de orçamento + contactos
│   ├── css/style.css           # Design system (grafite industrial + âmbar de luz quente)
│   └── js/
│       ├── produtos.js         # Dados de exemplo (futuro: tabela Supabase)
│       └── app.js              # Filtros, pesquisa, render de fichas, orçamentos
└── README.md
```

## Ver o protótipo

Abrir `prototipo/index.html` no navegador. Não precisa de servidor nem de build — funciona a partir do ficheiro. Para editar no **Termux/proot Ubuntu**: é só HTML/CSS/JS, sem npm nem frameworks.

Opcional (servidor local): `cd prototipo && python3 -m http.server 8000` → http://localhost:8000

## Resumo do diagnóstico (ver `docs/diagnostico.md`)

| Área | Site atual (florida.pt) |
|---|---|
| Stack | WordPress + WooCommerce + Kadence + WOOF + LiteSpeed + GTranslate |
| Catálogo | ~1.049 produtos ativos, 4 categorias, 2 níveis |
| **Preços** | **Escondidos em todo o site** |
| **Ação por produto** | **Nenhuma** — sem carrinho, sem "pedir orçamento" na ficha |
| Ficha de produto | 1 foto, specs mínimas (falta IP, casquilho, lúmens, dimensões, PDF) |
| Confiança | Sem certificações/garantia/prazos visíveis na jornada |
| SEO | Sem schema de Produto; títulos/meta genéricos |
| Contacto rápido | Sem WhatsApp |

**Problema central:** paga o custo de uma loja completa mas comporta-se como um folheto — mostra produtos e não oferece ação. O protótipo fecha esse funil.

## O que o protótipo demonstra (Fase 3)

- **Homepage** com categorias em destaque e produtos populares.
- **Catálogo** com filtros reais em JS (categoria, preço, IP, casquilho), pesquisa por nome/referência/EAN e ordenação.
- **Ficha de produto completa**: galeria, tabela de especificações, ficha técnica em PDF, selos de confiança, **botão "Pedir orçamento" + WhatsApp** com a referência pré-preenchida.
- **WhatsApp flutuante** em todas as páginas.
- **Mobile-first** e SEO técnico (title/meta por página, URLs limpos, HTML semântico). Pronto para acrescentar sitemap e schema.org de Produto.

## Arquitetura proposta para produção (Fase 3)

Frontend estático (o deste protótipo) + **Supabase** como base de dados e backend, tal como no Agendado.pt:

```sql
-- Tabela de produtos (migração por CSV/EAN do catálogo atual)
create table produtos (
  id          bigint generated always as identity primary key,
  ref         text unique not null,
  ean         text,
  nome        text not null,
  categoria   text not null,        -- interior | exterior | eletrico | outros
  subcategoria text,
  preco       numeric,              -- null = "sob consulta"
  potencia    int,                  -- W
  ip          text,                 -- IP20…IP68
  casquilho   text,                 -- E27, GU10, …
  temp_cor    text,                 -- 2700K…6500K
  lumens      int,
  tensao      text,
  cor         text,
  material    text,
  dimensoes   text,
  datasheet_url text,               -- PDF no Supabase Storage
  imagens     text[],               -- URLs no Supabase Storage
  popular     boolean default false,
  ativo       boolean default true,
  criado_em   timestamptz default now()
);

-- Pedidos de orçamento captados no site
create table orcamentos (
  id         bigint generated always as identity primary key,
  nome       text not null,
  email      text not null,
  telefone   text,
  tipo       text,                  -- instalador | revendedor | empresa | particular
  mensagem   text,
  itens      jsonb,                 -- [{ref, nome, qtd}]
  criado_em  timestamptz default now()
);
```

**Painel de gestão:** CRUD simples sobre a tabela `produtos` (Supabase Studio no arranque; depois um painel próprio HTML/JS com a auth do Supabase). Upload de imagens e PDFs para o Supabase Storage. Sem plugins pagos.

## Próximos passos sugeridos
1. Apresentar o protótipo à empresa.
2. **Piloto:** migrar uma categoria real (ex.: Downlights) com fichas completas + orçamento.
3. Plano de migração do catálogo completo (CSV/EAN) + painel de gestão em Supabase.
