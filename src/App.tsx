import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
//Importamos el componente del agujero negro
import BlackHole from './components/3d/BlackHole';
//Importamos el componente del anillo de fotones
import PhotonSphere from './components/3d/PhotonSphere';
import './App.css';

function App() {
  return (
    <>
      <div className="container">
        {/* El escenario 3d dentro del Canvas. 
          - BlackHole: Nuestro agujero negro.
          - Stars: Estrellas de fondo.
          - OrbitControls: Para poder mover la cámara.
        */}
      <Canvas
        camera={{ position: [0, 4, 10], fov: 50 }}
        style={{ background: '#020205' }}>
        {/* <OrbitControls /> para poder mover la cámara con el raton*/}
        <OrbitControls enableDamping dampingFactor={0.05} />
        {/* Fondo de estrellas */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        {/* 2. Usamos el componente y le pasamos un prop */}
        <BlackHole radius={2.2} />
        {/* El anillo de fotones */}
        <PhotonSphere radius={2.2} />
      </Canvas>
      </div>
    </>
  )
}

export default App
