# KURIOSITY · Universo transmedia y comunidad docente (prototipo)

Prototipo navegable del universo transmedia **KURIOSITY** y de su comunidad digital de docentes, proyecto de narrativas transmedia (Maestría en Comunicación Transmedia).

## Versión 2 (v2) · rama `main`

Rediseño completo de la página pública como nodo central del universo transmedia:

1. **Hero cinematográfico**: "El futuro no necesita más respuestas. Necesita mejores preguntas.", con botón al teaser.
2. **El conflicto**: "El mundo cambió. ¿Y la forma de enseñar?", con animaciones de scroll y acceso a "¿Por qué nace KURIOSITY?" (datos PISA con fuentes).
3. **Tres historias**: Simón (2026), Daniel (2026) y Emma (2040), cada una con su panel y enlaces cruzados.
4. **Explora el universo**: mapa interactivo de pódcast, reels, pósteres y comunidad docente, con conexiones narrativas.
5. **De espectador a protagonista**: invitación a la comunidad docente.
6. **Footer** con accesos a historias, experiencias y comunidad.

El nombre se corrigió a **KURIOSITY** en toda la interfaz visible. La comunidad docente se conserva sin cambios funcionales.

### Recursos oficiales pendientes

En `src/landing.js`, el objeto `MEDIA` reserva los espacios para el video de fondo del hero, el teaser y las imágenes oficiales de Simón, Daniel y Emma. Mientras estén en `null`, la página muestra contenedores identificados como pendientes.

## Versión 1 (v1) · rama `v1`

Incluye:

- Página pública con la sección "Por qué ahora" (resultados PISA 2015–2025), Daniel, el universo transmedia, historias y comunidad.
- Registro, inicio de sesión y verificación docente simulados (correo y condición docente por separado).
- Bienvenida de Daniel y guías de navegación por sección; consejos y frases de aliento en estilo sutil.
- Dashboard, recursos con filtro por proceso de pensamiento, cursos con progreso, comunidad con publicaciones centradas en el proceso de aprendizaje, eventos, guardados y perfil.
- Puntos de prosumo: publicar +3, replicar +5, compartir en redes +1 (máx. 3 al día). Niveles: 100 (diplomados), 1.000 (especializaciones), 5.000 (maestrías).

Todo es simulado: no hay autenticación real ni backend. El estado se guarda en el `localStorage` del navegador.

## Cómo verlo

Abre `index.html` en un navegador con conexión a internet (carga React, htm y Tailwind desde CDN).

## Cómo editarlo

El código está en `src/`. Después de editar, ejecuta:

```sh
./build.sh
```

| Archivo | Contenido |
|---|---|
| `src/head.html` | Título, fuentes, estilos y configuración de Tailwind |
| `src/landing.js` | Página pública v2: historias, mapa del universo, teaser y paneles |
| `src/data.js` | Datos de demostración, voz de Daniel, guías y reglas de puntos |
| `src/ui.js` | Íconos, componentes base, Daniel (guía, botón flotante, notas) |
| `src/public.js` | Registro, inicio de sesión y verificación |
| `src/community.js` | Publicaciones, formulario y comunidad |
| `src/sections.js` | Recursos, cursos, eventos, guardados y perfil |
| `src/gamification.js` | Puntos, niveles y beneficios |
| `src/app.js` | Inicio (dashboard), estructura de la app y estado |

Para restablecer la demostración: **Mi perfil → Datos de la demostración → Restablecer demostración**.
