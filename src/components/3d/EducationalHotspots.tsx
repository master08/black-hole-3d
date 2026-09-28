import { useState } from 'react'
import { Html } from '@react-three/drei'

interface HotspotData {
  id: string
  title: string
  subtitle: string
  description: string
  position: [number, number, number]
}

const HOTSPOTS: HotspotData[] = [
  {
    id: 'horizon',
    title: 'Horizonte de Sucesos',
    subtitle: 'Punto de no retorno',
    description: 'Frontera espacial donde la velocidad de escape iguala a la velocidad de la luz. Nada, ni siquiera los fotones, puede escapar de esta región.',
    position: [0, 0, 0.4]
  },
  {
    id: 'photon-sphere',
    title: 'Esfera de Fotones',
    subtitle: 'Órbita de la luz',
    description: 'Anillo ultra delgado donde los rayos de luz orbitan el agujero negro varias veces antes de ser capturados o desviados hacia nuestros ojos.',
    position: [0, 2.1, 0.1]
  },
  {
    id: 'lensing',
    title: 'Cúpula Gravitacional',
    subtitle: 'Lente gravitacional de Einstein',
    description: 'La gravedad extrema curva el espacio-tiempo de tal manera que vemos la cara posterior del disco de acreción proyectada sobre la cima del agujero.',
    position: [0, 3.8, -0.1]
  },
  {
    id: 'doppler',
    title: 'Emisión Doppler',
    subtitle: 'Beaming relativista',
    description: 'El gas de este lado viaja a velocidades cercanas a la de la luz en dirección hacia nosotros, lo que intensifica su brillo y eleva su temperatura aparente.',
    position: [-4.2, 0, 0.8]
  }
]

export default function EducationalHotspots() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <group>
      {HOTSPOTS.map((spot) => {
        const isOpen = activeId === spot.id

        return (
          <group key={spot.id} position={spot.position}>
            <Html center distanceFactor={12}>
              <div style={{ position: 'relative', pointerEvents: 'auto', userSelect: 'none' }}>
                {/* Botón pulsante 3D */}
                <button
                  onClick={() => setActiveId(isOpen ? null : spot.id)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isOpen ? '#ffdd44' : 'rgba(255, 255, 255, 0.85)',
                    border: '2px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: isOpen 
                      ? '0 0 20px #ffbb00, 0 0 40px #ff8800' 
                      : '0 0 12px rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#000',
                    transition: 'all 0.25s ease',
                    transform: isOpen ? 'scale(1.15)' : 'scale(1)',
                    outline: 'none'
                  }}
                  title={spot.title}
                >
                  {isOpen ? '×' : '+'}
                </button>

                {/* Tarjeta explicativa Sci-Fi (Glassmorphism) */}
                {isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '40px',
                      top: '-20px',
                      width: '280px',
                      background: 'rgba(10, 12, 22, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 200, 100, 0.35)',
                      borderRadius: '12px',
                      padding: '16px',
                      color: '#fff',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 170, 50, 0.15)',
                      zIndex: 1000,
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffb347', marginBottom: '4px', fontWeight: 600 }}>
                      {spot.subtitle}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                      {spot.title}
                    </div>
                    <div style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.85)' }}>
                      {spot.description}
                    </div>
                  </div>
                )}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
