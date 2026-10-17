/* ===================== BIENVENIDA DE DANIEL ===================== */
function DanielWelcome({ open, name, onGo, onExplore }) {
  return html`<${Modal} open=${open} onClose=${onExplore} size="max-w-xl" label="Bienvenida de Daniel">
    <button type="button" onClick=${onExplore} aria-label="Cerrar" className="absolute right-3 top-3 z-10 w-9 h-9 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><${Icon} name="x" size=${18} /></button>
    <div className="relative bg-ink text-white px-6 sm:px-9 pt-8 pb-7 overflow-hidden hero-bg">
      <div className="qmarks" aria-hidden="true"><span className="qm qm1">?</span><span className="qm qm4">¿</span></div>
      <div className="relative flex items-center gap-4">
        <${DanielAvatar} size=${84} className="ring-4 ring-white/15 shadow-xl" />
        <div><p className="font-display text-[24px] font-extrabold leading-tight">Daniel</p><p className="text-white/70 text-[14px]">Docente y miembro de KURIOSITY</p></div>
      </div>
      <h2 className="relative font-display text-[clamp(1.6rem,4.5vw,2.1rem)] font-extrabold mt-6 leading-tight">¡Hola, colega! Soy Daniel.</h2>
    </div>
    <div className="px-6 sm:px-9 py-6 text-[16.5px] text-ink/85 leading-relaxed grid gap-3.5">
      <p>Llevo años enseñando y, como probablemente te ha pasado, más de una vez me he preguntado cómo lograr que nuestros estudiantes vuelvan a sentir curiosidad por aprender.</p>
      <p>A veces pareciera que competimos contra TikTok, la inteligencia artificial y mil distracciones más. Pero he descubierto que no tenemos que encontrar todas las respuestas solos.</p>
      <p className="font-semibold text-ink">Por eso estamos aquí.</p>
      <p>En esta comunidad compartimos lo que funciona, hablamos de lo que no y construimos nuevas formas de enseñar.</p>
      <p className="font-display text-[20px] font-bold text-ink">¿Te animas a transformar el aula conmigo${name ? ', ' + name : ''}?</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <button className=${btnP + ' !px-5 !py-3 text-[16px]'} onClick=${onGo}>¡Vamos, Daniel!</button>
        <button className=${btnS + ' !px-5 !py-3 text-[16px]'} onClick=${onExplore}>Explorar por mi cuenta</button>
      </div>
    </div>
  <//>`;
}

