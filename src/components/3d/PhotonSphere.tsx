import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PhotonSphereProps {
    radius?: number;
}

export default function PhotonSphere({radius = 2.2}: PhotonSphereProps) {
    //Creamos la referencia para el anillo y el brillo.
    const ringRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    //Este Hook se ejecuta en CADA fotograma (60 veces por segundo)
    // delta:Es la fracción de segundo exacta entre el fotograma anterior y el actual
    // (evita que la animación vaya más rápido o lento si la computadora es más rápida o lenta).
    useFrame((state, delta) => {
        
        if(ringRef.current) {
            //Rotamos el anillo.
            ringRef.current.rotation.z += delta * 0.3;
        }

        if(glowRef.current) {
            const time = state.clock.getElapsedTime();//Te da los segundos exactos transcurridos desde que cargó la página.
            const scale = 1 + Math.sin(time * 3) * 0.03;
            glowRef.current.scale.set(scale,scale,scale);
        }
    })

    // La esfera de fotones está a 1.5 veces el radio de Schwarzschild (física real)
    const photonRadius = radius * 1.02;

    return (
        <group>
            {/* Luz emitida por la energía de los fotones */}
      <pointLight color="#ff8822" intensity={12} distance={30} decay={2} />
            {/* Anillo delgado de luz intensa en el borde *//* Con THREE.DoubleSide el anillo se ve tanto desde arriba como desde abajo.
              Con THREE.BackSide el anillo se ve desde adentro hacia afuera.*/}
            <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            {/* RingGeometry: args=[radioInterior, radioExterior, segmentos] */}
                <ringGeometry args={[photonRadius, photonRadius + 0.25, 64]} />
                <meshBasicMaterial 
                    color="#ffe5dd"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Brillo interno del agujero negro */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[photonRadius * 1.08, 64, 64]} />
                <meshBasicMaterial 
                    color="#ff7711"
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}       