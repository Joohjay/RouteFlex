import { MeshPhysicalMaterial, Color } from 'three';

export function createTruckPaint(color = '#1B2A3F'): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.4,
    envMapIntensity: 1.2,
  });
}

export function createMetal(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#8A929A'),
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5,
  });
}

export function createRubber(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#1A1A1A'),
    metalness: 0,
    roughness: 0.95,
  });
}

export function createGlass(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#2A4A6F'),
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.6,
    envMapIntensity: 1.5,
  });
}

export function createContainerMaterial(color = '#C29A4A'): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: 0.4,
    roughness: 0.6,
    envMapIntensity: 0.8,
  });
}

export function createFloorMaterial(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#1A1A1E'),
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: 0.4,
  });
}

export function createWarehouseWall(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#2A2A30'),
    metalness: 0.2,
    roughness: 0.8,
    envMapIntensity: 0.3,
  });
}