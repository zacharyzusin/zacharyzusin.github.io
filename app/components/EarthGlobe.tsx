"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion, useInView } from "framer-motion";
import { Visit, fetchVisits, isConfigured, SEED_VISITS } from "../lib/visitors";

const R = 1; // earth radius

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// A soft radial glow sprite for markers
function makeGlowTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(147,197,253,1)");
  g.addColorStop(0.3, "rgba(96,165,250,0.8)");
  g.addColorStop(1, "rgba(59,130,246,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export default function EarthGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const glowTexRef = useRef<THREE.Texture | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [sceneReady, setSceneReady] = useState(false);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  // Load data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isConfigured()) {
        const data = await fetchVisits();
        if (!cancelled) setVisits(data.length ? data : SEED_VISITS);
      } else {
        setVisits(SEED_VISITS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Set up the three.js scene
  useEffect(() => {
    if (!inView || !mountRef.current) return;
    const mount = mountRef.current;

    const size = mount.clientWidth || 480;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.3, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const dayMap = loader.load("/textures/earth_day.jpg");
    dayMap.colorSpace = THREE.SRGBColorSpace;
    const specMap = loader.load("/textures/earth_specular.jpg");
    const cloudMap = loader.load("/textures/earth_clouds.png");

    // Earth
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshPhongMaterial({
        map: dayMap,
        specularMap: specMap,
        specular: new THREE.Color(0x333355),
        shininess: 12,
      })
    );
    scene.add(earth);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.01, 64, 64),
      new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      })
    );
    scene.add(clouds);

    // Atmosphere (fresnel rim glow)
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.18, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(0x3b82f6) } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(uColor, 1.0) * intensity;
          }
        `,
      })
    );
    scene.add(atmosphere);

    // Markers group (children of earth so they follow it)
    const markersGroup = new THREE.Group();
    earth.add(markersGroup);
    markersGroupRef.current = markersGroup;
    glowTexRef.current = makeGlowTexture();
    setSceneReady(true);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(3, 1.5, 2);
    scene.add(sun);

    // Controls — auto-spin + drag to rotate
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.minDistance = 3.5;
    controls.maxDistance = 6;
    controls.enablePan = false;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    controls.rotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    let raf = 0;
    const animate = () => {
      if (!reduceMotion) clouds.rotation.y += 0.0004;
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const s = mount.clientWidth || 480;
      renderer.setSize(s, s);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      markersGroupRef.current = null;
    };
  }, [inView]);

  // Rebuild markers whenever visit data changes
  useEffect(() => {
    const group = markersGroupRef.current;
    const glowTex = glowTexRef.current;
    if (!group || !glowTex) return;

    // Clear existing
    while (group.children.length) group.remove(group.children[0]);

    // Group exact coordinate matches (e.g. repeat visits from the same
    // network) into one bigger marker instead of stacking duplicates.
    const counts = new Map<string, { lat: number; lng: number; n: number }>();
    for (const v of visits) {
      const key = `${v.lat},${v.lng}`;
      const e = counts.get(key);
      if (e) e.n += 1;
      else counts.set(key, { lat: v.lat, lng: v.lng, n: 1 });
    }

    for (const c of counts.values()) {
      const pos = latLngToVec3(c.lat, c.lng, R * 1.02);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      const s = 0.035 + Math.min(0.05, c.n * 0.008);
      sprite.scale.set(s, s, s);
      sprite.position.copy(pos);
      group.add(sprite);
    }
  }, [visits, sceneReady]);

  return (
    <section id="visitors" className="py-24">
      <div className="max-w-6xl mx-auto px-6" ref={containerRef}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl text-[#f1f5f9] whitespace-nowrap">
            Where This Site&apos;s Been Seen
          </h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>

        <p className="text-sm text-[#94a3b8] mb-10 max-w-lg">
          Each marker on the globe is a place someone has visited this site from.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div
            ref={mountRef}
            className="w-full max-w-[480px] aspect-square cursor-grab active:cursor-grabbing"
          />
        </motion.div>
      </div>
    </section>
  );
}
