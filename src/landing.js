/* ===================== LANDING KURIOSITY (v2) =====================
   Nodo central del universo transmedia: hero, conflicto, tres historias,
   mapa del universo, invitación a la comunidad docente y footer. */

/* Recursos oficiales (carpeta media/, publicada junto a la página).
   Para reemplazar un recurso, sube el archivo con el mismo nombre o cambia la ruta aquí. Usa null para mostrar el espacio reservado. */
const MEDIA = {
  heroVideo: 'media/hero-emma.mp4',     // Emma en 2040, fondo del hero (sin audio, en bucle)
  heroPoster: 'media/hero-emma.jpg',    // cuadro fijo mientras carga el video o si se reducen las animaciones
  teaser: 'media/teaser.mp4',           // teaser audiovisual
  teaserPoster: 'media/teaser-poster.jpg',
  characters: { simon: 'media/simon.jpg', daniel: 'media/daniel.jpg', emma: 'media/emma.jpg' },
};
const REDUCED_MOTION = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();

const CHARACTERS = [
  { id: 'simon', name: 'Simón', year: '2026', q: '¿Y si el problema no es que no quiera aprender?',
    desc: 'Simón tiene 14 años y comienza a creer que estudiar no es para él. Entre malas notas, comparaciones y expectativas ajenas, ha perdido algo más importante que sus calificaciones: las ganas de descubrir.',
    cta: 'Descubre su historia', product: 'reels', where: 'Su historia se cuenta en una serie de reels narrativos.',
    c1: '#E0409A', c2: '#FF7A59' },
  { id: 'daniel', name: 'Daniel', year: '2026', q: '¿Y si enseñar diferente pudiera cambiarlo todo?',
    desc: 'Daniel es un profesor que intenta conectar con una generación que parece hablar otro idioma. Entre las exigencias del sistema y la resistencia al cambio, deberá decidir si sigue enseñando como siempre o se atreve a transformar su clase.',
    cta: 'Conoce su desafío', product: 'comunidad', where: 'Su historia continúa en la comunidad docente y la plataforma de cocreación.',
    c1: '#3D6BFF', c2: '#2DD4BF' },
  { id: 'emma', name: 'Emma', year: '2040', q: '¿Qué pasa cuando tenemos todas las respuestas, pero olvidamos cómo pensar?',
    desc: 'En un futuro donde la inteligencia artificial parece resolverlo todo, Emma se enfrenta a una pregunta que ninguna tecnología puede responder. Una advertencia sobre lo que podríamos perder si dejamos de cultivar nuestra capacidad de pensar y crear.',
    cta: 'Viaja al futuro', product: 'podcast', where: 'Su historia se cuenta en el pódcast audiovisual "La última pregunta sobre la Tierra".',
    c1: '#9B5CFF', c2: '#E040FB' },
];
const CHAR_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

const PRODUCTS = {
  hub: { name: 'kuriosity.co', kicker: 'El nodo central', tagline: 'Todas las historias pasan por aquí.', icon: 'globe', color: '#F3F1FF',
    role: 'Aquí llegan quienes vienen de un reel, un póster, el pódcast o una invitación a la comunidad. Desde aquí se descubren las demás historias y las formas de participar.' },
  podcast: { name: 'Pódcast audiovisual', kicker: 'Emma · 2040', tagline: 'Escucha las preguntas que podrían cambiar nuestro futuro.', icon: 'mic', color: '#B48CFF', char: 'emma',
    role: 'Presenta el universo de Emma y permite explorar las consecuencias de un mundo que ha dejado de ejercitar su capacidad de pensar.' },
  reels: { name: 'Reels narrativos', kicker: 'Simón · 2026', tagline: 'Historias breves que dejan grandes preguntas.', icon: 'film', color: '#FF6FB5', char: 'simon',
    role: 'Permiten acercarse a personajes, conflictos y situaciones relacionadas con la experiencia educativa.' },
  posters: { name: 'Pósteres interactivos', kicker: 'Puerta de entrada', tagline: 'Una pregunta puede ser el comienzo de todo.', icon: 'image', color: '#FFB86B',
    role: 'Piezas visuales diseñadas para provocar reflexión y conducir hacia otras experiencias del universo mediante sus llamados a la acción y códigos QR.' },
  comunidad: { name: 'Comunidad docente', kicker: 'Daniel · 2026', tagline: 'De las preguntas a las acciones.', icon: 'users', color: '#5EEAD4', char: 'daniel',
    role: 'Un espacio de participación y cocreación donde los docentes pueden descubrir recursos, compartir experiencias y experimentar con nuevas maneras de enseñar.' },
};
// Conexiones narrativas: el ciclo futuro → presente → acción → futuro, y la entrada desde los pósteres.
const UNIVERSE_EDGES = [
  { from: 'podcast', to: 'reels', label: '2040 advierte lo que Simón vive hoy' },
  { from: 'reels', to: 'comunidad', label: 'El aula de Simón es el desafío de Daniel' },
  { from: 'comunidad', to: 'podcast', label: 'Cada clase que cambia, cambia el futuro de Emma' },
  { from: 'posters', to: 'hub', label: 'Su código QR te trae aquí' },
];
const NODE_POS = { hub: [50, 50], reels: [17, 19], podcast: [83, 19], comunidad: [50, 88], posters: [14, 80] };

/* Avanza de 0 a 1 mientras la sección atraviesa la pantalla (para animaciones de scroll). */
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => { raf = 0; const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); const vh = window.innerHeight || 800; setP(Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)))); };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return p;
}

function Eyebrow({ children, className = '' }) {
  return html`<p className=${cx('font-mono text-[11.5px] uppercase tracking-[.22em] text-[#B9A6FF]', className)}>${children}</p>`;
}