/* ===================== INICIO ===================== */
function JourneyStrip({ ctx }) {
  const { ud, posts, me, go, openComposer } = ctx;
  const mine = posts.filter(p => p.author === me.email);
  const steps = [
    ['Descubrir', 'Abre o guarda un recurso', ud.viewed.length > 0 || ud.savedRes.length > 0, () => go('recursos')],
    ['Aprender', 'Avanza en un curso', Object.values(ud.progress).some(a => a.length > 0), () => go('cursos')],
    ['Aplicar', 'Cuenta cómo usaste un recurso', mine.some(p => p.linkedResource || p.linkedCourse), () => go('recursos')],
    ['Compartir', 'Publica en la comunidad', mine.length > 0, () => openComposer({})],
    ['Cocrear', 'Comenta o crea tu versión de una idea', ud.commented || ud.cocreated, () => go('comunidad')],
  ];
  const n = steps.filter(s => s[2]).length;
  return html`<section data-guide="journey" className="rounded-3xl bg-white border border-line p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3"><p className="font-bold text-ink text-[15px]">Tu recorrido en KURIOSITY</p><span className="font-mono text-[13px] text-mute">${n}/5</span></div>
    <ol className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-3">
      ${steps.map(([t, d, ok, fn], i) => html`<li key=${t}><button onClick=${fn} className="w-full text-left group" title=${d}>
        <span className=${cx('block h-1.5 rounded-full transition', ok ? 'bg-teal-d' : 'bg-ink/10 group-hover:bg-violet/30')}></span>
        <span className=${cx('mt-2 flex items-center gap-1 text-[12px] sm:text-[14px] font-bold', ok ? 'text-teal-d' : 'text-ink')}>${ok && html`<${Icon} name="check" size=${13} sw=${3} />`}${t}</span>
        <span className="hidden md:block text-[12.5px] text-mute leading-snug">${d}</span>
      </button></li>`)}
    </ol>
  </section>`;
}
function Dashboard({ ctx }) {
  const { me, posts, ud, go, openComposer } = ctx;
  const [feed, setFeed] = useState('recent');
  const first = me.name.split(' ')[0];
  const recRes = useMemo(() => {
    const score = r => (r.grades.some(g => me.grades.includes(g)) ? 2 : 0) + (me.areas.includes(r.area) ? 3 : 0);
    return [...RESOURCES].sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [me.grades.join(), me.areas.join()]);
  const feedList = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (feed === 'featured') return [...posts].filter(p => p.kind === 'full').sort((a, b) => b.likes - a.likes).slice(0, 4);
    if (feed === 'questions') return sorted.filter(p => p.cat === 'Preguntas entre docentes').slice(0, 4);
    if (feed === 'mine') return sorted.filter(p => p.grade === 'all' || me.grades.includes(p.grade) || me.areas.includes(p.area)).slice(0, 4);
    return sorted.slice(0, 4);
  }, [posts, feed]);
  const courseList = useMemo(() => { const s = COURSES.filter(c => courseProg(c, ud).done > 0 && courseProg(c, ud).pct < 100); return [...s, ...COURSES.filter(c => !s.includes(c))].slice(0, 2); }, [ud.progress]);
  const evs = upcoming().slice(0, 3);
  const quick = [['recursos', 'book', 'Recursos para el aula', `${RESOURCES.length} materiales`, '#0B7F74', '#DCF5F1'], ['cursos', 'cap', 'Cursos para docentes', `${COURSES.length} cursos cortos`, '#5B3BE0', '#EFEBFF'], ['comunidad', 'users', 'Comunidad', `${posts.length} publicaciones`, '#A61E55', '#FBE4EE'], ['eventos', 'calendar', 'Eventos', `${upcoming().length} próximos`, '#B4470E', '#FCEBDD']];
  return html`<div className="grid gap-6">
    <header className="grid lg:grid-cols-[1fr_auto] gap-4 items-end">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[.16em] text-violet-d">${new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 className="font-display text-[clamp(1.9rem,4.4vw,2.8rem)] font-extrabold text-ink tracking-tight leading-[1.05] mt-1">¡Hola, profe ${first}!</h1>
        <p className="text-mute text-[18px] mt-1">¿Qué vamos a descubrir hoy?</p>
      </div>
      <figure className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-ink to-ink-2 pl-3 pr-4 py-3 max-w-md shadow-[0_12px_30px_-14px_rgba(14,26,60,.6)]">
        <${DanielAvatar} size=${40} className="ring-2 ring-white/40" />
        <blockquote className="text-[14.5px] text-white leading-snug"><span className="font-semibold">“A veces, una buena pregunta transforma más una clase que cien diapositivas.”</span> <span className="text-white/80">— Daniel</span></blockquote>
      </figure>
    </header>

    <div data-guide="quick" className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl">
      ${quick.map(([k, i, t, d, c, bg]) => html`<button key=${k} onClick=${() => go(k)} className="group text-left rounded-2xl p-4 text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(14,26,60,.45)] hover:brightness-110 transition" style=${{ background: `linear-gradient(135deg, ${c}, ${c}D9)` }}>
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/20 text-white"><${Icon} name=${i} size=${20} /></span>
        <p className="font-bold text-white mt-3 leading-tight text-[15px]">${t}</p>
        <p className="text-[13px] text-white/80 mt-0.5 flex items-center gap-1">${d}<span className="opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0"><${Icon} name="arrow" size=${13} /></span></p>
      </button>`)}
    </div>

    <${JourneyStrip} ctx=${ctx} />

    <div className="grid lg:grid-cols-[65fr_35fr] gap-6 items-start">
      <section className="min-w-0 grid gap-4">
        <button data-guide="compose" onClick=${() => openComposer({})} className="flex items-center gap-3 rounded-3xl bg-white border border-line p-3 sm:p-4 text-left hover:border-violet/40 transition">
          <${Avatar} person=${ctx.authorOf(me.email)} size=${40} />
          <span className="flex-1 rounded-full bg-mist px-4 py-2.5 text-mute text-[15px]">¿Probaste algo nuevo en clase? Cuéntanos cómo te fue.</span>
          <span className=${btnP + ' hidden sm:inline-flex !py-2'}>Compartir</span>
        </button>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display text-[20px] font-bold text-ink">De la comunidad</h2>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-full">${[['recent', 'Recientes'], ['featured', 'Experiencias destacadas'], ['questions', 'Preguntas'], ['mine', 'Para mis grados']].map(([k, l]) => html`<${Chip} key=${k} active=${feed === k} onClick=${() => setFeed(k)}>${l}<//>`)}</div>
        </div>
        ${feedList.length ? feedList.map(p => html`<${PostCard} key=${p.id} post=${p} ctx=${ctx} />`) : html`<${Empty} title="Nada por aquí todavía">¿Y si convertimos esa dificultad en una pregunta para la comunidad?<//>`}
        <button className=${btnS + ' justify-self-center'} onClick=${() => go('comunidad')}>Ver toda la comunidad <${Icon} name="arrow" size=${16} /></button>
      </section>

      <aside className="grid gap-5">
        <${PointsCard} ctx=${ctx} />
        <section data-guide="side" className="rounded-3xl bg-white border border-line p-4 sm:p-5">
          <div className="flex items-center justify-between"><h2 className="font-display text-[18px] font-bold text-ink">Recursos para ti</h2><button className="text-[13px] font-bold text-violet-d hover:underline" onClick=${() => go('recursos')}>Ver todos</button></div>
          <p className="text-[13px] text-mute mt-0.5">Según tus grados (${me.grades.map(gradeLabel).join(', ')}) y área</p>
          <ul className="mt-3 grid gap-2">${recRes.map(r => html`<li key=${r.id}><button className="w-full flex items-center gap-3 rounded-2xl p-2 text-left hover:bg-mist transition" onClick=${() => ctx.openResource(r.id)}>
            <span className="grid place-items-center w-12 h-12 rounded-xl shrink-0" style=${{ background: AREA_STYLE[r.area].bg, color: AREA_STYLE[r.area].c }}><${Icon} name=${AREA_STYLE[r.area].icon} size=${20} /></span>
            <span className="min-w-0"><span className="block font-bold text-ink text-[14px] leading-snug line-clamp-2">${r.title}</span><span className="block text-[12.5px] text-mute mt-0.5">${TYPE_ONE[r.type]} · ${r.grades.map(gradeLabel).join(' ')}</span></span>
          </button></li>`)}</ul>
        </section>
        <section className="rounded-3xl bg-white border border-line p-4 sm:p-5">
          <div className="flex items-center justify-between"><h2 className="font-display text-[18px] font-bold text-ink">Cursos destacados</h2><button className="text-[13px] font-bold text-violet-d hover:underline" onClick=${() => go('cursos')}>Ver todos</button></div>
          <ul className="mt-3 grid gap-3">${courseList.map(c => { const p = courseProg(c, ud); return html`<li key=${c.id}><button className="w-full rounded-2xl border border-line p-3 text-left hover:border-violet/30 transition" onClick=${() => ctx.openCourse(c.id)}>
            <div className="flex items-center gap-3"><span className="grid place-items-center w-10 h-10 rounded-xl text-white shrink-0" style=${{ background: c.color }}><${Icon} name=${c.icon} size=${18} /></span><span className="min-w-0"><span className="block font-bold text-ink text-[14px] leading-snug">${c.title}</span><span className="block text-[12.5px] text-mute">${p.done ? p.done + ' de ' + p.total + ' lecciones' : c.duration + ' · ' + c.modules.length + ' módulos'}</span></span></div>
            ${p.done > 0 && html`<${Progress} value=${p.pct} color=${c.color} className="mt-3" />`}
          </button></li>`; })}</ul>
        </section>
        <section className="rounded-3xl bg-white border border-line p-4 sm:p-5">
          <div className="flex items-center justify-between"><h2 className="font-display text-[18px] font-bold text-ink">Próximos eventos</h2><button className="text-[13px] font-bold text-violet-d hover:underline" onClick=${() => go('eventos')}>Agenda</button></div>
          <div className="mt-3 grid gap-2">${evs.map(e => html`<${EventRow} key=${e.id} e=${e} ctx=${ctx} compact />`)}</div>
        </section>
        <${DanielNote}>Quizá la experiencia que necesitas ya la vivió otro profe. Y si no, puede que la tuya sea la que alguien está buscando.<//>
      </aside>
    </div>
  </div>`;
}

/* ===================== BUSCADOR ===================== */
function SearchBox({ ctx, onDone, autoFocus = false }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const s = q.trim().toLowerCase();
  const res = s.length > 1 ? {
    r: RESOURCES.filter(r => (r.title + ' ' + r.desc + ' ' + r.area + ' ' + r.proc.join(' ') + ' ' + (r.tool || '')).toLowerCase().includes(s)).slice(0, 4),
    p: ctx.posts.filter(p => (p.title + ' ' + p.body).toLowerCase().includes(s)).slice(0, 3),
    c: COURSES.filter(c => (c.title + ' ' + c.desc).toLowerCase().includes(s)).slice(0, 2),
  } : null;
  const total = res ? res.r.length + res.p.length + res.c.length : 0;
  const pick = fn => { fn(); setQ(''); setOpen(false); onDone && onDone(); };
  const Row = ({ icon, t, sub, fn }) => html`<li><button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-mist" onMouseDown=${e => e.preventDefault()} onClick=${() => pick(fn)}><span className="grid place-items-center w-8 h-8 rounded-lg bg-mist text-ink/70 shrink-0"><${Icon} name=${icon} size=${15} /></span><span className="min-w-0"><span className="block text-[14px] font-semibold text-ink truncate">${t}</span><span className="block text-[12px] text-mute truncate">${sub}</span></span></button></li>`;
  return html`<div className="relative w-full">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute pointer-events-none"><${Icon} name="search" size=${17} /></span>
    <label htmlFor="global-search" className="sr-only">Buscar en KURIOSITY</label>
    <input id="global-search" autoFocus=${autoFocus} className=${inputC + ' pl-10 !py-2 !rounded-full !bg-mist focus:!bg-white border-transparent'} placeholder="Buscar recursos, cursos o publicaciones" value=${q} onChange=${e => { setQ(e.target.value); setOpen(true); }} onFocus=${() => setOpen(true)} onBlur=${() => setTimeout(() => setOpen(false), 120)} onKeyDown=${e => { if (e.key === 'Enter' && s) pick(() => ctx.goPost(q)); }} />
    ${open && res && html`<div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl bg-white border border-line shadow-xl p-2 max-h-[70vh] overflow-y-auto pop">
      ${total === 0 ? html`<p className="px-3 py-3 text-[14px] text-mute">Sin resultados para “${q}”. Prueba con otra palabra o pregúntale a la comunidad.</p>` : null}
      ${res.r.length > 0 && html`<p className="px-3 pt-1 pb-1 text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Recursos</p><ul>${res.r.map(r => html`<${Row} key=${r.id} icon="book" t=${r.title} sub=${TYPE_ONE[r.type] + ' · ' + r.area} fn=${() => ctx.openResource(r.id)} />`)}</ul>`}
      ${res.c.length > 0 && html`<p className="px-3 pt-2 pb-1 text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Cursos</p><ul>${res.c.map(c => html`<${Row} key=${c.id} icon="cap" t=${c.title} sub=${c.duration + ' · ' + c.modules.length + ' módulos'} fn=${() => ctx.openCourse(c.id)} />`)}</ul>`}
      ${res.p.length > 0 && html`<p className="px-3 pt-2 pb-1 text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Comunidad</p><ul>${res.p.map(p => html`<${Row} key=${p.id} icon="message" t=${p.title} sub=${p.cat} fn=${() => ctx.goPost(p.title)} />`)}</ul>`}
    </div>`}
  </div>`;
}

