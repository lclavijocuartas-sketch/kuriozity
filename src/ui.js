/* ===================== BASE DE UI ===================== */
const { useState, useEffect, useMemo, useRef } = React;
const html = htm.bind(React.createElement);
const cx = (...a) => a.filter(Boolean).join(' ');

const ICONS = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  bookopen:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  cap:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  users:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M22 21v-2a4 4 0 0 0-3-3.85"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  message:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M1 1l22 22"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',
  back:'<path d="M19 12H5M12 19l-7-7 7-7"/>',
  chev:'<path d="M9 18l6-6-6-6"/>',
  chevdown:'<path d="M6 9l6 6 6-6"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sparkles:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17v4M17 19h4"/>',
  filter:'<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  bulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  film:'<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  layers:'<path d="M12 2 2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  flask:'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01M8 10h.01M12 10h.01M16 10h.01"/>',
  landmark:'<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/>',
  cpu:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  puzzle:'<path d="M19.4 14.6a2 2 0 1 0 0-3.2V8a1 1 0 0 0-1-1h-3.4a2 2 0 1 0-3.2 0H8a1 1 0 0 0-1 1v3.4a2 2 0 1 1 0 3.2V18a1 1 0 0 0 1 1h3.4a2 2 0 1 1 3.2 0H18a1 1 0 0 0 1-1z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  branch:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="8" r="3"/><path d="M6 9v6M18 11c0 4-6 3-9 6"/>',
  paperclip:'<path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  hourglass:'<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
  star:'<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  spark:'<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="2.5"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
};
function Icon({ name, size = 18, className = '', fill = 'none', sw = 2 }) {
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill=${fill} stroke="currentColor" strokeWidth=${sw} strokeLinecap="round" strokeLinejoin="round" className=${'shrink-0 ' + className} aria-hidden="true" dangerouslySetInnerHTML=${{ __html: ICONS[name] || '' }}></svg>`;
}
function GoogleG({ size = 18 }) {
  return html`<svg width=${size} height=${size} viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z"/><path fill="#FBBC05" d="M10.6 28.6A14.6 14.6 0 0 1 9.8 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>`;
}

