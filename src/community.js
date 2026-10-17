/* ===================== PUBLICACIONES ===================== */
function CatPill({ cat }) {
  const s = CAT_STYLE[cat] || CAT_STYLE['Ideas para el aula'];
  return html`<${Tag} style=${{ background: s.bg, color: s.c }}><${Icon} name=${s.icon} size=${13} />${cat}<//>`;
}

function PostCard({ post, ctx }) {
  const { ud, authorOf, toggleLike, toggleSavePost, addComment, openShare, openResource, openComposer, openCourse, posts, me } = ctx;
  const a = authorOf(post.author);
  const liked = ud.likes.includes(post.id);
  const saved = ud.savedPosts.includes(post.id);
  const [open, setOpen] = useState(false);
  const [txt, setTxt] = useState('');
  const [more, setMore] = useState(false);
  const [bump, setBump] = useState(false);
  const res = post.linkedResource && RES_BY_ID[post.linkedResource];
  const course = post.linkedCourse && COURSE_BY_ID[post.linkedCourse];
  const parent = post.linkedPost && posts.find(p => p.id === post.linkedPost);
  const versions = posts.filter(p => p.linkedPost === post.id).length;
  const details = [['Lo que buscaba que comprendieran', post.problem], ['Estrategia', post.strategy], ['Preguntas que surgieron', post.questions], ['Dónde se trabaron y cómo salieron', post.stuck], ['Cómo noté que comprendían', post.results], ['Herramientas y fuentes', post.tools], ['Recomendación', post.recommend]].filter(x => x[1]);
  const long = post.body.length > 280;
  const likeCount = (post.likes || 0) + (liked ? 1 : 0);
  const like = () => { toggleLike(post.id); if (!liked) { setBump(true); setTimeout(() => setBump(false), 350); } };
  const send = e => { e.preventDefault(); if (!txt.trim()) return; addComment(post.id, txt.trim()); setTxt(''); };
  const meta = [a.inst, a.city].filter(Boolean).join(' · ');
  return html`<article className="rounded-3xl bg-white border border-line p-4 sm:p-5 hover:border-violet/25 transition">
    <header className="flex items-start gap-3">
      <${Avatar} person=${a} size=${42} />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ink text-[15px] leading-tight flex items-center gap-1.5 flex-wrap">${a.name}${a.daniel && html`<span className="rounded-full bg-violet text-white text-[10.5px] px-1.5 py-0.5 font-bold">Anfitrión</span>`}${post.author === me.email && html`<span className="rounded-full bg-ink/[.07] text-ink/70 text-[10.5px] px-1.5 py-0.5 font-bold">Tú</span>`}</p>
        <p className="text-[13px] text-mute truncate">${meta ? meta + ' · ' : ''}${ago(post.date)}</p>
      </div>
      <${CatPill} cat=${post.cat} />
    </header>
    ${parent && html`<p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-violet-d font-semibold"><${Icon} name="branch" size=${14} /> Nueva versión de “${parent.title.length > 60 ? parent.title.slice(0, 60) + '…' : parent.title}”</p>`}
    <h3 className="font-display text-[19px] font-bold text-ink leading-snug mt-3 balance">${post.title}</h3>
    <div className="mt-2 flex flex-wrap gap-1.5 items-center">${post.grade && html`<${GradePill} g=${post.grade} />`}${post.area && html`<span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[12px] font-semibold" style=${{ background: (AREA_STYLE[post.area] || {}).bg, color: (AREA_STYLE[post.area] || {}).c }}>${post.area}</span>`}${post.proc && post.proc.length > 0 && html`<${ProcChips} proc=${post.proc} small />`}</div>
    <p className=${cx('mt-3 text-[15.5px] text-ink/85 leading-relaxed whitespace-pre-line', !more && long && 'line-clamp-4')}>${post.body}</p>
    ${long && html`<button className="mt-1 text-[14px] font-bold text-violet-d hover:underline" onClick=${() => setMore(!more)}>${more ? 'Ver menos' : 'Ver más'}</button>`}
    ${details.length > 0 && html`<details className="mt-3 group rounded-2xl bg-mist border border-line">
      <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-2.5 text-[14px] font-bold text-ink">Cómo fue el proceso de aprendizaje <span className="text-mute group-open:rotate-180 transition"><${Icon} name="chevdown" size=${17} /></span></summary>
      <dl className="grid sm:grid-cols-2 gap-3 px-4 pb-4">${details.map(([k, v]) => html`<div key=${k}><dt className="text-[11.5px] font-bold uppercase tracking-[.08em] text-violet-d">${k}</dt><dd className="text-[14px] text-ink/85 mt-0.5 leading-snug">${v}</dd></div>`)}</dl>
    </details>`}
    ${post.image && html`<img src=${post.image} alt="Imagen adjunta" className="mt-3 rounded-2xl w-full max-h-[360px] object-cover border border-line" />`}
    ${post.attachment && html`<button className="mt-3 flex items-center gap-3 w-full rounded-2xl border border-line px-3 py-2.5 text-left hover:bg-mist transition" onClick=${() => ctx.toast('Descarga simulada: ' + post.attachment.name, 'info')}><span className="grid place-items-center w-9 h-9 rounded-xl bg-violet-soft text-violet-d"><${Icon} name="paperclip" size=${17} /></span><span className="text-[14px] font-semibold text-ink truncate">${post.attachment.name}</span><span className="ml-auto text-mute"><${Icon} name="download" size=${17} /></span></button>`}
    ${(res || course) && html`<div className="mt-3 flex flex-wrap gap-2">
      ${res && html`<button className="inline-flex items-center gap-2 rounded-xl border border-teal-d/25 bg-teal-soft px-3 py-2 text-[13px] font-semibold text-teal-d hover:border-teal-d/50 transition max-w-full" onClick=${() => openResource(res.id)}><${Icon} name="book" size=${15} /><span className="truncate">Basado en: ${res.title}</span></button>`}
      ${course && html`<button className="inline-flex items-center gap-2 rounded-xl border border-violet/25 bg-violet-soft px-3 py-2 text-[13px] font-semibold text-violet-d max-w-full" onClick=${() => openCourse(course.id)}><${Icon} name="cap" size=${15} /><span className="truncate">Aplicación del curso: ${course.title}</span></button>`}
    </div>`}
    ${post.tags && post.tags.length > 0 && html`<p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-mute">${post.tags.map(t => html`<span key=${t}>#${t.replace(/\s+/g, '')}</span>`)}</p>`}
    <footer className="mt-3 pt-2 border-t border-line flex items-center gap-0.5 sm:gap-1 flex-wrap">
      <button onClick=${like} aria-pressed=${liked} className=${cx('inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-semibold transition', liked ? 'text-[#D6336C] bg-[#FDECF2]' : 'text-ink/70 hover:bg-ink/5')}><span className=${bump ? 'heart-bump' : ''}><${Icon} name="heart" size=${18} fill=${liked ? 'currentColor' : 'none'} /></span>${likeCount}<span className="sr-only">me gusta</span></button>
      <button onClick=${() => setOpen(!open)} aria-expanded=${open} className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-semibold text-ink/70 hover:bg-ink/5"><${Icon} name="message" size=${18} />${post.comments.length}<span className="hidden sm:inline">comentarios</span></button>
      <button onClick=${() => toggleSavePost(post.id)} aria-pressed=${saved} className=${cx('inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-semibold transition', saved ? 'text-violet-d bg-violet-soft' : 'text-ink/70 hover:bg-ink/5')}><${Icon} name="bookmark" size=${18} fill=${saved ? 'currentColor' : 'none'} /><span className="hidden sm:inline">${saved ? 'Guardada' : 'Guardar'}</span></button>
      <button onClick=${() => openShare(post.id)} className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-semibold text-ink/70 hover:bg-ink/5"><${Icon} name="share" size=${18} /><span className="hidden sm:inline">Compartir</span></button>
      ${post.author !== me.email && html`<button onClick=${() => openComposer({ linkedPost: post.id, linkedResource: post.linkedResource, cat: post.cat === 'Preguntas entre docentes' ? 'Experiencias exitosas' : post.cat, grade: post.grade, area: post.area })} className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-bold text-violet-d hover:bg-violet-soft" title="Publica tu propia versión de esta idea"><${Icon} name="branch" size=${17} />Crear mi versión${versions > 0 ? html`<span className="font-mono text-[11px] bg-violet-soft rounded px-1">${versions}</span>` : ''}</button>`}
    </footer>
    ${open && html`<div className="mt-2 grid gap-3">
      ${post.comments.length === 0 && html`<p className="text-[14px] text-mute px-1">Todavía no hay comentarios. ¿Qué le preguntarías a ${a.daniel ? 'Daniel' : a.name.split(' ')[0]}?</p>`}
      ${post.comments.map(c => { const ca = authorOf(c.a); return html`<div key=${c.id} className="flex gap-2.5">
        <${Avatar} person=${ca} size=${32} />
        <div className="min-w-0 flex-1 rounded-2xl bg-mist px-3.5 py-2.5"><p className="text-[13px]"><strong className="text-ink">${ca.name}</strong> <span className="text-mute">· ${ago(c.d)}</span></p><p className="text-[14.5px] text-ink/85 leading-snug mt-0.5">${c.t}</p></div>
      </div>`; })}
      <form onSubmit=${send} className="flex gap-2 items-center">
        <${Avatar} person=${authorOf(me.email)} size=${32} />
        <label htmlFor=${'cm-' + post.id} className="sr-only">Escribe un comentario</label>
        <input id=${'cm-' + post.id} className=${inputC + ' !py-2 !rounded-full'} placeholder="Escribe un comentario…" value=${txt} onChange=${e => setTxt(e.target.value)} />
        <button className=${cx(btn, 'w-10 h-10 shrink-0 rounded-full bg-violet text-white hover:bg-violet-d')} disabled=${!txt.trim()} aria-label="Enviar comentario"><${Icon} name="send" size=${16} /></button>
      </form>
    </div>`}
  </article>`;
}

/* ===================== COMPOSITOR ===================== */
function Composer({ open, init, me, onClose, onPublish, posts }) {
  const blank = () => ({ kind: 'full', title: '', cat: 'Experiencias exitosas', grade: (me.grades || [])[0] || 'all', area: (me.areas || [])[0] || 'Transversales', body: '', problem: '', strategy: '', questions: '', stuck: '', results: '', tools: '', recommend: '', proc: [], tags: '', image: null, attachment: null, linkedResource: null, linkedCourse: null, linkedPost: null });
  const [f, setF] = useState(blank());
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { const b = blank(); setF({ ...b, ...(init || {}), kind: (init && init.kind) || (init && init.cat === 'Preguntas entre docentes' ? 'short' : 'full') }); setErr(''); } }, [open]);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const res = f.linkedResource && RES_BY_ID[f.linkedResource];
  const course = f.linkedCourse && COURSE_BY_ID[f.linkedCourse];
  const parent = f.linkedPost && posts.find(p => p.id === f.linkedPost);
  const onImg = async e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    if (file.type.startsWith('image/')) { setBusy(true); try { set('image', await resizeImage(file, 1000)); } catch (x) { setErr('No pudimos leer la imagen. Prueba con otro archivo JPG o PNG.'); } setBusy(false); }
    else set('attachment', { name: file.name });
    e.target.value = '';
  };
  const publish = e => {
    e.preventDefault();
    if (f.kind === 'short' ? !f.body.trim() : !f.title.trim()) { setErr(f.kind === 'short' ? 'Escribe tu pregunta o idea para publicarla.' : 'Ponle un título a tu experiencia.'); return; }
    const title = f.title.trim() || (f.body.trim().length > 90 ? f.body.trim().slice(0, 88) + '…' : f.body.trim());
    onPublish({ ...f, title, body: f.body.trim() || '', tags: f.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) });
  };
  const ta = (id, label, k, ph, rows = 2) => html`<div><label className=${labelC} htmlFor=${id}>${label} <span className="font-normal text-mute">(opcional)</span></label><textarea id=${id} rows=${rows} className=${inputC} value=${f[k]} placeholder=${ph} onChange=${e => set(k, e.target.value)}></textarea></div>`;
  return html`<${Modal} open=${open} onClose=${onClose} size="max-w-2xl" label="Compartir una experiencia">
    <${CloseBtn} onClick=${onClose} />
    <form onSubmit=${publish} noValidate>
      <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-line">
        <p className="font-mono text-[12px] uppercase tracking-[.16em] text-violet-d">${parent ? 'Cocrear' : res ? 'Así lo apliqué en mi aula' : 'Compartir'}</p>
        <h2 className="font-display text-[24px] font-extrabold text-ink mt-1 pr-10">${parent ? 'Publica tu versión de esta idea' : 'Compartir una experiencia'}</h2>
        <div className="mt-4 inline-flex p-1 rounded-xl bg-mist border border-line">
          ${[['full', 'Experiencia completa'], ['short', 'Pregunta o idea breve']].map(([k, l]) => html`<button type="button" key=${k} onClick=${() => { set('kind', k); if (k === 'short' && f.cat === 'Experiencias exitosas') set('cat', 'Preguntas entre docentes'); if (k === 'full' && f.cat === 'Preguntas entre docentes') set('cat', 'Experiencias exitosas'); }} className=${cx('rounded-lg px-3 py-1.5 text-[13.5px] font-bold transition', f.kind === k ? 'bg-white shadow-sm text-ink' : 'text-mute')}>${l}</button>`)}
        </div>
      </div>
      <div className="px-5 sm:px-7 py-5 grid gap-4">
        ${(res || course || parent) && html`<div className="flex flex-wrap gap-2">
          ${res && html`<span className="inline-flex items-center gap-2 rounded-xl bg-teal-soft px-3 py-2 text-[13px] font-semibold text-teal-d max-w-full"><${Icon} name="book" size=${15} /><span className="truncate">Vinculado al recurso: ${res.title}</span></span>`}
          ${course && html`<span className="inline-flex items-center gap-2 rounded-xl bg-violet-soft px-3 py-2 text-[13px] font-semibold text-violet-d max-w-full"><${Icon} name="cap" size=${15} /><span className="truncate">Vinculado al curso: ${course.title}</span></span>`}
          ${parent && html`<span className="inline-flex items-center gap-2 rounded-xl bg-violet-soft px-3 py-2 text-[13px] font-semibold text-violet-d max-w-full"><${Icon} name="branch" size=${15} /><span className="truncate">Versión de: ${parent.title}</span></span>`}
        </div>`}
        <${DanielNote}>${f.kind === 'short' ? '¿Y si convertimos esa dificultad en una pregunta para la comunidad?' : 'No todas las ideas funcionan a la primera. Cuéntanos el camino y no solo el resultado: dónde se trabaron tus estudiantes y cómo salieron.'}<//>
        <div><label className=${labelC} htmlFor="cp-title">${f.kind === 'short' ? 'Título' : 'Título'} ${f.kind === 'short' && html`<span className="font-normal text-mute">(opcional)</span>`}</label><input id="cp-title" className=${inputC} value=${f.title} onChange=${e => set('title', e.target.value)} placeholder=${f.kind === 'short' ? 'Ej.: ¿Cómo evalúan la participación oral?' : 'Ej.: Debate sobre IA con 10.º: lo que pasó'} /></div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className=${labelC} htmlFor="cp-cat">Tipo de publicación</label><select id="cp-cat" className=${inputC} value=${f.cat} onChange=${e => set('cat', e.target.value)}>${CATS.map(c => html`<option key=${c}>${c}</option>`)}</select></div>
          <div><label className=${labelC} htmlFor="cp-grade">Grado</label><select id="cp-grade" className=${inputC} value=${f.grade} onChange=${e => set('grade', e.target.value)}><option value="all">Todos los grados</option>${GRADES.map(g => html`<option key=${g} value=${g}>${g}.º</option>`)}</select></div>
          <div><label className=${labelC} htmlFor="cp-area">Área</label><select id="cp-area" className=${inputC} value=${f.area} onChange=${e => set('area', e.target.value)}>${AREAS.map(a => html`<option key=${a}>${a}</option>`)}</select></div>
        </div>
        <div><label className=${labelC} htmlFor="cp-body">${f.kind === 'short' ? 'Tu pregunta o idea' : 'Descripción de la experiencia'}</label><textarea id="cp-body" rows=${f.kind === 'short' ? 4 : 4} className=${inputC} value=${f.body} onChange=${e => set('body', e.target.value)} placeholder=${f.kind === 'short' ? 'Cuéntale a la comunidad qué te estás preguntando…' : '¿Qué hiciste, con quiénes y cómo lo viviste?'}></textarea></div>
        ${f.kind === 'full' && html`<fieldset className="grid gap-3 rounded-2xl border border-line p-4">
          <legend className="px-1.5 font-display text-[16px] font-bold text-ink">El proceso de aprendizaje</legend>
          <div className="grid sm:grid-cols-2 gap-3">
            ${ta('cp-prob', '¿Qué querías que tus estudiantes comprendieran?', 'problem', 'Ej.: Que la lectura sirve para responder sus propias preguntas.')}
            ${ta('cp-strat', '¿Qué estrategia utilizaste?', 'strategy', 'Ej.: Club de lectura con roles.')}
            ${ta('cp-qs', '¿Qué preguntas surgieron en el camino?', 'questions', 'Las de ellos y las tuyas.')}
            ${ta('cp-stuck', '¿Dónde se trabaron y cómo se destrabaron?', 'stuck', 'El error también enseña.')}
            ${ta('cp-res', '¿Cómo notaste que estaban comprendiendo?', 'results', 'Ej.: Lo explicaron con sus palabras a otro grupo.')}
            ${ta('cp-tools', '¿Qué herramientas o fuentes usaron y cómo les ayudaron a pensar?', 'tools', 'Libros, videos, redes, IA, entrevistas…')}
          </div>
          ${ta('cp-rec', '¿Qué recomendarías a otros docentes?', 'recommend', 'Lo que harías distinto.')}
          <div><p className=${labelC}>¿Qué procesos de pensamiento activó? <span className="font-normal text-mute">(opcional)</span></p>
            <div className="flex flex-wrap gap-1.5">${PROCESSES.map(p => html`<${Chip} key=${p} active=${(f.proc || []).includes(p)} onClick=${() => set('proc', (f.proc || []).includes(p) ? f.proc.filter(x => x !== p) : [...(f.proc || []), p])}>${p}<//>`)}</div></div>
        </fieldset>`}
        <div><label className=${labelC} htmlFor="cp-tags">Etiquetas <span className="font-normal text-mute">(separadas por comas, opcional)</span></label><input id="cp-tags" className=${inputC} value=${f.tags} onChange=${e => set('tags', e.target.value)} placeholder="lectura, 7.º, trabajo en equipo" /></div>
        <div>
          <span className=${labelC}>Archivos o imágenes <span className="font-normal text-mute">(opcional)</span></span>
          <div className="flex flex-wrap gap-2 items-center">
            <label className=${btnS + ' cursor-pointer !py-2'}><${Icon} name="image" size=${17} /> ${busy ? 'Cargando…' : 'Agregar imagen o archivo'}<input id="cp-file" type="file" className="sr-only" onChange=${onImg} /></label>
            ${f.attachment && html`<span className="inline-flex items-center gap-2 rounded-xl bg-mist border border-line px-3 py-2 text-[13px]"><${Icon} name="paperclip" size=${14} />${f.attachment.name}<button type="button" aria-label="Quitar archivo" onClick=${() => set('attachment', null)} className="text-mute hover:text-ink"><${Icon} name="x" size=${14} /></button></span>`}
          </div>
          ${f.image && html`<div className="relative mt-3 inline-block"><img src=${f.image} alt="Vista previa" className="h-28 rounded-xl border border-line object-cover" /><button type="button" aria-label="Quitar imagen" onClick=${() => set('image', null)} className="absolute -right-2 -top-2 w-7 h-7 grid place-items-center rounded-full bg-ink text-white"><${Icon} name="x" size=${14} /></button></div>`}
          <p className="mt-1.5 text-[12.5px] text-mute">Los archivos no se suben a ningún servidor en el prototipo. Evita incluir datos personales de estudiantes.</p>
        </div>
        ${err && html`<p className="text-[14px] text-[#B42318] rounded-xl bg-[#FEF0EF] px-3 py-2">${err}</p>`}
      </div>
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-line px-5 sm:px-7 py-4 flex items-center justify-end gap-3">
        <div className="mr-auto min-w-0"><${ComposerPoints} f=${f} me=${me} posts=${posts} /></div>
        <button type="button" className=${btnS} onClick=${onClose}>Cancelar</button>
        <button className=${btnP}><${Icon} name="send" size=${16} /> Publicar</button>
      </div>
    </form>
  <//>`;
}

function ShareModal({ post, onClose, toast, onSocial }) {
  const [sel, setSel] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => { setSel([]); setMsg(''); }, [post && post.id]);
  const people = ['daniel', 'marcela', 'jhon', 'paola', 'camilo', 'luz', 'andres'];
  const copy = async () => {
    const link = 'kuriozity.co/comunidad/' + (post ? post.id : '');
    try { await navigator.clipboard.writeText(link); toast('Enlace interno copiado.'); } catch (e) { toast('Enlace: ' + link, 'info'); }
  };
  return html`<${Modal} open=${!!post} onClose=${onClose} size="max-w-md" label="Compartir publicación">
    <${CloseBtn} onClick=${onClose} />
    ${post && html`<div className="p-6">
      <h2 className="font-display text-[22px] font-bold text-ink pr-10">Compartir</h2>
      <p className="mt-3 text-[13px] font-bold text-ink flex items-center gap-2">En redes sociales <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft text-teal-d px-2 py-0.5 text-[11.5px]"><${Icon} name="star" size=${11} fill="currentColor" />+${POINTS.share} pt · máx. ${SHARE_DAILY_MAX} al día</span></p>
      <div className="mt-2 grid grid-cols-4 gap-2">${[['WhatsApp', '#1FA855'], ['Facebook', '#1877F2'], ['LinkedIn', '#0A66C2'], ['X', '#0E1A3C']].map(([n, c]) => html`<button key=${n} className="rounded-xl border border-line py-2.5 text-[12.5px] font-bold text-ink hover:bg-mist transition flex flex-col items-center gap-1" onClick=${() => { onSocial(post, n); onClose(); }}><span className="grid place-items-center w-8 h-8 rounded-full text-white font-display text-[13px]" style=${{ background: c }}>${n[0]}</span>${n}</button>`)}</div>
      <p className="mt-1.5 text-[12px] text-mute">Simulado: no se publica nada en tus redes.</p>
      <p className="mt-5 text-[13px] font-bold text-ink">Con colegas de Kuriozity</p>
      <p className="text-mute text-[14px] mt-1 line-clamp-2">${post.title}</p>
      <ul className="mt-4 grid gap-1">${people.map(id => { const p = T[id]; const on = sel.includes(id); return html`<li key=${id}><button className=${cx('w-full flex items-center gap-3 rounded-xl px-2 py-2 text-left transition', on ? 'bg-violet-soft' : 'hover:bg-mist')} onClick=${() => setSel(on ? sel.filter(x => x !== id) : [...sel, id])} aria-pressed=${on}>
        <${Avatar} person=${p} size=${34} /><span className="min-w-0"><span className="block font-bold text-[14px] text-ink">${p.name}</span><span className="block text-[12.5px] text-mute truncate">${p.area} · ${p.city}</span></span>
        <span className=${cx('ml-auto grid place-items-center w-6 h-6 rounded-full border-2', on ? 'bg-violet border-violet text-white' : 'border-line')}>${on && html`<${Icon} name="check" size=${13} sw=${3} />`}</span></button></li>`; })}</ul>
      <label htmlFor="sh-msg" className="sr-only">Mensaje</label>
      <input id="sh-msg" className=${inputC + ' mt-3'} placeholder="Agrega un mensaje (opcional)" value=${msg} onChange=${e => setMsg(e.target.value)} />
      <div className="mt-4 flex gap-3">
        <button className=${btnS + ' flex-1'} onClick=${copy}><${Icon} name="link" size=${16} /> Copiar enlace</button>
        <button className=${btnP + ' flex-1'} disabled=${!sel.length} onClick=${() => { toast(`Compartida con ${sel.length} ${sel.length === 1 ? 'colega' : 'colegas'} (simulado).`); onClose(); }}>Enviar</button>
      </div>
    </div>`}
  <//>`;
}

/* ===================== COMUNIDAD ===================== */
function Community({ ctx, initialQuery = '' }) {
  const { posts, openComposer, me } = ctx;
  const [cat, setCat] = useState('Todas');
  const [sort, setSort] = useState('recent');
  const [q, setQ] = useState(initialQuery);
  useEffect(() => setQ(initialQuery), [initialQuery]);
  const tip = useMemo(() => DANIEL_TIPS[Math.floor(Math.random() * DANIEL_TIPS.length)], []);
  const list = useMemo(() => {
    let l = posts.filter(p => (cat === 'Todas' || p.cat === cat));
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter(p => (p.title + ' ' + p.body + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(s)); }
    return [...l].sort(sort === 'recent' ? (a, b) => new Date(b.date) - new Date(a.date) : (a, b) => (b.comments.length * 3 + b.likes) - (a.comments.length * 3 + a.likes));
  }, [posts, cat, sort, q]);
  const counts = useMemo(() => Object.fromEntries(CATS.map(c => [c, posts.filter(p => p.cat === c).length])), [posts]);
  return html`<div>
    <${PageHead} eyebrow="El corazón de Kuriozity" title="Comunidad" desc="Experiencias, preguntas e ideas de docentes de todo el país. Lo que compartes aquí se convierte en punto de partida para otros profes."
      action=${html`<button className=${btnP} onClick=${() => openComposer({})}><${Icon} name="plus" size=${17} /> Compartir una experiencia</button>`} />
    <${DanielTip} section="comunidad" />
    <div className="grid xl:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="min-w-0 grid gap-4">
        <button data-guide="cm-compose" onClick=${() => openComposer({})} className="flex items-center gap-3 rounded-3xl bg-white border border-line p-3 sm:p-4 text-left hover:border-violet/40 transition">
          <${Avatar} person=${ctx.authorOf(me.email)} size=${40} />
          <span className="flex-1 rounded-full bg-mist px-4 py-2.5 text-mute text-[15px]">${tip}</span>
          <span className="hidden sm:grid place-items-center w-10 h-10 rounded-full bg-violet text-white"><${Icon} name="edit" size=${17} /></span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute"><${Icon} name="search" size=${17} /></span><label htmlFor="cm-q" className="sr-only">Buscar en la comunidad</label><input id="cm-q" className=${inputC + ' pl-10 !py-2'} placeholder="Buscar publicaciones" value=${q} onChange=${e => setQ(e.target.value)} /></div>
          <label htmlFor="cm-sort" className="sr-only">Ordenar</label>
          <select id="cm-sort" className=${inputC + ' !w-auto !py-2'} value=${sort} onChange=${e => setSort(e.target.value)}><option value="recent">Más recientes</option><option value="active">Más conversadas</option></select>
        </div>
        <div data-guide="cm-cats" className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1 sm:mx-0 sm:px-1 sm:flex-wrap rounded-2xl">
          ${['Todas', ...CATS].map(c => html`<${Chip} key=${c} active=${cat === c} onClick=${() => setCat(c)}>${c !== 'Todas' && html`<${Icon} name=${CAT_STYLE[c].icon} size=${14} />`}${c}<//>`)}
        </div>
        ${list.length ? list.map((p, i) => i === 0 ? html`<div key=${p.id} data-guide="cm-first" className="rounded-3xl grid"><${PostCard} post=${p} ctx=${ctx} /></div>` : html`<${PostCard} key=${p.id} post=${p} ctx=${ctx} />`)
          : html`<${Empty} title="Aún no hay publicaciones aquí" action=${html`<button className=${btnP} onClick=${() => openComposer({ cat: cat === 'Todas' ? 'Preguntas entre docentes' : cat })}>Sé el primero en publicar</button>`}>Quizá la experiencia que necesitas ya la vivió otro profe y todavía no la ha contado. ¿Empezamos tú y yo?<//>`}
      </div>
      <aside className="hidden xl:grid gap-4 sticky top-24">
        <div className="px-1"><${DanielNote}>Quizá la experiencia que necesitas ya la vivió otro profe. Pregunta sin miedo: aquí nadie tiene todas las respuestas, empezando por mí.<//></div>
        <div className="rounded-3xl bg-white border border-line p-4">
          <p className="font-bold text-ink text-[15px]">Categorías</p>
          <ul className="mt-2 grid gap-0.5">${CATS.map(c => html`<li key=${c}><button className=${cx('w-full flex items-center gap-2.5 rounded-xl px-2 py-2 text-[14px] text-left transition', cat === c ? 'bg-violet-soft text-ink font-bold' : 'text-ink/80 hover:bg-mist')} onClick=${() => setCat(cat === c ? 'Todas' : c)}><span className="grid place-items-center w-7 h-7 rounded-lg" style=${{ background: CAT_STYLE[c].bg, color: CAT_STYLE[c].c }}><${Icon} name=${CAT_STYLE[c].icon} size=${14} /></span>${c}<span className="ml-auto font-mono text-[12px] text-mute">${counts[c]}</span></button></li>`)}</ul>
        </div>
        <div className="rounded-3xl bg-white border border-line p-4">
          <p className="font-bold text-ink text-[15px]">Docentes activos esta semana</p>
          <ul className="mt-3 grid gap-3">${['luz', 'camilo', 'marcela', 'paola'].map(id => html`<li key=${id} className="flex items-center gap-2.5"><${Avatar} person=${T[id]} size=${32} /><div className="min-w-0"><p className="text-[14px] font-bold text-ink leading-tight">${T[id].name}</p><p className="text-[12.5px] text-mute truncate">${T[id].area} · ${T[id].city}</p></div></li>`)}</ul>
        </div>
      </aside>
    </div>
  </div>`;
}

function PageHead({ eyebrow, title, desc, action }) {
  return html`<div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <div className="min-w-0 max-w-2xl">
      ${eyebrow && html`<p className="font-mono text-[12px] uppercase tracking-[.16em] text-violet-d">${eyebrow}</p>`}
      <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.4rem)] font-extrabold text-ink tracking-tight mt-1">${title}</h1>
      ${desc && html`<p className="text-mute text-[16px] mt-1.5 leading-relaxed">${desc}</p>`}
    </div>
    ${action}
  </div>`;
}