/* ===================== ESTRUCTURA DE LA APP ===================== */
const NAV = [['inicio', 'home', 'Inicio'], ['recursos', 'book', 'Recursos para el aula'], ['cursos', 'cap', 'Cursos para docentes'], ['comunidad', 'users', 'Comunidad'], ['eventos', 'calendar', 'Eventos'], ['guardados', 'bookmark', 'Mis guardados'], ['perfil', 'user', 'Mi perfil']];
const MOBILE_NAV = [['inicio', 'home', 'Inicio'], ['recursos', 'book', 'Recursos'], ['comunidad', 'users', 'Comunidad'], ['cursos', 'cap', 'Cursos'], ['perfil', 'user', 'Perfil']];

function NavList({ section, go, ud, onPick }) {
  return html`<ul className="grid gap-0.5">${NAV.map(([k, i, l]) => html`<li key=${k}><button onClick=${() => { go(k); onPick && onPick(); }} aria-current=${section === k ? 'page' : undefined} className=${cx('w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition', section === k ? 'bg-white/[.12] text-white' : 'text-white/70 hover:text-white hover:bg-white/[.06]')}>
    <span className=${cx('grid place-items-center w-8 h-8 rounded-lg transition', section === k ? 'bg-teal text-ink' : 'text-white/80')}><${Icon} name=${i} size=${18} /></span>${l}
    ${k === 'guardados' && (ud.savedRes.length + ud.savedPosts.length) > 0 && html`<span className="ml-auto font-mono text-[12px] text-white/60">${ud.savedRes.length + ud.savedPosts.length}</span>`}
  </button></li>`)}</ul>`;
}

