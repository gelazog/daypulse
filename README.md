# DayPulse 🌤️✨

**Tu dosis diaria de inspiración y clima — Progressive Web App**

![DayPulse Preview](https://img.shields.io/badge/PWA-Ready-f0a500?style=flat-square&logo=pwa)
![APIs](https://img.shields.io/badge/APIs-Quotable%20%7C%20Open--Meteo-0a0a0a?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📖 Descripción

DayPulse es una **Progressive Web App (PWA)** que combina:
- 📜 **Frases motivacionales** aleatorias en tiempo real
- 🌡️ **Clima actual** basado en tu ubicación GPS
- 💾 **Guardado de frases** favoritas (offline)
- 📤 **Compartir** frases vía Web Share API o clipboard

Diseñada con una estética editorial oscura y tipografía serif, DayPulse demuestra las capacidades modernas de las PWA sin depender de ningún framework externo — solo HTML, CSS y JavaScript vanilla.

---

## 🌐 APIs utilizadas

| API | Uso | Auth requerida |
|-----|-----|---------------|
| [Positive API](https://www.positive-api.online) | Frases motivacionales en 🇪🇸 español e 🇬🇧 inglés, filtradas por categoría | ❌ No |
| [Open-Meteo](https://open-meteo.com/) | Datos meteorológicos en tiempo real | ❌ No |
| [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/) | Geocodificación inversa (nombre de ciudad) | ❌ No |

**Todas las APIs son 100% gratuitas y no requieren tarjeta bancaria.**

### Endpoints de Positive API utilizados

| Endpoint | Descripción |
|----------|-------------|
| `GET /phrase/esp` | Frase aleatoria en español |
| `GET /phrase/esp?category_id={id}` | Frase aleatoria en español filtrada por categoría |
| `GET /phrase` | Frase aleatoria en inglés |
| `GET /phrase?category_id={id}` | Frase aleatoria en inglés filtrada por categoría |
| `GET /categories` | Lista de categorías disponibles |

---

## ✅ Requisitos PWA cumplidos

| Requisito | Estado |
|-----------|--------|
| `manifest.json` completo | ✅ |
| Service Worker registrado | ✅ |
| Instalable en dispositivo | ✅ |
| Modo offline funcional | ✅ |
| HTTPS compatible | ✅ |
| Responsive (móvil + desktop) | ✅ |

---

## 🔧 Funcionalidades

### Frases motivacionales
- Carga una frase aleatoria de Quotable API al iniciar
- Botón "Nueva frase" para refrescar
- Botón "Guardar" para guardar localmente (hasta 30 frases)
- Botón "Compartir" usando Web Share API (con fallback a clipboard)
- En modo offline usa la última frase cacheada por el Service Worker

### Clima
- Solicita permiso de geolocalización al hacer clic
- Muestra temperatura, sensación térmica, humedad y viento
- Geocodificación inversa para mostrar el nombre de la ciudad
- Fallback: si no hay GPS, usa Ciudad de México como ejemplo
- En modo offline muestra los últimos datos cacheados en localStorage

### Offline
- Service Worker cachea todos los assets estáticos en la instalación
- Estrategia **Cache First** para el shell de la app y fuentes
- Estrategia **Network First** para las APIs (con fallback al caché)
- Badge visual "Sin conexión" cuando no hay red

---

## 🚀 Cómo ejecutar localmente

```bash
# Clonar el repositorio
git clone https://github.com/gelazog/daypulse.git
cd daypulse

# Opción 1: Con Python (más simple)
python3 -m http.server 8080

# Opción 2: Con Node.js
npx serve .

# Opción 3: Con VS Code
# Instala la extensión "Live Server" y abre con Click Derecho > Open with Live Server
```

> ⚠️ **Importante**: Los Service Workers requieren HTTPS o `localhost`. No abras el `index.html` directamente con `file://`.

Luego visita: `http://localhost:8080`

---

## 📁 Estructura del proyecto

```
daypulse/
├── index.html        # App completa (HTML + CSS + JS en un archivo)
├── sw.js             # Service Worker
├── manifest.json     # Manifiesto de la PWA
├── icons/
│   ├── icon-192.png  # Ícono para splash screen y home screen
│   └── icon-512.png  # Ícono para instalación
└── README.md
```

---

## 🏗️ Arquitectura técnica

### Service Worker — Estrategias de caché

```
Instalación  → Pre-cachea: index.html, manifest.json, íconos
Fetch API    → Network First  (con fallback a caché si hay error)
Fetch Shell  → Cache First    (con actualización en background)
Fetch Fonts  → Cache First    (Google Fonts)
```

### Almacenamiento offline

```
localStorage:
  daypulse_saved       → Array de frases guardadas (max 30)
  daypulse_last_quote  → Última frase cargada
  daypulse_weather     → Últimos datos de clima

Service Worker Cache (daypulse-v1.0.0):
  /index.html, /sw.js, /manifest.json, /icons/*, Google Fonts
  Respuestas de Quotable API y Open-Meteo API
```

---

## 🎨 Decisiones de diseño

- **Estética**: Editorial oscura, inspirada en revistas de diseño
- **Tipografía**: Playfair Display (serif, quotes) + DM Sans (body)
- **Paleta**: Fondo `#0a0a0a`, acento ámbar `#f0a500`
- **Sin frameworks**: Vanilla JS, sin dependencias de npm
- **Sin build step**: Deploy directo del código fuente

---

## 📦 Despliegue

La app puede desplegarse gratis en:

- **GitHub Pages**: `Settings > Pages > Deploy from branch (main)`
- **Netlify**: Drag & drop de la carpeta al dashboard
- **Vercel**: `npx vercel` en la carpeta del proyecto

---

## 📝 Licencia

MIT © 2025 — Proyecto académico desarrollado para la materia de Desarrollo Web Moderno.