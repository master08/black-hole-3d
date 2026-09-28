# 🌌 Black Hole 3D (Gargantua Simulation)

Simulador 3D interactivo y educativo de un agujero negro supermasivo inspirado en la física óptica de **Gargantua** (*Interstellar*, Kip Thorne) y la infografía científica de la NASA. Construido con **React 19**, **Three.js**, **React Three Fiber** y **TypeScript**.

---

## ✨ Características Visuales y Físicas

- **Sombra Óptica del Agujero Negro**: Horizonte de eventos en negro azabache absoluto (`#000000`), calibrado en profundidad $Z \approx 0$ para evitar distorsiones volumétricas no relativistas.
- **Anillo de Fotones Incandescente**: Fina cresta blanca ultra caliente ($100\%$ de opacidad) que bordea el horizonte y corona la lente gravitacional.
- **Cúpula Gravitacional en Campana Senoidal**:
  - Proyección de la luz de la cara posterior del disco arqueándose sobre y bajo el horizonte.
  - Modelado radial en abanico sin paredes verticales ni cortes de máscara.
  - Desvanecimiento térmico continuo: blanco $\to$ champán $\to$ oro $\to$ cobre $\to$ polvo cósmico $\to$ opacidad 0 en el vacío.
- **Disco de Acreción Ecuatorial Plano**:
  - Más de 1,200 partículas cósmicas y 900 filamentos orbitales estirados.
  - Efecto Doppler relativista (el lado que se aproxima al observador es más brillante).
- **Cámara Cinemática Restringida**:
  - Controles orbitales acotados ($\pm 18^\circ$ horizontal, $\pm 8^\circ$ vertical) para permitir paralaje 3D interactivo preservando la perspectiva relativista frontal.
- **Postprocesamiento Bloom**:
  - Resplandor celestial cálido e incandescente a 60 FPS mediante `@react-three/postprocessing`.

---

## 🛠️ Tecnologías

- **React 19** + **TypeScript**
- **Vite** con SWC (`@vitejs/plugin-react-swc`)
- **Three.js** + **React Three Fiber** (`@react-three/fiber`)
- **Drei** (`@react-three/drei`)
- **Postprocessing** (`@react-three/postprocessing`)

---

## 🚀 Instalación y Uso Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build
```