const DANIEL_SVG = `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A45F5"/><stop offset="1" stop-color="#14B8A6"/></linearGradient><clipPath id="dcl"><circle cx="60" cy="60" r="60"/></clipPath></defs><g clip-path="url(#dcl)"><rect width="120" height="120" fill="url(#dgr)"/><text x="88" y="44" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="40" fill="#ffffff" fill-opacity=".22">?</text><path d="M14 124c4-24 22-36 46-36s42 12 46 36z" fill="#0E1A3C"/><path d="M48 89l12 13 12-13z" fill="#EDEBFA"/><rect x="51" y="72" width="18" height="18" rx="7" fill="#A86E48"/><ellipse cx="39" cy="56" rx="4.5" ry="6.5" fill="#A86E48"/><ellipse cx="81" cy="56" rx="4.5" ry="6.5" fill="#A86E48"/><ellipse cx="60" cy="53" rx="21" ry="25" fill="#C1865D"/><path d="M38 50c-3-17 8-27 22-27s26 9 22 27c-3-8-8-13-15-14-6 4-16 7-29 14z" fill="#3A3E4C"/><path d="M45 35c6-5 15-6 23-3M64 29c4 0 9 2 12 6" stroke="#A9AEC0" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M39 58c1 15 9 25 21 25s20-10 21-25c-3 6-8 9-12 9H51c-4 0-9-3-12-9z" fill="#4B4F5F"/><path d="M52 69c2.5 2.2 5 3 8 3s5.5-.8 8-3" stroke="#C1865D" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M45 45c3-2 7-2 10 0M65 45c3-2 7-2 10 0" stroke="#3A3E4C" stroke-width="2.2" fill="none" stroke-linecap="round"/><rect x="43.5" y="48.5" width="14" height="10.5" rx="4" fill="#ffffff" fill-opacity=".18" stroke="#0E1A3C" stroke-width="2.2"/><rect x="62.5" y="48.5" width="14" height="10.5" rx="4" fill="#ffffff" fill-opacity=".18" stroke="#0E1A3C" stroke-width="2.2"/><path d="M57.5 53h5" stroke="#0E1A3C" stroke-width="2"/><circle cx="50.5" cy="54" r="1.9" fill="#0E1A3C"/><circle cx="69.5" cy="54" r="1.9" fill="#0E1A3C"/></g></svg>`;
function DanielAvatar({ size = 40, className = '' }) {
  // Retrato oficial de Daniel; la ilustración DANIEL_SVG queda como respaldo si la imagen no carga.
  const [ok, setOk] = useState(true);
  if (!ok) return html`<span role="img" aria-label="Daniel" className=${cx('inline-block shrink-0 rounded-full overflow-hidden', className)} style=${{ width: size, height: size }} dangerouslySetInnerHTML=${{ __html: DANIEL_SVG }}></span>`;
  return html`<img src="media/daniel-avatar.jpg" alt="Daniel" onError=${() => setOk(false)} className=${cx('inline-block shrink-0 rounded-full object-cover bg-ink', className)} style=${{ width: size, height: size }} draggable="false" />`;
}
const initials = n => (n || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
function Avatar({ person, size = 40, className = '' }) {
  if (!person) return null;
  if (person.daniel) return html`<${DanielAvatar} size=${size} className=${className} />`;
  if (person.photo) return html`<img src=${person.photo} alt="" className=${cx('rounded-full object-cover shrink-0', className)} style=${{ width: size, height: size }} />`;
  return html`<span aria-hidden="true" className=${cx('inline-grid place-items-center rounded-full font-display font-bold text-white shrink-0', className)} style=${{ width: size, height: size, background: person.color || '#24356F', fontSize: size * 0.38 }}>${initials(person.name)}</span>`;
}

/* Logotipo oficial de KURIOSITY: blanco sobre fondos oscuros y azul noche sobre fondos claros (misma forma, sin redibujar). */
function Logo({ light = false, onClick, small = false }) {
  return html`<button type="button" onClick=${onClick} className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 focus-visible:ring-offset-transparent" aria-label="KURIOSITY, ir al inicio">
    <img src=${light ? 'media/logo-kuriosity-blanco.png' : 'media/logo-kuriosity-azul.png'} alt="KURIOSITY" className="block w-auto select-none" style=${{ height: small ? 18 : 22 }} draggable="false" />
  </button>`;
}

const btn = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
const btnP = btn + ' bg-violet text-white hover:bg-violet-d active:scale-[.98] px-4 py-2.5';
const btnTeal = btn + ' bg-teal text-ink hover:bg-teal-l active:scale-[.98] px-4 py-2.5';
const btnS = btn + ' bg-white border border-line text-ink hover:border-violet/40 hover:bg-violet-soft/60 px-4 py-2.5';
const btnG = btn + ' text-ink/80 hover:bg-ink/5 px-3 py-2';
const inputC = 'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-mute/70 focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition';
const labelC = 'block text-[13px] font-bold text-ink mb-1.5';
const gradeLabel = g => g === 'all' ? 'Todos los grados' : `${g}.º`;

function ago(iso) {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}
const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fmtLong = s => parseDate(s).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function resizeImage(file, max) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = rej; img.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}

