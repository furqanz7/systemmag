import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const createRange = (length: number) => Array.from({ length }, (_, index) => index);

const MagneticArc: React.FC<{ index: number; spread: number }> = ({ index, spread }) => {
  const geometry = useMemo(() => {
    const offset = (index - 3.5) * spread;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.75 + offset * 0.08, -0.12, 0.18 + offset),
      new THREE.Vector3(-0.92 + offset * 0.04, 0.56 + index * 0.012, 0.48 + offset * 0.66),
      new THREE.Vector3(0.18, 0.9 + index * 0.018, 0.28 + offset * 0.34),
      new THREE.Vector3(1.18 - offset * 0.04, 0.52 + index * 0.012, -0.02 + offset * 0.55),
      new THREE.Vector3(1.76 - offset * 0.08, -0.1, -0.24 + offset),
    ]);

    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(72));
  }, [index, spread]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={index % 2 ? '#f2b04b' : '#e65f18'} transparent opacity={0.18 + index * 0.025} />
    </line>
  );
};

const MagneticStripModel: React.FC = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const glowRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock, pointer }) => {
    const group = groupRef.current;
    if (!group) return;

    const time = clock.elapsedTime;
    group.rotation.y = -0.42 + pointer.x * 0.1 + Math.sin(time * 0.34) * 0.035;
    group.rotation.x = 0.28 - pointer.y * 0.05 + Math.sin(time * 0.28) * 0.025;
    group.position.y = Math.sin(time * 0.52) * 0.045;

    glowRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.scale.setScalar(0.82 + Math.sin(time * 2.1 + index * 0.64) * 0.18);
    });
  });

  return (
    <Float speed={1.05} rotationIntensity={0.13} floatIntensity={0.18}>
      <group ref={groupRef} position={[0.4, -0.06, 0]} rotation={[0.28, -0.42, -0.14]}>
        <RoundedBox args={[4.9, 0.16, 0.72]} radius={0.08} smoothness={10} position={[-0.36, -0.26, 0.22]} rotation={[0.02, 0, -0.1]}>
          <meshStandardMaterial color="#0d0d0c" roughness={0.86} metalness={0.08} />
        </RoundedBox>
        <RoundedBox args={[4.35, 0.16, 0.7]} radius={0.08} smoothness={10} position={[0.4, 0.34, -0.05]} rotation={[0.04, 0, 0.11]}>
          <meshStandardMaterial color="#141412" roughness={0.82} metalness={0.06} />
        </RoundedBox>

        {createRange(8).map((index) => {
          const x = -1.72 + index * 0.5;
          return (
            <group key={index}>
              <mesh position={[x, 0.19 + Math.sin(index * 0.6) * 0.035, 0.35]} ref={(node) => { glowRefs.current[index] = node; }}>
                <sphereGeometry args={[0.055, 18, 18]} />
                <meshBasicMaterial color="#ff8b2d" transparent opacity={0.92} />
              </mesh>
              <mesh position={[x + 0.05, -0.12, 0.46]}>
                <sphereGeometry args={[0.035, 14, 14]} />
                <meshBasicMaterial color="#ffc35a" transparent opacity={0.54} />
              </mesh>
            </group>
          );
        })}

        {createRange(8).map((index) => (
          <MagneticArc key={index} index={index} spread={0.085} />
        ))}
      </group>
    </Float>
  );
};

const MagneticTheater: React.FC = () => (
  <div className="magnetic-theater" aria-hidden="true">
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 6.2], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={1.45} />
      <directionalLight position={[3.5, 5.5, 4.5]} intensity={2.2} color="#fff1dd" />
      <pointLight position={[0.6, 1.2, 2.2]} intensity={3.2} color="#f06a24" distance={7} />
      <MagneticStripModel />
    </Canvas>
  </div>
);

export default MagneticTheater;
