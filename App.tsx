import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Download, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import * as THREE from 'three';
import {
  ABOUT_TIMELINE,
  APP_NAME,
  BA_FORMATS,
  BLOG_POSTS,
  LEGAL_PAGES,
  MARKETS,
  PRESS_ITEMS,
  PRODUCT_DECISION_PATHS,
  PROCESS_STEPS,
  PRODUCTS,
  TECHNOLOGY_CAPABILITIES,
  TECHNOLOGY_COMPARISON,
  TECHNOLOGY_STEPS,
  TRUST_BADGES,
} from './constants';
import type { BlogPost, ContentBlock, LegalPage, Market, ProductFamily } from './types';

gsap.registerPlugin(ScrollTrigger);

const MagneticTheater = React.lazy(() => import('./MagneticTheater'));

type ChapterId = 'hero' | 'problem' | 'technology' | 'products' | 'markets' | 'integration';
type AppRoute =
  | { kind: 'home' }
  | { kind: 'product'; id: string }
  | { kind: 'products' }
  | { kind: 'market'; id: string }
  | { kind: 'markets' }
  | { kind: 'technology' }
  | { kind: 'integration' }
  | { kind: 'about' }
  | { kind: 'contact' }
  | { kind: 'sample' }
  | { kind: 'blog' }
  | { kind: 'article'; slug: string }
  | { kind: 'press' }
  | { kind: 'legal'; slug: string };

const CHAPTERS: Array<{
  id: ChapterId;
  label: string;
  count: string;
  title: string;
}> = [
  { id: 'hero', label: 'home', count: '001 / 006', title: 'Disparaître' },
  { id: 'problem', label: 'enjeu', count: '002 / 006', title: 'Le geste' },
  { id: 'technology', label: 'technologie', count: '003 / 006', title: 'Mécanisme' },
  { id: 'products', label: 'produits', count: '004 / 006', title: 'Catalogue' },
  { id: 'markets', label: 'marchés', count: '005 / 006', title: 'Terrains' },
  { id: 'integration', label: 'savoir-faire', count: '006 / 006', title: 'Intégration' },
];

const CONTACT_ITEMS = [
  { icon: MapPin, label: '20 rue Bouvier, 75011 Paris' },
  { icon: Phone, label: '+33 1 45 08 91 41' },
  { icon: Mail, label: 'contact@systemmag.com' },
];

const BG_PALETTES = [
  ['#ede9df', '#aca69a', '#f7f3eb', '#e65f18'],
  ['#181716', '#6d5c4f', '#efe8dc', '#ee6a1a'],
  ['#e4e0d4', '#b8aa94', '#f3ead9', '#ee7a22'],
  ['#0b0b0b', '#28231f', '#11100e', '#f08a39'],
  ['#d9d4ca', '#1d1d1b', '#ede7da', '#e65f18'],
  ['#e5ded1', '#9e9587', '#f3eee4', '#e65f18'],
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createRange = (length: number) => Array.from({ length }, (_, index) => index);

const stripLanguagePrefix = (path: string) => path.replace(/^\/(?:fr|en)(?=\/|$)/, '') || '/';

const parseRoute = (): AppRoute => {
  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const path = stripLanguagePrefix(rawPath);
  const productMatch = path.match(/^\/(?:produits|products)\/(.+)$/);
  const marketMatch = path.match(/^\/(?:marches|marchés|markets)\/([^/]+)$/);
  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  const legalMatch = path.match(/^\/(legal|privacy)$/);

  if (path === '/' || path === '') return { kind: 'home' };
  if (path === '/technology' || path === '/technologie') return { kind: 'technology' };
  if (path === '/products' || path === '/produits') return { kind: 'products' };
  if (productMatch) return { kind: 'product', id: decodeURIComponent(productMatch[1].split('/').pop() ?? '') };
  if (path === '/markets' || path === '/marches' || path === '/marchés') return { kind: 'markets' };
  if (marketMatch) return { kind: 'market', id: decodeURIComponent(marketMatch[1]) };
  if (path === '/integration' || path === '/savoir-faire') return { kind: 'integration' };
  if (path === '/about' || path === '/entreprise' || path === '/histoire') return { kind: 'about' };
  if (path === '/contact') return { kind: 'contact' };
  if (path === '/echantillon' || path === '/sample') return { kind: 'sample' };
  if (path === '/blog' || path === '/ressources') return { kind: 'blog' };
  if (articleMatch) return { kind: 'article', slug: decodeURIComponent(articleMatch[1]) };
  if (path === '/press' || path === '/presse') return { kind: 'press' };
  if (legalMatch) return { kind: 'legal', slug: legalMatch[1] };
  return { kind: 'home' };
};

const productPath = (product: ProductFamily) => `/produits/${product.id}`;
const marketPath = (market: Market) => `/marches/${market.id}`;

const resolveProduct = (id: string) => (
  PRODUCTS.find((product) => product.id === id || product.aliases?.includes(id)) ?? PRODUCTS[0]
);
const resolveMarket = (id: string) => (
  MARKETS.find((market) => market.id === id || market.aliases?.includes(id)) ?? MARKETS[0]
);
const resolveArticle = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug) ?? BLOG_POSTS[0];
const resolveLegalPage = (slug: string) => LEGAL_PAGES.find((page) => page.slug === slug) ?? LEGAL_PAGES[0];