function Modal({ open, onClose, children, size = 'max-w-lg', label = 'Ventana', dark = false }) {
  useEffect(() => {
    if (!open) return;
    const k = e => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return html`<div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label=${label}>
    <div className="absolute inset-0 bg-ink/60 backdrop-blur-[3px] fade" onClick=${onClose}></div>
    <div className=${cx('relative w-full max-h-[94vh] overflow-y-auto rounded-t-[26px] sm:rounded-[26px] shadow-2xl pop', size, dark ? 'bg-ink text-white' : 'bg-white')}>${children}</div>
  </div>`;
}
function CloseBtn({ onClick, light = false }) {
  return html`<button type="button" onClick=${onClick} aria-label="Cerrar" className=${cx('absolute right-3 top-3 z-10 w-9 h-9 grid place-items-center rounded-full transition', light ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-white/90 text-ink hover:bg-mist border border-line')}><${Icon} name="x" size=${18} /></button>`;
}

function Chip({ active, onClick, children, color }) {
  return html`<button type="button" onClick=${onClick} aria-pressed=${!!active} className=${cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-semibold transition', active ? 'bg-ink text-white border-ink' : 'bg-white text-ink/80 border-line hover:border-violet/50 hover:text-ink')}>${children}</button>`;
}
function Tag({ children, style, className = '' }) {
  return html`<span className=${cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold', className)} style=${style}>${children}</span>`;
}
function GradePill({ g }) {
  return html`<span className="inline-flex items-center rounded-md bg-ink/[.06] px-1.5 py-0.5 font-mono text-[11.5px] font-medium text-ink/80">${gradeLabel(g)}</span>`;
}
/* Voz sutil de Daniel: consejos y frases de aliento. Sin tarjeta, sin color de fondo. */
function DanielNote({ children, className = '' }) {
  return html`<div className=${cx('daniel-whisper flex items-start gap-2.5', className)}>
    <${DanielAvatar} size=${28} className="mt-0.5 opacity-90" />
    <p className="min-w-0 text-[14.5px] leading-snug text-ink/70"><span className="font-mono not-italic text-[11px] font-medium uppercase tracking-[.12em] text-violet-d/80 mr-2">Daniel</span><span className="italic">${children}</span></p>
  </div>`;
}
function DanielTip({ section, className = 'mb-6' }) {
  const list = DANIEL_SECTION_TIPS[section] || [];
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, list.length)));
  if (!list.length) return null;
  return html`<div className=${cx('flex items-start gap-2 group', className)}>
    <${DanielNote} className="flex-1">${list[i % list.length]}<//>
    ${list.length > 1 && html`<button className="shrink-0 mt-0.5 p-1 rounded-lg text-mute/70 hover:text-violet-d hover:bg-violet-soft transition" onClick=${() => setI(i + 1)} aria-label="Otro consejo de Daniel" title="Otro consejo"><${Icon} name="refresh" size=${14} /></button>`}
  </div>`;
}

/* Guía de navegación de Daniel: estilo destacado, con foco sobre el elemento que explica. */
function findGuideTarget(names) {
  for (const n of names || []) {
    const els = document.querySelectorAll(`[data-guide="${n}"]`);
    for (const el of els) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return el; }
  }
  return null;
}
function DanielGuide({ guide, onStep, onClose, onMute }) {
  const steps = guide ? GUIDES[guide.key] || [] : [];
  const step = guide ? steps[guide.step] : null;
  useEffect(() => {
    if (!step) return;
    let el = null, prevPos = '';
    const t = setTimeout(() => {
      el = findGuideTarget(step.target);
      if (!el) return;
      prevPos = el.style.position;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.classList.add('guide-spot');
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 260) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    return () => { clearTimeout(t); if (el) { el.classList.remove('guide-spot'); el.style.position = prevPos; } };
  }, [guide && guide.key, guide && guide.step]);
  useEffect(() => {
    if (!step) return;
    const k = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight' && guide.step < steps.length - 1) onStep(guide.step + 1); if (e.key === 'ArrowLeft' && guide.step > 0) onStep(guide.step - 1); };
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k);
  }, [guide && guide.key, guide && guide.step]);
  if (!step) return null;
  const last = guide.step === steps.length - 1;
  return html`<section role="dialog" aria-modal="false" aria-label="Daniel te guía" key=${guide.key + guide.step}
    className="guide-card fixed z-[58] inset-x-3 bottom-[calc(80px+env(safe-area-inset-bottom,0px))] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-[400px] rounded-[26px] bg-ink text-white shadow-[0_24px_60px_-18px_rgba(14,26,60,.7)] overflow-visible pop">
    <div className="absolute inset-0 rounded-[26px] hero-bg overflow-hidden" aria-hidden="true"></div>
    <div className="relative p-5 pt-4">
      <div className="flex items-start gap-3.5">
        <span className="relative shrink-0 -mt-10">
          <span className="absolute -inset-1.5 rounded-full bg-teal/40 guide-halo"></span>
          <${DanielAvatar} size=${72} className="relative ring-4 ring-teal shadow-xl" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-mono text-[11px] uppercase tracking-[.16em] text-teal">Daniel te guía · ${guide.step + 1} de ${steps.length}</p>
          <h2 className="font-display text-[21px] font-extrabold leading-tight mt-1 balance">${step.title}</h2>
        </div>
        <button onClick=${onClose} aria-label="Cerrar guía" className="shrink-0 -mr-1 -mt-1 w-8 h-8 grid place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10"><${Icon} name="x" size=${17} /></button>
      </div>
      <p className="mt-3 text-[15.5px] text-white/85 leading-relaxed">${step.text}</p>
      <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">${steps.map((_, i) => html`<span key=${i} className=${cx('h-1.5 rounded-full transition-all', i === guide.step ? 'w-6 bg-teal' : i < guide.step ? 'w-1.5 bg-teal/60' : 'w-1.5 bg-white/25')}></span>`)}</div>
      <div className="mt-4 flex items-center gap-2">
        <button className="text-[13px] text-white/60 hover:text-white underline-offset-2 hover:underline mr-auto" onClick=${onMute}>No mostrar más guías</button>
        ${guide.step > 0 && html`<button className=${btn + ' px-3 py-2 text-white/85 hover:bg-white/10 text-[14px]'} onClick=${() => onStep(guide.step - 1)}><${Icon} name="back" size=${15} /> Atrás</button>`}
        <button className=${btnTeal + ' !py-2 text-[14px]'} onClick=${() => last ? onClose() : onStep(guide.step + 1)}>${last ? '¡Entendido!' : 'Siguiente'} ${!last && html`<${Icon} name="arrow" size=${15} />`}</button>
      </div>
    </div>
  </section>`;
}

