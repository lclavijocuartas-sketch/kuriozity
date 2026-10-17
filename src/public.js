/* ===================== PÁGINA PÚBLICA ===================== */
function Landing({ session, onJoin, onLogin, onEnter, onInfo }) {
  const [story, setStory] = useState(null);
  const go = id => { const el = document.getElementById(id); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const links = [['daniel', 'Daniel'], ['universo', 'El universo'], ['historias', 'Historias'], ['comunidad', 'Comunidad docente']];
  const s = story && STORIES.find(x => x.id === story);
  return html`<div className="bg-white">
    <header className="fixed inset-x-0 top-0 pt-[env(safe-area-inset-top,0px)] z-40 bg-ink/95 backdrop-blur border-b border-white/10 shadow-[0_8px_24px_-16px_rgba(0,0,0,.6)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <${Logo} light onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <nav className="hidden md:flex items-center gap-1 text-white/80 text-[15px]" aria-label="Menú principal">
          ${links.map(([id, l]) => html`<button key=${id} onClick=${() => go(id)} className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition">${l}</button>`)}
        </nav>
        <div className="flex items-center gap-2">
          <button className=${btn + ' cta-grad cta-pulse pulse-white text-white font-bold px-4 py-2 text-[14.5px] whitespace-nowrap hover:-translate-y-0.5'} onClick=${session ? onEnter : onLogin}>${session ? 'Ir a la comunidad' : 'Ingresa a la comunidad'} <${Icon} name="arrow" size=${16} /></button>
        </div>
      </div>
      <nav className="md:hidden flex gap-1 overflow-x-auto px-3 pb-2 -mt-1 text-white/80 text-[14px] no-scrollbar" aria-label="Menú principal">
        ${links.map(([id, l]) => html`<button key=${id} onClick=${() => go(id)} className="px-3 py-1.5 rounded-full bg-white/[.07] whitespace-nowrap">${l}</button>`)}
      </nav>
    </header>
    <div className="h-[102px] md:h-16 bg-ink" aria-hidden="true"></div>

    <section className="relative overflow-hidden bg-ink text-white hero-bg">
      <div className="qmarks" aria-hidden="true">${['?', '¿', '?', '?', '¿'].map((q, i) => html`<span key=${i} className=${'qm qm' + i}>${q}</span>`)}</div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24 grid lg:grid-cols-[1.12fr_.88fr] gap-12 items-center">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[.2em] text-teal">Experiencia transmedia · Colombia</p>
          <h1 className="font-display font-extrabold text-[clamp(2.35rem,6.2vw,4.5rem)] leading-[1.02] tracking-[-.02em] mt-4 balance">El futuro de la educación comienza con <span className="text-teal">una pregunta</span>.</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-white/80 max-w-xl">¿Y si recuperar la curiosidad fuera el primer paso para transformar la manera en que aprendemos? Kuriozity es una experiencia transmedia que conecta historias, preguntas y personas que creen en otras formas de enseñar y aprender.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className=${btn + ' cta-grad cta-pulse pulse-white text-white font-bold px-5 py-3 text-[16px] hover:-translate-y-0.5'} onClick=${session ? onEnter : onJoin}>Únete a la comunidad docente <${Icon} name="arrow" size=${18} /></button>
            <button className=${btn + ' border border-white/25 text-white hover:bg-white/10 px-5 py-3 text-[16px]'} onClick=${() => go('universo')}>Conoce Kuriozity</button>
          </div>
          <p className="mt-7 flex items-center gap-2 text-white/60 text-[14px]"><span className="w-8 h-px bg-white/30"></span>Transformemos el aula juntos.</p>
        </div>
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="rounded-[28px] bg-white/[.07] border border-white/15 p-5 backdrop-blur-md shadow-2xl rotate-[-1.5deg]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[.16em] text-white/60">Serie · Ep. 1</span>
              <span className="inline-flex items-center gap-1 text-[12px] text-teal"><span className="w-1.5 h-1.5 rounded-full bg-teal pulse"></span> Próximamente</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <${DanielAvatar} size=${76} />
              <div><p className="font-display text-[22px] font-bold leading-tight">El aula en silencio</p><p className="text-white/65 text-[14px]">Con Daniel, profe de 45 años</p></div>
            </div>
            <blockquote className="mt-5 font-display text-[20px] leading-snug text-white/95">“¿En qué momento dejamos de hacer preguntas en clase?”</blockquote>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-teal text-ink"><${Icon} name="play" size=${16} fill="currentColor" /></span>
              <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden"><div className="h-full w-1/3 bg-teal rounded-full"></div></div>
              <span className="font-mono text-[12px] text-white/60">04:12</span>
            </div>
          </div>
          <div className="absolute -left-4 -bottom-8 sm:-left-10 rounded-2xl bg-white text-ink px-4 py-3 shadow-xl rotate-[3deg] flex items-center gap-3 max-w-[240px]">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-violet-soft text-violet-d"><${Icon} name="mic" size=${18} /></span>
            <div><p className="text-[12px] text-mute">Pódcast</p><p className="font-bold text-[14px] leading-tight">Preguntas de recreo</p></div>
          </div>
          <div className="absolute -right-2 -top-6 sm:-right-6 rounded-2xl bg-sun text-ink px-3.5 py-2.5 shadow-xl rotate-[4deg] font-bold text-[13px] flex items-center gap-2">
            <${Icon} name="users" size=${16} /> +1.200 docentes
          </div>
        </div>
      </div>
    </section>

    <section id="por-que" className="scroll-mt-32 md:scroll-mt-20 bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[.18em] text-violet-d">Por qué ahora</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-ink leading-[1.08] mt-3 balance">Desde 2015, la comprensión lectora de nuestros estudiantes no ha dejado de caer.</h2>
          <p className="mt-5 text-[17px] text-ink/75 leading-relaxed max-w-prose">El deterioro empezó antes de la inteligencia artificial y antes de TikTok. El problema no es la herramienta: es la calidad del aprendizaje. Kuriozity apuesta por un aprendizaje significativo, en el que importa el proceso de pensar y no solo la tarea entregada, sin importar si la chispa vino de un libro, un video o la IA.</p>
        </div>
        <div className="rounded-[28px] bg-ink text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 hero-bg" aria-hidden="true"></div>
          <div className="relative">
            <p className="text-[13px] font-bold text-white/65">Puntaje promedio de Colombia en lectura · PISA</p>
            <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Lectura: 425 en 2015, 412 en 2018, 409 en 2022, 399 en 2025">
              ${[['2015', 425], ['2018', 412], ['2022', 409], ['2025', 399]].map(([y, v], i) => html`<li key=${y} className="flex flex-col">
                <span className=${cx('font-display font-extrabold leading-none tabular-nums', i === 3 ? 'text-teal text-[clamp(2rem,6vw,2.9rem)]' : 'text-white/85 text-[clamp(1.5rem,4.4vw,2.1rem)]')}>${v}</span>
                <span className="mt-1.5 font-mono text-[12px] text-white/55">${y}</span>
              </li>`)}
            </ol>
            <p className="mt-2 text-[13.5px] text-white/70">Promedio OCDE 2025: 461</p>
            <div className="mt-6 pt-5 border-t border-white/15 grid sm:grid-cols-2 gap-4">
              <p className="text-[15px] leading-snug"><span className="block font-display text-[26px] font-extrabold text-sun">Más de la mitad</span>de los estudiantes no alcanza el nivel básico de lectura.</p>
              <p className="text-[15px] leading-snug"><span className="block font-display text-[26px] font-extrabold text-sun">7 de cada 10</span>no alcanzan el nivel básico en matemáticas.</p>
            </div>
            <p className="mt-5 text-[12px] text-white/50">Fuente: OCDE, resultados PISA 2015 a 2025 para Colombia.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="daniel" className="scroll-mt-32 md:scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-[auto_1fr] gap-10 items-center">
      <div className="relative mx-auto">
        <${DanielAvatar} size=${220} className="shadow-2xl" />
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink text-white px-4 py-1.5 text-[13px] font-bold">Daniel · 45 años · profe</span>
      </div>
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[.18em] text-violet-d">El anfitrión</p>
        <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold text-ink mt-2 balance">Daniel no tiene todas las respuestas. Por eso busca colegas.</h2>
        <div className="mt-5 space-y-4 text-[17px] text-ink/75 leading-relaxed max-w-prose">
          <p>Lleva más de veinte años en el aula. Ha visto a sus estudiantes perder el interés, distraerse y conectar más con las redes que con la clase. Algunos colegas le dicen que esta generación es un caso perdido.</p>
          <p>Él no se resigna. Está convencido de que los docentes pueden transformar la experiencia de aprender cuando comparten lo que saben y prueban cosas nuevas juntos. Fue uno de los primeros en llegar a la comunidad, y ahora recibe a quienes llegan después.</p>
        </div>
        <button type="button" onClick=${session ? onEnter : onJoin} className=${btn + ' cta-grad cta-pulse text-white font-bold px-5 py-3 text-[16px] mt-7 hover:-translate-y-0.5'}>${session ? 'Ir a la comunidad' : 'Únete a la comunidad digital'} <${Icon} name="arrow" size=${18} /></button>
      </div>
    </section>

    <section id="universo" className="scroll-mt-32 md:scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-16">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[.18em] text-violet-d">El universo Kuriozity</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold text-ink leading-[1.08] mt-3 balance">Una historia que se cuenta en muchos formatos y se termina de escribir en el aula.</h2>
          <p className="mt-5 text-[17px] text-ink/75 leading-relaxed max-w-prose">Kuriozity cuestiona las prácticas tradicionales de enseñanza y propone otras formas de aprender. Lo hace con una serie, un pódcast, piezas gráficas y una comunidad donde los docentes no solo consumen contenidos: los producen, los reinterpretan y los comparten.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          ${[['film', 'Serie audiovisual', 'La vida de Daniel y su clase de 10.º en episodios cortos.'], ['mic', 'Pódcast', 'Conversaciones sobre las preguntas que no caben en el currículo.'], ['image', 'Piezas gráficas', 'Cómics y carteles para llevar las preguntas a los pasillos.'], ['users', 'Comunidad docente', 'El espacio de prosumo: recursos, cursos y experiencias de aula.']].map(([i, t, d], k) => k === 3 ? html`<button key=${t} type="button" onClick=${session ? onEnter : onLogin} className="group text-left rounded-3xl p-5 border border-ink bg-ink text-white transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(106,69,245,.7)] hover:border-violet focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/50 cta-pulse">
            <span className="flex items-center justify-between"><span className="grid place-items-center w-11 h-11 rounded-2xl bg-teal text-ink"><${Icon} name=${i} size=${20} /></span><span className="grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white group-hover:bg-teal group-hover:text-ink transition"><${Icon} name="arrow" size=${17} /></span></span>
            <span className="block font-display text-[19px] font-bold mt-4">${t}</span>
            <span className="block mt-1.5 text-[15px] leading-snug text-white/75">${d}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-teal group-hover:underline">${session ? 'Ir a la comunidad' : 'Iniciar sesión'} <${Icon} name="arrow" size=${15} /></span>
          </button>` : html`<div key=${t} className="rounded-3xl p-5 border transition hover:-translate-y-0.5 bg-mist border-line">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white text-violet-d"><${Icon} name=${i} size=${20} /></span>
            <p className="font-display text-[19px] font-bold mt-4">${t}</p>
            <p className="mt-1.5 text-[15px] leading-snug text-mute">${d}</p>
          </div>`)}
        </div>
      </div>
      <div className="mt-14 rounded-3xl border border-line p-5 sm:p-7">
        <p className="text-[13px] font-bold text-mute">El recorrido que propone la comunidad</p>
        <ol className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          ${['Descubrir', 'Aprender', 'Aplicar', 'Compartir', 'Cocrear'].map((p, i) => html`<li key=${p} className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-soft px-3.5 py-2 font-display font-bold text-ink text-[15px]"><span className="font-mono text-[11px] text-violet-d">${i + 1}</span>${p}</span>
            ${i < 4 ? html`<span className="text-mute"><${Icon} name="arrow" size=${16} /></span>` : null}
          </li>`)}
        </ol>
        <button type="button" onClick=${session ? onEnter : onLogin} className=${btn + ' cta-grad cta-pulse text-white font-bold px-5 py-3 text-[16px] mt-6 hover:-translate-y-0.5'}>Ingresa a la comunidad ahora <${Icon} name="arrow" size=${18} /></button>
      </div>
    </section>

    <section id="historias" className="scroll-mt-32 md:scroll-mt-20 bg-mist border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-mono text-[12px] uppercase tracking-[.18em] text-violet-d">Conoce sus historias</p>
          <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold text-ink mt-2">Cuatro puertas al mismo relato</h2></div>
          <p className="text-mute text-[14px] max-w-xs">Piezas en desarrollo. Las sinopsis son de demostración.</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${STORIES.map((st, i) => html`<button key=${st.id} onClick=${() => setStory(st.id)} className="group text-left rounded-3xl bg-white border border-line overflow-hidden hover:shadow-lg hover:-translate-y-1 transition flex flex-col">
            <div className=${cx('relative h-36 story-cover', 'sc' + i)}>
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-bold text-ink"><${Icon} name=${st.icon} size=${13} />${st.format}</span>
              <span className="absolute right-4 bottom-1 font-display font-extrabold text-[84px] leading-none text-white/25">${i % 2 ? '¿' : '?'}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-mute">${st.label}</p>
              <p className="font-display text-[19px] font-bold text-ink mt-1 leading-tight">${st.title}</p>
              <p className="text-[14px] text-mute mt-2 line-clamp-3">${st.syn}</p>
              <span className="mt-auto pt-4 inline-flex items-center gap-1 text-[14px] font-bold text-violet-d group-hover:gap-2 transition-all">Ver sinopsis <${Icon} name="chev" size=${15} /></span>
            </div>
          </button>`)}
        </div>
      </div>
    </section>


    <section id="comunidad" className="scroll-mt-32 md:scroll-mt-20 px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="max-w-6xl mx-auto rounded-[32px] bg-ink text-white overflow-hidden relative cta-bg">
        <div className="relative grid lg:grid-cols-[1.1fr_.9fr] gap-10 p-7 sm:p-12">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[.18em] text-teal">Comunidad docente</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-[1.04] mt-3">Transformemos el aula juntos.</h2>
            <p className="mt-4 text-white/75 text-[17px] max-w-lg">Un espacio privado para docentes de secundaria verificados. Encuentra recursos para tus grados, aprende con cursos cortos y comparte lo que pasa en tu aula.</p>
            <button className=${btnTeal + ' cta-pulse pulse-white mt-7 !px-5 !py-3 text-[16px] hover:-translate-y-0.5'} onClick=${session ? onEnter : onLogin}>${session ? 'Ir a la comunidad' : 'Ingresa a la comunidad ahora'} <${Icon} name="arrow" size=${18} /></button>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60"><${Icon} name="shield" size=${15} /> Comunidad con docentes verificados. Accede ahora y encuentra recursos para ti.</p>
          </div>
          <ul className="grid gap-3 self-center">
            ${[['book', 'Recursos para el aula', 'Organizados por grado, de 6.º a 11.º'], ['cap', 'Cursos para docentes', 'Metodologías, TIC, IA, lectura y evaluación'], ['users', 'Comunidad', 'Experiencias, preguntas y versiones nuevas de cada actividad'], ['calendar', 'Eventos', 'Agenda de Medellín, Colombia y virtuales']].map(([i, t, d]) => html`<li key=${t} className="flex items-center gap-4 rounded-2xl bg-white/[.06] border border-white/10 p-4">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 text-teal"><${Icon} name=${i} size=${19} /></span>
              <div><p className="font-bold">${t}</p><p className="text-white/65 text-[14px]">${d}</p></div>
            </li>`)}
          </ul>
        </div>
      </div>
    </section>

    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4">
        <${Logo} small onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <p className="text-[13px] text-mute">Prototipo académico · Maestría en Comunicación Transmedia · Contenidos de demostración</p>
        <${PrototypeBadge} onClick=${onInfo} />
      </div>
    </footer>

    <${Modal} open=${!!s} onClose=${() => setStory(null)} size="max-w-lg" label="Historia">
      ${s && html`<div>
        <${CloseBtn} onClick=${() => setStory(null)} light />
        <div className=${cx('relative h-44 story-cover', 'sc' + STORIES.indexOf(s))}>
          <span className="absolute left-6 bottom-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[13px] font-bold text-ink"><${Icon} name=${s.icon} size=${14} />${s.format} · ${s.label}</span>
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-[26px] font-extrabold text-ink leading-tight">${s.title}</h3>
          <p className="mt-3 text-[16px] text-ink/80 leading-relaxed">${s.syn}</p>
          <p className="mt-4 text-[13px] text-mute rounded-xl bg-mist px-3 py-2">Pieza del universo narrativo en desarrollo. Contenido de demostración.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className=${btnP} onClick=${() => { setStory(null); session ? onEnter() : onJoin(); }}>Continuar en la comunidad <${Icon} name="arrow" size=${16} /></button>
            <button className=${btnS} onClick=${() => setStory(null)}>Cerrar</button>
          </div>
        </div>
      </div>`}
    <//>
  </div>`;
}

/* ===================== AUTENTICACIÓN ===================== */
const FREE_DOMAINS = ['gmail.com','hotmail.com','outlook.com','yahoo.com','yahoo.es','live.com','icloud.com','hotmail.es','outlook.es','msn.com'];
function domainKind(email) {
  const d = (email.split('@')[1] || '').toLowerCase().trim();
  if (!d || !d.includes('.')) return null;
  if (FREE_DOMAINS.includes(d)) return 'personal';
  if (/(^|\.)edu(\.[a-z]{2})?$|\.edu\.|educacion|sedu|\.gov\.co$/.test(d)) return 'institutional';
  return 'unknown';
}
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
function DomainHint({ email }) {
  if (!validEmail(email)) return null;
  const k = domainKind(email);
  const m = {
    institutional: ['shield', 'text-teal-d', 'Dominio educativo reconocido. La revisión docente será más rápida.'],
    unknown: ['info', 'text-violet-d', 'No conocemos este dominio todavía. Muchas instituciones usan uno propio: un moderador lo revisará.'],
    personal: ['info', 'text-[#8A5300]', 'Es un correo personal. Usaremos la validación manual, sin pedirte documento de identidad.'],
  }[k];
  return html`<p className=${cx('mt-1.5 flex gap-1.5 text-[13px] leading-snug', m[1])}><${Icon} name=${m[0]} size=${15} className="mt-px" />${m[2]}</p>`;
}

function ProfileFields({ f, set, errs = {}, showEmail = false, emailLocked = false, idp = 'pf' }) {
  const toggle = (k, v) => set({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] });
  const err = k => errs[k] && html`<p className="mt-1 text-[13px] text-[#B42318]">${errs[k]}</p>`;
  return html`<div className="grid gap-4">
    <div><label className=${labelC} htmlFor=${idp + '-name'}>Nombre completo</label><input id=${idp + '-name'} className=${inputC} value=${f.name} onChange=${e => set({ ...f, name: e.target.value })} placeholder="Ej.: Laura Gómez Restrepo" autoComplete="name" />${err('name')}</div>
    ${showEmail && html`<div><label className=${labelC} htmlFor=${idp + '-email'}>Correo institucional</label><input id=${idp + '-email'} type="email" className=${inputC} value=${f.email} disabled=${emailLocked} onChange=${e => set({ ...f, email: e.target.value })} placeholder="nombre@tuinstitucion.edu.co" autoComplete="email" />${err('email')}<${DomainHint} email=${f.email} /></div>`}
    <div className="grid sm:grid-cols-2 gap-4">
      <div><label className=${labelC} htmlFor=${idp + '-inst'}>Institución educativa</label><input id=${idp + '-inst'} className=${inputC} value=${f.institution} onChange=${e => set({ ...f, institution: e.target.value })} placeholder="I.E. ..." />${err('institution')}</div>
      <div><label className=${labelC} htmlFor=${idp + '-city'}>Ciudad o municipio</label><input id=${idp + '-city'} className=${inputC} value=${f.city} onChange=${e => set({ ...f, city: e.target.value })} placeholder="Ej.: Medellín" />${err('city')}</div>
    </div>
    <fieldset><legend className=${labelC}>Área de enseñanza <span className="font-normal text-mute">(puedes elegir varias)</span></legend>
      <div className="flex flex-wrap gap-2">${AREAS.map(a => html`<${Chip} key=${a} active=${f.areas.includes(a)} onClick=${() => toggle('areas', a)}>${a}<//>`)}</div>${err('areas')}
    </fieldset>
    <fieldset><legend className=${labelC}>Grados en los que enseñas</legend>
      <div className="flex flex-wrap gap-2">${GRADES.map(g => html`<button type="button" key=${g} onClick=${() => toggle('grades', g)} aria-pressed=${f.grades.includes(g)} className=${cx('w-14 h-11 rounded-xl border font-mono font-medium text-[15px] transition', f.grades.includes(g) ? 'bg-violet text-white border-violet' : 'bg-white border-line text-ink hover:border-violet/50')}>${g}.º</button>`)}</div>${err('grades')}
    </fieldset>
  </div>`;
}
function ManualFields({ m, set }) {
  return html`<div className="rounded-2xl border border-sun/50 bg-sun/[.09] p-4 grid gap-3">
    <div className="flex gap-2.5"><span className="text-[#8A5300] mt-0.5"><${Icon} name="hourglass" size=${18} /></span>
      <div><p className="font-bold text-ink text-[15px]">Validación manual de condición docente</p><p className="text-[13px] text-ink/70 leading-snug">Para docentes sin correo institucional. Un moderador confirmará tu vinculación con la institución. No necesitas enviar documento de identidad.</p></div></div>
    <div className="grid sm:grid-cols-2 gap-3">
      <div><label className=${labelC} htmlFor="mv-contact">Contacto que puede confirmar <span className="font-normal text-mute">(rector/a o coordinador/a)</span></label><input id="mv-contact" className=${inputC} value=${m.contact} onChange=${e => set({ ...m, contact: e.target.value })} placeholder="Nombre y cargo" /></div>
      <div><label className=${labelC} htmlFor="mv-channel">Teléfono o correo de la institución</label><input id="mv-channel" className=${inputC} value=${m.channel} onChange=${e => set({ ...m, channel: e.target.value })} placeholder="Ej.: secretaría del colegio" /></div>
    </div>
    <div><label className=${labelC} htmlFor="mv-dane">Código DANE de la institución <span className="font-normal text-mute">(opcional)</span></label><input id="mv-dane" className=${inputC + ' font-mono'} value=${m.dane} onChange=${e => set({ ...m, dane: e.target.value })} placeholder="12 dígitos" /></div>
    <div><label className=${labelC} htmlFor="mv-note">Cuéntanos qué y dónde enseñas <span className="font-normal text-mute">(opcional)</span></label><textarea id="mv-note" rows="2" className=${inputC} value=${m.note} onChange=${e => set({ ...m, note: e.target.value })} placeholder="Ej.: Soy docente provisional de matemáticas en la sede rural."></textarea></div>
  </div>`;
}
const emptyProfile = () => ({ name: '', email: '', institution: '', city: '', areas: [], grades: [] });
const emptyManual = () => ({ contact: '', channel: '', dane: '', note: '' });
function validateProfile(f, needEmail) {
  const e = {};
  if (f.name.trim().length < 3) e.name = 'Escribe tu nombre completo.';
  if (needEmail && !validEmail(f.email)) e.email = 'Revisa el correo: debe tener el formato nombre@dominio.';
  if (!f.institution.trim()) e.institution = 'Escribe el nombre de tu institución.';
  if (!f.city.trim()) e.city = 'Escribe tu ciudad o municipio.';
  if (!f.areas.length) e.areas = 'Elige al menos un área.';
  if (!f.grades.length) e.grades = 'Elige al menos un grado.';
  return e;
}

function GooglePicker({ open, onClose, onPick }) {
  const [other, setOther] = useState(false);
  const [n, setN] = useState(''); const [e, setE] = useState('');
  const accounts = [
    { name: 'Laura Gómez', email: DEMO_EMAIL, note: 'Cuenta demo ya verificada', color: '#0B7F74' },
    { name: 'Sofía Herrera', email: 'sherrera@colegiolosandes.edu.co', note: 'Nueva · dominio institucional', color: '#5B3BE0' },
    { name: 'Andrés Restrepo', email: 'andres.profe.ciencias@gmail.com', note: 'Nueva · correo personal', color: '#B4470E' },
  ];
  return html`<${Modal} open=${open} onClose=${onClose} size="max-w-md" label="Continuar con Google">
    <${CloseBtn} onClick=${onClose} />
    <div className="p-6 sm:p-7">
      <div className="flex items-center gap-2"><${GoogleG} size=${22} /><span className="text-[15px] text-ink/80">Acceder con Google</span></div>
      <h2 className="font-display text-[22px] font-bold text-ink mt-4">Elige una cuenta</h2>
      <p className="text-mute text-[14px]">para continuar en Kuriozity</p>
      <p className="mt-3 text-[12.5px] rounded-lg bg-sun/15 text-[#7A4B00] px-3 py-2">Simulación: no se conecta con tu cuenta de Google real.</p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        ${accounts.map(a => html`<li key=${a.email}><button className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-mist rounded-lg transition" onClick=${() => onPick(a.email, a.name)}>
          <${Avatar} person=${a} size=${36} />
          <div className="min-w-0"><p className="font-bold text-ink text-[14px]">${a.name}</p><p className="text-mute text-[13px] truncate">${a.email}</p></div>
          <span className="ml-auto text-[11px] text-mute text-right leading-tight max-w-[90px]">${a.note}</span>
        </button></li>`)}
        <li>${other
          ? html`<form className="py-3 grid gap-2" onSubmit=${ev => { ev.preventDefault(); if (n.trim() && validEmail(e)) onPick(e.trim().toLowerCase(), n.trim()); }}>
              <input id="gp-name" className=${inputC} placeholder="Tu nombre" value=${n} onChange=${ev => setN(ev.target.value)} />
              <input id="gp-email" type="email" className=${inputC} placeholder="tu.correo@dominio.com" value=${e} onChange=${ev => setE(ev.target.value)} />
              <button className=${btnP} disabled=${!n.trim() || !validEmail(e)}>Continuar</button>
            </form>`
          : html`<button className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-mist rounded-lg" onClick=${() => setOther(true)}><span className="grid place-items-center w-9 h-9 rounded-full border border-line text-mute"><${Icon} name="user" size=${17} /></span><span className="text-[14px] font-semibold text-ink">Usar otra cuenta</span></button>`}
        </li>
      </ul>
      <p className="mt-4 text-[12.5px] text-mute">Google confirma tu correo. Tu condición docente se verifica por separado.</p>
    </div>
  <//>`;
}

function AuthScreen({ tab, setTab, accounts, actions, onBack, onInfo }) {
  const [gOpen, setGOpen] = useState(false);
  const [lf, setLf] = useState({ email: '', pass: '' });
  const [showPass, setShowPass] = useState(false);
  const [lErr, setLErr] = useState('');
  const [rf, setRf] = useState(emptyProfile());
  const [pass, setPass] = useState('');
  const [noInst, setNoInst] = useState(false);
  const [manual, setManual] = useState(emptyManual());
  const [privacy, setPrivacy] = useState(false);
  const [errs, setErrs] = useState({});
  const [recEmail, setRecEmail] = useState('');
  const [recSent, setRecSent] = useState(false);
  const formRef = useRef(null);
  const kind = domainKind(rf.email);
  const manualPath = noInst || kind === 'personal';

  const doLogin = e => {
    e.preventDefault();
    const em = lf.email.trim().toLowerCase();
    if (!validEmail(em)) return setLErr('Escribe un correo válido.');
    if (!lf.pass) return setLErr('Escribe tu contraseña.');
    if (!accounts[em]) return setLErr('No encontramos una cuenta con ese correo. Revisa que esté bien escrito o crea una cuenta nueva.');
    setLErr(''); actions.login(em);
  };
  const doRegister = e => {
    e.preventDefault();
    const er = validateProfile(rf, true);
    const em = rf.email.trim().toLowerCase();
    if (!er.email && accounts[em]) er.email = 'Ya existe una cuenta con este correo. Ingresa desde la pestaña Ingresar.';
    if (pass.length < 8) er.pass = 'La contraseña debe tener al menos 8 caracteres.';
    if (manualPath && !manual.contact.trim() && !manual.channel.trim()) er.manual = 'Indícanos al menos un contacto o un medio para confirmar tu vinculación.';
    if (!privacy) er.privacy = 'Debes aceptar la política de privacidad para continuar.';
    setErrs(er);
    if (Object.keys(er).length) { formRef.current && formRef.current.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    actions.register({ ...rf, email: em }, manualPath ? manual : null, kind);
  };
  const fillSample = () => {
    setRf({ name: 'Sofía Herrera Vélez', email: 'sherrera@colegiolosandes.edu.co', institution: 'Colegio Los Andes', city: 'Itagüí', areas: ['Ciencias sociales'], grades: ['8', '9'] });
    setPass('demo-no-se-guarda'); setPrivacy(true); setNoInst(false); setErrs({});
  };

  const tabs = [['login', 'Ingresar'], ['register', 'Crear cuenta']];
  return html`<div className="min-h-full grid lg:grid-cols-[.95fr_1.05fr] bg-white">
    <aside className="relative bg-ink text-white overflow-hidden hero-bg px-5 sm:px-10 py-6 sm:py-10 flex flex-col">
      <div className="qmarks" aria-hidden="true"><span className="qm qm0">?</span><span className="qm qm3">¿</span></div>
      <div className="relative flex items-center justify-between gap-3">
        <${Logo} light onClick=${onBack} />
        <button className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-[14px] font-semibold" onClick=${onBack}><${Icon} name="back" size=${16} /> Volver a Kuriozity</button>
      </div>
      <div className="relative my-auto py-10 lg:py-0 max-w-lg">
        <p className="font-mono text-[12px] uppercase tracking-[.18em] text-teal">Comunidad docente</p>
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] mt-3 balance">Bienvenido a la comunidad de quienes todavía creen en el poder de enseñar.</h1>
        <p className="mt-4 text-white/75 text-[17px] leading-relaxed">Un espacio para docentes que quieren despertar la curiosidad, compartir nuevas formas de aprender y transformar el futuro desde sus aulas.</p>
        ${tab !== 'register' && html`<button className=${btnTeal + ' mt-6 !px-5 !py-3'} onClick=${() => setTab('register')}>Quiero hacer parte <${Icon} name="arrow" size=${17} /></button>`}
        <div className="mt-10 hidden sm:block">
          <p className="text-[13px] font-bold text-white/60">Cómo funciona el acceso</p>
          <ol className="mt-3 grid gap-2.5">
            ${[['user', 'Crea tu cuenta', 'Con Google o con tu correo institucional.'], ['mail', 'Verifica tu correo', 'Te enviamos un enlace a tu bandeja de entrada.'], ['shield', 'Confirmamos que eres docente', 'Por dominio institucional o validación manual.']].map(([i, t, d], k) => html`<li key=${t} className="flex gap-3 items-start">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-white/10 text-teal font-mono text-[13px] shrink-0">${k + 1}</span>
              <div><p className="font-bold text-[15px]">${t}</p><p className="text-white/60 text-[14px]">${d}</p></div>
            </li>`)}
          </ol>
        </div>
      </div>
      <div className="relative"><${PrototypeBadge} light onClick=${onInfo} /></div>
    </aside>

    <main className="px-4 sm:px-10 py-8 sm:py-12 flex justify-center">
      <div className="w-full max-w-[480px]">
        ${tab === 'recover' ? html`<div>
          <button className=${btnG + ' -ml-3'} onClick=${() => { setTab('login'); setRecSent(false); }}><${Icon} name="back" size=${16} /> Volver</button>
          <h2 className="font-display text-[28px] font-extrabold text-ink mt-3">Recupera tu contraseña</h2>
          ${recSent ? html`<div className="mt-5 rounded-2xl bg-teal-soft p-5">
              <p className="font-bold text-ink flex items-center gap-2"><${Icon} name="mail" size=${18} /> Revisa tu correo</p>
              <p className="mt-2 text-ink/80 text-[15px]">Si existe una cuenta asociada a <strong>${recEmail}</strong>, recibirás un enlace para crear una contraseña nueva.</p>
              <p className="mt-3 text-[13px] text-mute">Simulación: no se envió ningún correo.</p>
            </div>`
          : html`<form className="mt-5 grid gap-4" onSubmit=${e => { e.preventDefault(); if (validEmail(recEmail)) setRecSent(true); }}>
              <p className="text-mute">Escribe el correo con el que te registraste y te enviaremos un enlace.</p>
              <div><label className=${labelC} htmlFor="rec-email">Correo</label><input id="rec-email" type="email" className=${inputC} value=${recEmail} onChange=${e => setRecEmail(e.target.value)} placeholder="nombre@tuinstitucion.edu.co" /></div>
              <button className=${btnP} disabled=${!validEmail(recEmail)}>Enviar enlace</button>
            </form>`}
        </div>` : html`<div>
          <div className="flex p-1 rounded-2xl bg-mist border border-line" role="tablist">
            ${tabs.map(([k, l]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)} className=${cx('flex-1 rounded-xl py-2.5 text-[15px] font-bold transition', tab === k ? 'bg-white text-ink shadow-sm' : 'text-mute hover:text-ink')}>${l}</button>`)}
          </div>
          <button className=${btnS + ' w-full mt-6 !py-3'} onClick=${() => setGOpen(true)}><${GoogleG} /> ${tab === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}</button>
          <div className="flex items-center gap-3 my-5 text-[13px] text-mute"><span className="flex-1 h-px bg-line"></span>${tab === 'login' ? 'o con tu correo' : 'o con tu correo institucional'}<span className="flex-1 h-px bg-line"></span></div>

          ${tab === 'login' ? html`<form className="grid gap-4" onSubmit=${doLogin}>
            <div><label className=${labelC} htmlFor="li-email">Correo</label><input id="li-email" type="email" className=${inputC} value=${lf.email} onChange=${e => setLf({ ...lf, email: e.target.value })} placeholder="nombre@tuinstitucion.edu.co" autoComplete="email" /></div>
            <div><div className="flex items-center justify-between"><label className=${labelC} htmlFor="li-pass">Contraseña</label><button type="button" className="text-[13px] font-bold text-violet-d hover:underline mb-1.5" onClick=${() => setTab('recover')}>¿La olvidaste?</button></div>
              <div className="relative"><input id="li-pass" type=${showPass ? 'text' : 'password'} className=${inputC + ' pr-11'} value=${lf.pass} onChange=${e => setLf({ ...lf, pass: e.target.value })} autoComplete="current-password" />
              <button type="button" aria-label=${showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-mute hover:text-ink" onClick=${() => setShowPass(!showPass)}><${Icon} name=${showPass ? 'eyeoff' : 'eye'} size=${18} /></button></div>
            </div>
            ${lErr && html`<p className="text-[14px] text-[#B42318] rounded-xl bg-[#FEF0EF] px-3 py-2">${lErr}</p>`}
            <button className=${btnP + ' !py-3'}>Ingresar</button>
            <p className="text-[12.5px] text-mute">En el prototipo las contraseñas no se validan ni se guardan.</p>
            <div className="mt-2 rounded-2xl border border-dashed border-violet/30 bg-violet-soft/50 p-4">
              <p className="text-[13px] font-bold text-ink">¿Presentando el prototipo?</p>
              <p className="text-[13px] text-mute mt-0.5">Entra con una docente ya verificada. Verás la bienvenida de Daniel en su primer ingreso.</p>
              <button type="button" className=${btnS + ' mt-3 w-full'} onClick=${() => actions.login(DEMO_EMAIL)}><${Avatar} person=${{ name: 'Laura Gómez', color: '#0B7F74' }} size=${24} /> Entrar como Laura Gómez</button>
            </div>
          </form>`
          : html`<form ref=${formRef} className="grid gap-4" onSubmit=${doRegister} noValidate>
            <button type="button" className="justify-self-start text-[13px] font-bold text-violet-d hover:underline" onClick=${fillSample}>Rellenar con datos de ejemplo</button>
            <${ProfileFields} f=${rf} set=${setRf} errs=${errs} showEmail idp="rg" />
            <label className="flex items-center gap-2.5 text-[14px] text-ink cursor-pointer"><input id="rg-noinst" type="checkbox" className="w-4 h-4 accent-[#6A45F5]" checked=${manualPath} disabled=${kind === 'personal'} onChange=${e => setNoInst(e.target.checked)} /> No tengo correo institucional</label>
            ${manualPath && html`<div data-err=${errs.manual ? '1' : undefined}><${ManualFields} m=${manual} set=${setManual} />${errs.manual && html`<p className="mt-1 text-[13px] text-[#B42318]">${errs.manual}</p>`}</div>`}
            <div data-err=${errs.pass ? '1' : undefined}><label className=${labelC} htmlFor="rg-pass">Contraseña</label>
              <div className="relative"><input id="rg-pass" type=${showPass ? 'text' : 'password'} className=${inputC + ' pr-11'} value=${pass} onChange=${e => setPass(e.target.value)} autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
              <button type="button" aria-label=${showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-mute hover:text-ink" onClick=${() => setShowPass(!showPass)}><${Icon} name=${showPass ? 'eyeoff' : 'eye'} size=${18} /></button></div>
              <div className="mt-2 flex gap-1">${[0, 1, 2].map(i => html`<span key=${i} className=${cx('h-1 flex-1 rounded-full', pass.length >= [1, 8, 12][i] ? ['bg-[#E5484D]', 'bg-sun', 'bg-teal-d'][Math.min(2, pass.length >= 12 ? 2 : pass.length >= 8 ? 1 : 0)] : 'bg-ink/10')}></span>`)}</div>
              ${errs.pass && html`<p className="mt-1 text-[13px] text-[#B42318]">${errs.pass}</p>`}
            </div>
            <label data-err=${errs.privacy ? '1' : undefined} className="flex items-start gap-2.5 text-[14px] text-ink/85 cursor-pointer"><input id="rg-privacy" type="checkbox" className="w-4 h-4 mt-0.5 accent-[#6A45F5]" checked=${privacy} onChange=${e => setPrivacy(e.target.checked)} />
              <span>Acepto la política de privacidad y autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012. Mi correo y los datos de verificación no serán públicos.</span></label>
            ${errs.privacy && html`<p className="-mt-2 text-[13px] text-[#B42318]">${errs.privacy}</p>`}
            ${Object.keys(errs).length > 0 && html`<p className="text-[14px] text-[#B42318] rounded-xl bg-[#FEF0EF] px-3 py-2">Revisa los campos marcados para continuar.</p>`}
            <button className=${btnP + ' !py-3'}>Crear cuenta</button>
          </form>`}
        </div>`}
      </div>
    </main>
    <${GooglePicker} open=${gOpen} onClose=${() => setGOpen(false)} onPick=${(em, n) => { setGOpen(false); actions.google(em, n); }} />
  </div>`;
}

/* ===================== COMPLETAR PERFIL (GOOGLE) ===================== */
function CompleteProfile({ me, actions, onInfo }) {
  const [f, setF] = useState({ ...emptyProfile(), name: me.name, email: me.email });
  const kind = domainKind(me.email);
  const [noInst, setNoInst] = useState(kind === 'personal');
  const [manual, setManual] = useState(emptyManual());
  const [privacy, setPrivacy] = useState(false);
  const [errs, setErrs] = useState({});
  const manualPath = noInst || kind === 'personal';
  const submit = e => {
    e.preventDefault();
    const er = validateProfile(f, false);
    if (manualPath && !manual.contact.trim() && !manual.channel.trim()) er.manual = 'Indícanos al menos un contacto o un medio para confirmar tu vinculación.';
    if (!privacy) er.privacy = 'Debes aceptar la política de privacidad para continuar.';
    setErrs(er);
    if (!Object.keys(er).length) actions.completeProfile(f, manualPath ? manual : null, kind);
  };
  return html`<div className="min-h-full bg-mist">
    <${StatusTopbar} onLogout=${actions.logout} onHome=${actions.toLanding} onInfo=${onInfo} />
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <${Stepper} me=${me} />
      <div className="mt-6 rounded-3xl bg-white border border-line p-5 sm:p-8">
        <div className="flex items-center gap-2 text-teal-d text-[14px] font-bold"><${Icon} name="check" size=${16} sw=${3} /> Google confirmó tu correo · ${me.email}</div>
        <h1 className="font-display text-[26px] font-extrabold text-ink mt-3">Completa tu perfil docente</h1>
        <p className="text-mute mt-1">Tu correo ya está verificado. Ahora necesitamos confirmar que eres docente. Con estos datos también personalizamos tu inicio.</p>
        <form className="mt-6 grid gap-4" onSubmit=${submit} noValidate>
          <${ProfileFields} f=${f} set=${setF} errs=${errs} idp="cp" />
          ${kind !== 'personal' && html`<label className="flex items-center gap-2.5 text-[14px] text-ink cursor-pointer"><input id="cp-noinst" type="checkbox" className="w-4 h-4 accent-[#6A45F5]" checked=${noInst} onChange=${e => setNoInst(e.target.checked)} /> Este no es un correo de mi institución</label>`}
          ${manualPath && html`<div><${ManualFields} m=${manual} set=${setManual} />${errs.manual && html`<p className="mt-1 text-[13px] text-[#B42318]">${errs.manual}</p>`}</div>`}
          <label className="flex items-start gap-2.5 text-[14px] text-ink/85 cursor-pointer"><input id="cp-privacy" type="checkbox" className="w-4 h-4 mt-0.5 accent-[#6A45F5]" checked=${privacy} onChange=${e => setPrivacy(e.target.checked)} /><span>Acepto la política de privacidad y el tratamiento de mis datos personales.</span></label>
          ${errs.privacy && html`<p className="-mt-2 text-[13px] text-[#B42318]">${errs.privacy}</p>`}
          <button className=${btnP + ' !py-3'}>Enviar a revisión</button>
        </form>
      </div>
    </main>
  </div>`;
}

/* ===================== VERIFICACIÓN ===================== */
function StatusTopbar({ onLogout, onHome, onInfo }) {
  return html`<header className="bg-white border-b border-line"><div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
    <${Logo} small onClick=${onHome} />
    <div className="flex items-center gap-2"><span className="hidden sm:inline"><${PrototypeBadge} onClick=${onInfo} /></span><button className=${btnG} onClick=${onLogout}><${Icon} name="logout" size=${17} /> Salir</button></div>
  </div></header>`;
}
function Stepper({ me }) {
  const st = [
    { k: 'mail', t: 'Correo', s: me.emailVerified ? 'Verificado' : 'Pendiente', done: me.emailVerified, cur: !me.emailVerified },
    { k: 'shield', t: 'Identidad docente', s: me.teacherStatus === 'verified' ? 'Aprobada' : me.teacherStatus === 'pending' ? (me.emailVerified ? 'En revisión' : 'En espera') : 'Falta tu perfil', done: me.teacherStatus === 'verified', cur: me.emailVerified && me.teacherStatus !== 'verified' },
    { k: 'users', t: 'Acceso a la comunidad', s: me.emailVerified && me.teacherStatus === 'verified' ? 'Habilitado' : 'Bloqueado', done: me.emailVerified && me.teacherStatus === 'verified', cur: false },
  ];
  return html`<ol className="grid grid-cols-3 gap-2" aria-label="Progreso de verificación">
    ${st.map((x, i) => html`<li key=${x.t} className="flex flex-col items-center text-center relative">
      ${i > 0 && html`<span className=${cx('absolute top-5 right-1/2 w-full h-0.5 -z-0', st[i - 1].done ? 'bg-teal-d' : 'bg-line')}></span>`}
      <span className=${cx('relative z-10 grid place-items-center w-10 h-10 rounded-full border-2 transition', x.done ? 'bg-teal-d border-teal-d text-white' : x.cur ? 'bg-white border-violet text-violet-d ring-4 ring-violet/15' : 'bg-white border-line text-mute')}><${Icon} name=${x.done ? 'check' : x.k} size=${18} sw=${x.done ? 3 : 2} /></span>
      <span className="mt-2 text-[13px] sm:text-[14px] font-bold text-ink leading-tight">${x.t}</span>
      <span className=${cx('text-[12px]', x.done ? 'text-teal-d' : x.cur ? 'text-violet-d font-semibold' : 'text-mute')}>${x.s}</span>
    </li>`)}
  </ol>`;
}
function VerifyScreen({ me, actions, toast, onInfo }) {
  const state = !me.emailVerified ? 'email' : me.teacherStatus !== 'verified' ? 'teacher' : 'ok';
  const pathLabel = me.reviewPath === 'domain' ? 'Automática por dominio institucional' : 'Validación manual por un moderador';
  const card = {
    email: { icon: 'mail', tone: 'bg-violet-soft text-violet-d', t: 'Revisa tu bandeja de entrada', d: html`Enviamos un enlace de verificación a <strong className="text-ink">${me.email}</strong>. Ábrelo desde tu correo para confirmar que la dirección es tuya. Si no lo ves, revisa la carpeta de spam.` },
    teacher: { icon: 'hourglass', tone: 'bg-sun/20 text-[#8A5300]', t: 'Tu identidad docente está en revisión', d: me.reviewPath === 'domain' ? html`Tu correo ya está verificado. Como usas un dominio educativo, confirmamos tu vinculación con <strong className="text-ink">${me.institution}</strong> de forma rápida. Normalmente toma menos de un día hábil.` : html`Tu correo ya está verificado. Un moderador confirmará tu vinculación con <strong className="text-ink">${me.institution}</strong> usando el contacto que nos diste. Puede tomar de uno a tres días hábiles. No te pediremos documento de identidad.` },
    ok: { icon: 'award', tone: 'bg-teal-soft text-teal-d', t: '¡Listo! Ya eres parte de la comunidad', d: 'Tu correo y tu condición docente están verificados. Ya puedes acceder a recursos, cursos, publicaciones y eventos.' },
  }[state];
  return html`<div className="min-h-full bg-mist">
    <${StatusTopbar} onLogout=${actions.logout} onHome=${actions.toLanding} onInfo=${onInfo} />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <p className="font-mono text-[12px] uppercase tracking-[.16em] text-violet-d">Estado de tu cuenta</p>
      <h1 className="font-display text-[clamp(1.7rem,4vw,2.3rem)] font-extrabold text-ink mt-1">Hola, ${me.name.split(' ')[0]}</h1>
      <div className="mt-7"><${Stepper} me=${me} /></div>

      <section className="mt-8 rounded-3xl bg-white border border-line p-6 sm:p-8 pop" key=${state}>
        <span className=${cx('grid place-items-center w-14 h-14 rounded-2xl', card.tone)}><${Icon} name=${card.icon} size=${26} /></span>
        <h2 className="font-display text-[24px] font-bold text-ink mt-4 balance">${card.t}</h2>
        <p className="mt-2 text-[16px] text-ink/75 leading-relaxed max-w-prose">${card.d}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          ${state === 'email' && html`<button className=${btnS} onClick=${() => toast('Enviamos un nuevo enlace (simulado).', 'info')}><${Icon} name="refresh" size=${16} /> Reenviar enlace</button>`}
          ${state === 'ok' && html`<button className=${btnP + ' !px-5 !py-3'} onClick=${actions.enter}>Entrar a la comunidad <${Icon} name="arrow" size=${17} /></button>`}
        </div>
        <dl className="mt-7 grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line p-4"><dt className="text-[12px] font-bold uppercase tracking-[.08em] text-mute">Correo</dt>
            <dd className="mt-1 flex items-center gap-2 font-bold text-ink">${me.emailVerified ? html`<span className="text-teal-d"><${Icon} name="check" size=${17} sw=${3} /></span> Verificado` : html`<span className="text-violet-d"><${Icon} name="clock" size=${17} /></span> Pendiente de verificar`}</dd>
            <dd className="text-[13px] text-mute mt-0.5">${me.method === 'google' ? 'Confirmado por Google' : 'Por enlace enviado al correo'}</dd></div>
          <div className="rounded-2xl border border-line p-4"><dt className="text-[12px] font-bold uppercase tracking-[.08em] text-mute">Condición docente</dt>
            <dd className="mt-1 flex items-center gap-2 font-bold text-ink">${me.teacherStatus === 'verified' ? html`<span className="text-teal-d"><${Icon} name="check" size=${17} sw=${3} /></span> Verificada` : html`<span className="text-[#8A5300]"><${Icon} name="hourglass" size=${17} /></span> ${me.emailVerified ? 'En revisión' : 'En espera del correo'}`}</dd>
            <dd className="text-[13px] text-mute mt-0.5">${pathLabel}</dd></div>
        </dl>
      </section>

      ${state !== 'ok' && html`<section className="mt-5 rounded-3xl border-2 border-dashed border-sun/70 bg-sun/[.08] p-5 sm:p-6">
        <p className="flex items-center gap-2 font-bold text-ink"><${Icon} name="info" size=${18} /> Panel de simulación</p>
        <p className="text-[14px] text-ink/70 mt-1">En la versión real estos pasos ocurren fuera de la plataforma. Aquí puedes recorrerlos sin enviar nada.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          ${state === 'email' && html`<button className=${btn + ' bg-ink text-white hover:bg-ink-2 px-4 py-2.5'} onClick=${actions.verifyEmail}><${Icon} name="mail" size=${17} /> Abrir el enlace del correo</button>`}
          ${state === 'teacher' && html`<button className=${btn + ' bg-ink text-white hover:bg-ink-2 px-4 py-2.5'} onClick=${actions.approveTeacher}><${Icon} name="shield" size=${17} /> Aprobar como moderador de Kuriozity</button>`}
        </div>
      </section>`}

      ${state !== 'ok' && html`<section className="mt-8">
        <p className="text-[14px] font-bold text-ink flex items-center gap-2"><${Icon} name="lock" size=${16} /> Se desbloquea cuando completes ambas verificaciones</p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[['book', 'Recursos'], ['cap', 'Cursos'], ['users', 'Comunidad'], ['calendar', 'Eventos']].map(([i, t]) => html`<div key=${t} className="relative rounded-2xl bg-white border border-line p-4 overflow-hidden">
            <div className="blur-[2px] opacity-60"><span className="grid place-items-center w-9 h-9 rounded-xl bg-violet-soft text-violet-d"><${Icon} name=${i} size=${18} /></span><p className="font-bold text-ink mt-3">${t}</p><div className="mt-2 h-2 rounded bg-ink/10 w-3/4"></div></div>
            <span className="absolute right-3 top-3 text-mute"><${Icon} name="lock" size=${16} /></span>
          </div>`)}
        </div>
      </section>`}
      <p className="mt-8 sm:hidden"><${PrototypeBadge} onClick=${onInfo} /></p>
    </main>
  </div>`;
}
