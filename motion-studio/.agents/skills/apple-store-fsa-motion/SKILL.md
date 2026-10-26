---
name: apple-store-fsa-motion
description: Crear y mejorar Reels MP4 de tecnología para APPLE STORE FSA, utilizando Remotion, interfaces animadas, motion graphics, audio y control de calidad.
---
# APPLE STORE FSA — PRO MOTION
- Especificaciones: 1080×1920, 30 FPS, 25 segundos, H.264 y yuv420p.
- Diseño: fondo negro #05090E, blanco #F3F8FD, celeste #68D9FF y gris #91A2B7.
- Construir gráficos vectoriales animados con React/Remotion: sin plantillas genéricas ni imágenes estáticas que solo cambian.
- Cada escena debe demostrar visualmente el consejo: interacción ilustrativa de activación, medidor de batería, escaneo facial y cámaras.
- Animar entradas por palabras, jerarquizar CTA y mantener zonas seguras: 130px laterales, 220px superiores y 350px inferiores.
- Fuente de verdad: revisar documentación Apple para consejos sobre iOS; las interfaces son ilustrativas y jamás implican verificar el estado real de un dispositivo.
- Respetar identidad propia; inspiración visual general, sin replicar composiciones o marcas ajenas.
- Ejecutar: `npm install`; `npm run audio`; `npx remotion browser ensure`; `npm run render`.
- Revisar después de render con ffprobe: ancho 1080, alto 1920, 30 fps, 25s, pista de audio. Extraer frames de 1.5, 5, 11, 17, 23.5 segundos y corregir cortes o superposiciones.
- Narración: no hay TTS en este proyecto. Si se pide voz, integrarla a partir de un archivo de audio autorizado, sincronizar subtítulos y explicitar si no fue posible.
- Entregar el MP4 final. No declarar éxito sin confirmar la salida del render.
