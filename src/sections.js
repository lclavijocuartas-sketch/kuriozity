/* ===================== RECURSOS ===================== */
function ResCover({ r, h = 'h-32', big = false }) {
  const s = AREA_STYLE[r.area];
  return html`<div className=${cx('relative overflow-hidden', h)} style=${{ background: s.bg }}>
    <span className="absolute -right-2 -bottom-6 font-display font-extrabold leading-none select-none" style=${{ color: s.c, opacity: .13, fontSize: big ? 190 : 130 }}>?</span>
    <span className="absolute left-4 top-4 grid place-items-center rounded-2xl bg-white/85" style=${{ color: s.c, width: big ? 56 : 44, height: big ? 56 : 44 }}><${Icon} name=${s.icon} size=${big ? 26 : 21} /></span>
    <span className="absolute left-4 bottom-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-bold" style=${{ color: s.c }}>${TYPE_ONE[r.type]}</span>
    ${r.tool && html`<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/85 text-white px-2.5 py-1 text-[11.5px] font-bold"><${Icon} name=${r.tool === 'IA' ? 'cpu' : 'play'} size=${12} />Con ${r.tool}</span>`}
  </div>`;
}
function ResourceCard({ r, ctx }) {
  const saved = ctx.ud.savedRes.includes(r.id);
  const a = ctx.authorOf(r.author);
  return html`<article className="group rounded-3xl bg-white border border-line overflow-hidden flex flex-col hover:shadow-[0_10px_30px_-12px_rgba(14,26,60,.25)] hover:-translate-y-0.5 transition">
    <button className="text-left" onClick=${() => ctx.openResource(r.id)} aria-label=${'Ver ' + r.title}><${ResCover} r=${r} /></button>
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex flex-wrap gap-1">${r.grades.map(g => html`<${GradePill} key=${g} g=${g} />`)}</div>
      <h3 className="mt-2 font-display text-[17px] font-bold text-ink leading-snug"><button className="text-left hover:text-violet-d transition" onClick=${() => ctx.openResource(r.id)}>${r.title}</button></h3>
      <p className="mt-1.5 text-[14px] text-mute line-clamp-2 leading-snug">${r.desc}</p>
      <p className="mt-2 text-[12.5px] font-semibold" style=${{ color: AREA_STYLE[r.area].c }}>${r.area}</p>
      <div className="mt-2.5"><${ProcChips} proc=${r.proc} small /></div>
      <div className="mt-3 flex items-center gap-2"><${Avatar} person=${a} size=${24} /><span className="text-[13px] text-ink/75 truncate">${a.name}</span></div>
      <div className="mt-auto pt-4 flex items-center gap-1.5">
        <button className=${btnS + ' !px-3 !py-2 text-[14px] flex-1'} onClick=${() => ctx.openResource(r.id)}><${Icon} name="eye" size=${16} /> Ver</button>
        <button className=${cx(btn, 'w-10 h-10 border', saved ? 'bg-violet-soft border-violet/30 text-violet-d' : 'bg-white border-line text-ink/70 hover:border-violet/40')} onClick=${() => ctx.toggleSaveRes(r.id)} aria-pressed=${saved} aria-label=${saved ? 'Quitar de guardados' : 'Guardar recurso'}><${Icon} name="bookmark" size=${17} fill=${saved ? 'currentColor' : 'none'} /></button>
        ${r.file ? html`<button className=${cx(btn, 'w-10 h-10 border bg-white border-line text-ink/70 hover:border-violet/40')} onClick=${() => ctx.download(r)} aria-label="Descargar"><${Icon} name="download" size=${17} /></button>`
          : html`<span className="w-10 h-10 grid place-items-center text-mute/50" title="Sin archivo descargable"><${Icon} name="download" size=${17} /></span>`}
      </div>
    </div>
  </article>`;
}
function Sel({ id, label, value, onChange, options, all }) {
  return html`<div className="min-w-0"><label htmlFor=${id} className="sr-only">${label}</label>
    <select id=${id} className=${cx(inputC, '!py-2 !text-[14px]', value && '!border-violet !bg-violet-soft/50 font-semibold')} value=${value} onChange=${e => onChange(e.target.value)}><option value="">${all}</option>${options.map(o => html`<option key=${o} value=${o}>${o}</option>`)}</select></div>`;
}
function Resources({ ctx }) {
  const { me } = ctx;
  const [grades, setGrades] = useState([]);
  const [type, setType] = useState('');
  const [area, setArea] = useState('');
  const [strat, setStrat] = useState('');
  const [proc, setProc] = useState('');
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const list = RESOURCES.filter(r =>
    (!grades.length || r.grades.some(g => grades.includes(g))) && (!type || r.type === type) && (!area || r.area === area) && (!strat || r.strategy === strat) && (!proc || r.proc.includes(proc)) &&
    (!q.trim() || (r.title + ' ' + r.desc + ' ' + r.area).toLowerCase().includes(q.toLowerCase())));
  const active = grades.length || type || area || strat || proc || q;
  const clear = () => { setGrades([]); setType(''); setArea(''); setStrat(''); setProc(''); setQ(''); setMine(false); };
  const useMine = () => { if (mine) { clear(); return; } setGrades(me.grades); setArea(me.areas.length === 1 ? me.areas[0] : ''); setMine(true); };
  return html`<div>
    <${PageHead} eyebrow="Biblioteca compartida" title="Recursos para el aula" desc="Materiales creados y probados por docentes. Filtra por grado, tipo, área o estrategia, y cuenta cómo los adaptaste."
      action=${html`<button className=${btnS} onClick=${() => ctx.openComposer({ cat: 'Recursos compartidos', kind: 'full' })}><${Icon} name="plus" size=${17} /> Compartir un recurso</button>`} />
    <${DanielTip} section="recursos" />
    <div data-guide="rs-filters" className="rounded-3xl bg-white border border-line p-4 grid gap-3 mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute"><${Icon} name="search" size=${17} /></span><label htmlFor="rs-q" className="sr-only">Buscar recursos</label><input id="rs-q" className=${inputC + ' pl-10 !py-2'} placeholder="Buscar por título o tema" value=${q} onChange=${e => setQ(e.target.value)} /></div>
        <button className=${cx(btn, 'px-3 py-2 border text-[14px]', mine ? 'bg-teal-soft border-teal-d/30 text-teal-d' : 'bg-white border-line text-ink hover:border-teal-d/40')} onClick=${useMine}><${Icon} name="sparkles" size=${16} /> Para mis grados</button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[13px] font-bold text-mute mr-1 shrink-0">Grado</span>
        ${GRADES.map(g => html`<button key=${g} onClick=${() => { setMine(false); setGrades(grades.includes(g) ? grades.filter(x => x !== g) : [...grades, g]); }} aria-pressed=${grades.includes(g)} className=${cx('shrink-0 h-9 min-w-[48px] px-2 rounded-xl border font-mono text-[14px] transition', grades.includes(g) ? 'bg-ink text-white border-ink' : 'bg-white border-line text-ink hover:border-violet/50')}>${g}.º</button>`)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <${Sel} id="rs-type" label="Tipo" value=${type} onChange=${setType} options=${TYPES} all="Todos los tipos" />
        <${Sel} id="rs-area" label="Área" value=${area} onChange=${v => { setMine(false); setArea(v); }} options=${AREAS} all="Todas las áreas" />
        <${Sel} id="rs-strat" label="Estrategia" value=${strat} onChange=${setStrat} options=${STRATS} all="Todas las estrategias" />
      </div>
      <div data-guide="rs-process" className="rounded-2xl bg-violet-soft/50 border border-violet/15 p-3">
        <p className="text-[13px] font-bold text-ink flex items-center gap-1.5"><${Icon} name="spark" size=${15} className="text-violet-d" />¿Qué proceso de pensamiento quieres activar?</p>
        <div className="mt-2 flex flex-wrap gap-1.5">${PROCESSES.map(p => html`<${Chip} key=${p} active=${proc === p} onClick=${() => setProc(proc === p ? '' : p)}>${p}<//>`)}</div>
        ${proc && html`<p className="mt-2 text-[13px] text-ink/70">${PROC_DESC[proc]}</p>`}
      </div>
      <div className="flex items-center justify-between text-[14px]"><span className="text-mute"><strong className="text-ink font-mono">${list.length}</strong> ${list.length === 1 ? 'recurso' : 'recursos'}</span>${active ? html`<button className="font-bold text-violet-d hover:underline" onClick=${clear}>Limpiar filtros</button>` : null}</div>
    </div>
    ${list.length ? html`<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">${list.map((r, i) => i === 0 ? html`<div key=${r.id} data-guide="rs-card" className="rounded-3xl grid"><${ResourceCard} r=${r} ctx=${ctx} /></div>` : html`<${ResourceCard} key=${r.id} r=${r} ctx=${ctx} />`)}</div>`
      : html`<${Empty} title="No encontramos recursos con esos filtros" action=${html`<div className="flex flex-wrap gap-2 justify-center"><button className=${btnS} onClick=${clear}>Limpiar filtros</button><button className=${btnP} onClick=${() => ctx.openComposer({ cat: 'Preguntas entre docentes', kind: 'short', body: 'Estoy buscando un recurso para ' + (grades.length ? grades.map(gradeLabel).join(', ') : 'mis grados') + (area ? ' de ' + area : '') + '. ¿Alguien tiene algo que le haya funcionado?' })}>Pedirlo a la comunidad</button></div>`}>Quizá ese recurso todavía no existe aquí. Si lo pides, puede que otro profe lo tenga guardado en su computador.<//>`}
  </div>`;
}
function ResourceModal({ id, ctx, onClose }) {
  const r = id && RES_BY_ID[id];
  const saved = r && ctx.ud.savedRes.includes(r.id);
  const exps = r ? ctx.posts.filter(p => p.linkedResource === r.id) : [];
  const a = r && ctx.authorOf(r.author);
  return html`<${Modal} open=${!!r} onClose=${onClose} size="max-w-3xl" label="Recurso">
    ${r && html`<div>
      <${CloseBtn} onClick=${onClose} />
      <${ResCover} r=${r} h="h-40 sm:h-48" big />
      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap gap-1.5 items-center">${r.grades.map(g => html`<${GradePill} key=${g} g=${g} />`)}<span className="text-[13px] font-semibold ml-1" style=${{ color: AREA_STYLE[r.area].c }}>${r.area}</span><span className="text-mute text-[13px]">· ${r.strategy}</span></div>
        <h2 className="font-display text-[clamp(1.5rem,3.4vw,2rem)] font-extrabold text-ink mt-2 leading-tight balance">${r.title}</h2>
        <div className="mt-3 flex items-center gap-2.5"><${Avatar} person=${a} size=${32} /><p className="text-[14px]"><span className="text-mute">Compartido por</span> <strong className="text-ink">${a.name}</strong><span className="text-mute"> · ${a.city}</span></p></div>
        <p className="mt-4 text-[16px] text-ink/85 leading-relaxed">${r.desc}</p>
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-mist p-3.5"><p className="text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Tipo</p><p className="font-bold text-ink mt-0.5">${TYPE_ONE[r.type]}</p></div>
          <div className="rounded-2xl bg-mist p-3.5"><p className="text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Duración</p><p className="font-bold text-ink mt-0.5">${r.duration}</p></div>
          <div className="rounded-2xl bg-mist p-3.5"><p className="text-[11.5px] font-bold uppercase tracking-[.08em] text-mute">Archivo</p><p className="font-bold text-ink mt-0.5 truncate">${r.file ? r.file.size : 'Solo en línea'}</p></div>
        </div>
        <section className="mt-6">
          <p className="font-bold text-ink flex items-center gap-2"><${Icon} name="spark" size=${18} className="text-violet-d" /> Procesos de pensamiento que activa</p>
          <ul className="mt-2 grid sm:grid-cols-2 gap-2">${r.proc.map(p => html`<li key=${p} className="rounded-2xl border border-violet/15 bg-violet-soft/40 px-3.5 py-2.5"><p className="font-bold text-violet-d text-[14px]">${p}</p><p className="text-[13.5px] text-ink/75 leading-snug mt-0.5">${PROC_DESC[p]}</p></li>`)}</ul>
          ${r.tool && html`<p className="mt-2 text-[13.5px] text-ink/70 flex items-center gap-1.5"><${Icon} name=${r.tool === 'IA' ? 'cpu' : 'play'} size=${14} />Usa ${r.tool === 'IA' ? 'la IA' : r.tool.toLowerCase()} como punto de partida para pensar, no como respuesta final.</p>`}
        </section>
        <section className="mt-6 rounded-2xl border border-teal-d/20 bg-teal-soft/60 p-4 sm:p-5">
          <p className="flex items-center gap-2 font-bold text-teal-d"><${Icon} name="bulb" size=${18} /> Recomendación de aplicación pedagógica</p>
          <p className="mt-2 text-[15.5px] text-ink/85 leading-relaxed">${r.rec}</p>
        </section>
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div><p className="font-bold text-ink">Objetivos de aprendizaje</p><ul className="mt-2 grid gap-1.5">${r.obj.map(o => html`<li key=${o} className="flex gap-2 text-[15px] text-ink/80"><span className="text-teal-d mt-0.5"><${Icon} name="check" size=${16} sw=${3} /></span>${o}</li>`)}</ul></div>
          <div><p className="font-bold text-ink">Materiales</p><ul className="mt-2 grid gap-1.5">${r.mat.map(o => html`<li key=${o} className="flex gap-2 text-[15px] text-ink/80"><span className="text-violet-d mt-1.5 w-1.5 h-1.5 rounded-full bg-violet shrink-0"></span>${o}</li>`)}</ul></div>
        </div>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <button className=${btnP + ' !py-3'} onClick=${() => { onClose(); ctx.openComposer({ linkedResource: r.id, cat: 'Experiencias exitosas', kind: 'full', grade: r.grades[0], area: r.area, proc: [...r.proc] }); }}><${Icon} name="edit" size=${17} /> Así lo apliqué en mi aula</button>
          <button className=${cx(btn, 'px-4 py-3 border', saved ? 'bg-violet-soft border-violet/30 text-violet-d' : 'bg-white border-line text-ink hover:border-violet/40')} onClick=${() => ctx.toggleSaveRes(r.id)}><${Icon} name="bookmark" size=${17} fill=${saved ? 'currentColor' : 'none'} />${saved ? 'Guardado' : 'Guardar'}</button>
          ${r.file && html`<button className=${btnS + ' !py-3'} onClick=${() => ctx.download(r)}><${Icon} name="download" size=${17} /> Descargar <span className="font-mono text-[12px] text-mute">${r.file.name.split('.').pop()}</span></button>`}
        </div>
        <section className="mt-8 pt-6 border-t border-line">
          <p className="font-display text-[19px] font-bold text-ink">Experiencias de la comunidad con este recurso <span className="font-mono text-[14px] text-mute">${exps.length}</span></p>
          ${exps.length ? html`<ul className="mt-3 grid gap-2">${exps.map(p => { const pa = ctx.authorOf(p.author); return html`<li key=${p.id}><button className="w-full flex items-center gap-3 rounded-2xl border border-line p-3 text-left hover:bg-mist transition" onClick=${() => { onClose(); ctx.goPost(p.title); }}>
              <${Avatar} person=${pa} size=${34} /><div className="min-w-0"><p className="font-bold text-ink text-[14.5px] truncate">${p.title}</p><p className="text-[13px] text-mute">${pa.name} · ${ago(p.date)} · ${p.comments.length} comentarios</p></div><span className="ml-auto text-mute"><${Icon} name="chev" size=${16} /></span></button></li>`; })}</ul>`
            : html`<div className="mt-3"><${DanielNote}>Nadie ha contado todavía cómo usó este recurso. Si lo pruebas, tu experiencia será la primera guía para el siguiente profe.<//></div>`}
        </section>
      </div>
    </div>`}
  <//>`;
}

/* ===================== CURSOS ===================== */
function CourseCover({ c, h = 'h-36', big = false }) {
  return html`<div className=${cx('relative overflow-hidden', h)} style=${{ background: `linear-gradient(135deg, ${c.color}, #0E1A3C)` }}>
    <div className="absolute inset-0 course-grid"></div>
    <span className="absolute right-4 -bottom-8 font-display font-extrabold leading-none text-white/15 select-none" style=${{ fontSize: big ? 200 : 140 }}>?</span>
    <span className="absolute left-4 top-4 grid place-items-center w-11 h-11 rounded-2xl bg-white/15 text-white backdrop-blur"><${Icon} name=${c.icon} size=${22} /></span>
  </div>`;
}
const courseProg = (c, ud) => { const done = (ud.progress[c.id] || []).filter(id => c.lessons.some(l => l.id === id)).length; return { done, total: c.lessons.length, pct: Math.round(done / c.lessons.length * 100) }; };
function CourseCard({ c, ctx }) {
  const p = courseProg(c, ctx.ud);
  return html`<article className="rounded-3xl bg-white border border-line overflow-hidden flex flex-col hover:shadow-[0_10px_30px_-12px_rgba(14,26,60,.25)] hover:-translate-y-0.5 transition">
    <button className="text-left" onClick=${() => ctx.openCourse(c.id)} aria-label=${'Abrir ' + c.title}><${CourseCover} c=${c} /></button>
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="font-display text-[18px] font-bold text-ink leading-snug">${c.title}</h3>
      <p className="mt-1.5 text-[14px] text-mute leading-snug">${c.desc}</p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/70"><span className="inline-flex items-center gap-1.5"><${Icon} name="clock" size=${14} />${c.duration}</span><span className="inline-flex items-center gap-1.5"><${Icon} name="layers" size=${14} />${c.modules.length} módulos</span><span className="inline-flex items-center gap-1.5"><${Icon} name="play" size=${13} />${c.lessons.length} lecciones</span></p>
      <div className="mt-auto pt-5">
        ${p.done > 0 && html`<div className="flex items-center justify-between text-[13px] mb-1.5"><span className="text-mute">${p.pct === 100 ? 'Completado' : 'Tu progreso'}</span><span className="font-mono font-medium text-ink">${p.pct} %</span></div><${Progress} value=${p.pct} color=${c.color} className="mb-3" />`}
        <button className=${cx(p.done ? btnP : btnS, 'w-full')} onClick=${() => ctx.openCourse(c.id)}>${p.pct === 100 ? 'Repasar' : p.done ? 'Continuar aprendiendo' : 'Empezar curso'} <${Icon} name="arrow" size=${16} /></button>
      </div>
    </div>
  </article>`;
}
function Courses({ ctx, courseId, setCourseId }) {
  if (courseId) return html`<${CourseDetail} c=${COURSE_BY_ID[courseId]} ctx=${ctx} onBack=${() => setCourseId(null)} />`;
  const started = COURSES.filter(c => courseProg(c, ctx.ud).done > 0);
  return html`<div>
    <${PageHead} eyebrow="Formación docente" title="Cursos para docentes" desc="Cursos cortos y transversales para fortalecer tu práctica. Sin importar el grado que enseñes, cada uno termina con algo que puedes probar en tu aula." />
    <${DanielTip} section="cursos" />
    ${started.length > 0 && html`<div className="mb-6 rounded-3xl bg-ink text-white p-5 sm:p-6 flex flex-wrap items-center gap-5">
      <${DanielAvatar} size=${48} />
      <div className="flex-1 min-w-[200px]"><p className="text-white/60 text-[13px] font-bold uppercase tracking-[.08em]">Continúa donde quedaste</p><p className="font-display text-[20px] font-bold mt-0.5">${started[0].title}</p><${Progress} value=${courseProg(started[0], ctx.ud).pct} className="mt-3 max-w-sm !bg-white/15" /></div>
      <button className=${btnTeal} onClick=${() => ctx.openCourse(started[0].id)}>Continuar <${Icon} name="arrow" size=${16} /></button>
    </div>`}
    <div data-guide="cs-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 rounded-3xl">${COURSES.map((c, i) => i === 0 ? html`<div key=${c.id} data-guide="cs-first" className="rounded-3xl grid"><${CourseCard} c=${c} ctx=${ctx} /></div>` : html`<${CourseCard} key=${c.id} c=${c} ctx=${ctx} />`)}</div>
  </div>`;
}
function Ring({ pct, color, size = 88 }) {
  const r = (size - 10) / 2, C = 2 * Math.PI * r;
  return html`<svg width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label=${pct + ' % completado'}>
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="8" />
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke=${color} strokeWidth="8" strokeLinecap="round" strokeDasharray=${C} strokeDashoffset=${C * (1 - pct / 100)} transform=${`rotate(-90 ${size / 2} ${size / 2})`} style=${{ transition: 'stroke-dashoffset .6s ease' }} />
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="18" fontWeight="500">${pct}%</text>
  </svg>`;
}
function CourseDetail({ c, ctx, onBack }) {
  const done = ctx.ud.progress[c.id] || [];
  const p = courseProg(c, ctx.ud);
  const [lesson, setLesson] = useState(null);
  const [openMods, setOpenMods] = useState(() => c.modules.map((m, i) => i === Math.max(0, c.modules.findIndex(m => m.lessons.some(l => !done.includes(l.id))))));
  const next = c.lessons.find(l => !done.includes(l.id));
  const L = lesson && c.lessons.find(l => l.id === lesson);
  const LIdx = L ? c.lessons.indexOf(L) : -1;
  const completeAndNext = () => {
    if (!done.includes(L.id)) ctx.toggleLesson(c.id, L.id);
    const n = c.lessons.slice(LIdx + 1).find(l => !done.includes(l.id) && l.id !== L.id);
    setLesson(n ? n.id : null);
  };
  return html`<div>
    <button className=${btnG + ' -ml-3 mb-3'} onClick=${onBack}><${Icon} name="back" size=${16} /> Todos los cursos</button>
    <div data-guide="cd-hero" className="rounded-[28px] overflow-hidden relative text-white" style=${{ background: `linear-gradient(135deg, ${c.color}, #0E1A3C 75%)` }}>
      <div className="absolute inset-0 course-grid"></div>
      <span className="absolute right-6 -bottom-16 font-display font-extrabold text-[260px] leading-none text-white/10 select-none" aria-hidden="true">?</span>
      <div className="relative p-6 sm:p-9 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[.16em] text-white/70">Curso transversal</p>
          <h1 className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] font-extrabold mt-2 leading-tight balance">${c.title}</h1>
          <p className="mt-2 text-white/80 text-[16px] max-w-xl">${c.desc}</p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-white/85"><span className="inline-flex items-center gap-1.5"><${Icon} name="clock" size=${15} />${c.duration} estimadas</span><span className="inline-flex items-center gap-1.5"><${Icon} name="layers" size=${15} />${c.modules.length} módulos</span><span className="inline-flex items-center gap-1.5"><${Icon} name="play" size=${14} />${c.lessons.length} lecciones</span></p>
          ${next ? html`<button className=${btnTeal + ' mt-6'} onClick=${() => setLesson(next.id)}>${p.done ? 'Continuar aprendiendo' : 'Empezar curso'} <${Icon} name="arrow" size=${16} /></button>` : null}
        </div>
        <div className="flex md:flex-col items-center gap-3"><${Ring} pct=${p.pct} color="#2DD4BF" /><p className="text-[13px] text-white/75">${p.done} de ${p.total} lecciones</p></div>
      </div>
    </div>

    ${p.pct === 100 && html`<div className="mt-5 rounded-3xl border-2 border-teal-d/30 bg-teal-soft p-5 sm:p-6 flex flex-wrap items-center gap-4 pop">
      <span className="grid place-items-center w-12 h-12 rounded-2xl bg-teal-d text-white"><${Icon} name="award" size=${24} /></span>
      <div className="flex-1 min-w-[220px]"><p className="font-display text-[20px] font-bold text-ink">¡Terminaste el curso!</p><p className="text-ink/75 text-[15px]">Lo más valioso viene ahora: llevarlo a tu aula. Cuéntale a la comunidad cómo lo aplicaste.</p></div>
      <button className=${btnP} onClick=${() => ctx.openComposer({ linkedCourse: c.id, cat: 'Experiencias exitosas', kind: 'full' })}><${Icon} name="edit" size=${17} /> Compartir mi aplicación</button>
    </div>`}

    <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <section data-guide="cd-modules" className="grid gap-3 rounded-3xl">
        <h2 className="font-display text-[20px] font-bold text-ink">Contenido del curso</h2>
        ${c.modules.map((m, i) => { const mdone = m.lessons.filter(l => done.includes(l.id)).length; const isOpen = openMods[i]; return html`<div key=${i} className="rounded-2xl bg-white border border-line overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-mist/60" aria-expanded=${isOpen} onClick=${() => setOpenMods(openMods.map((v, k) => k === i ? !v : v))}>
            <span className=${cx('grid place-items-center w-8 h-8 rounded-xl font-mono text-[13px] shrink-0', mdone === m.lessons.length ? 'bg-teal-d text-white' : 'bg-mist text-ink')}>${mdone === m.lessons.length ? html`<${Icon} name="check" size=${15} sw=${3} />` : i + 1}</span>
            <span className="min-w-0 flex-1"><span className="block font-bold text-ink">${m.t}</span><span className="block text-[13px] text-mute">${mdone}/${m.lessons.length} lecciones</span></span>
            <span className=${cx('text-mute transition', isOpen && 'rotate-180')}><${Icon} name="chevdown" size=${18} /></span>
          </button>
          ${isOpen && html`<ul className="border-t border-line">${m.lessons.map(l => { const d = done.includes(l.id); return html`<li key=${l.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-line last:border-0">
            <button aria-label=${d ? 'Marcar como pendiente' : 'Marcar como completada'} aria-pressed=${d} onClick=${() => ctx.toggleLesson(c.id, l.id)} className=${cx('grid place-items-center w-6 h-6 rounded-full border-2 shrink-0 transition', d ? 'bg-teal-d border-teal-d text-white' : 'border-line hover:border-teal-d')}>${d && html`<${Icon} name="check" size=${13} sw=${3} />`}</button>
            <button className="min-w-0 flex-1 text-left group" onClick=${() => setLesson(l.id)}><span className=${cx('block text-[15px] group-hover:text-violet-d', d ? 'text-ink/60' : 'text-ink font-semibold')}>${l.t}</span><span className="text-[12.5px] text-mute inline-flex items-center gap-1"><${Icon} name=${l.icon} size=${12} />${l.type} · ${l.dur}</span></button>
            <button className="text-violet-d p-1.5 rounded-lg hover:bg-violet-soft" aria-label=${'Abrir ' + l.t} onClick=${() => setLesson(l.id)}><${Icon} name="chev" size=${17} /></button>
          </li>`; })}</ul>`}
        </div>`; })}
      </section>
      <aside className="grid gap-4">
        <div className="rounded-3xl bg-white border border-line p-4">
          <p className="font-bold text-ink">Recursos descargables</p>
          <ul className="mt-2 grid gap-1.5">${c.downloads.map(d => html`<li key=${d}><button className="w-full flex items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-mist text-[14px]" onClick=${() => ctx.toast('Descarga simulada: ' + d, 'info')}><span className="grid place-items-center w-8 h-8 rounded-lg bg-violet-soft text-violet-d"><${Icon} name="file" size=${15} /></span><span className="min-w-0 flex-1 truncate text-ink">${d}</span><span className="text-mute"><${Icon} name="download" size=${16} /></span></button></li>`)}</ul>
        </div>
        <div data-guide="cd-activity" className="rounded-3xl bg-white border border-line p-4">
          <p className="font-bold text-ink flex items-center gap-2"><${Icon} name="target" size=${17} /> Actividad práctica</p>
          <p className="mt-2 text-[14.5px] text-ink/80 leading-snug">${c.activity}</p>
          <button className=${btnS + ' mt-3 w-full !py-2 text-[14px]'} onClick=${() => ctx.openComposer({ linkedCourse: c.id, cat: 'Experiencias exitosas', kind: 'full' })}>Compartir mi actividad</button>
        </div>
        <${DanielNote}>No hace falta terminar todo para empezar a probar. Yo aprendí más del primer intento fallido que de la teoría.<//>
      </aside>
    </div>

    <${Modal} open=${!!L} onClose=${() => setLesson(null)} size="max-w-2xl" label="Lección">
      ${L && html`<div>
        <${CloseBtn} onClick=${() => setLesson(null)} light />
        <div className="relative aspect-video max-h-[300px] w-full grid place-items-center text-white overflow-hidden" style=${{ background: `linear-gradient(135deg, ${c.color}, #0E1A3C)` }}>
          <div className="absolute inset-0 course-grid"></div>
          ${L.type === 'Video' ? html`<button className="relative grid place-items-center w-16 h-16 rounded-full bg-white/90 text-ink hover:scale-105 transition" onClick=${() => ctx.toast('Video ilustrativo: el contenido real se cargará en producción.', 'info')} aria-label="Reproducir video"><${Icon} name="play" size=${24} fill="currentColor" /></button>`
            : html`<span className="relative grid place-items-center w-16 h-16 rounded-2xl bg-white/15"><${Icon} name=${L.icon} size=${28} /></span>`}
          <span className="absolute left-4 bottom-3 font-mono text-[12px] text-white/80">${L.type} · ${L.dur}</span>
        </div>
        <div className="p-5 sm:p-7">
          <p className="text-[13px] text-mute">Lección ${LIdx + 1} de ${c.lessons.length}</p>
          <h3 className="font-display text-[22px] font-bold text-ink mt-1">${L.t}</h3>
          <p className="mt-3 text-[15.5px] text-ink/80 leading-relaxed">${L.type === 'Actividad' ? 'Toma una clase que ya tengas planeada y aplica la idea de esta lección en un solo momento. Escribe en tres líneas qué cambiarías y por qué.' : L.type === 'Lectura' ? 'Una lectura corta con ejemplos de aulas colombianas y una pregunta para conversar con tus colegas al final.' : 'Un video corto con ejemplos de clase y una pregunta para pensar antes de seguir.'}</p>
          <p className="mt-3 text-[12.5px] text-mute rounded-xl bg-mist px-3 py-2">Contenido ilustrativo para probar la interfaz del curso.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-between">
            <button className=${btnS} disabled=${LIdx === 0} onClick=${() => setLesson(c.lessons[LIdx - 1].id)}><${Icon} name="back" size=${16} /> Anterior</button>
            <button className=${btnP} onClick=${completeAndNext}>${done.includes(L.id) ? 'Siguiente lección' : 'Marcar como completada y seguir'} <${Icon} name="arrow" size=${16} /></button>
          </div>
        </div>
      </div>`}
    <//>
  </div>`;
}

/* ===================== EVENTOS ===================== */
function EventRow({ e, ctx, compact = false }) {
  const d = parseDate(e.date);
  const fav = ctx.ud.events.includes(e.id);
  const modeIcon = e.mode === 'Virtual' ? 'monitor' : e.loc === 'Internacional' ? 'globe' : 'pin';
  return html`<article className=${cx('flex gap-3 sm:gap-4 rounded-2xl bg-white border border-line hover:border-violet/30 transition', compact ? 'p-3' : 'p-4')}>
    <div className=${cx('shrink-0 rounded-2xl text-center grid content-center', compact ? 'w-14 h-14' : 'w-16 h-[72px]', e.loc === 'Medellín' ? 'bg-teal-soft text-teal-d' : e.loc === 'Virtual' ? 'bg-violet-soft text-violet-d' : 'bg-mist text-ink')}>
      <span className="font-mono text-[11px] uppercase">${MONTHS[d.getMonth()]}</span><span className=${cx('font-display font-extrabold leading-none', compact ? 'text-[20px]' : 'text-[26px]')}>${d.getDate()}</span>
    </div>
    <div className="min-w-0 flex-1">
      ${!compact && html`<div className="flex flex-wrap items-center gap-1.5 mb-1"><span className="rounded-full bg-ink/[.06] px-2 py-0.5 text-[11.5px] font-bold text-ink/70">${e.loc === 'Medellín' ? 'Medellín y ciudad' : e.loc}</span><span className="rounded-full bg-ink/[.06] px-2 py-0.5 text-[11.5px] font-bold text-ink/70">${e.cat}</span><span className="rounded-full bg-sun/20 px-2 py-0.5 text-[11px] font-bold text-[#7A4B00]">Demo</span></div>`}
      <h3 className=${cx('font-bold text-ink leading-snug', compact ? 'text-[14px] line-clamp-2' : 'text-[16px]')}>${e.name}</h3>
      <p className="text-[13px] text-mute mt-0.5 flex items-center gap-1.5 truncate"><${Icon} name=${modeIcon} size=${13} />${e.mode === 'Virtual' ? 'Virtual' : e.place}${!compact ? ' · ' + e.mode : ''}</p>
      ${!compact && html`<p className="text-[14px] text-ink/75 mt-1.5 line-clamp-2">${e.desc}</p><p className="text-[12.5px] text-mute mt-1">${e.org}</p>`}
    </div>
    ${!compact && html`<div className="flex flex-col gap-2 shrink-0 self-center">
      <button className=${btnS + ' !px-3 !py-2 text-[14px]'} onClick=${() => ctx.openEvent(e.id)}>Ver información</button>
      <button className=${cx(btn, 'px-3 py-2 text-[13px] border', fav ? 'bg-teal-soft border-teal-d/30 text-teal-d' : 'bg-white border-line text-ink/70')} onClick=${() => ctx.toggleEvent(e.id)} aria-pressed=${fav}>${fav ? html`<${Icon} name="check" size=${14} sw=${3} /> En mi agenda` : html`<${Icon} name="plus" size=${14} /> Me interesa`}</button>
    </div>`}
    ${compact && html`<button className="self-center text-violet-d p-1.5 rounded-lg hover:bg-violet-soft" aria-label="Ver información" onClick=${() => ctx.openEvent(e.id)}><${Icon} name="chev" size=${18} /></button>`}
  </article>`;
}
const upcoming = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return EVENTS.filter(e => parseDate(e.date) >= t).sort((a, b) => parseDate(a.date) - parseDate(b.date)); };
function Events({ ctx }) {
  const [loc, setLoc] = useState('Todos');
  const [mode, setMode] = useState('');
  const [when, setWhen] = useState('all');
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const lim = when === '30' ? 30 : when === '90' ? 90 : 9999;
  const list = upcoming().filter(e => (loc === 'Todos' || e.loc === loc) && (!mode || e.mode === mode) && (parseDate(e.date) - now) / 864e5 <= lim);
  const byMonth = list.reduce((acc, e) => { const d = parseDate(e.date); const k = d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }); (acc[k] = acc[k] || []).push(e); return acc; }, {});
  return html`<div>
    <${PageHead} eyebrow="Agenda" title="Eventos educativos" desc="Encuentros sobre educación, innovación y tecnología en Medellín, Colombia, el mundo y en línea." />
    <${DanielTip} section="eventos" />
    <p className="mb-5 flex gap-2 items-start rounded-2xl bg-sun/[.12] border border-sun/40 px-4 py-3 text-[14px] text-ink/80"><${Icon} name="info" size=${17} className="mt-0.5 text-[#8A5300]" />Eventos de demostración. Nombres, fechas y organizaciones son ficticios y no enlazan a inscripciones reales.</p>
    <div data-guide="ev-filters" className="rounded-3xl bg-white border border-line p-4 grid gap-3 mb-6">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">${[['Todos', 'Todos'], ['Medellín', 'Medellín y ciudad'], ['Colombia', 'Colombia'], ['Internacional', 'Internacionales'], ['Virtual', 'Virtuales']].map(([k, l]) => html`<${Chip} key=${k} active=${loc === k} onClick=${() => setLoc(k)}>${l}<//>`)}</div>
      <div className="grid grid-cols-2 gap-2 sm:max-w-md">
        <div><label htmlFor="ev-mode" className="sr-only">Modalidad</label><select id="ev-mode" className=${inputC + ' !py-2 !text-[14px]'} value=${mode} onChange=${e => setMode(e.target.value)}><option value="">Toda modalidad</option><option>Presencial</option><option>Virtual</option><option>Híbrido</option></select></div>
        <div><label htmlFor="ev-when" className="sr-only">Fecha</label><select id="ev-when" className=${inputC + ' !py-2 !text-[14px]'} value=${when} onChange=${e => setWhen(e.target.value)}><option value="all">Todas las fechas</option><option value="30">Próximos 30 días</option><option value="90">Próximos 3 meses</option></select></div>
      </div>
    </div>
    ${list.length ? Object.entries(byMonth).map(([m, es], mi) => html`<section key=${m} data-guide=${mi === 0 ? 'ev-list' : undefined} className="mb-6 rounded-2xl"><h2 className="font-display text-[17px] font-bold text-ink capitalize mb-3">${m}</h2><div className="grid gap-3">${es.map(e => html`<${EventRow} key=${e.id} e=${e} ctx=${ctx} />`)}</div></section>`)
      : html`<${Empty} title="No hay eventos con esos filtros" action=${html`<button className=${btnS} onClick=${() => { setLoc('Todos'); setMode(''); setWhen('all'); }}>Ver todos los eventos</button>`}>¿Conoces un encuentro que valga la pena? Compártelo en la comunidad para que otros profes se enteren.<//>`}
  </div>`;
}
function EventModal({ id, ctx, onClose }) {
  const e = id && EVENTS.find(x => x.id === id);
  const fav = e && ctx.ud.events.includes(e.id);
  return html`<${Modal} open=${!!e} onClose=${onClose} size="max-w-lg" label="Evento">
    ${e && html`<div className="p-6 sm:p-8">
      <${CloseBtn} onClick=${onClose} />
      <div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-ink/[.06] px-2 py-0.5 text-[12px] font-bold text-ink/70">${e.loc}</span><span className="rounded-full bg-ink/[.06] px-2 py-0.5 text-[12px] font-bold text-ink/70">${e.cat}</span><span className="rounded-full bg-sun/20 px-2 py-0.5 text-[12px] font-bold text-[#7A4B00]">Evento de demostración</span></div>
      <h2 className="font-display text-[24px] font-extrabold text-ink mt-3 leading-tight pr-8 balance">${e.name}</h2>
      <dl className="mt-4 grid gap-2.5 text-[15px]">
        <div className="flex gap-2.5"><dt className="text-violet-d"><${Icon} name="calendar" size=${18} /></dt><dd className="text-ink capitalize">${fmtLong(e.date)}</dd></div>
        <div className="flex gap-2.5"><dt className="text-violet-d"><${Icon} name=${e.mode === 'Virtual' ? 'monitor' : 'pin'} size=${18} /></dt><dd className="text-ink">${e.place} · ${e.mode}</dd></div>
        <div className="flex gap-2.5"><dt className="text-violet-d"><${Icon} name="users" size=${18} /></dt><dd className="text-ink">${e.org}</dd></div>
      </dl>
      <p className="mt-4 text-[15.5px] text-ink/80 leading-relaxed">${e.desc}</p>
      <p className="mt-4 text-[13px] text-mute rounded-xl bg-mist px-3 py-2">En producción, este botón llevará a la página oficial de inscripción del organizador.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className=${fav ? btnS : btnP} onClick=${() => ctx.toggleEvent(e.id)}>${fav ? html`<${Icon} name="check" size=${16} sw=${3} /> En mi agenda` : html`<${Icon} name="plus" size=${16} /> Me interesa`}</button>
        <button className=${btnS} onClick=${() => ctx.toast('Inscripción simulada: este evento es de demostración.', 'info')}>Inscribirme</button>
      </div>
    </div>`}
  <//>`;
}

/* ===================== GUARDADOS ===================== */
function Saved({ ctx }) {
  const [tab, setTab] = useState('res');
  const res = RESOURCES.filter(r => ctx.ud.savedRes.includes(r.id));
  const ps = ctx.posts.filter(p => ctx.ud.savedPosts.includes(p.id));
  const evs = EVENTS.filter(e => ctx.ud.events.includes(e.id));
  const tabs = [['res', 'Recursos', res.length], ['posts', 'Publicaciones', ps.length], ['events', 'Mi agenda', evs.length]];
  return html`<div>
    <${PageHead} eyebrow="Tu colección" title="Mis guardados" desc="Lo que separaste para volver a mirar con calma." />
    <${DanielTip} section="guardados" />
    <div data-guide="sv-tabs" className="flex gap-1 p-1 rounded-2xl bg-white border border-line w-fit mb-6 max-w-full overflow-x-auto" role="tablist">
      ${tabs.map(([k, l, n]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)} className=${cx('rounded-xl px-3.5 py-2 text-[14px] font-bold whitespace-nowrap transition', tab === k ? 'bg-ink text-white' : 'text-mute hover:text-ink')}>${l} <span className="font-mono text-[12px] opacity-70">${n}</span></button>`)}
    </div>
    ${tab === 'res' && (res.length ? html`<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">${res.map(r => html`<${ResourceCard} key=${r.id} r=${r} ctx=${ctx} />`)}</div>`
      : html`<${Empty} title="Aún no has guardado recursos" action=${html`<button className=${btnP} onClick=${() => ctx.go('recursos')}>Explorar recursos</button>`}>Cuando algo te llame la atención, guárdalo con el marcador. Yo tengo una carpeta llena de ideas que todavía no me atrevo a probar.<//>`)}
    ${tab === 'posts' && (ps.length ? html`<div className="grid gap-4 max-w-3xl">${ps.map(p => html`<${PostCard} key=${p.id} post=${p} ctx=${ctx} />`)}</div>`
      : html`<${Empty} title="No tienes publicaciones guardadas" action=${html`<button className=${btnP} onClick=${() => ctx.go('comunidad')}>Ir a la comunidad</button>`}>Guarda las experiencias que quieras adaptar más adelante.<//>`)}
    ${tab === 'events' && (evs.length ? html`<div className="grid gap-3 max-w-3xl">${evs.map(e => html`<${EventRow} key=${e.id} e=${e} ctx=${ctx} />`)}</div>`
      : html`<${Empty} title="Tu agenda está libre" action=${html`<button className=${btnP} onClick=${() => ctx.go('eventos')}>Ver eventos</button>`}>Marca "Me interesa" en un evento para tenerlo a mano.<//>`)}
  </div>`;
}

/* ===================== PERFIL ===================== */
function Profile({ ctx }) {
  const { me, ud } = ctx;
  const [edit, setEdit] = useState(false);
  const [asOthers, setAsOthers] = useState(false);
  const [tab, setTab] = useState('posts');
  const [confirmReset, setConfirmReset] = useState(false);
  const myPosts = ctx.posts.filter(p => p.author === me.email);
  const exps = myPosts.filter(p => p.kind === 'full' || p.linkedResource || p.linkedCourse || p.linkedPost);
  const started = COURSES.filter(c => courseProg(c, ud).done > 0);
  const savedRes = RESOURCES.filter(r => ud.savedRes.includes(r.id));
  const v = me.visibility;
  const show = k => !asOthers || v[k];
  const person = ctx.authorOf(me.email, true);
  const stats = [['Recursos guardados', savedRes.length, 'bookmark'], ['Cursos iniciados', started.length, 'cap'], ['Publicaciones', myPosts.length, 'message'], ['Experiencias compartidas', exps.length, 'sparkles']];
  const tabs = [['posts', 'Publicaciones', myPosts.length], ['exps', 'Experiencias', exps.length], ['saved', 'Recursos guardados', savedRes.length], ['courses', 'Cursos', started.length]];
  return html`<div>
    <div data-guide="pf-head" className="rounded-[28px] bg-white border border-line overflow-hidden">
      <div className="h-28 sm:h-36 profile-cover relative"><span className="absolute right-6 -bottom-10 font-display font-extrabold text-[160px] leading-none text-white/15 select-none" aria-hidden="true">¿</span></div>
      <div className="px-5 sm:px-8 pb-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 -mt-12">
          <${Avatar} person=${person} size=${104} className="ring-4 ring-white" />
          <div className="flex flex-wrap gap-2">
            <button className=${cx(btn, 'px-3 py-2 border text-[14px]', asOthers ? 'bg-violet-soft border-violet/30 text-violet-d' : 'bg-white border-line text-ink')} onClick=${() => setAsOthers(!asOthers)} aria-pressed=${asOthers}><${Icon} name="eye" size=${16} />${asOthers ? 'Viendo como otros docentes' : 'Ver como otros docentes'}</button>
            <button className=${btnP + ' !py-2'} onClick=${() => setEdit(true)}><${Icon} name="edit" size=${16} /> Editar perfil</button>
          </div>
        </div>
        <h1 className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold text-ink mt-3">${me.name}</h1>
        <p className="text-mute text-[15px] flex flex-wrap gap-x-3 gap-y-1 mt-0.5">${show('institution') && html`<span className="inline-flex items-center gap-1.5"><${Icon} name="landmark" size=${15} />${me.institution}</span>`}${show('city') && html`<span className="inline-flex items-center gap-1.5"><${Icon} name="pin" size=${15} />${me.city}</span>`}</p>
        ${show('bio') && me.bio && html`<p className="mt-3 text-[16px] text-ink/80 max-w-2xl leading-relaxed">${me.bio}</p>`}
        ${!me.bio && !asOthers && html`<button className="mt-3 text-[14px] font-bold text-violet-d hover:underline" onClick=${() => setEdit(true)}>+ Agrega una biografía breve</button>`}
        <div className="mt-4 flex flex-wrap gap-1.5">
          ${show('areas') && me.areas.map(a => html`<span key=${a} className="rounded-full px-2.5 py-1 text-[12.5px] font-bold" style=${{ background: AREA_STYLE[a].bg, color: AREA_STYLE[a].c }}>${a}</span>`)}
          ${show('grades') && me.grades.map(g => html`<${GradePill} key=${g} g=${g} />`)}
        </div>
        ${asOthers && html`<p className="mt-4 text-[13px] text-violet-d bg-violet-soft rounded-xl px-3 py-2 inline-flex items-center gap-2"><${Icon} name="eye" size=${15} />Así ven tu perfil otros docentes. Tu correo nunca es visible.</p>`}
      </div>
    </div>

    <${DanielTip} section="perfil" className="mt-5" />
    <${PointsPanel} ctx=${ctx} />
    <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
      ${stats.map(([l, n, i]) => html`<div key=${l} className="rounded-2xl bg-white border border-line p-4"><span className="text-violet-d"><${Icon} name=${i} size=${18} /></span><p className="font-display text-[28px] font-extrabold text-ink mt-1 leading-none">${n}</p><p className="text-[13px] text-mute mt-1">${l}</p></div>`)}
    </div>

    <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
      <section className="min-w-0">
        <div className="flex gap-1 p-1 rounded-2xl bg-white border border-line w-fit mb-4 max-w-full overflow-x-auto" role="tablist">
          ${tabs.map(([k, l, n]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)} className=${cx('rounded-xl px-3 py-2 text-[14px] font-bold whitespace-nowrap transition', tab === k ? 'bg-ink text-white' : 'text-mute hover:text-ink')}>${l} <span className="font-mono text-[12px] opacity-70">${n}</span></button>`)}
        </div>
        ${(tab === 'posts' || tab === 'exps') && ((tab === 'posts' ? myPosts : exps).length ? html`<div className="grid gap-4">${(tab === 'posts' ? myPosts : exps).map(p => html`<${PostCard} key=${p.id} post=${p} ctx=${ctx} />`)}</div>`
          : html`<${Empty} title=${tab === 'posts' ? 'Todavía no has publicado' : 'Aún no has compartido experiencias'} action=${html`<button className=${btnP} onClick=${() => ctx.openComposer({})}>Compartir una experiencia</button>`}>¿Probaste algo nuevo en clase? Cuéntanos cómo te fue. No tiene que haber salido perfecto.<//>`)}
        ${tab === 'saved' && (savedRes.length ? html`<div className="grid sm:grid-cols-2 gap-4">${savedRes.map(r => html`<${ResourceCard} key=${r.id} r=${r} ctx=${ctx} />`)}</div>` : html`<${Empty} title="Sin recursos guardados" action=${html`<button className=${btnP} onClick=${() => ctx.go('recursos')}>Explorar recursos</button>`}>Guarda recursos para encontrarlos aquí.<//>`)}
        ${tab === 'courses' && (started.length ? html`<div className="grid gap-3">${started.map(c => { const p = courseProg(c, ud); return html`<button key=${c.id} className="flex items-center gap-4 rounded-2xl bg-white border border-line p-4 text-left hover:border-violet/30" onClick=${() => ctx.openCourse(c.id)}><span className="grid place-items-center w-11 h-11 rounded-xl text-white shrink-0" style=${{ background: c.color }}><${Icon} name=${c.icon} size=${20} /></span><div className="min-w-0 flex-1"><p className="font-bold text-ink">${c.title}</p><${Progress} value=${p.pct} color=${c.color} className="mt-2" /></div><span className="font-mono text-[14px] text-ink">${p.pct}%</span></button>`; })}</div>` : html`<${Empty} title="Aún no has empezado cursos" action=${html`<button className=${btnP} onClick=${() => ctx.go('cursos')}>Ver cursos</button>`}>Los cursos son cortos y puedes avanzar a tu ritmo.<//>`)}
      </section>
      <aside className="grid gap-4">
        <div className="rounded-3xl bg-white border border-line p-5">
          <p className="font-bold text-ink flex items-center gap-2"><${Icon} name="shield" size=${18} /> Verificación de la cuenta</p>
          <ul className="mt-3 grid gap-3">
            <li className="flex gap-3"><span className="grid place-items-center w-7 h-7 rounded-full bg-teal-d text-white shrink-0"><${Icon} name="check" size=${14} sw=${3} /></span><div><p className="font-bold text-ink text-[14px]">Correo verificado</p><p className="text-[13px] text-mute">${me.method === 'google' ? 'Confirmado con Google' : 'Confirmado por enlace'}</p></div></li>
            <li className="flex gap-3"><span className="grid place-items-center w-7 h-7 rounded-full bg-teal-d text-white shrink-0"><${Icon} name="check" size=${14} sw=${3} /></span><div><p className="font-bold text-ink text-[14px]">Condición docente verificada</p><p className="text-[13px] text-mute">${me.reviewPath === 'domain' ? 'Por dominio institucional' : 'Por validación manual'}</p></div></li>
          </ul>
          <div className="mt-4 rounded-xl bg-mist px-3 py-2.5 text-[13px] text-ink/75 flex gap-2"><${Icon} name="lock" size=${15} className="mt-0.5" /><span><strong className="text-ink">${me.email}</strong><br/>Privado. Ni tu correo ni los datos de verificación se muestran a otros docentes.</span></div>
        </div>
        <div data-guide="pf-privacy" className="rounded-3xl bg-white border border-line p-5">
          <p className="font-bold text-ink">Visible para otros docentes</p>
          <ul className="mt-2 grid gap-1 text-[14px]">${[['institution', 'Institución educativa'], ['city', 'Ciudad'], ['areas', 'Áreas de enseñanza'], ['grades', 'Grados'], ['bio', 'Biografía']].map(([k, l]) => html`<li key=${k} className="flex items-center justify-between"><span className="text-ink/80">${l}</span><span className=${cx('inline-flex items-center gap-1 text-[12.5px] font-bold', v[k] ? 'text-teal-d' : 'text-mute')}><${Icon} name=${v[k] ? 'eye' : 'eyeoff'} size=${14} />${v[k] ? 'Visible' : 'Oculto'}</span></li>`)}</ul>
          <button className=${btnS + ' w-full mt-3 !py-2 text-[14px]'} onClick=${() => setEdit(true)}>Cambiar privacidad</button>
        </div>
        <div className="rounded-3xl bg-white border border-line p-5 flex gap-3 items-start">
          <${DanielAvatar} size=${40} />
          <div className="min-w-0"><p className="font-bold text-ink text-[14px]">Guías de Daniel</p><p className="text-[13px] text-mute mt-0.5">${ud.guidesOff ? 'Las guías automáticas están apagadas.' : 'Daniel te explica cada sección la primera vez que entras.'}</p>
          <button className=${btnS + ' mt-3 !py-2 text-[14px]'} onClick=${ctx.resetGuides}><${Icon} name="refresh" size=${15} /> Volver a ver las guías</button></div>
        </div>
        <div className="rounded-3xl border border-dashed border-line p-5">
          <p className="font-bold text-ink text-[14px]">Datos de la demostración</p>
          <p className="text-[13px] text-mute mt-1">Borra la sesión, las publicaciones nuevas y los guardados para presentar el prototipo desde cero.</p>
          ${confirmReset ? html`<div className="mt-3 flex gap-2"><button className=${btn + ' bg-[#B42318] text-white px-3 py-2 text-[14px] flex-1'} onClick=${ctx.resetDemo}>Sí, restablecer</button><button className=${btnS + ' !py-2 text-[14px]'} onClick=${() => setConfirmReset(false)}>Cancelar</button></div>`
            : html`<button className=${btnS + ' w-full mt-3 !py-2 text-[14px]'} onClick=${() => setConfirmReset(true)}><${Icon} name="refresh" size=${15} /> Restablecer demostración</button>`}
        </div>
      </aside>
    </div>
    <${EditProfile} open=${edit} me=${me} onClose=${() => setEdit(false)} onSave=${patch => { ctx.updateMe(patch); setEdit(false); ctx.toast('Perfil actualizado.'); }} />
  </div>`;
}
function EditProfile({ open, me, onClose, onSave }) {
  const [f, setF] = useState(null);
  const [errs, setErrs] = useState({});
  useEffect(() => { if (open) { setF({ name: me.name, email: me.email, institution: me.institution, city: me.city, areas: [...me.areas], grades: [...me.grades], bio: me.bio || '', photo: me.photo, visibility: { ...me.visibility } }); setErrs({}); } }, [open]);
  if (!f) return null;
  const onPhoto = async e => { const file = e.target.files && e.target.files[0]; if (!file) return; try { const d = await resizeImage(file, 240); setF(p => ({ ...p, photo: d })); } catch (x) {} e.target.value = ''; };
  const save = e => { e.preventDefault(); const er = validateProfile(f, false); setErrs(er); if (!Object.keys(er).length) onSave({ name: f.name.trim(), institution: f.institution.trim(), city: f.city.trim(), areas: f.areas, grades: f.grades, bio: f.bio.trim(), photo: f.photo, visibility: f.visibility }); };
  const setVis = (k, val) => setF(p => ({ ...p, visibility: { ...p.visibility, [k]: val } }));
  return html`<${Modal} open=${open} onClose=${onClose} size="max-w-2xl" label="Editar perfil">
    <${CloseBtn} onClick=${onClose} />
    <form onSubmit=${save} noValidate>
      <div className="p-5 sm:p-7 grid gap-5">
        <h2 className="font-display text-[24px] font-extrabold text-ink">Editar perfil</h2>
        <div className="flex items-center gap-4">
          <${Avatar} person=${{ name: f.name, photo: f.photo, color: me.color }} size=${72} />
          <div className="flex flex-wrap gap-2"><label className=${btnS + ' cursor-pointer !py-2 text-[14px]'}><${Icon} name="image" size=${16} /> Cambiar foto<input id="ep-photo" type="file" accept="image/*" className="sr-only" onChange=${onPhoto} /></label>${f.photo && html`<button type="button" className=${btnG + ' text-[14px]'} onClick=${() => setF({ ...f, photo: null })}>Quitar</button>`}</div>
        </div>
        <${ProfileFields} f=${f} set=${setF} errs=${errs} idp="ep" />
        <div><label className=${labelC} htmlFor="ep-bio">Biografía breve</label><textarea id="ep-bio" rows="3" maxLength="280" className=${inputC} value=${f.bio} onChange=${e => setF({ ...f, bio: e.target.value })} placeholder="Qué enseñas, qué te interesa probar en el aula…"></textarea><p className="text-right text-[12px] text-mute font-mono mt-1">${f.bio.length}/280</p></div>
        <fieldset className="rounded-2xl bg-mist p-4"><legend className="sr-only">Privacidad</legend>
          <p className="font-bold text-ink">¿Qué pueden ver otros docentes?</p>
          <p className="text-[13px] text-mute">Tu nombre siempre es visible. Tu correo y los datos de verificación nunca lo son.</p>
          <div className="mt-2 divide-y divide-line">${[['institution', 'Institución educativa'], ['city', 'Ciudad o municipio'], ['areas', 'Áreas de enseñanza'], ['grades', 'Grados que enseño'], ['bio', 'Biografía']].map(([k, l]) => html`<${Switch} key=${k} id=${'vis-' + k} label=${l} checked=${f.visibility[k]} onChange=${val => setVis(k, val)} />`)}</div>
        </fieldset>
      </div>
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-line px-5 sm:px-7 py-4 flex justify-end gap-3"><button type="button" className=${btnS} onClick=${onClose}>Cancelar</button><button className=${btnP}>Guardar cambios</button></div>
    </form>
  <//>`;
}