/* Imagen oficial del personaje o contenedor reservado claramente identificado. */
function CharacterMedia({ c, className = '', big = false }) {
  const src = MEDIA.characters[c.id];
  if (src) return html`<img src=${src} alt=${c.name + ', ' + c.year} loading="lazy" className=${cx('absolute inset-0 w-full h-full object-cover', className)} style=${{ objectPosition: 'center 18%' }} />`;
  return html`<div className=${cx('absolute inset-0 overflow-hidden', className)} style=${{ background: `radial-gradient(90% 70% at 70% 15%, ${c.c1}55, transparent 60%), radial-gradient(80% 60% at 10% 100%, ${c.c2}40, transparent 60%), #0B0D2A` }}>
    <span className="absolute -right-4 -bottom-10 font-display font-extrabold leading-none select-none" style=${{ fontSize: big ? 360 : 300, color: c.c1, opacity: .16 }} aria-hidden="true">${c.name[0]}</span>
    <span className="absolute left-1/2 top-[22%] -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap max-w-[90%] rounded-full border border-dashed border-white/35 bg-black/25 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[.12em] text-white/70"><${Icon} name="image" size=${12} />Imagen oficial · pendiente</span>
  </div>`;
}

/* ---------- Ventanas: teaser y piezas en producción ---------- */
function MediaModal({ kind, onClose, onStory }) {
  const titles = { teaser: 'Teaser de KURIOSITY', podcast: 'La última pregunta sobre la Tierra', reels: 'Reels de Simón', posters: 'Pósteres interactivos' };
  return html`<${Modal} open=${!!kind} onClose=${onClose} size="max-w-3xl" label=${titles[kind] || 'Contenido'} dark>
    ${kind && html`<div className="lp-modal">
      <${CloseBtn} onClick=${onClose} light />
      <div className="px-5 sm:px-8 pt-7 pb-2">
        <${Eyebrow}>${kind === 'teaser' ? 'Teaser audiovisual' : kind === 'podcast' ? 'Pódcast audiovisual · Emma · 2040' : kind === 'reels' ? 'Serie de reels · Simón · 2026' : 'Pósteres con código QR'}</${Eyebrow}>
        <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.1rem)] font-extrabold leading-tight mt-2 pr-10">${titles[kind]}</h2>
      </div>
      <div className="p-5 sm:p-8 pt-4">
        ${kind === 'teaser' && (MEDIA.teaser
          ? html`<video src=${MEDIA.teaser} poster=${MEDIA.teaserPoster} controls autoPlay playsInline preload="metadata" className="w-full rounded-2xl bg-black aspect-video"></video>`
          : html`<div className="relative aspect-video rounded-2xl overflow-hidden lp-frame grid place-items-center text-center">
              <div className="absolute inset-0 hero-aurora opacity-70" aria-hidden="true"></div>
              <div className="relative px-6"><span className="inline-grid place-items-center w-16 h-16 rounded-full border border-white/30 bg-white/10"><${Icon} name="play" size=${24} fill="currentColor" /></span>
              <p className="mt-4 font-display text-[20px] font-bold">El teaser está en producción</p>
              <p className="mt-1 text-white/65 text-[14.5px] max-w-sm mx-auto">Aquí se reproducirá el teaser oficial cuando esté listo.</p></div>
            </div>`)}
        ${kind === 'podcast' && html`<div className="rounded-2xl lp-frame p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-20 h-20 rounded-2xl shrink-0" style=${{ background: 'linear-gradient(135deg,#9B5CFF,#E040FB)' }}><${Icon} name="mic" size=${30} /></span>
              <div className="min-w-0"><p className="font-display text-[19px] font-bold leading-tight">Episodio 1 · por publicar</p><p className="text-white/60 text-[14px]">Protagonizado por Emma, desde 2040</p></div>
            </div>
            <div className="mt-5 flex items-center gap-3 opacity-60" aria-hidden="true"><span className="grid place-items-center w-10 h-10 rounded-full bg-white/15"><${Icon} name="play" size=${15} fill="currentColor" /></span><div className="flex-1 h-1.5 rounded-full bg-white/15"></div><span className="font-mono text-[12px]">--:--</span></div>
            <p className="mt-4 text-[14px] text-white/65">Reproductor de prototipo. Los episodios se incorporarán cuando estén publicados.</p>
          </div>`}
        ${kind === 'reels' && html`<div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">${[1, 2, 3].map(n => html`<div key=${n} className="relative shrink-0 w-[150px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden lp-frame">
            <div className="absolute inset-0" style=${{ background: `radial-gradient(80% 60% at 50% 20%, #E0409A${n === 2 ? '66' : '40'}, transparent 60%), #0B0D2A` }}></div>
            <span className="absolute left-3 top-3 font-mono text-[10.5px] uppercase tracking-[.14em] text-white/70">Reel ${n}</span>
            <span className="absolute inset-0 grid place-items-center"><span className="grid place-items-center w-12 h-12 rounded-full bg-white/15 border border-white/25"><${Icon} name="play" size=${18} fill="currentColor" /></span></span>
            <span className="absolute left-3 right-3 bottom-3 text-[12px] text-white/70">Por publicar</span>
          </div>`)}</div>
          <p className="mt-4 text-[14px] text-white/65">Espacios reservados para la serie de reels de Simón. Se reemplazarán por los videos oficiales.</p>`}
        ${kind === 'posters' && html`<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">${CHARACTERS.map(c => html`<button key=${c.id} onClick=${() => onStory(c.id)} className="group relative text-left aspect-[3/4] rounded-2xl overflow-hidden lp-frame p-4 flex flex-col hover:-translate-y-1 transition">
            <div className="absolute inset-0" style=${{ background: `linear-gradient(160deg, ${c.c1}55, transparent 55%), #0B0D2A` }}></div>
            <span className="relative font-mono text-[10.5px] uppercase tracking-[.14em] text-white/60">Póster · ${c.name}</span>
            <p className="relative mt-auto serif text-[22px] leading-[1.1]">${c.q}</p>
            <span className="relative mt-4 flex items-center gap-2"><span className="qr-ph" aria-hidden="true"></span><span className="text-[11.5px] text-white/70 leading-tight">Escanea<br/>kuriosity.co</span></span>
            <span className="relative mt-3 text-[12.5px] font-bold text-white/85 group-hover:underline">Ir a la historia →</span>
          </button>`)}</div>
          <p className="mt-4 text-[14px] text-white/65">Maquetas de prototipo con las preguntas de cada historia. El código QR de cada póster lleva a kuriosity.co.</p>`}
      </div>
    </div>`}
  <//>`;
}

/* ---------- Historia de cada personaje ---------- */
function StoryPanel({ id, onClose, onStory, onMedia, onCommunity, session }) {
  const c = id && CHAR_BY_ID[id];
  const others = c ? CHARACTERS.filter(x => x.id !== c.id) : [];
  const prod = c && PRODUCTS[c.product];
  const action = c && (c.product === 'comunidad'
    ? html`<button className=${btn + ' cta-grad text-white font-bold px-5 py-3'} onClick=${onCommunity}>${session ? 'Ir a la comunidad docente' : 'Entrar a la comunidad de Daniel'} <${Icon} name="arrow" size=${17} /></button>`
    : html`<button className=${btn + ' cta-grad text-white font-bold px-5 py-3'} onClick=${() => onMedia(c.product)}><${Icon} name=${prod.icon} size=${17} />${c.product === 'podcast' ? 'Escuchar el pódcast' : 'Ver los reels'}</button>`);
  return html`<${Modal} open=${!!c} onClose=${onClose} size="max-w-3xl" label=${c ? 'Historia de ' + c.name : 'Historia'} dark>
    ${c && html`<div className="lp-modal">
      <${CloseBtn} onClick=${onClose} light />
      <div className="relative h-56 sm:h-72">
        <${CharacterMedia} c=${c} big />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D2A] via-[#0B0D2A]/30 to-transparent"></div>
        <div className="absolute left-5 sm:left-8 bottom-4">
          <p className="font-mono text-[13px] tracking-[.2em]" style=${{ color: c.c1 }}>${c.year}</p>
          <h2 className="font-display text-[clamp(2.2rem,6vw,3.2rem)] font-extrabold leading-none">${c.name}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-8 pt-4">
        <p className="serif text-[clamp(1.5rem,3.6vw,2rem)] leading-[1.15]">${c.q}</p>
        <p className="mt-4 text-[16.5px] text-white/75 leading-relaxed max-w-prose">${c.desc}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[13.5px] text-white/80"><${Icon} name=${prod.icon} size=${15} />${c.where}</p>
        <div className="mt-6 flex flex-wrap gap-3">${action}</div>
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[13px] font-bold text-white/60">Sigue explorando el universo</p>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">${others.map(o => html`<button key=${o.id} onClick=${() => onStory(o.id)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3 text-left hover:bg-white/[.08] hover:border-white/25 transition">
            <span className="grid place-items-center w-12 h-12 rounded-xl font-display font-extrabold text-[20px] shrink-0" style=${{ background: `linear-gradient(135deg, ${o.c1}, ${o.c2})` }}>${o.name[0]}</span>
            <span className="min-w-0"><span className="block font-bold">${o.name} · <span className="font-mono text-[12.5px] font-normal text-white/60">${o.year}</span></span><span className="block text-[13px] text-white/60 line-clamp-2">${o.q}</span></span>
          </button>`)}</div>
        </div>
      </div>
    </div>`}
  <//>`;
}

/* ---------- Fundamentación: ¿Por qué nace KURIOSITY? ---------- */
function WhyModal({ open, onClose }) {
  return html`<${Modal} open=${open} onClose=${onClose} size="max-w-2xl" label="¿Por qué nace KURIOSITY?" dark>
    <div className="lp-modal p-6 sm:p-9">
      <${CloseBtn} onClick=${onClose} light />
      <${Eyebrow}>Fundamentación · en construcción</${Eyebrow}>
      <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold leading-tight mt-2 pr-10">¿Por qué nace KURIOSITY?</h2>
      <p className="mt-4 text-[16px] text-white/75 leading-relaxed">Las nuevas generaciones aprenden en un mundo distinto, pero muchas prácticas educativas no han cambiado al mismo ritmo. Los resultados de las pruebas internacionales muestran que la comprensión lectora de los estudiantes colombianos viene cayendo desde antes de la llegada de la inteligencia artificial.</p>
      <div className="mt-6 rounded-2xl lp-frame p-5">
        <p className="text-[13px] font-bold text-white/65">Puntaje promedio de Colombia en lectura · PISA</p>
        <ol className="mt-3 grid grid-cols-4 gap-2" aria-label="Lectura: 425 en 2015, 412 en 2018, 409 en 2022, 399 en 2025">
          ${[['2015', 425], ['2018', 412], ['2022', 409], ['2025', 399]].map(([y, v], i) => html`<li key=${y}><span className=${cx('block font-display font-extrabold tabular-nums leading-none', i === 3 ? 'text-[34px] grad-text' : 'text-[26px] text-white/85')}>${v}</span><span className="block mt-1 font-mono text-[12px] text-white/50">${y}</span></li>`)}
        </ol>
        <p className="mt-3 text-[13.5px] text-white/65">En 2025, más de la mitad de los estudiantes no alcanzó el nivel básico de lectura. Promedio de la OCDE en lectura: 461.</p>
      </div>
      <p className="mt-6 text-[13px] font-bold text-white/60">Fuentes</p>
      <ul className="mt-2 grid gap-1.5 text-[14px]">
        <li><a className="underline decoration-white/30 hover:decoration-white" href="https://www.oecd.org/en/about/programmes/pisa.html" target="_blank" rel="noopener">OCDE · Programa PISA</a></li>
        <li><a className="underline decoration-white/30 hover:decoration-white" href="https://fundacionexe.org.co/wp-content/uploads/2024/03/Reporte-general-de-resultados-PISA-2022.pdf" target="_blank" rel="noopener">Fundación ExE · Reporte de resultados PISA 2022</a></li>
        <li><a className="underline decoration-white/30 hover:decoration-white" href="https://www.elcolombiano.com/colombia/educacion/resultados-pisa-2025-colombia-matematicas-lectura-ciencias-computacion-IL40789504" target="_blank" rel="noopener">El Colombiano · Resultados PISA 2025 para Colombia</a></li>
      </ul>
      <p className="mt-5 text-[13px] text-white/50">Esta sección se ampliará con la fundamentación académica completa del proyecto.</p>
    </div>
  <//>`;
}

/* ---------- Mapa del universo transmedia ---------- */
function UniverseMap({ sel, setSel, onAction }) {
  const related = id => UNIVERSE_EDGES.filter(e => e.from === id || e.to === id);
  const isLit = e => sel === 'hub' ? true : (e.from === sel || e.to === sel);
  const spokeLit = id => sel === 'hub' || sel === id;
  const ids = ['reels', 'podcast', 'comunidad', 'posters'];
  const P = NODE_POS;
  const R = id => id === 'hub' ? 58 : 44; // radio del nodo en unidades del viewBox, para que la flecha no quede debajo
  const curve = (a, b, bend = 0) => {
    let [x1, y1] = [P[a][0] * 10, P[a][1] * 6.2], [x2, y2] = [P[b][0] * 10, P[b][1] * 6.2];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const cx_ = mx - dy / L * bend, cy_ = my + dx / L * bend;
    const t1 = Math.hypot(cx_ - x1, cy_ - y1) || 1, t2 = Math.hypot(x2 - cx_, y2 - cy_) || 1;
    x1 += (cx_ - x1) / t1 * R(a); y1 += (cy_ - y1) / t1 * R(a);
    x2 -= (x2 - cx_) / t2 * R(b); y2 -= (y2 - cy_) / t2 * R(b);
    return `M${x1},${y1} Q${cx_},${cy_} ${x2},${y2}`;
  };
  const labelPos = { 'podcast-reels': [50, 6], 'reels-comunidad': [31, 63], 'comunidad-podcast': [73, 59], 'posters-hub': [22, 70] };
  return html`<div>
    <!-- Escritorio: constelación -->
    <div className="hidden md:block relative w-full aspect-[1000/620] select-none">
      <svg viewBox="0 0 1000 620" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#C9B8FF" /></marker>
          <linearGradient id="cyc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B5CFF" /><stop offset=".5" stopColor="#E0409A" /><stop offset="1" stopColor="#3D6BFF" /></linearGradient>
        </defs>
        ${ids.map(id => html`<path key=${'s' + id} d=${curve('hub', id)} fill="none" stroke="#FFFFFF" strokeOpacity=${spokeLit(id) ? .28 : .08} strokeWidth="1.2" strokeDasharray="3 7" />`)}
        ${UNIVERSE_EDGES.filter(e => e.to !== 'hub').map(e => html`<path key=${e.from + e.to} d=${curve(e.from, e.to, e.from === 'podcast' ? -40 : 60)} fill="none" stroke="url(#cyc)" strokeOpacity=${isLit(e) ? .95 : .15} strokeWidth=${isLit(e) ? 2.4 : 1.4} markerEnd="url(#arr)" className="edge-flow" />`)}
      </svg>
      ${UNIVERSE_EDGES.map(e => { const [x, y] = labelPos[e.from + '-' + e.to]; return html`<span key=${'l' + e.from} className=${cx('absolute -translate-x-1/2 -translate-y-1/2 max-w-[210px] text-center rounded-full px-3 py-1 text-[12.5px] leading-snug transition', isLit(e) ? 'bg-[#141640] text-white border border-white/20' : 'text-white/30 border border-transparent')} style=${{ left: x + '%', top: y + '%' }}>${e.label}</span>`; })}
      ${['hub', ...ids].map(id => { const p = PRODUCTS[id]; const on = sel === id; return html`<button key=${id} onClick=${() => setSel(id)} onMouseEnter=${() => setSel(id)} aria-pressed=${on}
        className=${cx('absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center group focus-visible:outline-none', id === 'hub' ? 'w-[190px]' : 'w-[170px]')} style=${{ left: P[id][0] + '%', top: P[id][1] + '%' }}>
        <span className=${cx('grid place-items-center rounded-full border transition duration-300 shrink-0', id === 'hub' ? 'w-24 h-24' : 'w-16 h-16', on ? 'scale-110 bg-white/[.12]' : 'bg-white/[.05] group-hover:bg-white/[.1]')} style=${{ width: id === 'hub' ? 96 : 64, height: id === 'hub' ? 96 : 64, borderColor: on ? p.color : 'rgba(255,255,255,.2)', boxShadow: on ? `0 0 0 6px ${p.color}22, 0 0 40px ${p.color}55` : 'none', color: p.color }}>${id === 'hub' ? html`<span className="font-display font-extrabold text-[30px] text-white">?</span>` : html`<${Icon} name=${p.icon} size=${24} />`}</span>
        <span className="mt-2 font-display font-bold text-[15px] leading-tight text-white">${p.name}</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-white/55 mt-0.5">${p.kicker}</span>
      </button>`; })}
    </div>

    <!-- Móvil: el ciclo como recorrido vertical -->
    <ol className="md:hidden grid gap-2">
      ${['podcast', 'reels', 'comunidad'].map((id, i) => { const p = PRODUCTS[id]; const e = UNIVERSE_EDGES[i]; return html`<li key=${id}>
        <button onClick=${() => setSel(id)} aria-pressed=${sel === id} className=${cx('w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition', sel === id ? 'bg-white/[.1] border-white/30' : 'bg-white/[.04] border-white/10')}>
          <span className="grid place-items-center w-11 h-11 rounded-full border border-white/20 shrink-0" style=${{ color: p.color }}><${Icon} name=${p.icon} size=${19} /></span>
          <span className="min-w-0"><span className="block font-bold">${p.name}</span><span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-white/55">${p.kicker}</span></span>
        </button>
        <p className="flex items-center gap-2 pl-5 py-2 text-[13px] text-white/70"><span className="text-[#E0409A]">↓</span>${i < 2 ? e.label : e.label + ' (y el ciclo vuelve a empezar)'}</p>
      </li>`; })}
      <li className="grid grid-cols-2 gap-2 pt-1">${['posters', 'hub'].map(id => { const p = PRODUCTS[id]; return html`<button key=${id} onClick=${() => setSel(id)} aria-pressed=${sel === id} className=${cx('flex flex-col gap-1 rounded-2xl border p-3 text-left', sel === id ? 'bg-white/[.1] border-white/30' : 'bg-white/[.04] border-white/10')}><span style=${{ color: p.color }}><${Icon} name=${p.icon} size=${18} /></span><span className="font-bold text-[14px] leading-tight">${p.name}</span><span className="text-[12px] text-white/55">${p.kicker}</span></button>`; })}</li>
    </ol>

    <${UniverseDetail} id=${sel} onAction=${onAction} related=${related(sel)} />
  </div>`;
}
function UniverseDetail({ id, onAction, related }) {
  const p = PRODUCTS[id];
  const ch = p.char && CHAR_BY_ID[p.char];
  const actions = {
    hub: [['Conocer las tres historias', () => onAction('scroll', 'historias')], ['Ver el teaser', () => onAction('media', 'teaser')]],
    podcast: [['Escuchar un adelanto', () => onAction('media', 'podcast')], ['Conocer a Emma', () => onAction('story', 'emma')]],
    reels: [['Ver los reels', () => onAction('media', 'reels')], ['Conocer a Simón', () => onAction('story', 'simon')]],
    posters: [['Ver los pósteres', () => onAction('media', 'posters')]],
    comunidad: [['Entrar a la comunidad', () => onAction('community')], ['Conocer a Daniel', () => onAction('story', 'daniel')]],
  }[id];
  return html`<div className="mt-6 rounded-[24px] lp-frame p-5 sm:p-7 grid md:grid-cols-[1.2fr_1fr] gap-6 fade" key=${id} aria-live="polite">
    <div className="min-w-0">
      <p className="font-mono text-[11px] uppercase tracking-[.18em]" style=${{ color: p.color }}>${p.kicker}</p>
      <h3 className="font-display text-[24px] font-extrabold leading-tight mt-1">${p.name}</h3>
      <p className="serif text-[21px] leading-snug mt-2 text-white/90">${p.tagline}</p>
      <p className="mt-3 text-[15.5px] text-white/70 leading-relaxed">${p.role}</p>
      <div className="mt-5 flex flex-wrap gap-2.5">${actions.map(([l, fn], i) => html`<button key=${l} onClick=${fn} className=${i === 0 ? btn + ' cta-grad text-white font-bold px-4 py-2.5' : btn + ' border border-white/25 text-white hover:bg-white/10 px-4 py-2.5'}>${l} ${i === 0 && html`<${Icon} name="arrow" size=${16} />`}</button>`)}</div>
      ${id !== 'hub' && id !== 'comunidad' && html`<p className="mt-3 text-[12.5px] text-white/45">Contenido en producción: se muestra en estado de prototipo.</p>`}
    </div>
    <div className="min-w-0">
      <p className="text-[13px] font-bold text-white/60">${id === 'hub' ? 'Cómo se conecta el universo' : 'Conexiones'}</p>
      <ul className="mt-2 grid gap-2">
        ${(id === 'hub' ? UNIVERSE_EDGES : related).map(e => html`<li key=${e.from + e.to} className="rounded-xl bg-white/[.04] border border-white/10 px-3 py-2.5 text-[14px]">
          <span className="block text-[11.5px] font-mono uppercase tracking-[.12em] text-white/50">${PRODUCTS[e.from].name} → ${PRODUCTS[e.to].name}</span>
          <span className="text-white/85">${e.label}</span></li>`)}
        ${ch && html`<li className="rounded-xl px-3 py-2.5 text-[14px] text-white/70">Personaje: <strong className="text-white">${ch.name}</strong> · ${ch.year}</li>`}
      </ul>
    </div>
  </div>`;
}

/* ---------- Página ---------- */
function Landing({ session, onJoin, onLogin, onEnter, onInfo }) {
  const [story, setStory] = useState(null);
  const [media, setMedia] = useState(null);
  const [why, setWhy] = useState(false);
  const [sel, setSel] = useState('hub');
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const conflictRef = useRef(null);
  const closeRef = useRef(null);
  const cp = useScrollProgress(conflictRef);
  const kp = useScrollProgress(closeRef);
  useEffect(() => { const on = () => setScrolled(window.scrollY > 40); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);
  const go = id => { setMenu(false); if (id === 'inicio') return window.scrollTo({ top: 0, behavior: 'smooth' }); const el = document.getElementById(id); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toCommunity = () => { setStory(null); setMedia(null); session ? onEnter() : onLogin(); };
  const onAction = (type, arg) => { if (type === 'scroll') go(arg); else if (type === 'media') setMedia(arg); else if (type === 'story') setStory(arg); else if (type === 'community') toCommunity(); };
  const links = [['inicio', 'Inicio'], ['historias', 'Las historias'], ['universo', 'Explora el universo']];
  const commBtn = (extra = '') => html`<button onClick=${toCommunity} className=${cx('comm-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-bold text-white whitespace-nowrap transition', extra)}><${Icon} name="users" size=${16} />${session ? 'Ir a la comunidad' : 'Comunidad docente'}</button>`;
  const highlight = 'Porque aprender no debería ser solo recordar información. Debería ser descubrir, cuestionar, imaginar y crear.'.split(' ');
  const lit = Math.round(Math.max(0, Math.min(1, (cp - .25) / .4)) * highlight.length);

  return html`<div className="lp min-h-full">
    <header className=${cx('fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top,0px)] transition duration-300', scrolled || menu ? 'bg-[#05061A]/90 backdrop-blur-md border-b border-white/10' : 'border-b border-transparent')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <${Logo} light onClick=${() => go('inicio')} />
        <nav className="hidden md:flex items-center gap-1 text-[15px]" aria-label="Menú principal">
          ${links.map(([id, l]) => html`<button key=${id} onClick=${() => go(id)} className="px-3 py-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition">${l}</button>`)}
          <span className="ml-2">${commBtn()}</span>
        </nav>
        <button className="md:hidden p-2 -mr-2 rounded-xl text-white hover:bg-white/10" onClick=${() => setMenu(!menu)} aria-expanded=${menu} aria-label=${menu ? 'Cerrar menú' : 'Abrir menú'}><${Icon} name=${menu ? 'x' : 'menu'} size=${22} /></button>
      </div>
      ${menu && html`<nav className="md:hidden px-4 pb-4 grid gap-1 fade" aria-label="Menú principal">
        ${links.map(([id, l]) => html`<button key=${id} onClick=${() => go(id)} className="text-left px-3 py-3 rounded-xl text-white/85 hover:bg-white/10 text-[16px]">${l}</button>`)}
        <div className="pt-2">${commBtn('w-full justify-center py-3')}</div>
      </nav>`}
    </header>

    <!-- 1 · HERO -->
    <section id="inicio" className="relative overflow-hidden min-h-[640px] flex items-center">
      <div className="absolute inset-0 hero-aurora" aria-hidden="true"></div>
      ${MEDIA.heroVideo && html`<video className="absolute inset-0 w-full h-full object-cover opacity-70" style=${{ objectPosition: '60% center' }} src=${MEDIA.heroVideo} poster=${MEDIA.heroPoster} autoPlay=${!REDUCED_MOTION} muted loop playsInline preload="auto" aria-hidden="true"></video>`}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05061A] via-[#05061A]/80 to-[#05061A]/10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05061A]/70 via-transparent to-transparent" aria-hidden="true"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05061A] to-transparent" aria-hidden="true"></div>
      <div className="hero-horizon" aria-hidden="true"></div>
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <h1>
          <span className="block font-display font-extrabold text-[clamp(2.3rem,6.4vw,5.1rem)] leading-[1] tracking-[-.025em] balance">El futuro no necesita más respuestas.</span>
          <span className="block serif grad-text text-[clamp(2.7rem,7.6vw,6.2rem)] leading-[1.02] mt-2 pb-2">Necesita mejores preguntas.</span>
        </h1>
        <div className="mt-8 max-w-[58ch] space-y-4 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-white/75">
          <p>La tecnología avanza. El mundo cambia. <span className="text-white/90">Pero ¿estamos transformando al mismo ritmo la manera de enseñar?</span></p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button onClick=${() => go('historias')} className=${btn + ' cta-grad cta-pulse pulse-white text-white font-bold px-6 py-3.5 text-[16px] hover:-translate-y-0.5'}>Explorar el universo <${Icon} name="arrow" size=${18} /></button>
          <button onClick=${() => setMedia('teaser')} className=${btn + ' border border-white/25 text-white hover:bg-white/10 px-5 py-3.5 text-[16px] backdrop-blur-sm'}><span className="grid place-items-center w-7 h-7 rounded-full bg-white text-[#05061A]"><${Icon} name="play" size=${12} fill="currentColor" /></span>Ver el teaser</button>
        </div>
      </div>
      <button onClick=${() => go('conflicto')} className="absolute left-1/2 -translate-x-1/2 bottom-6 text-white/50 hover:text-white hidden sm:flex flex-col items-center gap-1 text-[11px] font-mono uppercase tracking-[.2em]" aria-label="Seguir bajando"><span>Bajar</span><span className="scroll-cue"><${Icon} name="chevdown" size=${18} /></span></button>
    </section>

    <!-- 2 · EL CONFLICTO -->
    <section id="conflicto" ref=${conflictRef} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden="true">
        ${[['pantallas · redes sociales · inteligencia artificial · contenidos · algoritmos ·', 1], ['notificaciones · videos · respuestas instantáneas · pantallas ·', -1]].map(([t, dir], i) => html`<p key=${i} className="whitespace-nowrap font-display font-extrabold text-[clamp(3rem,9vw,7.5rem)] leading-[1.05] kw-line" style=${{ transform: `translateX(${dir * (cp * 30 - 15)}%)` }}>${t} ${t}</p>`)}
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-end">
        <div>
          <${Eyebrow}>El conflicto</${Eyebrow}>
          <h2 className="mt-4"><span className="block font-display font-extrabold text-[clamp(2.3rem,5.6vw,4.2rem)] leading-[1] tracking-[-.02em]">El mundo cambió.</span><span className="block serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.05] text-[#C9B8FF]">¿Y la forma de enseñar?</span></h2>
        </div>
        <div className="lp-glass rounded-[24px] p-6 sm:p-7 space-y-4 text-[17px] leading-relaxed text-white/80">
          <p>Las nuevas generaciones crecen entre pantallas, redes sociales, inteligencia artificial y un universo de contenidos que transforma su manera de relacionarse con el conocimiento.</p>
          <p>Mientras tanto, la educación enfrenta un desafío: dejar de concentrarse únicamente en transmitir respuestas y comenzar a despertar preguntas.</p>
        </div>
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 mt-20 sm:mt-28">
        <p className="font-display font-bold text-[clamp(1.6rem,3.8vw,2.9rem)] leading-[1.18] tracking-[-.01em] balance" aria-label=${highlight.join(' ')}>
          ${highlight.map((w, i) => html`<span key=${i} aria-hidden="true" className=${cx('transition-colors duration-500', i < lit ? (/descubrir|cuestionar|imaginar|crear/.test(w) ? 'grad-text' : 'text-white') : 'text-white/40')}>${w} </span>`)}
        </p>
        <button onClick=${() => setWhy(true)} className="mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-[#C9B8FF] hover:text-white group"><${Icon} name="help" size=${18} />¿Por qué nace KURIOSITY?<span className="transition group-hover:translate-x-1"><${Icon} name="arrow" size=${16} /></span></button>
      </div>
    </section>

    <!-- 3 · TRES HISTORIAS -->
    <section id="historias" className="relative py-24 sm:py-32 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <${Eyebrow}>Las historias</${Eyebrow}>
            <h2 className="mt-4"><span className="block font-display font-extrabold text-[clamp(2.3rem,5.6vw,4.2rem)] leading-[1] tracking-[-.02em]">Tres historias.</span><span className="block serif grad-text text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.05] pb-1">Un futuro en juego.</span></h2>
          </div>
          <p className="max-w-md text-[17px] text-white/70 leading-relaxed">Tres personas. Tres perspectivas. Una misma pregunta: ¿qué sucede cuando dejamos de despertar la curiosidad?</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          ${CHARACTERS.map(c => html`<article key=${c.id} className="story-card group relative rounded-[28px] overflow-hidden min-h-[640px] flex flex-col justify-end isolate" style=${{ '--c1': c.c1, '--c2': c.c2 }}>
            <div className="absolute inset-0 -z-10 transition duration-700 group-hover:scale-105"><${CharacterMedia} c=${c} /></div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05061A] from-[38%] via-[#05061A]/75 via-[58%] to-transparent to-[85%]"></div>
            <div className="absolute right-4 top-4 -z-10 rounded-full bg-[#05061A]/55 backdrop-blur px-3 py-1 font-mono font-medium text-[22px] leading-none tracking-[-.02em]" style=${{ color: c.c1 }}>${c.year}</div>
            <div className="p-6 sm:p-7">
              <p className="font-display font-extrabold text-[30px] leading-none">${c.name}</p>
              <p className="mt-4 serif text-[25px] leading-[1.15] text-white">${c.q}</p>
              <p className="mt-4 text-[15px] text-white/70 leading-relaxed story-desc">${c.desc}</p>
              <button onClick=${() => setStory(c.id)} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold text-white story-cta">${c.cta}<span className="transition group-hover:translate-x-1"><${Icon} name="arrow" size=${16} /></span></button>
            </div>
          </article>`)}
        </div>
      </div>
    </section>

    <!-- 4 · EXPLORA EL UNIVERSO -->
    <section id="universo" className="relative py-24 sm:py-32 scroll-mt-16 lp-band">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-14 items-end">
          <div>
            <${Eyebrow}>Explora el universo</${Eyebrow}>
            <h2 className="mt-4"><span className="block font-display font-extrabold text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.02] tracking-[-.02em]">No es solo una historia.</span><span className="block serif text-[clamp(2.2rem,5.4vw,4.1rem)] leading-[1.05] text-[#C9B8FF]">Es una invitación a cambiar el futuro.</span></h2>
          </div>
          <p className="text-[17px] text-white/70 leading-relaxed">KURIOSITY es un universo de experiencias que conecta el presente con un futuro posible. A través de historias, preguntas y espacios de participación, te invitamos a descubrir por qué necesitamos nuevas maneras de enseñar y aprender.</p>
        </div>
        <p className="mt-10 text-[14px] text-white/55 flex items-center gap-2"><${Icon} name="spark" size=${15} />Toca cada experiencia para ver qué aporta y a dónde te lleva. Puedes empezar por cualquiera.</p>
        <div className="mt-4"><${UniverseMap} sel=${sel} setSel=${setSel} onAction=${onAction} /></div>
      </div>
    </section>

    <!-- 5 · DE ESPECTADOR A PROTAGONISTA -->
    <section id="comunidad" ref=${closeRef} className="relative overflow-hidden py-24 sm:py-32 scroll-mt-16">
      <div className="absolute inset-0 community-glow" aria-hidden="true"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-start">
        <div>
          <${Eyebrow}>Comunidad docente</${Eyebrow}>
          <h2 className="mt-4"><span className="block font-display font-extrabold text-[clamp(2.3rem,5.6vw,4.2rem)] leading-[1] tracking-[-.02em]">El futuro también se enseña.</span><span className="block serif grad-text text-[clamp(2.2rem,5.4vw,4rem)] leading-[1.08] pb-1">Y comienza en nuestras aulas.</span></h2>
          <div className="mt-7 space-y-4 text-[17px] text-white/75 leading-relaxed max-w-[56ch]">
            <p>No podemos cambiar el pasado. Pero sí podemos transformar la manera en que enseñamos hoy.</p>
            <p>Una comunidad para docentes que creen que enseñar es mucho más que transmitir conocimientos: es despertar preguntas, inspirar nuevas ideas y formar personas capaces de transformar su mundo.</p>
          </div>
          <figure className="mt-8 flex items-start gap-4 lp-glass rounded-[22px] p-5 max-w-[56ch]">
            <${DanielAvatar} size=${56} className="ring-2 ring-white/20" />
            <figcaption className="text-[15.5px] text-white/80 leading-relaxed"><span className="font-bold text-white">Daniel</span> está ante la misma decisión que muchos docentes: seguir enseñando como siempre o atreverse a transformar su clase. En la comunidad no tiene que decidirlo solo, y tú tampoco.</figcaption>
          </figure>
          <p className="mt-10 serif text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.15] text-white balance">¿Y si el cambio que necesita la educación empezara en tu próxima clase?</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button onClick=${session ? onEnter : onJoin} className=${btn + ' cta-grad cta-pulse pulse-white text-white font-bold px-6 py-3.5 text-[16px] hover:-translate-y-0.5'}>${session ? 'Ir a la comunidad docente' : 'Quiero transformar mi forma de enseñar'} <${Icon} name="arrow" size=${18} /></button>
            ${!session && html`<button onClick=${onLogin} className="text-[15px] text-white/70 hover:text-white underline-offset-4 hover:underline">Ya tengo cuenta · Iniciar sesión</button>`}
          </div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-white/50"><${Icon} name="shield" size=${15} />Comunidad con docentes verificados.</p>
        </div>
        <ul className="grid gap-3 lg:mt-24">
          ${[['search', 'Descubre', 'Descubre recursos para transformar tus clases.'], ['message', 'Comparte', 'Comparte experiencias con otros docentes.'], ['layers', 'Crea', 'Crea y construye nuevas estrategias de aprendizaje.']].map(([i, t, d], k) => html`<li key=${t} className="flex items-center gap-4 lp-glass rounded-[20px] p-5">
            <span className="font-mono text-[12px] text-white/40 w-5">0${k + 1}</span>
            <span className="grid place-items-center w-12 h-12 rounded-2xl shrink-0" style=${{ background: ['linear-gradient(135deg,#3D6BFF,#2DD4BF)', 'linear-gradient(135deg,#7C5CFF,#E0409A)', 'linear-gradient(135deg,#E0409A,#FF7A59)'][k] }}><${Icon} name=${i} size=${21} /></span>
            <span className="min-w-0"><span className="block font-display font-bold text-[18px]">${t}</span><span className="block text-[14.5px] text-white/70">${d}</span></span>
          </li>`)}
        </ul>
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-28">
        <p className="font-display font-extrabold text-[clamp(2.2rem,7.5vw,6rem)] leading-[1] tracking-[-.03em] flex flex-wrap gap-x-[.35em]">
          ${['Descubre.', 'Comparte.', 'Crea.', 'Transforma.'].map((w, i) => html`<span key=${w} className=${cx('transition duration-700', kp > .35 + i * .08 ? (i === 3 ? 'grad-text' : 'text-white') : 'text-white/25')}>${w}</span>`)}
        </p>
      </div>
    </section>

    <!-- 6 · FOOTER -->
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
        <div>
          <${Logo} light onClick=${() => go('inicio')} />
          <p className="mt-4 serif text-[24px] leading-tight text-white/90 max-w-[18ch]">El futuro comienza con lo que hacemos hoy.</p>
          <p className="mt-4 font-mono text-[13px] text-white/55">kuriosity.co</p>
        </div>
        ${[
          ['Las historias', CHARACTERS.map(c => [c.name + ' · ' + c.year, () => setStory(c.id)])],
          ['Experiencias', [['Pódcast audiovisual', () => setMedia('podcast')], ['Reels narrativos', () => setMedia('reels')], ['Pósteres interactivos', () => setMedia('posters')], ['Mapa del universo', () => go('universo')]]],
          ['Comunidad docente', [[session ? 'Ir a la comunidad' : 'Ingresar', toCommunity], ...(session ? [] : [['Crear cuenta', onJoin]]), ['¿Por qué nace KURIOSITY?', () => setWhy(true)]]],
        ].map(([t, items]) => html`<nav key=${t} aria-label=${t}><p className="text-[13px] font-bold text-white/50">${t}</p><ul className="mt-3 grid gap-2">${items.map(([l, fn]) => html`<li key=${l}><button onClick=${fn} className="text-[15px] text-white/80 hover:text-white text-left">${l}</button></li>`)}</ul></nav>`)}
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-white/45">
        <p>Prototipo académico · Maestría en Comunicación Transmedia</p>
        <${PrototypeBadge} light onClick=${onInfo} />
      </div>
    </footer>

    <${StoryPanel} id=${story} session=${session} onClose=${() => setStory(null)} onStory=${setStory} onMedia=${k => { setStory(null); setMedia(k); }} onCommunity=${toCommunity} />
    <${MediaModal} kind=${media} onClose=${() => setMedia(null)} onStory=${id => { setMedia(null); setStory(id); }} />
    <${WhyModal} open=${why} onClose=${() => setWhy(false)} />
  </div>`;
}
