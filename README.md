# Kuriozity · Comunidad docente (prototipo)

Prototipo navegable de la comunidad digital de docentes de **Kuriozity**, proyecto de narrativas transmedia (Maestría en Comunicación Transmedia).

## Versión 1 (v1)

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
| `src/data.js` | Datos de demostración, voz de Daniel, guías y reglas de puntos |
| `src/ui.js` | Íconos, componentes base, Daniel (guía, botón flotante, notas) |
| `src/public.js` | Página pública, registro, inicio de sesión y verificación |
| `src/community.js` | Publicaciones, formulario y comunidad |
| `src/sections.js` | Recursos, cursos, eventos, guardados y perfil |
| `src/gamification.js` | Puntos, niveles y beneficios |
| `src/app.js` | Inicio (dashboard), estructura de la app y estado |

Para restablecer la demostración: **Mi perfil → Datos de la demostración → Restablecer demostración**.
