/* ===================== PUNTOS DE PROSUMO: COMPONENTES ===================== */
const LEVEL0 = { n: 0, name: 'Docente en camino', unlock: null, color: '#59607E' };
function levelInfo(pts) {
  const n = levelOf(pts);
  const cur = n ? LEVELS[n - 1] : LEVEL0;
  const nxt = nextLevel(pts);
  const from = n ? LEVELS[n - 1].min : 0;
  const pct = nxt ? Math.max(0, Math.min(100, ((pts - from) / (nxt.min - from)) * 100)) : 100;
  return { n, cur, nxt, pct, from };
}
const POINT_LABEL = { publish: 'Publicación', replicate: 'Réplica en tu contexto', share: 'Compartido en redes', seed: 'Saldo inicial' };
const POINT_ICON = { publish: 'edit', replicate: 'branch', share: 'share', seed: 'star' };

function LevelBadge({ n, size = 'sm' }) {
  const l = n ? LEVELS[n - 1] : LEVEL0;
  return html`<span className=${cx('inline-flex items-center gap-1 rounded-full font-bold text-white', size === 'sm' ? 'px-2 py-0.5 text-[11.5px]' : 'px-3 py-1 text-[13px]')} style=${{ background: l.color }}><${Icon} name="star" size=${size === 'sm' ? 11 : 14} fill="currentColor" />${n ? 'Nivel ' + n : 'Sin nivel aún'}</span>`;
}

/* Tarjeta compacta para el inicio */
function PointsCard({ ctx }) {
  const pts = sumPoints(ctx.ud.points);
  const { n, cur, nxt, pct } = levelInfo(pts);
  return html`<section data-guide="points" className="rounded-3xl bg-white border border-line p-4 sm:p-5">
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-display text-[18px] font-bold text-ink">Tus puntos de prosumo</h2>
      <${LevelBadge} n=${n} />
    </div>
    <p className="mt-2 font-display text-[34px] font-extrabold text-ink leading-none tabular-nums">${fmtPts(pts)} <span className="text-[15px] font-bold text-mute">pts</span></p>
    ${nxt ? html`<div className="mt-3">
        <div className="h-2.5 rounded-full bg-ink/[.07] overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style=${{ width: pct + '%', background: `linear-gradient(90deg, ${cur.color}, ${nxt.color})` }}></div></div>
        <p className="mt-1.5 text-[13px] text-mute">Te faltan <strong className="text-ink tabular-nums">${fmtPts(nxt.min - pts)}</strong> para el nivel ${nxt.n}, que desbloquea <strong className="text-ink">${nxt.unlock.toLowerCase()}</strong>.</p>
      </div>` : html`<p className="mt-2 text-[13px] text-mute">Llegaste al nivel más alto. Las maestrías en convenio están desbloqueadas.</p>`}
    <ul className="mt-3 grid grid-cols-3 gap-1.5 text-center">
      ${[['replicate', 'Replicar'], ['publish', 'Publicar'], ['share', 'Compartir']].map(([k, l]) => html`<li key=${k} className="rounded-xl bg-mist px-1.5 py-2"><p className="font-display font-extrabold text-ink text-[17px] leading-none">+${POINTS[k]}</p><p className="text-[11.5px] text-mute mt-1">${l}</p></li>`)}
    </ul>
    <button className="mt-3 text-[13px] font-bold text-violet-d hover:underline" onClick=${() => ctx.go('perfil')}>Ver mis niveles y beneficios</button>
  </section>`;
}

