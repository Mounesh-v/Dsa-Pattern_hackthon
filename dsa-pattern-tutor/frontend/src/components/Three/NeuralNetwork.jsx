import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NeuralNetwork = () => {
  const groupRef = useRef();

  // Create nodes
  const nodes = useMemo(() => {
    const nodeCount = 50;
    const positions = [];
    const colors = [];

    for (let i = 0; i < nodeCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );

      // Random neon colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors.push(0, 0.95, 1); // Neon blue
      } else if (colorChoice < 0.66) {
        colors.push(0.75, 0, 1); // Neon purple
      } else {
        colors.push(1, 0, 1); // Neon pink
      }
    }

    return { positions, colors };
  }, []);

  // Create connections
  const connections = useMemo(() => {
    const lines = [];
    const maxDistance = 5;

    for (let i = 0; i < nodes.positions.length / 3; i++) {
      for (let j = i + 1; j < nodes.positions.length / 3; j++) {
        const x1 = nodes.positions[i * 3];
        const y1 = nodes.positions[i * 3 + 1];
        const z1 = nodes.positions[i * 3 + 2];

        const x2 = nodes.positions[j * 3];
        const y2 = nodes.positions[j * 3 + 1];
        const z2 = nodes.positions[j * 3 + 2];

        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
        );

        if (distance < maxDistance) {
          lines.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }

    return lines;
  }, [nodes.positions]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length / 3}
            array={new Float32Array(connections)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f5ff" opacity={0.3} transparent />
      </lineSegments>

      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.positions.length / 3}
            array={new Float32Array(nodes.positions)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.colors.length / 3}
            array={new Float32Array(nodes.colors)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export default NeuralNetwork;