/* Botón flotante: Daniel siempre disponible. La burbuja lleva frases de aliento (estilo sutil). */
function DanielFab({ onGuide, bubble, onCloseBubble, hidden }) {
  if (hidden) return null;
  return html`<div className="fixed z-[50] right-4 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] lg:right-6 lg:bottom-6 flex flex-col items-end gap-2 pointer-events-none">
    ${bubble && html`<div className="pointer-events-auto relative max-w-[min(78vw,300px)] rounded-2xl rounded-br-md bg-white/95 backdrop-blur border border-line shadow-[0_10px_30px_-14px_rgba(14,26,60,.35)] pl-3.5 pr-8 py-2.5 fade" role="status">
      <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-violet-d/80">Daniel</p>
      <p className="text-[14px] italic text-ink/75 leading-snug mt-0.5">${bubble}</p>
      <button onClick=${onCloseBubble} aria-label="Cerrar mensaje" className="absolute right-1.5 top-1.5 p-1 rounded-md text-mute hover:text-ink"><${Icon} name="x" size=${14} /></button>
    </div>`}
    <button data-guide="fab" onClick=${onGuide} className="pointer-events-auto group relative rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/50" aria-label="Daniel: muéstrame cómo funciona esta sección" title="¿Te muestro cómo funciona esta sección?">
      <${DanielAvatar} size=${56} className="ring-[3px] ring-white shadow-[0_10px_24px_-8px_rgba(14,26,60,.55)] group-hover:scale-105 transition" />
      <span className="absolute -top-1 -left-1 grid place-items-center w-6 h-6 rounded-full bg-teal text-ink ring-2 ring-white font-display font-extrabold text-[13px]">?</span>
    </button>
  </div>`;
}

