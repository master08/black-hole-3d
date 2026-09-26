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
        <mesh position={[0, 0, 0]}>
            {/* Usamos <sphereGeometry> de Three.js dentro de una <mesh> de React Three Fiber.
                'args' son los parámetros de la esfera:
                [radio, segmentos_x, segmentos_y]
                Cuanto mayores los números de segmentos, más suave se ve la esfera.
            */}
            <sphereGeometry args={[radius, 64, 64]} />

            {/* Con esto le damos propiedades visuales:
                - color: Un color entre azul oscuro y morado (
                - roughness: Qué tan rugoso es (0 es muy brillante como cristal, 1 es mate)
                - metalness: Qué tanto parece metal (0 es plástico, 1 es metal)
            */}
            <meshStandardMaterial 
                color="#000000"
            />
        </mesh>
    );
}