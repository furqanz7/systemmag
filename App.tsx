import React, { useState, useEffect } from 'react';
import { APP_NAME, AWARENESS_STAGES, VALUE_PROPS, DISTRIBUTOR_DATA } from './constants';
import { 
  Menu, ChevronDown, Rocket, ShieldAlert, Zap, 
  ArrowRight, MousePointer2, Network, Anchor, Database, Globe
} from 'lucide-react';

const App: React.FC = () => {
  const [activeStage, setActiveStage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-industrial-black text-white font-sans selection:bg-industrial-accent selection:text-white relative overflow-x-hidden snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern industrial-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-black via-transparent to-transparent"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-industrial-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-industrial-accent rounded-full animate-pulse shadow-[0_0_10px_#3B82F6]"></div>
             <span className="font-mono font-bold tracking-widest text-lg">{APP_NAME}</span>
             <span className="hidden md:inline-block text-[10px] text-industrial-metallic ml-2 px-1.5 py-0.5 border border-white/10 rounded font-mono uppercase">Pitch Interne</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-industrial-metallic">
            <button onClick={() => scrollToSection('section-hero')} className="hover:text-white transition-colors uppercase">INTRO</button>
            <button onClick={() => scrollToSection('section-problem')} className="hover:text-white transition-colors uppercase">LE PROBLÈME</button>
            <button onClick={() => scrollToSection('section-strategy')} className="hover:text-white transition-colors uppercase">LE SHIFT</button>
            <button onClick={() => scrollToSection('section-ecosystem')} className="hover:text-white transition-colors uppercase">ÉCOSYSTÈME</button>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-[1px] w-full bg-white/5">
          <div 
            className="h-full bg-industrial-accent transition-all duration-300 ease-out"
            style={{ width: `${scrolled}%` }}
          ></div>
        </div>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section id="section-hero" className="snap-start min-h-screen flex flex-col justify-center items-center px-4 relative border-b border-white/5 bg-industrial-black">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 border border-industrial-accent/30 px-3 py-1 rounded-full bg-industrial-accent/5 backdrop-blur-sm">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-mono text-industrial-accent tracking-widest">PROPOSITION DEEPTECH // ERIC SITBON</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-2 leading-[0.85] text-white uppercase">
              MORT <br/>
              AU <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-metallic to-white relative">
                ZIP
                <span className="absolute -inset-1 blur-lg bg-white/20 opacity-0 animate-pulse"></span>
              </span>.
            </h1>
            
            <p className="text-lg md:text-xl text-industrial-metallic mt-8 max-w-2xl font-light border-l-2 border-industrial-accent/50 pl-6">
              Tu n'as pas inventé une meilleure fermeture. Tu as créé un changement de paradigme.
              <span className="block mt-2 text-white font-medium">Il est temps que ton digital reflète ta dominance technique.</span>
            </p>
          </div>

          {/* Decorative Technical UI */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-4 opacity-80">
            {VALUE_PROPS.map((prop, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-sm backdrop-blur-sm hover:border-industrial-accent/50 transition-all group cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono font-bold text-sm tracking-widest text-industrial-metallic group-hover:text-white transition-colors">{prop.title}</h3>
                  <Zap className="w-4 h-4 text-industrial-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 cursor-pointer" onClick={() => scrollToSection('section-problem')}>
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* --- SECTION 2: OBSOLESCENCE (THE PROBLEM) --- */}
      <section id="section-problem" className="snap-start min-h-screen flex items-center justify-center px-4 relative border-b border-white/5 bg-industrial-dark">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-mono text-industrial-alert tracking-[0.3em] uppercase mb-2">Diagnostic de Situation</h2>
            <h3 className="text-4xl md:text-5xl font-bold">L'ANOMALIE TEMPORELLE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-stretch">
            {/* The OLD Way */}
            <div className="group relative p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-industrial-alert/5">
              <div className="absolute top-4 right-4">
                <ShieldAlert className="w-6 h-6 text-industrial-alert opacity-50" />
              </div>
              <h4 className="text-6xl font-black text-white/10 mb-4 select-none">1917</h4>
              <h5 className="text-2xl font-bold mb-2">Le Zip Standard</h5>
              <ul className="space-y-4 text-industrial-metallic font-mono text-sm mt-8">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-alert rounded-full"></span>
                  Mécanique faillible
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-alert rounded-full"></span>
                  Bruit indésirable
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-alert rounded-full"></span>
                  Difficile sous stress
                </li>
              </ul>
              <div className="mt-12 opacity-50 grayscale mix-blend-screen">
                <img src="https://images.unsplash.com/photo-1594910006707-16010041400e?q=80&w=1000&auto=format&fit=crop" alt="Old Texture" className="w-full h-32 object-cover opacity-20" />
              </div>
            </div>

            {/* The SYSTEMMAG Way */}
            <div className="group relative p-8 md:p-12 border border-industrial-accent/30 bg-industrial-accent/5 backdrop-blur-sm transition-all hover:bg-industrial-accent/10 hover:scale-[1.02] z-10">
              <div className="absolute top-0 right-0 p-2 bg-industrial-accent text-[10px] font-bold text-black font-mono">
                TECH DE RUPTURE
              </div>
              <h4 className="text-6xl font-black text-industrial-accent/20 mb-4 select-none">2024</h4>
              <h5 className="text-2xl font-bold mb-2 text-white">Systemmag</h5>
              <ul className="space-y-4 text-white font-mono text-sm mt-8">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-accent rounded-full shadow-[0_0_8px_#3B82F6]"></span>
                  Fiabilité 100%
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-accent rounded-full shadow-[0_0_8px_#3B82F6]"></span>
                  Silence Tactique
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-industrial-accent rounded-full shadow-[0_0_8px_#3B82F6]"></span>
                  Auto-Alignement
                </li>
              </ul>
              <div className="mt-12 border border-industrial-accent/20 h-32 flex items-center justify-center relative overflow-hidden bg-black/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-industrial-accent/20 via-transparent to-transparent animate-pulse"></div>
                <Anchor className="w-12 h-12 text-industrial-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: STRATEGY (AWARENESS LADDER) --- */}
      <section id="section-strategy" className="snap-start min-h-screen flex items-center justify-center px-4 bg-industrial-black relative border-b border-white/5">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Concept */}
          <div>
            <h2 className="text-sm font-mono text-industrial-accent tracking-[0.3em] uppercase mb-4">Stratégie d'Acquisition</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">L'ÉCHELLE DE CONSCIENCE</h3>
            <p className="text-industrial-metallic text-lg mb-8 leading-relaxed">
              Le site actuel attend des clients qui savent déjà qu'ils vous cherchent. <span className="text-white">C'est une erreur.</span>
              <br/><br/>
              Nous allons chercher les clients qui ignorent encore que le Zip est leur problème. Nous devons les faire monter l'échelle, marche par marche.
            </p>
            
            <div className="p-6 bg-white/5 border-l-4 border-industrial-accent rounded-r-lg backdrop-blur-sm">
              <div className="text-xs font-mono text-industrial-accent mb-2">OBJECTIF</div>
              <p className="text-xl font-bold italic">
                "{AWARENESS_STAGES.find(s => s.id === activeStage)?.strategy}"
              </p>
            </div>
          </div>

          {/* Right: The Interactive Ladder */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
            <div className="space-y-4">
              {AWARENESS_STAGES.map((stage) => (
                <div 
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`relative pl-12 py-4 pr-6 cursor-pointer transition-all duration-300 group rounded-lg border ${
                    activeStage === stage.id 
                      ? 'bg-industrial-accent/10 border-industrial-accent/30 translate-x-2' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                    activeStage === stage.id 
                      ? 'bg-industrial-black border-industrial-accent scale-125 shadow-[0_0_10px_#3B82F6]' 
                      : 'bg-industrial-black border-gray-600 group-hover:border-gray-400'
                  }`}></div>

                  <h4 className={`text-sm font-bold font-mono tracking-wider mb-1 transition-colors ${
                    activeStage === stage.id ? 'text-industrial-accent' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    NIVEAU {stage.id}: {stage.label}
                  </h4>
                  <p className={`text-sm transition-colors ${
                    activeStage === stage.id ? 'text-white' : 'text-gray-600'
                  }`}>
                    {stage.mindset}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 4: ECOSYSTEM (Business Model) --- */}
      <section id="section-ecosystem" className="snap-start min-h-screen flex items-center justify-center px-4 bg-industrial-dark relative border-b border-white/5">
        <div className="max-w-6xl mx-auto w-full">
           <div className="mb-16 text-center">
            <h2 className="text-sm font-mono text-industrial-metallic tracking-[0.3em] uppercase mb-2">Structure du Business</h2>
            <h3 className="text-3xl md:text-5xl font-bold">REPRENDRE LE CONTRÔLE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
               <ArrowRight className="w-12 h-12 text-white/10" />
             </div>

             {/* Current State */}
             <div className="relative p-8 rounded border border-white/5 bg-industrial-black/50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="absolute -top-3 left-8 px-2 bg-industrial-dark text-xs font-mono text-gray-500 border border-gray-700">
                  {DISTRIBUTOR_DATA.current.status}
                </div>
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                     <Network className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-400">{DISTRIBUTOR_DATA.current.name}</h4>
                    <p className="text-sm text-gray-600 mt-2">Dépendance : {DISTRIBUTOR_DATA.current.intermediary}</p>
                  </div>
                  <div className="w-full bg-white/5 p-4 rounded mt-4 border border-red-900/20">
                    <p className="text-xs font-mono text-red-500 uppercase mb-1">Danger</p>
                    <p className="text-sm text-gray-400">{DISTRIBUTOR_DATA.current.drawback}</p>
                  </div>
                </div>
             </div>

             {/* Future State */}
             <div className="relative p-8 rounded border border-industrial-accent/30 bg-industrial-accent/5 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
                <div className="absolute -top-3 left-8 px-2 bg-industrial-dark text-xs font-mono text-industrial-accent border border-industrial-accent/30">
                  {DISTRIBUTOR_DATA.future.status}
                </div>
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-industrial-accent/20 flex items-center justify-center animate-pulse">
                     <Globe className="w-8 h-8 text-industrial-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{DISTRIBUTOR_DATA.future.name}</h4>
                    <p className="text-sm text-industrial-metallic mt-2">Levier : {DISTRIBUTOR_DATA.future.intermediary}</p>
                  </div>
                  <div className="w-full bg-industrial-accent/10 p-4 rounded mt-4 border border-industrial-accent/20">
                    <p className="text-xs font-mono text-industrial-accent uppercase mb-1">Opportunité</p>
                    <p className="text-sm text-white">{DISTRIBUTOR_DATA.future.drawback}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: PROPOSAL (CLOSE) --- */}
      <section id="section-proposal" className="snap-start min-h-screen flex flex-col items-center justify-center px-4 bg-black relative overflow-hidden">
         {/* Background Animation */}
         <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-industrial-accent rounded-full blur-[120px] animate-pulse"></div>
         </div>

         <div className="relative z-10 max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto bg-industrial-black rounded-full border border-white/10 flex items-center justify-center mb-8 shadow-inner">
               <Rocket className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">PRÊT POUR LE DÉCOLLAGE ?</h2>
            <p className="text-industrial-metallic text-lg mb-10 leading-relaxed">
              Le produit est révolutionnaire. Le marché est immense. <br/>
              Il ne manque que le moteur d'acquisition.
              <br/><br/>
              <span className="text-white font-medium">RaiseMed.IA x SYSTEMMAG</span>
            </p>

            <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg tracking-wider rounded overflow-hidden transition-all hover:scale-105 active:scale-95">
               <span className="relative z-10 flex items-center gap-2">
                 LANCER LE PROTOCOLE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
               </span>
               <div className="absolute inset-0 bg-industrial-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 opacity-20"></div>
            </button>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
               <div className="text-left">
                 <p className="text-[10px] font-mono text-gray-500 uppercase">Proposé par</p>
                 <p className="text-sm font-bold text-white">Elroy Sitbon</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-mono text-gray-500 uppercase">Pour</p>
                 <p className="text-sm font-bold text-white">Eric Sitbon / Systemmag</p>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}

export default App;