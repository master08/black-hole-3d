import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AccretionDiskProps {
  radius?: number
}

export default function AccretionDisk({ radius = 2.0 }: AccretionDiskProps) {
  const diskRef = useRef<THREE.Mesh>(null)

  // 1. Textura ardiente para el DISCO ECUATORIAL con gradiente térmico idéntico y partículas
  // - Borde interior (r = 295px): blanco ardiente 100% opaco
  // - Exterior (r = 1010px): opacidad 0 (desvanecimiento suave al vacío)
  // - Cientos de partículas cósmicas de plasma y filamentos de seda estirados
  const diskTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!
    const cx = 1024
    const cy = 1024

    // Gradiente térmico radial idéntico a la cúpula gravitacional
    const grad = ctx.createRadialGradient(cx, cy, 280, cx, cy, 1015)
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)')             // Agujero central
    grad.addColorStop(0.015, 'rgba(255, 255, 255, 1.0)')   // Borde interior blanco ardiente
    grad.addColorStop(0.07, 'rgba(255, 245, 195, 0.98)')   // Champán estelar
    grad.addColorStop(0.20, 'rgba(255, 185, 60, 0.88)')    // Oro incandescente
    grad.addColorStop(0.45, 'rgba(225, 95, 20, 0.55)')     // Cobre plasma
    grad.addColorStop(0.72, 'rgba(120, 30, 8, 0.20)')      // Polvo cósmico
    grad.addColorStop(0.90, 'rgba(50, 10, 2, 0.04)')       // Bruma difusa
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)')             // Opacidad 0 exterior

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2048, 2048)

    // A) Nubes suaves de gas de plasma
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 295 + Math.pow(Math.random(), 1.4) * 680
      const x = cx + Math.cos(angle) * dist
      const y = cy + Math.sin(angle) * dist
      const size = 15 + Math.random() * 40

      const normDist = (dist - 295) / 680
      const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, size)
      cloudGrad.addColorStop(0, `rgba(255, ${160 + Math.random() * 85}, 50, ${(0.03 + Math.random() * 0.06) * (1.0 - normDist)})`)
      cloudGrad.addColorStop(1, 'rgba(255, 80, 10, 0)')

      ctx.fillStyle = cloudGrad
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // B) Fibras y estrías de seda orbitales estiradas
    for (let i = 0; i < 900; i++) {
      const dist = 290 + Math.pow(Math.random(), 1.3) * 690
      const a = Math.random() * Math.PI * 2
      const len = 0.5 + Math.random() * 2.5
      const normDist = (dist - 290) / 690

      // Efecto Doppler (aproximación más brillante)
      const isApproaching = Math.cos(a) < 0.2
      const doppler = isApproaching ? 1.3 : 0.7
      const alpha = (0.02 + Math.random() * 0.10) * doppler * (1.0 - normDist * 0.85)

      let color = ''
      if (normDist < 0.12) {
        color = `rgba(255, 255, 240, ${alpha * 1.2})` // Blanco cerca del horizonte
      } else if (normDist < 0.4) {
        color = `rgba(255, 210, 100, ${alpha})`       // Champán / oro
      } else {
        color = `rgba(240, 100, 20, ${alpha * 0.8})`  // Cobre / polvo
      }

      ctx.strokeStyle = color
      ctx.lineWidth = 0.6 + Math.random() * 2.2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(cx, cy, dist, a, a + len)
      ctx.stroke()
    }

    // C) Partículas estelares y chispas de plasma cósmico
    for (let i = 0; i < 1200; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 292 + Math.pow(Math.random(), 1.35) * 690
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist
      const pSize = 0.5 + Math.random() * 1.8
      const normDist = (dist - 292) / 690

      const pAlpha = (0.15 + Math.random() * 0.65) * (1.0 - normDist * 0.85)
      const pColor = normDist < 0.25
        ? `rgba(255, 255, 240, ${pAlpha})`
        : normDist < 0.6
          ? `rgba(255, 200, 80, ${pAlpha})`
          : `rgba(245, 120, 30, ${pAlpha * 0.6})`

      ctx.fillStyle = pColor
      ctx.beginPath()
      ctx.arc(px, py, pSize, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.center.set(0.5, 0.5)
    return texture
  }, [])

  // 2. Textura especializada para la CÚPULA EN FORMA DE CAMPANA
  // - V = 0 es el borde interior pegado a la esfera (blanco ardiente 100% opaco)
  // - V = 1 es la cresta exterior (OPACIDAD = 0, desvanecimiento total al vacío sin máscara)
  // - U = 0 a 1 sigue la dirección del flujo a lo largo de las curvas de la campana
  const bellTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Gradiente térmico vertical invertido:
    // y = 0 (cresta exterior, V = 1) -> TRANSPARENTE AL VACÍO (opacidad 0)
    // y = 512 (borde interior, V = 0) -> BLANCO ARDIENTE AL CENTRO (100% opaco)
    const grad = ctx.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)')            // Cresta exterior: opacidad 0
    grad.addColorStop(0.08, 'rgba(50, 10, 2, 0.04)')      // Bruma difusa
    grad.addColorStop(0.25, 'rgba(120, 30, 8, 0.20)')     // Polvo cósmico
    grad.addColorStop(0.50, 'rgba(225, 95, 20, 0.55)')    // Cobre plasma
    grad.addColorStop(0.75, 'rgba(255, 185, 60, 0.88)')   // Oro incandescente
    grad.addColorStop(0.92, 'rgba(255, 245, 195, 0.98)')  // Champán estelar
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 1.0)')    // Borde interior blanco ardiente al centro

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2048, 512)

    // Fibras y líneas de gas estiradas horizontalmente
    // Concentradas cerca del centro caliente (y = 512) y desvaneciéndose hacia afuera
    for (let i = 0; i < 750; i++) {
      const distFromCenter = Math.pow(Math.random(), 1.5) * 440
      const y = 512 - distFromCenter
      const x = Math.random() * 2048
      const len = 150 + Math.random() * 500

      // Efecto Doppler relativista (lado izquierdo más brillante)
      const normX = x / 2048
      const doppler = 1.0 - normX * 0.35
      const alpha = (0.04 + Math.random() * 0.10) * doppler * (y / 512)
      const color = normX < 0.45 ? `rgba(255, 250, 220, ${alpha})` : `rgba(245, 130, 30, ${alpha})`

      ctx.strokeStyle = color
      ctx.lineWidth = 0.8 + Math.random() * 2.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + len, y)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    return texture
  }, [])

  // 3. GEOMETRÍA RADIAL FLUIDA (Cero efecto cilindro, se abre hacia afuera como trompeta/campana)
  const { topArchGeometry, bottomArchGeometry } = useMemo(() => {
    const radialSegments = 160
    const rings = 36

    const innerR = radius * 1.008     // Abraza la esfera negra milimétricamente
    const diskOuterR = radius * 3.5  // Diámetro exterior del disco ecuatorial (7.0)
    const topPeakH = radius * 2.2    // Cúpula superior más abierta y majestuosa (4.4)
    const bottomPeakH = radius * 1.55 // Cúpula inferior más abierta (3.1)

    // A) CÚPULA SUPERIOR (theta de 0 a PI)
    const topGeo = new THREE.BufferGeometry()
    const posTop: number[] = []
    const uvsTop: number[] = []
    const indicesTop: number[] = []

    for (let r = 0; r <= rings; r++) {
      const v = r / rings // 0 = borde en la esfera (blanco ardiente), 1 = exterior difuso (opacidad 0)
      for (let s = 0; s <= radialSegments; s++) {
        const u = s / radialSegments
        const theta = u * Math.PI // de 0 (derecha) a PI (izquierda)
        const sinTheta = Math.sin(theta)

        // Cúpula superior abierta: amplia y majestuosa sobre el agujero negro
        const flareFactor = Math.pow(1.0 - sinTheta, 1.15)
        const rOut = topPeakH + flareFactor * (diskOuterR - topPeakH)
        const currR = innerR + v * (rOut - innerR)

        const x = Math.cos(theta) * currR
        const y = Math.sin(theta) * currR
        // Curvatura suave en Z detrás de la esfera
        const z = -0.06 - sinTheta * 0.12 - (1.0 - v) * 0.04

        posTop.push(x, y, z)

        // UV curvilíneo: U sigue el arco theta, V va de la esfera (0) al vacío (1)
        uvsTop.push(u, v)
      }
    }

    const vertsPerRow = radialSegments + 1
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < radialSegments; s++) {
        const i0 = r * vertsPerRow + s
        const i1 = r * vertsPerRow + (s + 1)
        const i2 = (r + 1) * vertsPerRow + s
        const i3 = (r + 1) * vertsPerRow + (s + 1)

        indicesTop.push(i0, i1, i2)
        indicesTop.push(i1, i3, i2)
      }
    }

    topGeo.setAttribute('position', new THREE.Float32BufferAttribute(posTop, 3))
    topGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvsTop, 2))
    topGeo.setIndex(indicesTop)
    topGeo.computeVertexNormals()

    // B) CÚPULA INFERIOR (theta de PI a 2*PI)
    const bottomGeo = new THREE.BufferGeometry()
    const posBottom: number[] = []
    const uvsBottom: number[] = []
    const indicesBottom: number[] = []

    for (let r = 0; r <= rings; r++) {
      const v = r / rings
      for (let s = 0; s <= radialSegments; s++) {
        const u = s / radialSegments
        const theta = Math.PI + u * Math.PI // de PI a 2*PI
        const sinPhi = Math.sin(u * Math.PI)

        const flareFactor = Math.pow(1.0 - sinPhi, 1.15)
        const rOut = bottomPeakH + flareFactor * (diskOuterR - bottomPeakH)
        const currR = innerR + v * (rOut - innerR)

        const x = Math.cos(theta) * currR
        const y = Math.sin(theta) * currR
        const z = -0.06 - sinPhi * 0.12 - (1.0 - v) * 0.04

        posBottom.push(x, y, z)

        uvsBottom.push(u, v)
      }
    }

    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < radialSegments; s++) {
        const i0 = r * vertsPerRow + s
        const i1 = r * vertsPerRow + (s + 1)
        const i2 = (r + 1) * vertsPerRow + s
        const i3 = (r + 1) * vertsPerRow + (s + 1)

        indicesBottom.push(i0, i1, i2)
        indicesBottom.push(i1, i3, i2)
      }
    }

    bottomGeo.setAttribute('position', new THREE.Float32BufferAttribute(posBottom, 3))
    bottomGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvsBottom, 2))
    bottomGeo.setIndex(indicesBottom)
    bottomGeo.computeVertexNormals()

    return { topArchGeometry: topGeo, bottomArchGeometry: bottomGeo }
  }, [radius])

  // 4. Rotación continua del gas a 60 FPS
  useFrame((_, delta) => {
    diskTexture.rotation += delta * 0.18
    bellTexture.offset.x += delta * 0.08
  })

  const innerR = radius * 1.008
  const outerR = radius * 3.5

  return (
    <group>
      {/* 1. DISCO ECUATORIAL PLANO (Horizontal cortando por delante) */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerR, outerR, 128]} />
        <meshBasicMaterial
          map={diskTexture}
          side={THREE.DoubleSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.95}
        />
      </mesh>

      {/* 2. CÚPULA SUPERIOR EN FORMA DE CAMPANA (Líneas curvadas y desvanecimiento a 0) */}
      <mesh geometry={topArchGeometry} position={[0, 0, 0]}>
        <meshBasicMaterial
          map={bellTexture}
          side={THREE.DoubleSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.92}
        />
      </mesh>

      {/* 3. CÚPULA INFERIOR EN FORMA DE CAMPANA (Líneas curvadas y desvanecimiento a 0) */}
      <mesh geometry={bottomArchGeometry} position={[0, 0, 0]}>
        <meshBasicMaterial
          map={bellTexture}
          side={THREE.DoubleSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.82}
        />
      </mesh>
    </group>
  )
}