/* Panel completo en el perfil */
function PointsPanel({ ctx }) {
  const ledger = [...(ctx.ud.points || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pts = sumPoints(ledger);
  const { n, cur, nxt, pct } = levelInfo(pts);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? ledger : ledger.slice(0, 5);
  return html`<section data-guide="pf-points" className="mt-5 rounded-[28px] bg-white border border-line overflow-hidden">
    <div className="relative bg-ink text-white p-5 sm:p-7 overflow-hidden">
      <div className="absolute inset-0 hero-bg" aria-hidden="true"></div>
      <div className="relative grid md:grid-cols-[auto_1fr] gap-5 md:gap-8 items-center">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[.16em] text-teal">Puntos de prosumo</p>
          <p className="mt-1 font-display text-[clamp(2.6rem,7vw,3.6rem)] font-extrabold leading-none tabular-nums">${fmtPts(pts)}</p>
          <p className="mt-2 flex items-center gap-2 text-white/80 text-[14px]"><${LevelBadge} n=${n} size="md" /> ${cur.name}</p>
        </div>
        <div className="min-w-0">
          ${nxt ? html`<p className="text-[14px] text-white/80">Próximo: <strong className="text-white">nivel ${nxt.n} · ${nxt.name}</strong>, desbloquea ${nxt.unlock.toLowerCase()}</p>
            <div className="mt-2 h-3 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full bg-teal transition-all duration-700" style=${{ width: pct + '%' }}></div></div>
            <p className="mt-1.5 text-[13px] text-white/65 tabular-nums">${fmtPts(pts)} de ${fmtPts(nxt.min)} puntos · te faltan ${fmtPts(nxt.min - pts)}</p>`
          : html`<p className="text-[15px] text-white/85">Alcanzaste el nivel más alto de KURIOSITY.</p>`}
          <p className="mt-3 text-[13px] text-white/70">Replicar una experiencia de otro profe en tu aula <strong className="text-white">+${POINTS.replicate}</strong> · Publicar una experiencia <strong className="text-white">+${POINTS.publish}</strong> · Compartir en redes <strong className="text-white">+${POINTS.share}</strong> (máx. ${SHARE_DAILY_MAX} al día)</p>
        </div>
      </div>
    </div>

    <div className="p-5 sm:p-7">
      <h3 className="font-display text-[19px] font-bold text-ink">Niveles y beneficios</h3>
      <p className="text-[14px] text-mute mt-0.5">Cada nivel desbloquea programas de formación en convenio con universidades.</p>
      <ol className="mt-4 grid md:grid-cols-3 gap-3">
        ${LEVELS.map(l => { const open = pts >= l.min; return html`<li key=${l.n} className=${cx('rounded-2xl border p-4 flex flex-col', open ? 'border-transparent' : 'border-line bg-mist/60')} style=${open ? { background: l.color + '12', boxShadow: `inset 0 0 0 1.5px ${l.color}55` } : null}>
          <div className="flex items-center justify-between gap-2">
            <span className="grid place-items-center w-10 h-10 rounded-xl text-white" style=${{ background: open ? l.color : '#9AA0B8' }}><${Icon} name=${open ? l.icon : 'lock'} size=${19} /></span>
            <span className="font-mono text-[12px] text-mute tabular-nums">${fmtPts(l.min)} pts</span>
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[.12em]" style=${{ color: open ? l.color : '#59607E' }}>Nivel ${l.n} · ${open ? 'desbloqueado' : 'bloqueado'}</p>
          <p className="font-display text-[18px] font-bold text-ink leading-tight">${l.unlock}</p>
          <p className="text-[13px] text-mute">${l.name}</p>
          <ul className="mt-3 grid gap-2 flex-1">${l.programs.map(([t, u, d]) => html`<li key=${t} className=${cx('rounded-xl bg-white border border-line px-3 py-2', !open && 'opacity-60')}><p className="text-[13.5px] font-bold text-ink leading-snug">${t}</p><p className="text-[12px] text-mute">${u} · ${d}</p></li>`)}</ul>
          ${open ? html`<button className=${btnS + ' mt-3 !py-2 text-[13.5px]'} onClick=${() => ctx.toast('En producción, aquí se gestiona el cupo con la universidad en convenio.', 'info')}>Solicitar cupo</button>`
            : html`<p className="mt-3 text-[12.5px] text-mute flex items-center gap-1.5"><${Icon} name="lock" size=${13} />Te faltan ${fmtPts(l.min - pts)} puntos</p>`}
        </li>`; })}
      </ol>
      <p className="mt-3 text-[12px] text-mute">Universidades y programas de ejemplo. Los convenios reales se definirán con las instituciones aliadas.</p>

      <div className="mt-7 flex items-center justify-between gap-3">
        <h3 className="font-display text-[19px] font-bold text-ink">Historial de puntos</h3>
        <span className="font-mono text-[13px] text-mute">${ledger.length} movimientos</span>
      </div>
      ${ledger.length ? html`<ul className="mt-3 divide-y divide-line rounded-2xl border border-line">${shown.map(e => html`<li key=${e.id} className="flex items-center gap-3 px-3.5 py-3">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-violet-soft text-violet-d shrink-0"><${Icon} name=${POINT_ICON[e.type]} size=${16} /></span>
          <div className="min-w-0 flex-1"><p className="text-[14px] font-semibold text-ink truncate">${e.label}</p><p className="text-[12px] text-mute">${POINT_LABEL[e.type]} · ${ago(e.date)}</p></div>
          <span className="font-display font-extrabold text-teal-d tabular-nums">+${e.pts}</span>
        </li>`)}</ul>
        ${ledger.length > 5 && html`<button className="mt-2 text-[13px] font-bold text-violet-d hover:underline" onClick=${() => setShowAll(!showAll)}>${showAll ? 'Ver menos' : 'Ver todo el historial'}</button>`}`
      : html`<div className="mt-3"><${DanielNote}>Tu primer punto llega cuando cuentes una experiencia de tu aula. Y si replicas la idea de otro profe, sumas más: así crecemos todos.<//></div>`}
    </div>
  </section>`;
}

/* Celebración al subir de nivel: Daniel con énfasis, como en los momentos clave */
function LevelUpModal({ level, onClose, onSee }) {
  return html`<${Modal} open=${!!level} onClose=${onClose} size="max-w-md" label="Subiste de nivel">
    ${level && html`<div>
      <button type="button" onClick=${onClose} aria-label="Cerrar" className="absolute right-3 top-3 z-10 w-9 h-9 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><${Icon} name="x" size=${18} /></button>
      <div className="relative bg-ink text-white px-6 pt-8 pb-7 overflow-hidden hero-bg text-center">
        <div className="qmarks" aria-hidden="true"><span className="qm qm1">?</span><span className="qm qm4">¿</span></div>
        <span className="relative inline-grid place-items-center w-20 h-20 rounded-3xl text-white shadow-xl level-pop" style=${{ background: level.color }}><${Icon} name="star" size=${38} fill="currentColor" /></span>
        <p className="relative mt-4 font-mono text-[12px] uppercase tracking-[.16em] text-teal">Nivel ${level.n} desbloqueado</p>
        <h2 className="relative font-display text-[28px] font-extrabold leading-tight mt-1">${level.name}</h2>
        <p className="relative mt-2 text-white/80">Ya puedes solicitar cupo en <strong className="text-white">${level.unlock.toLowerCase()}</strong> en convenio con universidades.</p>
      </div>
      <div className="p-6 grid gap-4">
        <div className="flex gap-3 items-start">
          <${DanielAvatar} size=${48} />
          <p className="text-[15.5px] text-ink/85 leading-relaxed"><strong className="text-ink">¡Felicitaciones, colega!</strong> Cada punto es una experiencia que otro profe pudo leer y llevar a su aula. Eso vale mucho más que el diploma.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button className=${btnP} onClick=${onSee}>Ver mis beneficios <${Icon} name="arrow" size=${16} /></button>
          <button className=${btnS} onClick=${onClose}>Seguir explorando</button>
        </div>
      </div>
    </div>`}
  <//>`;
}

/* Etiqueta en el formulario: cuántos puntos suma esta publicación */
function ComposerPoints({ f, me, posts }) {
  const replica = isReplica(f, me, posts);
  const proc = hasProcess(f);
  const type = replica && proc ? 'replicate' : 'publish';
  return html`<div className="flex items-center gap-2 text-[13px] min-w-0">
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft text-teal-d font-bold px-2.5 py-1 shrink-0"><${Icon} name="star" size=${13} fill="currentColor" />+${POINTS[type]} pts</span>
    <span className="text-mute leading-tight hidden sm:inline">${type === 'replicate' ? 'Réplica en tu contexto' : replica ? `Cuenta algo del proceso para que valga como réplica (+${POINTS.replicate})` : 'Publicación'}</span>
  </div>`;
}

/* Después de publicar o replicar: cuánto ganó, qué tan cerca está de la meta y qué puede desbloquear. */
function PointsEarnedModal({ data, onClose, onSee }) {
  const d = data;
  const info = d ? levelInfo(d.after) : null;
  const nxt = info && info.nxt;
  const from = info ? info.from : 0;
  const span = nxt ? nxt.min - from : 1;
  const pctBefore = nxt ? Math.max(0, Math.min(100, ((d.before - from) / span) * 100)) : 100;
  const pctAfter = nxt ? Math.max(0, Math.min(100, ((d.after - from) / span) * 100)) : 100;
  const left = nxt ? nxt.min - d.after : 0;
  const nReplicas = Math.ceil(left / POINTS.replicate), nPubs = Math.ceil(left / POINTS.publish);
  const later = nxt ? LEVELS.filter(l => l.n > nxt.n) : [];
  const isRep = d && d.type === 'replicate';
  return html`<${Modal} open=${!!d} onClose=${onClose} size="max-w-2xl" label="Puntos ganados">
    ${d && html`<div>
      <button type="button" onClick=${onClose} aria-label="Cerrar" className="absolute right-3 top-3 z-10 w-9 h-9 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><${Icon} name="x" size=${18} /></button>
      <div className="relative bg-ink text-white px-6 sm:px-9 pt-8 pb-7 overflow-hidden hero-bg">
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="grid place-items-center w-20 h-20 rounded-3xl bg-teal text-ink shadow-xl level-pop shrink-0"><span className="font-display font-extrabold text-[30px] leading-none">+${d.pts}</span></span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11.5px] uppercase tracking-[.16em] text-teal">${isRep ? 'Réplica en tu contexto' : 'Publicación'} · puntos de prosumo</p>
            <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-extrabold leading-tight mt-1 balance">${isRep ? '¡Gracias por cocrear!' : '¡Gracias por compartir!'}</h2>
            <p className="mt-1 text-white/75 text-[15px]">${isRep ? 'Llevaste la idea de otro profe a tu aula y contaste cómo fue. Así crece el conocimiento de todos.' : 'Tu experiencia ya puede inspirar a otro profe que está buscando lo mismo que tú.'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid gap-6">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-ink"><span className="font-display text-[34px] font-extrabold tabular-nums leading-none">${fmtPts(d.after)}</span> <span className="text-mute font-bold">puntos</span></p>
            ${nxt ? html`<p className="text-[14px] text-mute">Meta: <strong className="text-ink tabular-nums">${fmtPts(nxt.min)}</strong> · nivel ${nxt.n}</p>` : html`<${LevelBadge} n=${3} size="md" />`}
          </div>
          ${nxt && html`<div className="mt-3 relative h-4 rounded-full bg-ink/[.07] overflow-hidden" role="progressbar" aria-valuemin=${from} aria-valuemax=${nxt.min} aria-valuenow=${d.after} aria-label=${'Progreso hacia el nivel ' + nxt.n}>
              <div className="absolute inset-y-0 left-0 rounded-full" style=${{ width: pctBefore + '%', background: nxt.color, opacity: .55 }}></div>
              <div className="absolute inset-y-0 rounded-r-full earned-grow" style=${{ left: pctBefore + '%', width: Math.max(1.5, pctAfter - pctBefore) + '%', background: nxt.color }}></div>
            </div>
            <div className="mt-1.5 flex justify-between text-[12px] text-mute tabular-nums"><span>${fmtPts(from)}</span><span>${fmtPts(nxt.min)}</span></div>
            <p className="mt-3 text-[16px] text-ink leading-snug">Estás a <strong className="tabular-nums">${fmtPts(left)} ${left === 1 ? 'punto' : 'puntos'}</strong> del nivel ${nxt.n}, <strong>${nxt.name}</strong>.</p>
            <p className="mt-1 text-[14px] text-mute">Lo logras con <strong className="text-ink">${nReplicas} ${nReplicas === 1 ? 'réplica' : 'réplicas'} más</strong> de experiencias de otros profes, o con <strong className="text-ink">${nPubs} ${nPubs === 1 ? 'publicación' : 'publicaciones'} más</strong>.</p>`}
          ${!nxt && html`<p className="mt-3 text-[16px] text-ink">Ya desbloqueaste todos los niveles de KURIOSITY. Gracias por mantener viva la comunidad.</p>`}
        </section>

        ${nxt && html`<section className="rounded-2xl border p-4 sm:p-5" style=${{ borderColor: nxt.color + '40', background: nxt.color + '0D' }}>
          <p className="flex items-center gap-2 font-bold text-ink"><span className="grid place-items-center w-8 h-8 rounded-lg text-white" style=${{ background: nxt.color }}><${Icon} name="lock" size=${15} /></span>Si sigues participando, desbloqueas ${nxt.unlock.toLowerCase()}</p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2">${nxt.programs.map(([t, u, dur]) => html`<li key=${t} className="rounded-xl bg-white border border-line px-3 py-2"><p className="text-[14px] font-bold text-ink leading-snug">${t}</p><p className="text-[12px] text-mute">${u} · ${dur}</p></li>`)}</ul>
          ${later.length > 0 && html`<p className="mt-3 text-[13px] text-mute">Y más adelante: ${later.map(l => `${l.unlock.toLowerCase()} (${fmtPts(l.min)} pts)`).join(' y ')}.</p>`}
        </section>`}

        <${DanielNote}>${isRep ? 'Replicar no es copiar: es probar en tu contexto y contar lo que aprendiste. Esa es la mejor forma de cocrear.' : 'Cada experiencia que cuentas, aunque no haya salido perfecta, le ahorra a otro profe empezar desde cero.'}<//>

        <div className="flex flex-wrap gap-2.5">
          <button className=${btnP} onClick=${onClose}>Seguir participando <${Icon} name="arrow" size=${16} /></button>
          <button className=${btnS} onClick=${onSee}><${Icon} name="star" size=${16} /> Ver mis niveles y beneficios</button>
        </div>
      </div>
    </div>`}
  <//>`;
}
