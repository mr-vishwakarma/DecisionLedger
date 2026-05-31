import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

export default function FluidCanvas() {
  const canvasRef = useRef(null);
  const { mode } = useTheme();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_scroll: { value: 0 },
      u_isDark: { value: mode === 'dark' ? 1.0 : 0.0 }
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_scroll;
        uniform float u_isDark;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          float d = distance(uv, vec2(0.5));
          
          float grid = sin(uv.x * 50.0 + u_time) * cos(uv.y * 50.0 - u_time * 0.5);
          float flow = sin(d * 10.0 - u_time * 2.0 + u_scroll * 5.0);
          
          // Light theme colors (tan/cream)
          vec3 lightColor1 = vec3(0.9568, 0.8980, 0.8078); // #F4E5CE
          vec3 lightColor2 = vec3(0.85, 0.80, 0.70); // Slightly darker tan for contrast

          // Dark theme colors (black/dark grey)
          vec3 darkColor1 = vec3(0.02, 0.02, 0.02);
          vec3 darkColor2 = vec3(0.08, 0.08, 0.08);

          // Interpolate based on theme
          vec3 color1 = mix(lightColor1, darkColor1, u_isDark);
          vec3 color2 = mix(lightColor2, darkColor2, u_isDark);
          
          float mixVal = smoothstep(0.4, 0.5, d + flow * 0.02 + grid * 0.01);
          vec3 color = mix(color1, color2, mixVal * 0.2);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 1;

    let reqId;
    const animate = (time) => {
      uniforms.u_time.value = time * 0.001;
      uniforms.u_scroll.value = window.scrollY / window.innerHeight;
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return <canvas id="webgl-canvas" ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
}
