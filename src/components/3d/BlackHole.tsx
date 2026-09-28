// 1. Definimos con TypeScript qué datos (props) puede recibir este componente
interface BlackHoleProps {
    radius?: number // El radio del agujero negro (el '?' significa que es opcional)
}

// 2. Creamos la función del componente recibiendo los props
export default function BlackHole({ radius = 2 }: BlackHoleProps) {
    return (
        // En TSX, lo que devuelve es lo que se dibuja en pantalla.
        // Usamos geometríaSphere para crear una esfera.
        // <mesh> es el contenedor del objeto 3D
        // El 'args' son los parámetros de la esfera: [radio, segmentos_x, segmentos_y]
        <mesh position={[0, 0, 0]} scale={[1, 1, 0.15]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshBasicMaterial color="#000000" />
        </mesh>
    );
}