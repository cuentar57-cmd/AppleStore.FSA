# APPLE STORE FSA — Motion Studio con Codex y Remotion

Este proyecto está **aislado en motion-studio/** para no alterar la tienda web.

## Desde el iPhone
Abrí la rama `codex/apple-store-fsa-motion` del repositorio `cuentar57-cmd/AppleStore.FSA` en Codex Cloud, si tu cuenta tiene la función habilitada. Pedile:
> Entrá a motion-studio, seguí la skill apple-store-fsa-motion, instalá dependencias, generá audio, corregí cualquier error, renderizá el Reel en MP4 1080x1920 30fps, revisá 5 fotogramas y entregá el MP4.

## En computadora (opcional)
```bash
cd motion-studio
npm install
npm run audio
npx remotion browser ensure
npm run dev
npm run render
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration -of json out/APPLE_STORE_FSA_Reel.mp4
```

## Qué contiene
- Cinco escenas programadas en React/Remotion, duración 25s.
- Animaciones de iPhone, activación ilustrativa, batería, Face ID y cámaras.
- Audio sintético original generado sin samples con Python.
- Instrucciones para Codex en `.agents/skills/apple-store-fsa-motion/SKILL.md`.
- Workflow de GitHub Actions que, **si está habilitado en el repo**, intenta renderizar y adjunta un MP4 como artifact.

## Limitaciones
- No incluye voz: sí música y sonidos simples sintéticos.
- Las pantallas no reproducen iOS de forma literal.
- Este código no está verificado en Codex hasta ejecutarse el build y el render. Revisar costo/licencia de Remotion para el uso comercial.
