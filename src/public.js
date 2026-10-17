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
      <p className="text-mute text-[14px]">para continuar en KURIOSITY</p>
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
        <button className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-[14px] font-semibold" onClick=${onBack}><${Icon} name="back" size=${16} /> Volver a KURIOSITY</button>
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
          ${state === 'teacher' && html`<button className=${btn + ' bg-ink text-white hover:bg-ink-2 px-4 py-2.5'} onClick=${actions.approveTeacher}><${Icon} name="shield" size=${17} /> Aprobar como moderador de KURIOSITY</button>`}
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
