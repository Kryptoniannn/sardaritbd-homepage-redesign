import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hardware-accelerated Three.js 3D WebGL centerpiece:
 * Faceted iridescent crystal core + orbiting gyroscope rings + 3D spatial particle galaxy.
 */
export default function ThreeStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    // Studio 3-point lighting (Cobalt + Solar Gold + Ice Rim)
    const amb = new THREE.AmbientLight(0x4b6bff, 1.3);
    scene.add(amb);

    const keyLight = new THREE.PointLight(0x3d6bff, 22, 24);
    keyLight.position.set(4.5, 4, 5);
    scene.add(keyLight);

    const goldLight = new THREE.PointLight(0xffd000, 18, 22);
    goldLight.position.set(-4.5, -3, 4.5);
    scene.add(goldLight);

    const rimLight = new THREE.DirectionalLight(0x9fb8ff, 2.2);
    rimLight.position.set(0, 6, -4);
    scene.add(rimLight);

    // Master sculpture group positioned behind the right Hero stage on desktop
    const rig = new THREE.Group();
    scene.add(rig);

    // 1. Faceted Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x102875,
      emissive: 0x071338,
      metalness: 0.45,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.85,
      iridescenceIOR: 1.4,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rig.add(coreMesh);

    // 2. Wireframe Precision Lattice Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.66, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x6f93ff,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rig.add(cageMesh);

    // 3. Dual Gyroscope Torus Rings
    const ring1Geo = new THREE.TorusGeometry(2.45, 0.011, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      emissive: 0xffd000,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(Math.PI * 0.32, Math.PI * 0.12, 0);
    rig.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.72, 0.014, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x5d84ff,
      emissive: 0x3d6bff,
      emissiveIntensity: 0.55,
      metalness: 0.8,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(-Math.PI * 0.28, Math.PI * 0.38, 0);
    rig.add(ring2);

    // 4. Orbiting Gold Satellites
    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      emissive: 0xffd000,
      emissiveIntensity: 0.85,
    });
    const sat1 = new THREE.Mesh(satGeo, satMat);
    const sat2 = new THREE.Mesh(satGeo, satMat);
    rig.add(sat1, sat2);

    // 5. 3D Depth Particle Field
    const P_COUNT = 260;
    const pPositions = new Float32Array(P_COUNT * 3);
    const pColors = new Float32Array(P_COUNT * 3);
    const cBlue = new THREE.Color(0x6f93ff);
    const cGold = new THREE.Color(0xffd000);

    for (let i = 0; i < P_COUNT; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 18;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1.5;
      const c = Math.random() > 0.78 ? cGold : cBlue;
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    ptsGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const ptsMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const points = new THREE.Points(ptsGeo, ptsMat);
    scene.add(points);

    const resize = () => {
      if (!renderer || !host) return;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      // Position sculpture smoothly to frame the right visual area on desktop
      if (w >= 1024) {
        rig.position.set(1.95, 0.1, -1.2);
        rig.scale.setScalar(1.0);
      } else {
        rig.position.set(0, 0.8, -1.6);
        rig.scale.setScalar(0.8);
      }
    };
    resize();

    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      target.y = -(e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    const onRestored = () => {
      lost = false;
      resize();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);

    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      if (!lost && renderer && !document.hidden) {
        const t = clock.getElapsedTime();
        mouse.x += (target.x - mouse.x) * 0.05;
        mouse.y += (target.y - mouse.y) * 0.05;

        const scrollRatio = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        rig.rotation.y = t * 0.24 + mouse.x * 0.55 + scrollRatio * 1.4;
        rig.rotation.x = t * 0.14 + mouse.y * 0.4;
        rig.position.y = (window.innerWidth >= 1024 ? 0.1 : 0.8) + Math.sin(t * 1.1) * 0.16 - scrollRatio * 1.2;

        coreMesh.rotation.z = -t * 0.18;
        cageMesh.rotation.y = -t * 0.12;
        ring1.rotation.z = t * 0.35;
        ring2.rotation.z = -t * 0.28;

        sat1.position.set(Math.cos(t * 1.15) * 2.35, Math.sin(t * 1.15) * 1.2, Math.sin(t * 1.15) * 1.8);
        sat2.position.set(Math.sin(t * 0.9) * 2.7, Math.cos(t * 0.9) * 1.5, Math.cos(t * 0.9) * -1.4);

        points.rotation.y = t * 0.03 + mouse.x * 0.08;
        points.rotation.x = mouse.y * 0.05;

        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (renderer) {
        renderer.domElement.removeEventListener("webglcontextlost", onLost);
        renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
        renderer.dispose();
        if (renderer.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
      }
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-90" />;
}
