---
name: apple-store-fsa-motion
description: Producir Reels profesionales de APPLE STORE FSA con Remotion, interfaces de iPhone simuladas y entrega MP4 verificada.
---
# APPLE STORE FSA — Motion Graphics

Para crear o mejorar Reels de APPLE STORE FSA en este repositorio:

1. Usar exclusivamente el proyecto aislado `motion-studio/`. No editar la tienda web.
2. Leer `motion-studio/AGENTS.md` y `motion-studio/.agents/skills/apple-store-fsa-motion/SKILL.md` antes de trabajar.
3. Crear animaciones programáticas en React/Remotion, evitando diapositivas estáticas y sin copiar la identidad de otros creadores.
4. El formato de entrega es MP4 H.264, 1080×1920, 30 FPS, 25 segundos. Fondo negro y acentos celestes; textos dentro de zonas seguras para Instagram.
5. Ejecutar desde `motion-studio`: `npm install`, `npm run audio`, `npx remotion browser ensure`, `npm run render`.
6. Verificar el MP4 final con ffprobe y revisar fotogramas. Corregir solapamientos y cualquier corte de palabras.
7. Voz en off solo si hay TTS realmente disponible o un archivo autorizado. El proyecto base tiene música/FX sintetizados sin voz.
8. Las interfaces de ajustes de iPhone son ilustrativas; no presentarlas como capturas idénticas de iOS.
9. Nunca afirmar que se generó un MP4 si el render no fue ejecutado y verificado.