function AppShell({ ctx, me, onLogout, onLanding, onInfo, welcomeOpen, onWelcomeGo, onWelcomeExplore }) {
  const { section, go, ud } = ctx;
  const guideKey = section === 'cursos' && ctx.courseId ? 'curso' : section;
  const [guide, setGuide] = useState(null);
  const [bubble, setBubble] = useState(null);
  const bubbleTimer = useRef(null);
  const lastCheer = useRef(-1);
  const sayCheer = (delay = 900) => {
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => {
      let i; do { i = Math.floor(Math.random() * DANIEL_CHEERS.length); } while (i === lastCheer.current && DANIEL_CHEERS.length > 1);
      lastCheer.current = i; setBubble(DANIEL_CHEERS[i]);
      bubbleTimer.current = setTimeout(() => setBubble(null), 7000);
    }, delay);
  };
  useEffect(() => () => clearTimeout(bubbleTimer.current), []);
  // Cada vez que el docente entra a una sección: guía automática la primera vez; después, una frase de aliento.
  useEffect(() => {
    if (welcomeOpen) return;
    if (!ud.guidesOff && !ud.guides[guideKey] && GUIDES[guideKey]) { setBubble(null); const t = setTimeout(() => setGuide({ key: guideKey, step: 0 }), 450); return () => clearTimeout(t); }
    setGuide(g => (g && g.key !== guideKey ? null : g));
    sayCheer();
  }, [guideKey, welcomeOpen]);
  const closeGuide = () => { if (guide) ctx.markGuide(guide.key); setGuide(null); };
  const muteGuides = () => { if (guide) ctx.markGuide(guide.key); ctx.muteGuides(); setGuide(null); ctx.toast('Listo. Si me necesitas, toca mi foto en la esquina.', 'info'); };
  const openGuide = () => { setBubble(null); setGuide({ key: guideKey, step: 0 }); };
  const [drawer, setDrawer] = useState(false);
  const [mSearch, setMSearch] = useState(false);
  const person = ctx.authorOf(me.email, true);
  const title = (NAV.find(n => n[0] === section) || [])[2];
  let body;
  if (section === 'inicio') body = html`<${Dashboard} ctx=${ctx} />`;
  else if (section === 'recursos') body = html`<${Resources} ctx=${ctx} />`;
  else if (section === 'cursos') body = html`<${Courses} ctx=${ctx} courseId=${ctx.courseId} setCourseId=${ctx.setCourseId} />`;
  else if (section === 'comunidad') body = html`<${Community} ctx=${ctx} initialQuery=${ctx.communityQuery} />`;
  else if (section === 'eventos') body = html`<${Events} ctx=${ctx} />`;
  else if (section === 'guardados') body = html`<${Saved} ctx=${ctx} />`;
  else body = html`<${Profile} ctx=${ctx} />`;
  const sideFooter = html`<div className="grid gap-3">
    <div className="rounded-2xl bg-white/[.06] border border-white/10 p-3.5 flex gap-3">
      <${DanielAvatar} size=${34} />
      <p className="text-[13px] text-white/75 leading-snug">“No tengo todas las respuestas. Por eso estoy aquí con ustedes.”</p>
    </div>
    <div className="flex items-center gap-2.5 px-1">
      <${Avatar} person=${person} size=${36} />
      <div className="min-w-0 flex-1"><p className="text-[14px] font-bold text-white truncate">${me.name}</p><p className="text-[12px] text-teal flex items-center gap-1"><${Icon} name="shield" size=${12} /> Docente verificado</p><button onClick=${() => go('perfil')} className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/15 px-2 py-0.5 text-[11.5px] font-bold text-sun tabular-nums"><${Icon} name="star" size=${11} fill="currentColor" />${fmtPts(sumPoints(ud.points))} pts · ${levelOf(sumPoints(ud.points)) ? 'Nivel ' + levelOf(sumPoints(ud.points)) : 'Sin nivel'}</button></div>
      <button onClick=${onLogout} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" aria-label="Cerrar sesión" title="Cerrar sesión"><${Icon} name="logout" size=${18} /></button>
    </div>
    <button onClick=${onInfo} className="text-left text-[12px] text-sun/90 hover:text-sun inline-flex items-center gap-1.5 px-1"><${Icon} name="info" size=${13} /> Prototipo · verificación simulada</button>
  </div>`;
  return html`<div className="min-h-full bg-mist">
    <aside className="hidden lg:flex fixed left-0 bottom-0 top-[env(safe-area-inset-top,0px)] w-[260px] flex-col bg-ink px-4 py-5 z-40">
      <div className="px-2"><${Logo} light onClick=${onLanding} /></div>
      <p className="px-3 mt-1 text-[12px] text-white/45">Comunidad docente</p>
      <nav data-guide="nav" className="mt-6 flex-1 overflow-y-auto rounded-2xl" aria-label="Secciones">
        <${NavList} section=${section} go=${go} ud=${ud} />
        <button className=${btnTeal + ' w-full mt-5'} onClick=${() => ctx.openComposer({})}><${Icon} name="plus" size=${17} /> Compartir una experiencia</button>
      </nav>
      ${sideFooter}
    </aside>

    <div className="lg:pl-[260px]">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 bg-mist/90 backdrop-blur border-b border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <button className="lg:hidden p-2 -ml-2 rounded-xl text-ink hover:bg-ink/5" onClick=${() => setDrawer(true)} aria-label="Abrir menú"><${Icon} name="menu" size=${22} /></button>
          <div className="lg:hidden"><${Logo} small onClick=${() => go('inicio')} /></div>
          <div className="hidden sm:block flex-1 max-w-md lg:ml-0"><${SearchBox} ctx=${ctx} /></div>
          <div className="ml-auto flex items-center gap-2">
            <button className="sm:hidden p-2 rounded-xl text-ink hover:bg-ink/5" onClick=${() => setMSearch(true)} aria-label="Buscar"><${Icon} name="search" size=${21} /></button>
            <button className=${btnP + ' hidden sm:inline-flex !py-2'} onClick=${() => ctx.openComposer({})}><${Icon} name="plus" size=${17} /> Compartir</button>
            <button onClick=${() => go('perfil')} aria-label="Mi perfil" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"><${Avatar} person=${person} size=${36} /></button>
          </div>
        </div>
        ${mSearch && html`<div className="sm:hidden px-4 pb-3 flex gap-2 items-center"><${SearchBox} ctx=${ctx} autoFocus onDone=${() => setMSearch(false)} /><button className=${btnG} onClick=${() => setMSearch(false)}>Cerrar</button></div>`}
      </header>
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-12" key=${section}>
        <nav className="text-[13px] text-mute mb-3 flex items-center gap-1" aria-label="Ubicación"><button className="hover:text-ink" onClick=${() => go('inicio')}>Inicio</button>${section !== 'inicio' && html`<span className="flex items-center gap-1"><${Icon} name="chev" size=${13} /><button className="hover:text-ink" onClick=${() => { if (section === 'cursos') ctx.setCourseId(null); }}>${title}</button></span>`}${section === 'cursos' && ctx.courseId && html`<span className="flex items-center gap-1 min-w-0"><${Icon} name="chev" size=${13} /><span className="text-ink truncate">${COURSE_BY_ID[ctx.courseId].title}</span></span>`}</nav>
        <div className="fade-up">${body}</div>
      </main>
    </div>

    <nav data-guide="mnav" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom,0px)]" aria-label="Navegación principal">
      <ul className="grid grid-cols-5">${MOBILE_NAV.map(([k, i, l]) => html`<li key=${k}><button onClick=${() => go(k)} aria-current=${section === k ? 'page' : undefined} className=${cx('w-full flex flex-col items-center gap-0.5 pt-2 pb-2 text-[11.5px] font-bold transition', section === k ? 'text-violet-d' : 'text-mute')}>
        <span className=${cx('grid place-items-center w-12 h-7 rounded-full transition', section === k && 'bg-violet-soft')}><${Icon} name=${i} size=${20} /></span>${l}</button></li>`)}</ul>
    </nav>

    ${drawer && html`<div className="lg:hidden fixed inset-0 z-[55]" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="absolute inset-0 bg-ink/60 fade" onClick=${() => setDrawer(false)}></div>
      <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-[320px] bg-ink px-4 pb-5 pt-[calc(20px+env(safe-area-inset-top,0px))] flex flex-col slide-in overflow-y-auto">
        <div className="flex items-center justify-between px-2"><${Logo} light onClick=${() => { setDrawer(false); onLanding(); }} /><button className="p-2 rounded-lg text-white/80 hover:bg-white/10" onClick=${() => setDrawer(false)} aria-label="Cerrar menú"><${Icon} name="x" size=${20} /></button></div>
        <nav className="mt-6 flex-1"><${NavList} section=${section} go=${go} ud=${ud} onPick=${() => setDrawer(false)} />
          <button className=${btnTeal + ' w-full mt-5'} onClick=${() => { setDrawer(false); ctx.openComposer({}); }}><${Icon} name="plus" size=${17} /> Compartir una experiencia</button></nav>
        <div className="mt-6">${sideFooter}</div>
      </div>
    </div>`}

    <${DanielWelcome} open=${welcomeOpen} name=${me.name.split(' ')[0]} onGo=${() => { onWelcomeGo(); }} onExplore=${() => { ctx.markGuide('inicio'); onWelcomeExplore(); }} />
    <${DanielGuide} guide=${guide} onStep=${n => setGuide({ ...guide, step: n })} onClose=${closeGuide} onMute=${muteGuides} />
    <${DanielFab} hidden=${welcomeOpen || !!guide || drawer} onGuide=${openGuide} bubble=${bubble} onCloseBubble=${() => { clearTimeout(bubbleTimer.current); setBubble(null); }} />
  </div>`;
}

