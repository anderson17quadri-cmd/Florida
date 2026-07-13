/* ==========================================================================
   PRIMEIRA PÁGINA — script.js
   Todas as animações: GSAP 3 + ScrollTrigger + Lenis (via CDN).

   COMO AJUSTAR AS ANIMAÇÕES (guia rápido):
   - duration : tempo da animação em segundos (0.8 = suave; 0.4 = rápido)
   - ease     : curva de aceleração. "power3.out" = entra rápido e trava
                suave (ideal para reveals); "sine.inOut" = oscilação
                natural (ideal para loops); "back.out(1.7)" = com "pop"
   - stagger  : atraso entre elementos do mesmo grupo (0.1–0.2 costuma
                ficar bem; valores maiores = efeito cascata mais lento)
   - start    : "top 85%" = anima quando o TOPO do elemento atinge 85%
                da altura do viewport (mais alto = anima mais cedo)
   - scrub    : true = a animação fica "presa" ao scroll (avança e
                recua com o dedo/roda), em vez de tocar uma vez
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     BLOCO 0 · GUARDA DE SEGURANÇA
     Se os CDNs do GSAP/Lenis não carregarem, mantemos a classe "no-js"
     no <html> — o CSS mostra então todo o conteúdo sem animações.
     ------------------------------------------------------------------------ */
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add('no-js');
    return;
  }
  document.documentElement.classList.remove('no-js');

  gsap.registerPlugin(ScrollTrigger);

  /* Deteta se o utilizador pediu menos animação no sistema operativo */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     BLOCO 1 · LENIS SMOOTH SCROLL + INTEGRAÇÃO COM O SCROLLTRIGGER
     O Lenis suaviza o scroll nativo; o ScrollTrigger precisa de ser
     "acordado" a cada frame de scroll do Lenis para manter tudo em sincronia.
     Ajustes: `duration` (inércia do scroll, 1–1.5) e `easing`.
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,                                        // inércia do scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easing exponencial suave
    });

    // Cada scroll do Lenis atualiza o ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // O ticker do GSAP passa a "conduzir" o Lenis (um só requestAnimationFrame)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP dá segundos; Lenis quer milissegundos
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* Helper para navegar até uma âncora (usa Lenis se existir) */
  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: -70, duration: 1.2 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ------------------------------------------------------------------------
     BLOCO 2 · LOADER (PAGE REVEAL)
     Overlay navy que desliza para cima ao carregar (0.9s), e só depois
     dispara as animações de entrada do hero (bloco 6).
     Ajustes: duração do slide em `duration`, atraso inicial em `delay`.
     ------------------------------------------------------------------------ */
  const loader = document.getElementById('loader');

  function playIntro() {
    const tl = gsap.timeline();

    // 1) Palavras do logo no loader aparecem
    tl.from('.loader-word', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out'
    })
      // 2) Overlay desliza para cima revelando a página
      .to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.35
      })
      .set(loader, { display: 'none' })
      // 3) Hero entra (timeline do bloco 6), sobrepondo-se ligeiramente
      .add(heroIntro(), '-=0.35');
  }

  /* ------------------------------------------------------------------------
     BLOCO 3 · HEADER: TRANSPARENTE → BRANCO SÓLIDO
     Passa a ter fundo branco + sombra quando o scroll ultrapassa 80px.
     Usamos o evento de scroll do Lenis (ou o nativo como fallback).
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');

  function onScrollHeader(scrollY) {
    header.classList.toggle('is-scrolled', scrollY > 80);
  }
  if (lenis) {
    lenis.on('scroll', ({ scroll }) => onScrollHeader(scroll));
  } else {
    window.addEventListener('scroll', () => onScrollHeader(window.scrollY), { passive: true });
  }
  onScrollHeader(window.scrollY); // estado inicial (ex.: refresh a meio da página)

  /* ------------------------------------------------------------------------
     BLOCO 4 · MENU MOBILE (HAMBÚRGUER + OVERLAY FULLSCREEN)
     Abre overlay navy; os links entram com fade + slide em stagger.
     O scroll é bloqueado (lenis.stop) enquanto o menu está aberto.
     ------------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  let menuOpen = false;

  function toggleMenu(force) {
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    header.classList.toggle('menu-open', menuOpen);
    hamburger.classList.toggle('is-open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.classList.toggle('is-open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!menuOpen));

    if (menuOpen) {
      if (lenis) lenis.stop(); // bloqueia o scroll de fundo
      // Links entram: fade + slide de baixo, em cascata (stagger 0.07)
      gsap.fromTo(mobileLinks,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      );
    } else {
      if (lenis) lenis.start();
    }
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Clicar num link fecha o menu e navega suavemente até à secção
  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu(false);
      scrollToTarget(link.getAttribute('href'));
    });
  });

  /* Navegação suave também nos links do header desktop e âncoras gerais */
  document.querySelectorAll('.nav-link, .btn-header, .hero-cta[href^="#"], .footer-link[href^="#"], .logo[href^="#"]')
    .forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTarget(href);
      });
    });

  /* ------------------------------------------------------------------------
     BLOCO 5 · CURSOR CUSTOMIZADO
     Círculo verde que segue o rato com "atraso elástico" (interpolação
     linear / lerp a cada frame). Cresce sobre elementos clicáveis.
     Ajuste: o fator 0.18 do lerp — maior = segue mais colado ao rato.
     ------------------------------------------------------------------------ */
  const cursor = document.getElementById('cursor');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursor && finePointer && !reduceMotion) {
    let mouseX = -100, mouseY = -100;  // posição real do rato
    let curX = -100, curY = -100;      // posição interpolada do círculo

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.add('is-visible');
    });

    // Loop de interpolação: o círculo "persegue" o rato a 18% por frame
    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX - 9}px, ${curY - 9}px)`;
    });

    // Cresce sobre qualquer elemento clicável/interativo
    const hoverTargets = 'a, button, .portfolio-card, .problem-card, .testimonial-card';
    document.addEventListener('mouseover', (e) => {
      cursor.classList.toggle('is-hovering', !!e.target.closest(hoverTargets));
    });
  }

  /* ------------------------------------------------------------------------
     BLOCO 6 · HERO — ANIMAÇÃO DE ENTRADA (no load, não no scroll)
     Sequência: badge → palavras do título (stagger 0.1) → subtítulo →
     botões (fade+scale, stagger) → mockup → indicador de scroll.
     Devolve a timeline para ser encadeada no loader (bloco 2).
     ------------------------------------------------------------------------ */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-badge',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 })

      // Cada palavra do H1 sobe 40px com fade, 0.1s entre palavras
      .fromTo('.hero-word',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.3')

      // Subtítulo entra 0.3s "depois" do título (posição relativa na timeline)
      .fromTo('.hero-sub',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')

      // Botões: fade + scale com stagger
      .fromTo('.hero-cta',
        { opacity: 0, scale: 0.9, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.35')

      // Mockup do browser entra da direita com leve rotação
      .fromTo('.hero-mockup-wrap',
        { opacity: 0, x: 60, y: 20 },
        { opacity: 1, x: 0, y: 0, duration: 0.9 }, '-=0.7')

      // Indicador de scroll por último
      .fromTo('.scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }, '-=0.2');

    return tl;
  }

  /* ------------------------------------------------------------------------
     BLOCO 7 · FORMAS FLUTUANTES (hero + CTA final)
     Loop infinito: cada forma oscila verticalmente com duração aleatória.
     repeat:-1 = infinito; yoyo:true = vai e volta; sine.inOut = suave.
     ------------------------------------------------------------------------ */
  if (!reduceMotion) {
    document.querySelectorAll('.shape').forEach((shape, i) => {
      gsap.to(shape, {
        y: i % 2 === 0 ? 30 : -30,          // alterna a direção entre formas
        x: i % 2 === 0 ? -14 : 14,
        duration: gsap.utils.random(5, 8),   // durações diferentes = movimento orgânico
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  /* ------------------------------------------------------------------------
     BLOCO 8 · MOCKUP DO HERO — PARALLAX COM O RATO
     A moldura do browser roda/desloca-se proporcionalmente à posição do
     cursor dentro do hero (efeito de profundidade 3D).
     Ajustes: os multiplicadores (10 e 6) controlam a intensidade.
     ------------------------------------------------------------------------ */
  const heroSection = document.getElementById('hero');
  const heroMockup = document.getElementById('heroMockup');

  if (heroMockup && finePointer && !reduceMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      // Normaliza a posição do rato para o intervalo [-0.5, 0.5]
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(heroMockup, {
        rotationY: -6 + relX * 10,   // rotação base -6° ± 5°
        rotationX: 2 - relY * 6,     // rotação base 2° ∓ 3°
        x: relX * 16,
        y: relY * 12,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    // Regressa à pose original quando o rato sai do hero
    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroMockup, { rotationY: -6, rotationX: 2, x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
    });
  }

  /* ------------------------------------------------------------------------
     BLOCO 9 · INDICADOR DE SCROLL — BOUNCE INFINITO
     Sobe/desce 8px em loop. Ajuste: `y` (amplitude) e `duration` (ritmo).
     ------------------------------------------------------------------------ */
  if (!reduceMotion) {
    gsap.to('.scroll-indicator .mouse-wheel', {
      y: 8,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /* ------------------------------------------------------------------------
     BLOCO 10 · CONTADORES (COUNT-UP) DA PROVA SOCIAL
     Cada número tem data-count="valor final". Animamos um objeto proxy
     {val:0} até esse valor e escrevemos o inteiro no elemento a cada
     frame (onUpdate). data-count-template permite formatos especiais,
     ex.: "5-{v}" produz "5-7". Dispara UMA vez ao entrar no viewport.
     Ajustes: duration (2s) e ease ("power2.out" desacelera no fim).
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const template = el.dataset.countTemplate || '{v}';
    const proxy = { val: 0 };

    // Estado inicial visível correto (ex.: "0" ou "5-0")
    el.textContent = template.replace('{v}', '0');

    gsap.to(proxy, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',   // dispara quando o topo do número atinge 80% do viewport
        once: true          // só conta uma vez (remover para repetir a cada entrada)
      },
      onUpdate() {
        el.textContent = template.replace('{v}', Math.round(proxy.val));
      }
    });
  });

  /* ------------------------------------------------------------------------
     BLOCO 11 · REVEALS GENÉRICOS AO SCROLL (padrão base do site)
     - [data-reveal]        → elemento individual: fade + subir 36px
     - [data-reveal-group]  → grupos (cards) com stagger 0.15s entre eles
     PARA REPLICAR NOUTRA SECÇÃO: basta pôr data-reveal no elemento, ou
     data-reveal-group="nome-do-grupo" em vários irmãos — o código abaixo
     apanha-os automaticamente.
     ------------------------------------------------------------------------ */

  // Elementos individuais (títulos de secção, barra de stats, etc.)
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
  });

  // Grupos com stagger: junta os elementos pelo valor do atributo
  const groups = {};
  document.querySelectorAll('[data-reveal-group]').forEach((el) => {
    const name = el.dataset.revealGroup;
    (groups[name] = groups[name] || []).push(el);
  });

  Object.values(groups).forEach((els) => {
    gsap.fromTo(els,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,                        // 0.15s entre cada card do grupo
        scrollTrigger: {
          trigger: els[0],                    // dispara quando o 1º card aparece
          start: 'top 85%',
          once: true
        }
      });
  });

  /* ------------------------------------------------------------------------
     BLOCO 12 · PORTFÓLIO — PARALLAX DA "TELA" + TILT 3D NO HOVER
     a) Parallax: o conteúdo dentro do ecrã do laptop desloca-se de
        -20px a +20px conforme o card atravessa o viewport (scrub:true
        = preso ao scroll). Ajuste: os valores de y.
     b) Tilt: no hover, o card inclina-se (rotateX/rotateY até ±6°)
        seguindo a posição do rato dentro do card, + scale(1.02).
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.portfolio-card').forEach((card) => {
    const screen = card.querySelector('.screen-content');

    // a) Parallax da tela interna (sempre ativo, mesmo em mobile)
    if (screen && !reduceMotion) {
      gsap.fromTo(screen,
        { y: -20 },
        {
          y: 20,
          ease: 'none',                 // linear — o scrub já controla o ritmo
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',        // começa quando o card entra em baixo
            end: 'bottom top',          // termina quando sai por cima
            scrub: true                 // liga a animação diretamente ao scroll
          }
        });
    }

    // b) Tilt 3D (apenas com rato "fino" — desativado em ecrãs táteis)
    if (finePointer && !reduceMotion) {
      const MAX_TILT = 6; // graus máximos de inclinação

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;  // [-0.5, 0.5]
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotationY: relX * MAX_TILT * 2,
          rotationX: -relY * MAX_TILT * 2,
          scale: 1.02,
          transformPerspective: 900,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      // Volta ao estado plano quando o rato sai
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
      });
    }
  });

  /* ------------------------------------------------------------------------
     BLOCO 13 · PROCESSO — LINHA QUE SE DESENHA + PASSOS SEQUENCIAIS
     Desktop: a linha SVG usa o truque stroke-dasharray/dashoffset —
     o comprimento total do traço é medido (getTotalLength) e o offset
     é animado de 100% até 0, "desenhando" a linha com o scroll (scrub).
     Os 4 passos aparecem (fade + scale) em pontos da mesma timeline,
     sincronizados com a passagem da linha por cada círculo.
     Mobile: a linha vertical (::before) cresce via variável CSS
     --line-scale, animada da mesma forma.
     ------------------------------------------------------------------------ */
  const processSection = document.getElementById('processo');
  const processPath = document.getElementById('processPath');
  const processSteps = gsap.utils.toArray('[data-step]');
  const stepsWrap = document.getElementById('processSteps');

  const mm = gsap.matchMedia();

  // ---- DESKTOP/TABLET (>768px): linha horizontal SVG ----
  mm.add('(min-width: 769px)', () => {
    const length = processPath.getTotalLength();

    // Prepara o traço: totalmente "escondido" (offset = comprimento total)
    gsap.set(processPath, { strokeDasharray: length, strokeDashoffset: length });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processSection,
        start: 'top 65%',     // começa quando a secção está a 65% do viewport
        end: 'bottom 85%',
        scrub: reduceMotion ? false : 1  // scrub:1 = segue o scroll com 1s de suavização
      }
    });

    // A linha desenha-se ao longo de 4 "unidades" da timeline
    tl.to(processPath, { strokeDashoffset: 0, duration: 4, ease: 'none' }, 0);

    // Cada passo aparece quando a linha "chega" até ele
    // (posições 0, 1, 2, 3 na timeline = 0%, 25%, 50%, 75% do desenho)
    processSteps.forEach((step, i) => {
      tl.fromTo(step,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
        i // posição na timeline em segundos-de-timeline
      );
    });

    return () => tl.scrollTrigger && tl.scrollTrigger.kill();
  });

  // ---- MOBILE (≤768px): linha vertical (::before via variável CSS) ----
  mm.add('(max-width: 768px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processSection,
        start: 'top 70%',
        end: 'bottom 90%',
        scrub: reduceMotion ? false : 1
      }
    });

    // O ::before usa transform: scaleY(var(--line-scale)) no CSS;
    // animar a variável no elemento pai anima o pseudo-elemento.
    tl.to(stepsWrap, { '--line-scale': 1, duration: 4, ease: 'none' }, 0);

    processSteps.forEach((step, i) => {
      tl.fromTo(step,
        { opacity: 0, scale: 0.85, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
        i
      );
    });

    return () => tl.scrollTrigger && tl.scrollTrigger.kill();
  });

  /* ------------------------------------------------------------------------
     BLOCO 14 · CTA FINAL — ENTRADA + PULSE DO BOTÃO WHATSAPP
     Título/subtítulo/botão entram com fade + scale em stagger.
     O botão ganha depois um "pulse" lento e contínuo (scale 1→1.05→1,
     2.5s por ciclo) para atrair o olhar sem ser agressivo.
     ------------------------------------------------------------------------ */
  gsap.fromTo('[data-cta-reveal]',
    { opacity: 0, scale: 0.92, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: '#cta', start: 'top 75%', once: true },
      onComplete() {
        // Pulse contínuo — só arranca depois da entrada terminar
        if (!reduceMotion) {
          gsap.to('#whatsappBtn', {
            scale: 1.05,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    });

  /* ------------------------------------------------------------------------
     BLOCO 15 · ARRANQUE
     Espera o carregamento completo (fontes/recursos) para o reveal da
     página, e recalcula as posições do ScrollTrigger no fim.
     ------------------------------------------------------------------------ */
  if (document.readyState === 'complete') {
    playIntro();
  } else {
    window.addEventListener('load', playIntro);
  }

  // Recalcula os triggers quando as fontes web acabam de carregar
  // (as alturas dos textos mudam ligeiramente com a fonte final)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
