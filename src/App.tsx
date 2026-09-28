import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import BlackHole from './components/3d/BlackHole';
import AccretionDisk from './components/3d/AccretionDisk';
import './App.css';

function App() {
  const holeRadius = 2.0;

  return (
    <div className="container">
      <Canvas
        camera={{ position: [0, 0.7, 9.0], fov: 45 }}
        style={{ background: '#010103' }}
      >
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 2 - 0.15}  // Máximo ~8.5° hacia arriba
          maxPolarAngle={Math.PI / 2 + 0.11}  // Máximo ~6° hacia abajo
          minAzimuthAngle={-Math.PI / 10}     // Máximo 18° a la izquierda (la mitad)
          maxAzimuthAngle={Math.PI / 10}      // Máximo 18° a la derecha (la mitad)
          minDistance={7.0}                  // Zoom mínimo (no entrar al agujero)
          maxDistance={12.0}                 // Zoom máximo
          enablePan={false}                  // Mantener el agujero siempre centrado
        />
        
        {/* Fondo estelar */}
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />

        {/* 1. Sombra negra del agujero */}
        <BlackHole radius={holeRadius} />

        {/* 2. El Disco de Acreción + Cúpula Gravitacional 3D (con anillo de fotones integrado) */}
        <AccretionDisk radius={holeRadius} />

        {/* 4. Resplandor cinemático */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.25}
            luminanceSmoothing={0.85}
            intensity={1.3}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default App;