/* ===================== APP ===================== */
const LS_KEY = 'kuriozity-demo-v3';
function loadDb() { try { const r = localStorage.getItem(LS_KEY); if (!r) return null; const d = JSON.parse(r); return d && d.v === 3 ? d : null; } catch (e) { return null; } }
function saveDb(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) { try { localStorage.setItem(LS_KEY, JSON.stringify({ ...d, posts: d.posts.map(p => ({ ...p, image: null })) })); } catch (x) {} } }
const emptyUD = () => ({ savedRes: [], savedPosts: [], likes: [], progress: {}, events: [], viewed: [], commented: false, cocreated: false, guides: {}, guidesOff: false, points: [] });
const PALETTE = ['#0B7F74', '#5B3BE0', '#A61E55', '#B4470E', '#24356F', '#0E6E8C', '#2F7D32'];

function App() {
  const [db, setDb] = useState(() => loadDb() || seedDb());
  useEffect(() => { saveDb(db); }, [db]);
  const [pub, setPub] = useState('landing');
  const [authTab, setAuthTab] = useState('login');
  const [peekLanding, setPeekLanding] = useState(false);
  const [section, setSection] = useState('inicio');
  const [courseId, setCourseId] = useState(null);
  const [communityQuery, setCommunityQuery] = useState('');
  const [resId, setResId] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [composer, setComposer] = useState(null);
  const [shareId, setShareId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [info, setInfo] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [levelUp, setLevelUp] = useState(null);
  const [earned, setEarned] = useState(null);

  const me = db.session ? db.accounts[db.session] : null;
  const ud = me ? { ...emptyUD(), ...(db.user[me.email] || {}) } : emptyUD();
  const verified = me && me.emailVerified && me.teacherStatus === 'verified';
  let screen;
  if (!me) screen = pub;
  else if (peekLanding) screen = 'landing';
  else if (!me.profileComplete) screen = 'complete';
  else if (!verified || justVerified) screen = 'verify';
  else screen = 'app';

  useEffect(() => { window.scrollTo(0, 0); }, [screen, section, courseId]);

  const toast = (msg, tone) => { const id = Math.random().toString(36).slice(2); setToasts(t => [...t.slice(-2), { id, msg, tone }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200); };
  const updAccount = (email, patch) => setDb(d => ({ ...d, accounts: { ...d.accounts, [email]: { ...d.accounts[email], ...patch } } }));
  const updUD = fn => setDb(d => { const cur = { ...emptyUD(), ...(d.user[d.session] || {}) }; return { ...d, user: { ...d.user, [d.session]: fn(cur) } }; });
  const togg = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const newAccount = (f, extra) => ({ email: f.email, name: f.name.trim(), institution: (f.institution || '').trim(), city: (f.city || '').trim(), areas: f.areas || [], grades: f.grades || [], bio: '', photo: null, color: PALETTE[Math.floor(Math.random() * PALETTE.length)], welcomeSeen: false, visibility: { institution: true, city: true, areas: true, grades: true, bio: true }, createdAt: new Date().toISOString(), ...extra });

  const authActions = {
    login: email => { setDb(d => ({ ...d, session: email })); setPeekLanding(false); setSection('inicio'); setCourseId(null); },
    google: (email, name) => {
      setDb(d => d.accounts[email] ? { ...d, session: email } : { ...d, session: email, accounts: { ...d.accounts, [email]: newAccount({ email, name }, { method: 'google', emailVerified: true, teacherStatus: 'none', profileComplete: false, reviewPath: null }) } });
      setPeekLanding(false); setSection('inicio');
      toast('Google confirmó tu correo (simulado).');
    },
    register: (f, manual, kind) => {
      setDb(d => ({ ...d, session: f.email, accounts: { ...d.accounts, [f.email]: newAccount(f, { method: 'email', emailVerified: false, teacherStatus: 'pending', profileComplete: true, reviewPath: kind === 'institutional' && !manual ? 'domain' : 'manual', manual }) } }));
      setPeekLanding(false); setSection('inicio');
      toast('Cuenta creada. Te enviamos un enlace de verificación (simulado).', 'info');
    },
    completeProfile: (f, manual, kind) => { updAccount(me.email, { name: f.name.trim(), institution: f.institution.trim(), city: f.city.trim(), areas: f.areas, grades: f.grades, profileComplete: true, teacherStatus: 'pending', reviewPath: kind === 'institutional' && !manual ? 'domain' : 'manual', manual }); toast('Perfil enviado a revisión.'); },
    verifyEmail: () => { updAccount(me.email, { emailVerified: true }); toast('Correo verificado.'); },
    approveTeacher: () => { updAccount(me.email, { teacherStatus: 'verified' }); setJustVerified(true); toast('Condición docente aprobada.'); },
    enter: () => { setJustVerified(false); setSection('inicio'); setPeekLanding(false); },
    logout: () => { setJustVerified(false); setDb(d => ({ ...d, session: null })); setPub('landing'); setPeekLanding(false); setSection('inicio'); setCourseId(null); toast('Cerraste sesión. Tus datos de demostración siguen guardados en este navegador.', 'info'); },
    toLanding: () => setPeekLanding(true),
  };

  const authorOf = (id, self = false) => {
    if (T[id]) return T[id];
    const a = db.accounts[id];
    if (!a) return { name: 'Docente', color: '#24356F' };
    const v = a.visibility || {};
    const own = self || (me && id === me.email);
    return { name: a.name, photo: a.photo, color: a.color, inst: (own || v.institution) ? a.institution : null, city: (own || v.city) ? a.city : null };
  };

  const ctx = me ? {
    me, ud, posts: db.posts, section, courseId, setCourseId, communityQuery, toast, authorOf,
    go: s => { setSection(s); if (s !== 'cursos') setCourseId(null); if (s !== 'comunidad') setCommunityQuery(''); },
    goPost: q => { setCommunityQuery(q); setSection('comunidad'); },
    openResource: id => { setResId(id); updUD(u => u.viewed.includes(id) ? u : { ...u, viewed: [...u.viewed, id] }); },
    openCourse: id => { setResId(null); setCourseId(id); setSection('cursos'); },
    openEvent: id => setEventId(id),
    openComposer: init => setComposer(init || {}),
    openShare: id => setShareId(id),
    toggleSaveRes: id => { const was = ud.savedRes.includes(id); updUD(u => ({ ...u, savedRes: togg(u.savedRes, id) })); toast(was ? 'Recurso quitado de tus guardados.' : 'Recurso guardado en Mis guardados.'); },
    toggleSavePost: id => { const was = ud.savedPosts.includes(id); updUD(u => ({ ...u, savedPosts: togg(u.savedPosts, id) })); toast(was ? 'Publicación quitada de tus guardados.' : 'Publicación guardada.'); },
    toggleLike: id => updUD(u => ({ ...u, likes: togg(u.likes, id) })),
    toggleEvent: id => { const was = ud.events.includes(id); updUD(u => ({ ...u, events: togg(u.events, id) })); toast(was ? 'Evento quitado de tu agenda.' : 'Evento agregado a tu agenda.'); },
    toggleLesson: (cid, lid) => updUD(u => { const cur = u.progress[cid] || []; return { ...u, progress: { ...u.progress, [cid]: togg(cur, lid) } }; }),
    addComment: (pid, text) => { setDb(d => ({ ...d, posts: d.posts.map(p => p.id === pid ? { ...p, comments: [...p.comments, { id: 'c' + Date.now(), a: me.email, t: text, d: new Date().toISOString() }] } : p) })); updUD(u => ({ ...u, commented: true })); },
    download: r => toast('Descarga simulada: ' + r.file.name, 'info'),
    updateMe: patch => updAccount(me.email, patch),
    markGuide: k => updUD(u => ({ ...u, guides: { ...u.guides, [k]: true } })),
    muteGuides: () => updUD(u => ({ ...u, guidesOff: true })),
    resetGuides: () => { updUD(u => ({ ...u, guides: {}, guidesOff: false })); toast('Daniel volverá a guiarte en cada sección.'); },
    shareSocial: (post, net) => {
      const today = new Date().toDateString();
      const sharesToday = (ud.points || []).filter(e => e.type === 'share' && new Date(e.date).toDateString() === today).length;
      if (sharesToday >= SHARE_DAILY_MAX) { toast(`Compartida en ${net} (simulado). Ya sumaste los ${SHARE_DAILY_MAX} puntos de hoy por compartir.`, 'info'); return; }
      award('share', `Compartiste en ${net}: ${post.title.length > 60 ? post.title.slice(0, 60) + '…' : post.title}`, post.id);
    },
    resetDemo: () => { try { localStorage.removeItem(LS_KEY); } catch (e) {} setDb(seedDb()); setPub('landing'); setSection('inicio'); setCourseId(null); toast('Demostración restablecida.'); },
  } : null;

  const award = (type, label, postId) => {
    const before = sumPoints(ud.points);
    const pts = POINTS[type];
    const entry = { id: 'pt' + Date.now() + Math.random().toString(36).slice(2, 5), type, pts, label, post: postId, date: new Date().toISOString() };
    updUD(u => ({ ...u, points: [...(u.points || []), entry] }));
    const lb = levelOf(before), la = levelOf(before + pts);
    if (la > lb) setTimeout(() => setLevelUp(LEVELS[la - 1]), 700);
    else if (type === 'share') toast(`+${pts} punto · ${POINT_LABEL[type]}`);
    else setTimeout(() => setEarned({ type, pts, before, after: before + pts }), 650);
  };

  const publish = f => {
    const post = { ...f, id: 'p' + Date.now(), author: me.email, date: new Date().toISOString(), likes: 0, comments: [] };
    setDb(d => ({ ...d, posts: [post, ...d.posts] }));
    if (f.linkedPost) updUD(u => ({ ...u, cocreated: true }));
    setComposer(null);
    setCommunityQuery('');
    if (section !== 'comunidad' && section !== 'inicio') setSection('comunidad');
    const replica = isReplica(f, me, db.posts) && hasProcess(f);
    const short = f.title.length > 60 ? f.title.slice(0, 60) + '…' : f.title;
    setTimeout(() => award(replica ? 'replicate' : 'publish', (replica ? 'Replicaste en tu contexto: ' : 'Publicaste: ') + short, post.id), 350);
    toast(f.linkedResource ? 'Publicada y vinculada al recurso. ¡Gracias por compartir!' : 'Publicada en la comunidad.');
  };

  let view;
  if (screen === 'landing') view = html`<${Landing} session=${!!me} onJoin=${() => { setAuthTab('register'); setPub('auth'); }} onLogin=${() => { setAuthTab('login'); setPub('auth'); }} onEnter=${() => setPeekLanding(false)} onInfo=${() => setInfo(true)} />`;
  else if (screen === 'auth') view = html`<${AuthScreen} tab=${authTab} setTab=${setAuthTab} accounts=${db.accounts} actions=${authActions} onBack=${() => setPub('landing')} onInfo=${() => setInfo(true)} />`;
  else if (screen === 'complete') view = html`<${CompleteProfile} me=${me} actions=${authActions} onInfo=${() => setInfo(true)} />`;
  else if (screen === 'verify') view = html`<${VerifyScreen} me=${me} actions=${authActions} toast=${toast} onInfo=${() => setInfo(true)} />`;
  else view = html`<${AppShell} ctx=${ctx} me=${me} onLogout=${authActions.logout} onLanding=${authActions.toLanding} onInfo=${() => setInfo(true)}
      welcomeOpen=${!me.welcomeSeen} onWelcomeGo=${() => { updAccount(me.email, { welcomeSeen: true }); setSection('inicio'); }} onWelcomeExplore=${() => updAccount(me.email, { welcomeSeen: true })} />`;

  return html`<div className="min-h-full">
    ${view}
    ${ctx && screen === 'app' && html`<div>
      <${ResourceModal} id=${resId} ctx=${ctx} onClose=${() => setResId(null)} />
      <${EventModal} id=${eventId} ctx=${ctx} onClose=${() => setEventId(null)} />
      <${Composer} open=${!!composer} init=${composer} me=${me} posts=${db.posts} onClose=${() => setComposer(null)} onPublish=${publish} />
      <${ShareModal} post=${shareId && db.posts.find(p => p.id === shareId)} onClose=${() => setShareId(null)} toast=${toast} onSocial=${ctx.shareSocial} />
      <${PointsEarnedModal} data=${earned} onClose=${() => setEarned(null)} onSee=${() => { setEarned(null); ctx.go('perfil'); }} />
      <${LevelUpModal} level=${levelUp} onClose=${() => setLevelUp(null)} onSee=${() => { setLevelUp(null); ctx.go('perfil'); }} />
    </div>`}
    <${PrototypeInfo} open=${info} onClose=${() => setInfo(false)} />
    <${Toasts} items=${toasts} />
  </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