const PaintedTextureBackground: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const pointer = new THREE.Vector2(0.58, 0.42);
    const targetPointer = new THREE.Vector2(0.58, 0.42);
    const colorA = new THREE.Color(BG_PALETTES[0][0]);
    const colorB = new THREE.Color(BG_PALETTES[0][1]);
    const colorC = new THREE.Color(BG_PALETTES[0][2]);
    const accent = new THREE.Color(BG_PALETTES[0][3]);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uPointer: { value: pointer },
        uColorA: { value: colorA },
        uColorB: { value: colorB },
        uColorC: { value: colorC },
        uAccent: { value: accent },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uAccent;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.05;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          float flow = fbm((uv * vec2(2.1, 1.35)) + vec2(uTime * 0.025, -uTime * 0.018));
          float linen = fbm((uv * vec2(7.0, 1.5)) + vec2(-uTime * 0.014, uTime * 0.01));
          float cursor = 1.0 - smoothstep(0.02, 0.72, distance(uv * aspect, uPointer * aspect));
          vec3 base = mix(uColorA, uColorB, smoothstep(0.05, 0.98, uv.y + flow * 0.22));
          base = mix(base, uColorC, smoothstep(0.12, 0.98, uv.x + linen * 0.18));
          base += uAccent * (cursor * 0.16 + smoothstep(0.68, 1.0, flow) * 0.075);
          float vignette = 1.0 - smoothstep(0.48, 1.08, distance(uv, vec2(0.52, 0.52)));
          base *= mix(0.62, 1.08, vignette);
          gl_FragColor = vec4(base, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onPointerMove = (event: PointerEvent) => {
      targetPointer.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    let frame = 0;
    const render = (time: number) => {
      const palette = BG_PALETTES[activeIndexRef.current] ?? BG_PALETTES[0];
      colorA.lerp(new THREE.Color(palette[0]), 0.045);
      colorB.lerp(new THREE.Color(palette[1]), 0.045);
      colorC.lerp(new THREE.Color(palette[2]), 0.045);
      accent.lerp(new THREE.Color(palette[3]), 0.055);
      pointer.lerp(targetPointer, prefersReducedMotion ? 1 : 0.08);
      material.uniforms.uTime.value = prefersReducedMotion ? 0 : time * 0.001;
      renderer.render(scene, camera);
      if (!prefersReducedMotion) frame = requestAnimationFrame(render);
    };

    render(0);
    if (!prefersReducedMotion) frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="painted-background" ref={mountRef} aria-hidden="true" />;
};

const MagneticParticleField: React.FC = () => {
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const particles = field.querySelectorAll('.anime-particle');
    const animation = animate(particles, {
      translateY: [0, -18, 0],
      translateX: (_target: Element, index: number) => [0, index % 2 ? 12 : -12, 0],
      opacity: [0.18, 0.82, 0.18],
      scale: [0.72, 1.24, 0.72],
      delay: (_target: Element, index: number) => index * 58,
      duration: 2400,
      loop: true,
      ease: 'inOutSine',
    } as Parameters<typeof animate>[1]);

    return () => animation.pause();
  }, []);

  return (
    <div className="magnetic-particle-field" ref={fieldRef} aria-hidden="true">
      {createRange(34).map((index) => (
        <i
          key={index}
          className="anime-particle"
          style={{
            '--x': `${8 + ((index * 19) % 84)}%`,
            '--y': `${10 + ((index * 31) % 78)}%`,
            '--s': `${0.54 + ((index % 7) * 0.075)}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const ChapterNav: React.FC<{
  activeIndex: number;
  menuOpen: boolean;
  mode: 'home' | 'detail';
  onToggleMenu: () => void;
  onNavigate: (index: number) => void;
}> = ({ activeIndex, menuOpen, mode, onToggleMenu, onNavigate }) => (
  <header className="site-chrome" data-mode={mode}>
    <button className="brand-mark" type="button" onClick={() => onNavigate(0)} aria-label={`${APP_NAME} accueil`}>
      <img src="/images/logo-systemmag.png" alt={APP_NAME} />
    </button>

    <nav className="desktop-nav" aria-label="Navigation principale">
      {CHAPTERS.map((chapter, index) => (
        <button
          key={chapter.id}
          type="button"
          className={mode === 'home' && activeIndex === index ? 'is-active' : ''}
          onClick={() => onNavigate(index)}
        >
          {chapter.label}
          <ArrowUpRight aria-hidden="true" />
        </button>
      ))}
    </nav>

    <button
      className="mobile-menu-button"
      type="button"
      aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={menuOpen}
      onClick={onToggleMenu}
    >
      {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
    </button>

    <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
      {CHAPTERS.map((chapter, index) => (
        <button key={chapter.id} type="button" onClick={() => onNavigate(index)}>
          {chapter.label}
        </button>
      ))}
    </div>
  </header>
);

const StoryHud: React.FC<{ activeIndex: number; onNext: () => void }> = ({ activeIndex, onNext }) => (
  <>
    <div className="story-version">[ v.01b ]</div>
    <div className="story-counter">[ {CHAPTERS[activeIndex].count} ]</div>
    <div className="story-title">[ {CHAPTERS[activeIndex].title} ]</div>
    <button className="scroll-cue" type="button" onClick={onNext} aria-label="Chapitre suivant">
      <ArrowDown aria-hidden="true" />
    </button>
  </>
);

const StageProduct: React.FC<{
  activeChapter: ChapterId;
  activeTechnologyIndex: number;
  selectedProduct: ProductFamily;
  activeProcessImage: string;
}> = ({ activeChapter, activeTechnologyIndex, selectedProduct, activeProcessImage }) => (
  <div className="stage-product" data-product-mode={activeChapter}>
    <div className="product-photo-layer">
      <img src="/images/cinematic-hero-mockup-v3.png" alt="" />
      <div className="photo-linework">
        {createRange(8).map((index) => <span key={index} />)}
      </div>
    </div>
    <Suspense fallback={null}>
      <MagneticTheater />
    </Suspense>

    <div className="technology-sequence-layer" data-active-step={activeTechnologyIndex + 1} aria-hidden="true">
      <img className="technology-cinema-image" src="/images/cinematic-mechanism-scroll-v3.png" alt="" />
      <div className="mechanism-field-lines">
        {createRange(10).map((index) => <span key={index} />)}
      </div>
      {TECHNOLOGY_STEPS.map((step, index) => (
        <figure
          key={step.id}
          className={`technology-frame ${activeTechnologyIndex === index ? 'is-active' : ''}`}
        >
          <img src={step.image} alt="" loading="lazy" decoding="async" />
        </figure>
      ))}
      <div className="technology-step-meter">
        {TECHNOLOGY_STEPS.map((step, index) => (
          <span key={step.id} className={activeTechnologyIndex === index ? 'is-active' : ''} />
        ))}
      </div>
    </div>

    <div className="product-catalogue-layer">
      <img className="catalogue-theatre" src="/images/cinematic-product-theatre-v3.png" alt="" />
      <img className="catalogue-main" src={selectedProduct.image} alt="" />
    </div>

    <div className="product-process-layer">
      <img src={activeProcessImage} alt="" />
    </div>
  </div>
);

const HeroScene: React.FC<{ onNavigate: (index: number) => void }> = ({ onNavigate }) => (
  <section className="story-scene scene-hero is-active" data-scene="hero" aria-labelledby="hero-title">
    <div className="scene-copy hero-copy">
      <h1 id="hero-title">
        La fermeture
        <br />
        magnétique
        <br />
        conçue pour
        <br />
        <em>disparaître</em>
      </h1>
      <div className="hero-actions">
        <button type="button" className="primary-action" onClick={() => onNavigate(4)}>
          Parler à un expert
        </button>
        <button type="button" className="secondary-action" onClick={() => onNavigate(2)}>
          Voir le catalogue
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </div>
    <p className="scene-caption">
      Systemmag conçoit des fermetures magnétiques intégrées aux textiles, accessoires et équipements
      techniques, pour créer des systèmes discrets, souples et adaptés à vos contraintes d’usage.
    </p>
  </section>
);

const ProblemScene: React.FC = () => (
  <section className="story-scene scene-problem" data-scene="problem" aria-labelledby="problem-title">
    <div className="scene-copy problem-copy">
      <span className="scene-label">[ le geste ]</span>
      <h2 id="problem-title">
        Fermer vite.
        <br />
        Sans chercher.
        <br />
        Sans montrer.
      </h2>
    </div>
    <div className="problem-statement">
      <p>
        Sur un textile, une fermeture ne doit pas seulement tenir. Elle doit se positionner naturellement,
        rester souple, accepter les contraintes du terrain et préserver la ligne du produit.
      </p>
      <div className="problem-points" aria-label="Contraintes principales">
        <span>alignement</span>
        <span>souplesse</span>
        <span>discrétion</span>
        <span>répétition</span>
      </div>
    </div>
  </section>
);

const TechnologyScene: React.FC<{
  activeTechnologyIndex: number;
  onSelectTechnology: (index: number) => void;
}> = ({ activeTechnologyIndex, onSelectTechnology }) => (
  <section className="story-scene scene-technology" data-scene="technology" aria-labelledby="technology-title">
    <div className="scene-copy compact-copy">
      <span className="scene-label">[ mécanisme ]</span>
      <h2 id="technology-title">
        Trois temps.
        <br />
        Un geste.
      </h2>
      <p className="technology-intro">
        Les deux parties se rapprochent, se positionnent et s’attirent automatiquement grâce aux polarités alternées.
        L’ouverture se fait ensuite par pelage, aimant après aimant.
      </p>
    </div>
    <div className="mechanism-steps">
      {TECHNOLOGY_STEPS.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={`mechanism-step ${activeTechnologyIndex === index ? 'is-active' : ''}`}
          aria-pressed={activeTechnologyIndex === index}
          onClick={() => onSelectTechnology(index)}
        >
          <span>[ 0{step.id} ]</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </button>
      ))}
    </div>
  </section>
);

const ProductScene: React.FC<{
  selectedProduct: ProductFamily;
  onSelectProduct: (product: ProductFamily) => void;
  onOpenProduct: (product: ProductFamily) => void;
}> = ({ selectedProduct, onSelectProduct, onOpenProduct }) => (
  <section className="story-scene scene-products" data-scene="products" aria-labelledby="products-title">
    <div className="scene-copy product-copy">
      <span className="scene-label">[ familles ]</span>
      <h2 id="products-title">
        Produits
        <br />
        intégrés
      </h2>
      <p>{selectedProduct.summary}</p>
      <button type="button" className="secondary-action on-dark" onClick={() => onOpenProduct(selectedProduct)}>
        Ouvrir la fiche
        <ArrowUpRight aria-hidden="true" />
      </button>
    </div>

    <div className="product-index" aria-label="Familles de produits">
      {PRODUCTS.map((product) => (
        <button
          key={product.id}
          type="button"
          className={selectedProduct.id === product.id ? 'is-selected' : ''}
          onMouseEnter={() => onSelectProduct(product)}
          onFocus={() => onSelectProduct(product)}
          onClick={() => onOpenProduct(product)}
        >
          <span className="product-row-media" aria-hidden="true">
            <img src={product.gallery[1] ?? product.gallery[0] ?? product.image} alt="" loading="lazy" decoding="async" />
          </span>
          <span>{product.number}</span>
          <strong>{product.title}</strong>
          <small>{product.label} / {product.specs.join(' / ')}</small>
        </button>
      ))}
    </div>
  </section>
);

const MarketsScene: React.FC<{
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
  onOpenMarket: (market: Market) => void;
}> = ({ selectedMarket, onSelectMarket, onOpenMarket }) => (
  <section className="story-scene scene-markets" data-scene="markets" aria-labelledby="markets-title">
    <div className="market-backdrop-wall" aria-hidden="true">
      {MARKETS.map((market) => (
        <img
          key={market.id}
          className={selectedMarket.id === market.id ? 'is-active' : ''}
          src={market.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
    <div className="scene-copy markets-copy">
      <span className="scene-label">[ usages ]</span>
      <h2 id="markets-title">
        Marchés
        <br />
        sensibles
      </h2>
    </div>
    <div className="markets-editorial">
      {MARKETS.map((market, index) => (
        <button
          key={market.id}
          type="button"
          className="market-card"
          onMouseEnter={() => onSelectMarket(market)}
          onFocus={() => onSelectMarket(market)}
          onClick={() => onOpenMarket(market)}
          aria-label={`Ouvrir la page ${market.title}`}
        >
          <span className="market-preview" aria-hidden="true">
            <img src={market.image} alt="" loading="lazy" decoding="async" />
            <i />
          </span>
          <span className="market-number">{String(index + 1).padStart(2, '0')}</span>
          <h3>{market.title}</h3>
          <p>{market.description}</p>
        </button>
      ))}
    </div>
  </section>
);

const IntegrationScene: React.FC<{
  activeProcessIndex: number;
  onSelectProcess: (index: number) => void;
}> = ({ activeProcessIndex, onSelectProcess }) => (
  <section className="story-scene scene-integration" data-scene="integration" aria-labelledby="integration-title">
    <div className="scene-copy integration-copy">
      <span className="scene-label">[ du prototype à la série ]</span>
      <h2 id="integration-title">
        Parlons
        <br />
        intégration
      </h2>
    </div>

    <div className="process-journey" aria-label="Processus d’intégration">
      {PROCESS_STEPS.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={`process-card ${activeProcessIndex === index ? 'is-active' : ''}`}
          aria-pressed={activeProcessIndex === index}
          onMouseEnter={() => onSelectProcess(index)}
          onFocus={() => onSelectProcess(index)}
          onClick={() => onSelectProcess(index)}
        >
          <span>[ {String(step.id).padStart(2, '0')} ]</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </button>
      ))}
    </div>

    <div className="contact-panel">
      <p>Une question ? Parlons de votre intégration.</p>
      {CONTACT_ITEMS.map(({ icon: Icon, label }) => (
        <span key={label}>
          <Icon aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  </section>
);

const DetailBack: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <button className="detail-back" type="button" onClick={onBack}>
    <ArrowLeft aria-hidden="true" />
    Retour au récit
  </button>
);

const RoutedLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: (path: string) => void;
}> = ({ href, children, className, onNavigate }) => (
  <a
    href={href}
    className={className}
    onClick={(event) => {
      if (!onNavigate) return;
      event.preventDefault();
      onNavigate(href);
    }}
  >
    {children}
  </a>
);

const RouteHero: React.FC<{
  kicker: string;
  title: React.ReactNode;
  lede: string;
  image?: string;
  dark?: boolean;
  children?: React.ReactNode;
}> = ({ kicker, title, lede, image, dark = false, children }) => (
  <section className={`route-hero ${dark ? 'route-hero-dark' : ''}`}>
    <div className="route-hero-copy">
      <span className="detail-kicker">[ {kicker} ]</span>
      <h1>{title}</h1>
      <p>{lede}</p>
      {children}
    </div>
    {image ? (
      <figure className="route-hero-media">
        <img src={image} alt="" />
      </figure>
    ) : null}
  </section>
);

const RouteFooterCta: React.FC<{ onContact: () => void; title?: string; text?: string }> = ({
  onContact,
  title = 'Une contrainte précise ? Parlons intégration.',
  text = 'Envoyez le support, le geste attendu et les contraintes d’usage : la bonne architecture se définit avant le composant.',
}) => (
  <section className="route-cta">
    <div>
      <span className="detail-kicker">[ cadrage ]</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    <button type="button" className="primary-action" onClick={onContact}>
      Parler à un expert
    </button>
  </section>
);

const TrustRibbon: React.FC = () => (
  <section className="trust-ribbon" aria-label="Repères SYSTEMMAG">
    {TRUST_BADGES.map((badge) => (
      <article key={badge.label}>
        <strong>{badge.label}</strong>
        <span>{badge.value}</span>
      </article>
    ))}
  </section>
);

const FaqSection: React.FC<{ items: Array<{ question: string; answer: string }> }> = ({ items }) => (
  <section className="faq-section">
    <div>
      <span className="detail-kicker">[ questions fréquentes ]</span>
      <h2>Réponses utiles avant cadrage.</h2>
    </div>
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
);

const TechnologyPage: React.FC<{ onBack: () => void; onContact: () => void }> = ({ onBack, onContact }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="technologie"
      title={<>Une fermeture magnétique pensée comme une architecture textile.</>}
      lede="SYSTEMMAG ne colle pas un aimant dans un vêtement. Le système organise la force, le guidage et l’ouverture autour du support final."
      image="/images/technology-hero-ai-workbench.png"
    >
      <div className="detail-actions">
        <button type="button" className="primary-action" onClick={onContact}>
          Cadrer mon application
        </button>
        <a className="secondary-action" href="/downloads/catalogue-systemmag-fr.pdf" download>
          Catalogue technique
          <Download aria-hidden="true" />
        </a>
      </div>
    </RouteHero>

    <section className="route-split route-split-sticky">
      <div className="route-copy-block">
        <span className="detail-kicker">[ mécanisme ]</span>
        <h2>Trois mouvements, une sensation continue.</h2>
        <p>Le comportement se comprend en trois temps : les parties se trouvent, la force se répartit, puis l’ouverture avance naturellement par pelage.</p>
      </div>
      <div className="mechanism-page-steps">
        {TECHNOLOGY_STEPS.map((step) => (
          <article key={step.id}>
            <img src={step.image} alt={step.title} loading="lazy" decoding="async" />
            <span>[ 0{step.id} ]</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="route-grid-section route-dark-band">
      <div className="route-section-heading">
        <span className="detail-kicker">[ principes ]</span>
        <h2>Ce qui rend le système intégrable.</h2>
      </div>
      <div className="cinematic-card-grid">
        {TECHNOLOGY_CAPABILITIES.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="comparison-section">
      <span className="detail-kicker">[ alternatives ]</span>
      <h2>Choisir une fermeture, c’est choisir un comportement.</h2>
      <div className="spec-table">
        {TECHNOLOGY_COMPARISON.map((row) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <p>{row.value}</p>
          </div>
        ))}
      </div>
    </section>

    <RouteFooterCta onContact={onContact} />
  </motion.main>
);

const ProductsHubPage: React.FC<{
  onBack: () => void;
  onContact: () => void;
  onOpenProduct: (product: ProductFamily) => void;
}> = ({ onBack, onContact, onOpenProduct }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="catalogue"
      title={<>Des systèmes magnétiques textiles pour chaque contrainte.</>}
      lede="Le bon choix part du geste : fermer une ouverture, répartir une force, protéger un module ou développer une intégration spécifique."
      image="/images/zip-c-isolated.png"
    />

    <section className="route-grid-section">
      <div className="route-section-heading">
        <span className="detail-kicker">[ choisir ]</span>
        <h2>Commencer par la fonction à résoudre.</h2>
      </div>
      <div className="decision-grid">
        {PRODUCT_DECISION_PATHS.map((item, index) => {
          const product = PRODUCTS.find((candidate) => candidate.title === item.target) ?? PRODUCTS[0];
          return (
            <button key={item.title} type="button" onClick={() => onOpenProduct(product)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <small>{item.target}</small>
            </button>
          );
        })}
      </div>
    </section>

    <section className="product-hub-grid">
      {PRODUCTS.map((product) => (
        <button key={product.id} type="button" onClick={() => onOpenProduct(product)}>
          <figure>
            <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
          </figure>
          <span>[ {product.number} ]</span>
          <h2>{product.title}</h2>
          <p>{product.summary}</p>
        </button>
      ))}
    </section>

    <section className="ba-rail">
      <div>
        <span className="detail-kicker">[ formats BA ]</span>
        <h2>Blocs et bandes aimantées.</h2>
      </div>
      <div className="ba-format-grid">
        {PRODUCTS[1].variants?.map((variant, index) => (
          <article key={variant.label}>
            <img src={BA_FORMATS[index]?.image ?? '/images/bandes-iso.webp'} alt="" loading="lazy" decoding="async" />
            <h3>{variant.label}</h3>
            <p>{variant.value}</p>
          </article>
        ))}
      </div>
    </section>

    <RouteFooterCta onContact={onContact} title="Besoin d’un catalogue ou d’un échantillon ?" />
  </motion.main>
);

const MarketsHubPage: React.FC<{
  onBack: () => void;
  onContact: () => void;
  onOpenMarket: (market: Market) => void;
}> = ({ onBack, onContact, onOpenMarket }) => (
  <motion.main className="route-page route-page-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="marchés"
      title={<>Six terrains, une exigence d’intégration.</>}
      lede="Le produit change, mais la question reste la même : comment rendre le geste plus fiable, plus propre et plus discret dans l’usage réel ?"
      image="/images/markets-hero-collage.png"
      dark
    />

    <section className="market-hub-grid">
      {MARKETS.map((market, index) => (
        <button key={market.id} type="button" onClick={() => onOpenMarket(market)}>
          <img src={market.image} alt="" loading="lazy" decoding="async" />
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h2>{market.title}</h2>
          <p>{market.headline}</p>
        </button>
      ))}
    </section>

    <RouteFooterCta onContact={onContact} title="Identifier le bon système pour votre terrain." />
  </motion.main>
);

const IntegrationPage: React.FC<{ onBack: () => void; onContact: () => void }> = ({ onBack, onContact }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="savoir-faire"
      title={<>Du prototype à la série, la fermeture devient un système.</>}
      lede="Le bureau d’étude transforme une contrainte d’usage en architecture magnétique : format, force, support, fourreau, couture et validation."
      image="/images/cadrage-blueprint.png"
    />

    <section className="process-page">
      {PROCESS_STEPS.map((step) => (
        <article key={step.id}>
          <figure>
            <img src={step.image} alt="" loading="lazy" decoding="async" />
          </figure>
          <div>
            <span>[ {String(step.id).padStart(2, '0')} ]</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
        </article>
      ))}
    </section>

    <section className="integration-proof">
      <div>
        <span className="detail-kicker">[ livrables ]</span>
        <h2>Une base claire pour décider.</h2>
      </div>
      <div className="cinematic-card-grid">
        {['Hypothèse d’intégration', 'Format magnétique recommandé', 'Prototype manipulable', 'Préconisations série'].map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item}</h3>
            <p>Un élément concret pour faire avancer vos équipes design, R&D, achat et production.</p>
          </article>
        ))}
      </div>
    </section>

    <RouteFooterCta onContact={onContact} />
  </motion.main>
);

const AboutPage: React.FC<{ onBack: () => void; onContact: () => void }> = ({ onBack, onContact }) => (
  <motion.main className="route-page route-page-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="entreprise"
      title={<>Une usine parisienne dédiée aux systèmes magnétiques.</>}
      lede="SYSTEMMAG est une PME française fondée en 2000, portée par un savoir-faire industriel, des brevets internationaux et des applications exigeantes."
      image="/images/eric-sitbon-usine.webp"
      dark
    />
    <TrustRibbon />
    <section className="timeline-section">
      <span className="detail-kicker">[ repères ]</span>
      <h2>Construire une autorité industrielle dans le temps.</h2>
      {ABOUT_TIMELINE.map((item) => (
        <article key={item.label}>
          <span>{item.label}</span>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
    <RouteFooterCta onContact={onContact} title="Parler à l’équipe SYSTEMMAG." />
  </motion.main>
);

const ContactPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="contact"
      title={<>Décrivez votre contrainte. Nous cadrons le geste.</>}
      lede="Un bon échange commence par le support, l’usage, la force attendue, le volume et la manière dont l’utilisateur ouvre ou ferme le produit."
      image="/images/prototype-cta.png"
    />
    <section className="contact-route-layout">
      <div className="contact-route-info">
        {CONTACT_ITEMS.map(({ icon: Icon, label }) => (
          <span key={label}>
            <Icon aria-hidden="true" />
            {label}
          </span>
        ))}
        <a className="secondary-action" href="/downloads/catalogue-systemmag-fr.pdf" download>
          Télécharger le catalogue
          <Download aria-hidden="true" />
        </a>
      </div>
      <form className="project-form" action="mailto:contact@systemmag.com" method="GET">
        <label>
          Nom / entreprise
          <input name="subject" type="text" placeholder="Votre société" />
        </label>
        <label>
          Email professionnel
          <input name="email" type="email" placeholder="vous@entreprise.com" />
        </label>
        <label>
          Secteur
          <select name="sector" defaultValue="">
            <option value="" disabled>Sélectionner</option>
            {MARKETS.map((market) => <option key={market.id}>{market.title}</option>)}
          </select>
        </label>
        <label>
          Projet
          <textarea name="body" rows={6} placeholder="Produit, textile, volume, contrainte d’usage..." />
        </label>
        <button type="submit" className="primary-action">Envoyer la demande</button>
      </form>
    </section>
  </motion.main>
);

const SamplePage: React.FC<{ onBack: () => void; onContact: () => void }> = ({ onBack, onContact }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="échantillon"
      title={<>Tester le geste avant de décider.</>}
      lede="Sélectionnez une famille produit et transmettez le contexte : l’échantillon utile dépend toujours de l’usage final."
      image="/images/cta-systemmag-orange.png"
    />
    <section className="sample-grid">
      {PRODUCTS.map((product) => (
        <article key={product.id}>
          <img src={product.image} alt="" loading="lazy" decoding="async" />
          <h2>{product.title}</h2>
          <p>{product.summary}</p>
        </article>
      ))}
    </section>
    <RouteFooterCta onContact={onContact} title="Demander une orientation d’échantillon." />
  </motion.main>
);

const BlogPage: React.FC<{ onBack: () => void; onNavigate: (path: string) => void }> = ({ onBack, onNavigate }) => (
  <motion.main className="route-page route-page-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="ressources"
      title={<>Articles techniques pour cadrer les décisions.</>}
      lede="Une base CMS-ready pour publier guides, comparatifs, cas d’usage et pages piliers SEO autour de la fermeture magnétique textile."
      image="/images/schema-modules.png"
    />
    <section className="blog-index">
      {BLOG_POSTS.map((post) => (
        <RoutedLink key={post.slug} href={`/blog/${post.slug}`} onNavigate={onNavigate}>
          <img src={post.coverImage} alt="" loading="lazy" decoding="async" />
          <span>{post.category} / {post.publishDate}</span>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </RoutedLink>
      ))}
    </section>
  </motion.main>
);

const ArticlePage: React.FC<{ post: BlogPost; onBack: () => void; onNavigate: (path: string) => void }> = ({
  post,
  onBack,
  onNavigate,
}) => (
  <motion.main className="route-page route-page-light article-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <article>
      <RoutedLink href="/blog" className="detail-back article-link" onNavigate={onNavigate}>
        <ArrowLeft aria-hidden="true" />
        Ressources
      </RoutedLink>
      <span className="detail-kicker">[ {post.category} / {post.publishDate} ]</span>
      <h1>{post.title}</h1>
      <p className="detail-lede">{post.excerpt}</p>
      <img src={post.coverImage} alt="" />
      {post.body.map((block) => (
        <section key={block.title}>
          <h2>{block.title}</h2>
          <p>{block.text}</p>
        </section>
      ))}
    </article>
  </motion.main>
);

const PressPage: React.FC<{ onBack: () => void; onContact: () => void }> = ({ onBack, onContact }) => (
  <motion.main className="route-page route-page-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <RouteHero
      kicker="presse"
      title={<>Presse, preuve et trajectoire industrielle.</>}
      lede="Un espace pour structurer les mentions, repères, éléments d’autorité et futurs contenus presse de SYSTEMMAG."
      image="/images/eric-sitbon-usine.webp"
      dark
    />
    <section className="press-table">
      {PRESS_ITEMS.map((item) => (
        <article key={`${item.media}-${item.date}`}>
          <span>{item.date}</span>
          <h2>{item.media}</h2>
          <p>{item.format}</p>
        </article>
      ))}
    </section>
    <RouteFooterCta onContact={onContact} title="Demander un élément presse ou technique." />
  </motion.main>
);

const LegalRoutePage: React.FC<{ page: LegalPage; onBack: () => void }> = ({ page, onBack }) => (
  <motion.main className="route-page route-page-light article-page legal-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <DetailBack onBack={onBack} />
    <article>
      <span className="detail-kicker">[ informations ]</span>
      <h1>{page.title}</h1>
      <p className="detail-lede">{page.intro}</p>
      {page.sections.map((section: ContentBlock) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </section>
      ))}
    </article>
  </motion.main>
);

const ProductDetailPage: React.FC<{
  product: ProductFamily;
  onBack: () => void;
  onContact: () => void;
  onOpenProduct: (product: ProductFamily) => void;
}> = ({ product, onBack, onContact, onOpenProduct }) => (
  <motion.main
    className="detail-page product-detail-page"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
  >
    <section className="detail-hero" aria-labelledby="product-detail-title">
      <div className="detail-hero-copy">
        <DetailBack onBack={onBack} />
        <span className="detail-kicker">[ produit {product.number} / {product.label} ]</span>
        <h1 id="product-detail-title">{product.title}</h1>
        <p className="detail-lede">{product.detailTitle}</p>
        <p className="detail-body-copy">{product.detailIntro}</p>
        <div className="detail-actions">
          <button type="button" className="primary-action" onClick={onContact}>
            Parler à un expert
          </button>
          <a className="secondary-action" href="/downloads/catalogue-systemmag-fr.pdf" download>
            Catalogue technique
            <Download aria-hidden="true" />
          </a>
        </div>
      </div>

      <motion.figure
        className="detail-hero-media"
        initial={{ opacity: 0, rotateX: 7, rotateY: -8, y: 30 }}
        animate={{ opacity: 1, rotateX: 0, rotateY: -3, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
      >
        <img src={product.gallery[0] ?? product.image} alt={product.title} />
        <figcaption>[ système intégré ]</figcaption>
      </motion.figure>
    </section>

    <section className="detail-band detail-band-dark">
      <div>
        <span className="detail-kicker">[ contexte d’usage ]</span>
        <h2>Ce que la fermeture doit résoudre.</h2>
      </div>
      <div className="detail-list-grid">
        {product.constraints.map((item) => (
          <article key={item}>
            <span />
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>

    {product.proofPoints?.length ? (
      <section className="proof-strip">
        {product.proofPoints.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.value}</p>
          </article>
        ))}
      </section>
    ) : null}

    <section className="detail-spec-layout">
      <div className="detail-copy-block">
        <span className="detail-kicker">[ intégration ]</span>
        <h2>Une solution définie autour du support, du geste et de la production.</h2>
      </div>
      <div className="detail-columns">
        <article>
          <h3>Usages</h3>
          {product.useCases.map((item) => <p key={item}>{item}</p>)}
        </article>
        <article>
          <h3>Méthodes</h3>
          {product.integration.map((item) => <p key={item}>{item}</p>)}
        </article>
        <article>
          <h3>Caractéristiques</h3>
          {product.specs.map((item) => <p key={item}>{item}</p>)}
        </article>
      </div>
    </section>

    {product.variants?.length ? (
      <section className="variant-section">
        <div>
          <span className="detail-kicker">[ variantes ]</span>
          <h2>Famille, formats et niveaux d’intégration.</h2>
        </div>
        <div className="variant-grid">
          {product.variants.map((variant) => (
            <article key={variant.label}>
              <h3>{variant.label}</h3>
              <p>{variant.value}</p>
            </article>
          ))}
        </div>
      </section>
    ) : null}

    <section className="spec-table-section" aria-labelledby="spec-table-title">
      <h2 id="spec-table-title">Lecture technique</h2>
      <div className="spec-table">
        {product.specificationRows.map((row) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <p>{row.value}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="detail-gallery" aria-label="Galerie produit">
      {product.gallery.map((image, index) => (
        <figure key={image}>
          <img src={image} alt={`${product.title} - vue ${index + 1}`} loading="lazy" decoding="async" />
        </figure>
      ))}
    </section>

    {product.faq?.length ? <FaqSection items={product.faq} /> : null}

    <section className="related-strip">
      <div>
        <span className="detail-kicker">[ autres familles ]</span>
        <h2>Continuer le catalogue.</h2>
      </div>
      <div className="related-links">
        {PRODUCTS.filter((item) => item.id !== product.id).map((item) => (
          <button key={item.id} type="button" onClick={() => onOpenProduct(item)}>
            <span>{item.number}</span>
            {item.title}
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  </motion.main>
);

const MarketDetailPage: React.FC<{
  market: Market;
  onBack: () => void;
  onContact: () => void;
  onOpenProduct: (product: ProductFamily) => void;
}> = ({ market, onBack, onContact, onOpenProduct }) => {
  const recommendedProducts = PRODUCTS.filter((product) => market.recommendedProducts.includes(product.title));

  return (
    <motion.main
      className="detail-page market-detail-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="market-detail-hero" aria-labelledby="market-detail-title">
        <img src={market.image} alt="" aria-hidden="true" />
        <div className="market-detail-overlay" />
        <div className="market-detail-copy">
          <DetailBack onBack={onBack} />
          <span className="detail-kicker">[ marché / {market.title} ]</span>
          <h1 id="market-detail-title">{market.title}</h1>
          <p>{market.headline}</p>
          <button type="button" className="primary-action" onClick={onContact}>
            Étudier une intégration
          </button>
        </div>
      </section>

      {market.specs?.length ? (
        <section className="proof-strip proof-strip-dark">
          {market.specs.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <p>{item.value}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="market-requirements">
        <div>
          <span className="detail-kicker">[ contraintes terrain ]</span>
          <h2>La fermeture doit rester lisible dans l’usage réel.</h2>
        </div>
        <div className="market-pill-grid">
          {market.needs.map((need) => <span key={need}>{need}</span>)}
        </div>
      </section>

      <section className="detail-spec-layout market-layout">
        <div className="detail-copy-block">
          <span className="detail-kicker">[ applications ]</span>
          <h2>Des points d’intégration précis, pas un accessoire ajouté après coup.</h2>
        </div>
        <div className="detail-columns">
          {market.applications.map((application, index) => (
            <article key={application}>
              <span className="market-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{application}</h3>
              <p>Définition du geste, choix du format magnétique et adaptation au support textile ou technique.</p>
            </article>
          ))}
        </div>
      </section>

      {market.benefits?.length ? (
        <section className="variant-section variant-section-dark">
          <div>
            <span className="detail-kicker">[ bénéfices ]</span>
            <h2>Ce que l’intégration doit améliorer.</h2>
          </div>
          <div className="variant-grid">
            {market.benefits.map((benefit) => (
              <article key={benefit}>
                <h3>{benefit}</h3>
                <p>À cadrer selon le support, la force attendue, la fréquence d’usage et les contraintes du terrain.</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="related-strip related-strip-dark">
        <div>
          <span className="detail-kicker">[ familles recommandées ]</span>
          <h2>Solutions à étudier pour ce marché.</h2>
        </div>
        <div className="related-links">
          {recommendedProducts.map((product) => (
            <button key={product.id} type="button" onClick={() => onOpenProduct(product)}>
              <span>{product.number}</span>
              {product.title}
              <ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {market.faq?.length ? <FaqSection items={market.faq} /> : null}
    </motion.main>
  );
};

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const pendingChapterRef = useRef<number | null>(null);
  const [route, setRoute] = useState<AppRoute>(() => parseRoute());
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTechnologyIndex, setActiveTechnologyIndex] = useState(0);
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [selectedMarketId, setSelectedMarketId] = useState(MARKETS[0].id);

  const isHome = route.kind === 'home';
  const activeChapter = CHAPTERS[activeIndex];
  const selectedProduct = useMemo(
    () => PRODUCTS.find((product) => product.id === selectedProductId) ?? PRODUCTS[0],
    [selectedProductId],
  );
  const selectedMarket = useMemo(
    () => MARKETS.find((market) => market.id === selectedMarketId) ?? MARKETS[0],
    [selectedMarketId],
  );
  const activeProcessImage = PROCESS_STEPS[activeProcessIndex]?.image ?? PROCESS_STEPS[0].image;
  const currentProduct = route.kind === 'product' ? resolveProduct(route.id) : null;
  const currentMarket = route.kind === 'market' ? resolveMarket(route.id) : null;
  const currentArticle = route.kind === 'article' ? resolveArticle(route.slug) : null;
  const currentLegalPage = route.kind === 'legal' ? resolveLegalPage(route.slug) : null;

  const setPath = (path: string) => {
    window.history.pushState(null, '', path);
    setRoute(parseRoute());
    setMenuOpen(false);
  };

  const scrollToChapter = (index: number) => {
    const story = storyRef.current;
    if (!story) return;

    const start = window.scrollY + story.getBoundingClientRect().top;
    const scrollable = story.offsetHeight - window.innerHeight;
    const target = start + scrollable * (index / (CHAPTERS.length - 1));

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  const navigateToChapter = (index: number) => {
    setMenuOpen(false);
    if (!isHome) {
      pendingChapterRef.current = index;
      setPath('/');
      return;
    }
    scrollToChapter(index);
  };

  const openProduct = (product: ProductFamily) => setPath(productPath(product));
  const openMarket = (market: Market) => setPath(marketPath(market));
  const openContact = () => setPath('/contact');

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!isHome) {
      window.scrollTo(0, 0);
      return;
    }

    const pending = pendingChapterRef.current;
    if (pending === null) return;
    pendingChapterRef.current = null;
    window.setTimeout(() => scrollToChapter(pending), 80);
  }, [isHome, route]);

  useEffect(() => {
    const titleMap: Partial<Record<AppRoute['kind'], string>> = {
      home: 'SYSTEMMAG — La fermeture magnétique conçue pour disparaître',
      technology: 'Technologie — SYSTEMMAG',
      products: 'Produits — SYSTEMMAG',
      markets: 'Marchés — SYSTEMMAG',
      integration: 'Savoir-faire — SYSTEMMAG',
      about: 'Entreprise — SYSTEMMAG',
      contact: 'Contact — SYSTEMMAG',
      sample: 'Échantillons — SYSTEMMAG',
      blog: 'Ressources — SYSTEMMAG',
      press: 'Presse — SYSTEMMAG',
    };

    const title =
      route.kind === 'product'
        ? `${resolveProduct(route.id).title} — SYSTEMMAG`
        : route.kind === 'market'
          ? `${resolveMarket(route.id).title} — SYSTEMMAG`
          : route.kind === 'article'
            ? `${resolveArticle(route.slug).seoTitle} — SYSTEMMAG`
            : route.kind === 'legal'
              ? `${resolveLegalPage(route.slug).title} — SYSTEMMAG`
              : titleMap[route.kind] ?? 'SYSTEMMAG';

    const description =
      route.kind === 'product'
        ? resolveProduct(route.id).detailIntro
        : route.kind === 'market'
          ? resolveMarket(route.id).headline
          : route.kind === 'article'
            ? resolveArticle(route.slug).seoDescription
            : route.kind === 'legal'
              ? resolveLegalPage(route.slug).intro
              : 'Fermetures magnétiques intégrées aux textiles, accessoires et équipements techniques.';

    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [route]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const story = storyRef.current;
    if (!root || !story || !isHome) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActiveIndex(0);
      return undefined;
    }

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>('.story-scene');
      gsap.set(scenes, { autoAlpha: 0, y: 54, scale: 0.985, filter: 'blur(0px)' });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' });

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.15,
          onUpdate: (self) => {
            root.style.setProperty('--story-progress', self.progress.toFixed(4));
            const rawIndex = Math.round(self.progress * (CHAPTERS.length - 1));
            const nextIndex = clamp(rawIndex, 0, CHAPTERS.length - 1);
            setActiveIndex((current) => (current === nextIndex ? current : nextIndex));

            const technologySceneProgress = clamp((self.progress - 0.31) / 0.22, 0, 0.999);
            const nextTechnology = clamp(
              Math.floor(technologySceneProgress * TECHNOLOGY_STEPS.length),
              0,
              TECHNOLOGY_STEPS.length - 1,
            );
            setActiveTechnologyIndex((current) => (current === nextTechnology ? current : nextTechnology));

            const finalSceneProgress = clamp((self.progress - 0.79) / 0.21, 0, 0.999);
            const nextProcess = clamp(Math.floor(finalSceneProgress * PROCESS_STEPS.length), 0, PROCESS_STEPS.length - 1);
            setActiveProcessIndex((current) => (current === nextProcess ? current : nextProcess));
          },
        },
      });

      scenes.forEach((scene, index) => {
        if (index === 0) return;
        const previous = scenes[index - 1];
        const enterAt = index - 0.68;
        timeline
          .to(previous, { autoAlpha: 0, y: -36, scale: 1.01, filter: 'blur(0px)', duration: 0.34 }, enterAt)
          .fromTo(
            scene,
            { autoAlpha: 0, y: 42, scale: 0.99, filter: 'blur(0px)' },
            { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.5 },
            enterAt + 0.08,
          );
      });

      timeline.to({}, { duration: 0.01 }, CHAPTERS.length - 1);
    }, root);

    return () => ctx.revert();
  }, [isHome]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || isHome) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const revealBlocks = gsap.utils.toArray<HTMLElement>(
        '.route-page section:not(.route-hero), .detail-page section:not(.detail-hero):not(.market-detail-hero)',
      );
      revealBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 58 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 82%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.detail-gallery figure, .market-hub-grid button, .product-hub-grid button').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 42, rotateX: 4 },
          {
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [isHome, route]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div
      className="cinematic-page"
      ref={rootRef}
      data-chapter={isHome ? activeChapter.id : 'detail'}
      data-route={route.kind}
    >
      <PaintedTextureBackground activeIndex={isHome ? activeIndex : 2} />
      <ChapterNav
        activeIndex={activeIndex}
        menuOpen={menuOpen}
        mode={isHome ? 'home' : 'detail'}
        onToggleMenu={() => setMenuOpen((value) => !value)}
        onNavigate={navigateToChapter}
      />

      {isHome ? (
        <main className="scroll-story" ref={storyRef}>
          <div className="cinematic-stage" data-chapter={activeChapter.id}>
            <div className="stage-grain" aria-hidden="true" />
            <div className="stage-lines" aria-hidden="true" />
            <MagneticParticleField />
            <StoryHud
              activeIndex={activeIndex}
              onNext={() => navigateToChapter(clamp(activeIndex + 1, 0, CHAPTERS.length - 1))}
            />

            <StageProduct
              activeChapter={activeChapter.id}
              activeTechnologyIndex={activeTechnologyIndex}
              selectedProduct={selectedProduct}
              activeProcessImage={activeProcessImage}
            />

            <HeroScene onNavigate={navigateToChapter} />
            <ProblemScene />
            <TechnologyScene
              activeTechnologyIndex={activeTechnologyIndex}
              onSelectTechnology={(index) => setActiveTechnologyIndex(index)}
            />
            <ProductScene
              selectedProduct={selectedProduct}
              onSelectProduct={(product) => setSelectedProductId(product.id)}
              onOpenProduct={openProduct}
            />
            <MarketsScene
              selectedMarket={selectedMarket}
              onSelectMarket={(market) => setSelectedMarketId(market.id)}
              onOpenMarket={openMarket}
            />
            <IntegrationScene
              activeProcessIndex={activeProcessIndex}
              onSelectProcess={(index) => setActiveProcessIndex(index)}
            />
          </div>
        </main>
      ) : currentProduct ? (
        <ProductDetailPage
          product={currentProduct}
          onBack={() => navigateToChapter(0)}
          onContact={openContact}
          onOpenProduct={openProduct}
        />
      ) : currentMarket ? (
        <MarketDetailPage
          market={currentMarket}
          onBack={() => navigateToChapter(0)}
          onContact={openContact}
          onOpenProduct={openProduct}
        />
      ) : route.kind === 'technology' ? (
        <TechnologyPage onBack={() => navigateToChapter(0)} onContact={openContact} />
      ) : route.kind === 'products' ? (
        <ProductsHubPage
          onBack={() => navigateToChapter(0)}
          onContact={openContact}
          onOpenProduct={openProduct}
        />
      ) : route.kind === 'markets' ? (
        <MarketsHubPage
          onBack={() => navigateToChapter(0)}
          onContact={openContact}
          onOpenMarket={openMarket}
        />
      ) : route.kind === 'integration' ? (
        <IntegrationPage onBack={() => navigateToChapter(0)} onContact={openContact} />
      ) : route.kind === 'about' ? (
        <AboutPage onBack={() => navigateToChapter(0)} onContact={openContact} />
      ) : route.kind === 'contact' ? (
        <ContactPage onBack={() => navigateToChapter(0)} />
      ) : route.kind === 'sample' ? (
        <SamplePage onBack={() => navigateToChapter(0)} onContact={openContact} />
      ) : route.kind === 'blog' ? (
        <BlogPage onBack={() => navigateToChapter(0)} onNavigate={setPath} />
      ) : currentArticle ? (
        <ArticlePage post={currentArticle} onBack={() => navigateToChapter(0)} onNavigate={setPath} />
      ) : route.kind === 'press' ? (
        <PressPage onBack={() => navigateToChapter(0)} onContact={openContact} />
      ) : currentLegalPage ? (
        <LegalRoutePage page={currentLegalPage} onBack={() => navigateToChapter(0)} />
      ) : null}
    </div>
  );
};

export default App;
