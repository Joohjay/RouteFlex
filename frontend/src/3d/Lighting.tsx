import { Environment, ContactShadows } from '@react-three/drei';

export function SceneLighting() {
  return (
    <>
      <Environment
        preset="warehouse"
        environmentIntensity={0.6}
        environmentRotation={[0, Math.PI / 4, 0]}
      />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={4}
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#C29A4A"
      />
      <pointLight
        position={[0, 6, 0]}
        intensity={0.6}
        color="#C29A4A"
        distance={15}
        decay={2}
      />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
      />
    </>
  );
}

export function DimLighting() {
  return (
    <>
      <Environment
        preset="warehouse"
        environmentIntensity={0.2}
        environmentRotation={[0, Math.PI / 4, 0]}
      />
      <ambientLight intensity={0.08} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={0.15}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />
      <pointLight
        position={[0, 3, 2]}
        intensity={0.25}
        color="#C29A4A"
        distance={10}
        decay={2}
      />
    </>
  );
}