function ProcChips({ proc, small = false }) {
  if (!proc || !proc.length) return null;
  return html`<span className="flex flex-wrap gap-1">${proc.map(p => html`<span key=${p} className=${cx('inline-flex items-center gap-1 rounded-full border border-violet/20 bg-violet-soft/60 text-violet-d font-semibold', small ? 'px-2 py-0.5 text-[11.5px]' : 'px-2.5 py-1 text-[12.5px]')}><${Icon} name="spark" size=${small ? 11 : 13} />${p}</span>`)}</span>`;
}
function Empty({ title, children, action }) {
  return html`<div className="flex flex-col items-center text-center gap-3 rounded-3xl border border-dashed border-line bg-white px-6 py-10">
    <${DanielAvatar} size=${56} />
    <p className="font-display text-lg font-bold text-ink balance">${title}</p>
    <p className="text-mute max-w-md">${children}</p>
    ${action}
  </div>`;
}
function Progress({ value, color = '#14B8A6', className = '' }) {
  return html`<div className=${cx('h-2 w-full rounded-full bg-ink/[.07] overflow-hidden', className)} role="progressbar" aria-valuenow=${Math.round(value)} aria-valuemin="0" aria-valuemax="100"><div className="h-full rounded-full transition-all duration-500" style=${{ width: value + '%', background: color }}></div></div>`;
}
function Switch({ checked, onChange, label, id }) {
  return html`<label htmlFor=${id} className="flex items-center justify-between gap-4 py-2 cursor-pointer">
    <span className="text-[14px] text-ink">${label}</span>
    <span className="relative">
      <input id=${id} type="checkbox" className="peer sr-only" checked=${checked} onChange=${e => onChange(e.target.checked)} />
      <span className="block w-11 h-6 rounded-full bg-ink/15 peer-checked:bg-teal-d transition peer-focus-visible:ring-2 peer-focus-visible:ring-violet"></span>
      <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
    </span>
  </label>`;
}

function Toasts({ items }) {
  return html`<div className="fixed z-[80] left-1/2 -translate-x-1/2 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] lg:bottom-6 flex flex-col gap-2 items-center pointer-events-none w-[min(92vw,420px)]" aria-live="polite">
    ${items.map(t => html`<div key=${t.id} className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-ink text-white px-4 py-3 shadow-xl pop text-[14px] w-full">
      <span className=${cx('grid place-items-center w-6 h-6 rounded-full shrink-0', t.tone === 'info' ? 'bg-sun text-ink' : 'bg-teal text-ink')}><${Icon} name=${t.tone === 'info' ? 'info' : 'check'} size=${14} sw=${3} /></span>
      <span>${t.msg}</span>
    </div>`)}
  </div>`;
}

function PrototypeBadge({ light = false, onClick }) {
  return html`<button type="button" onClick=${onClick} className=${cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold border', light ? 'border-sun/50 text-sun bg-sun/10' : 'border-sun/60 text-[#7A4B00] bg-sun/15')}>
    <${Icon} name="info" size=${13} /> Prototipo · verificación simulada
  </button>`;
}
function PrototypeInfo({ open, onClose }) {
  return html`<${Modal} open=${open} onClose=${onClose} size="max-w-xl" label="Sobre este prototipo">
    <${CloseBtn} onClick=${onClose} />
    <div className="p-6 sm:p-8">
      <p className="font-mono text-[12px] uppercase tracking-[.16em] text-violet-d">Sobre este prototipo</p>
      <h2 className="font-display text-2xl font-bold text-ink mt-2 balance">Todo lo que ves aquí es una simulación</h2>
      <div className="mt-4 space-y-3 text-[15px] text-ink/85 leading-relaxed">
        <p>El inicio de sesión con Google, el envío de correos, la verificación del correo y la aprobación docente se simulan con botones. Ningún dato sale de tu navegador y no hay autenticación real.</p>
        <p>Las contraseñas que escribas no se guardan en ningún lugar. El estado de la demostración (sesión, guardados, publicaciones, progreso) se conserva en el almacenamiento local de este navegador.</p>
        <p>La bienvenida de Daniel se marca como vista en el registro de la cuenta. En producción ese indicador vive en el servidor, por eso no vuelve a aparecer aunque el docente use otro dispositivo.</p>
        <div className="rounded-2xl bg-mist p-4">
          <p className="font-bold text-ink">Una versión de producción necesita</p>
          <ul className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[14px]">
            ${['Autenticación OAuth 2.0 / OpenID Connect','Verificación de correo con enlaces firmados','Sesiones gestionadas en el servidor','Roles y permisos (docente, moderador)','Flujo de aprobación de identidad docente','Moderación de publicaciones y reportes','Cumplimiento de la Ley 1581 de 2012','Almacenamiento seguro de archivos'].map(x => html`<li key=${x} className="flex gap-2"><span className="text-teal-d mt-0.5"><${Icon} name="check" size=${15} sw=${3} /></span>${x}</li>`)}
          </ul>
        </div>
        <p className="text-[13px] text-mute">Personas, instituciones, publicaciones y eventos son datos de demostración.</p>
      </div>
    </div>
  <//>`;
}
