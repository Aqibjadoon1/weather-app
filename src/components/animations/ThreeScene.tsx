"use client";

import { useEffect, useRef } from "react";

interface ThreeSceneProps {
  className?: string;
  variant?: "sun" | "particles" | "birds" | "profile_orb";
  sunPosition?: [number, number, number];
}

export default function ThreeScene({
  className = "",
  variant = "sun",
  sunPosition = [3, 3, -5],
}: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let animId: number;
    let scene: any, camera: any, renderer: any;
    let sunGroup: any, raysGroup: any, birds: any[] = [], windParticles: any;
    let orbGroup: any, orbMesh: any, coreMesh: any, orbParticles: any[] = [];
    let particlesCount = 0, velocities: any[] = [];

    const init = async () => {
      const THREE = await import("three");

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffcc33, 2, 50);
      pointLight.position.set(5, 5, 2);
      scene.add(pointLight);

      if (variant === "profile_orb") {
        orbGroup = new THREE.Group();

        const geometry = new THREE.IcosahedronGeometry(1.5, 4);
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0x007aff,
          emissiveIntensity: 0.2,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });
        orbMesh = new THREE.Mesh(geometry, material);
        orbGroup.add(orbMesh);

        const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
        const coreMat = new THREE.MeshPhongMaterial({
          color: 0x007aff,
          emissive: 0x005bb7,
          emissiveIntensity: 0.5,
          shininess: 100,
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        orbGroup.add(coreMesh);

        const oCount = 50;
        const particleGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < oCount; i++) {
          const pMesh = new THREE.Mesh(particleGeo, particleMat);
          const r = 2 + Math.random();
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          pMesh.position.x = r * Math.sin(phi) * Math.cos(theta);
          pMesh.position.y = r * Math.sin(phi) * Math.sin(theta);
          pMesh.position.z = r * Math.cos(phi);

          pMesh.userData = {
            angle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.01,
            r: r,
          };
          orbGroup.add(pMesh);
          orbParticles.push(pMesh);
        }
        scene.add(orbGroup);
      }

      if (variant === "sun" || variant === "birds") {
        sunGroup = new THREE.Group();
        const sunGeo = new THREE.SphereGeometry(1, 64, 64);
        const sunMat = new THREE.MeshPhongMaterial({
          color: 0xffdd44,
          emissive: 0xffaa00,
          emissiveIntensity: 0.6,
          shininess: 100,
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sunGroup.add(sun);

        raysGroup = new THREE.Group();
        for (let i = 0; i < 16; i++) {
          const rayGeo = new THREE.CylinderGeometry(0.01, 0.08, 1.6, 8);
          const rayMat = new THREE.MeshPhongMaterial({ color: 0xffcc33, transparent: true, opacity: 0.4 });
          const ray = new THREE.Mesh(rayGeo, rayMat);
          const angle = (i / 16) * Math.PI * 2;
          ray.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
          ray.rotation.z = angle + Math.PI / 2;
          raysGroup.add(ray);
        }
        sunGroup.add(raysGroup);
        sunGroup.position.set(sunPosition[0], sunPosition[1], sunPosition[2]);
        scene.add(sunGroup);
      }

      if (variant === "birds" || variant === "sun") {
        birds = [];
        const bCount = variant === "birds" ? 8 : 5;
        for (let i = 0; i < bCount; i++) {
          const b = new THREE.Group();
          const w = new THREE.PlaneGeometry(0.3, 0.08);
          const m = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
          const lw = new THREE.Mesh(w, m);
          const rw = lw.clone();
          lw.position.x = -0.15;
          rw.position.x = 0.15;
          b.add(lw, rw);
          b.position.set(-15 - Math.random() * 10, 2 + Math.random() * 4, -6);
          scene.add(b);
          birds.push({ mesh: b, lw, rw, speed: 0.02 + Math.random() * 0.05, phase: Math.random() * Math.PI });
        }
      }

      if (variant !== "profile_orb") {
        particlesCount = variant === "particles" ? 300 : 200;
        const posArray = new Float32Array(particlesCount * 3);
        velocities = [];
        for (let i = 0; i < particlesCount; i++) {
          posArray[i * 3] = (Math.random() - 0.5) * 30;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
          velocities.push({
            x: 0.01 + Math.random() * 0.04,
            y: (Math.random() - 0.5) * 0.02,
            phase: Math.random() * Math.PI * 2,
          });
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const mat = new THREE.PointsMaterial({
          size: 0.06,
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
        });
        windParticles = new THREE.Points(geo, mat);
        scene.add(windParticles);
      }

      camera.position.z = variant === "profile_orb" ? 6 : 10;
      animate();
    };

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!renderer || !scene || !camera) return;
      const time = Date.now() * 0.001;

      if (orbGroup && orbMesh && coreMesh) {
        orbGroup.rotation.y += 0.005;
        orbGroup.rotation.x += 0.003;
        orbMesh.scale.setScalar(1 + Math.sin(time) * 0.05);
        coreMesh.rotation.y -= 0.01;
        orbParticles.forEach((p: any) => {
          p.userData.angle += p.userData.speed;
          p.position.x = p.userData.r * Math.cos(p.userData.angle);
          p.position.z = p.userData.r * Math.sin(p.userData.angle);
          p.position.y += Math.sin(time + p.userData.angle) * 0.01;
        });
      }

      if (sunGroup) {
        sunGroup.rotation.z += 0.002;
        if (raysGroup) raysGroup.rotation.z -= 0.005;
      }

      birds.forEach((b: any) => {
        b.mesh.position.x += b.speed;
        b.mesh.position.y += Math.sin(time + b.phase) * 0.005;
        const flap = Math.sin(time * 8 + b.phase) * 0.5;
        b.lw.rotation.z = flap;
        b.rw.rotation.z = -flap;
        if (b.mesh.position.x > 15) b.mesh.position.x = -15;
      });

      if (windParticles) {
        const p = windParticles.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
          p[i * 3] += velocities[i].x;
          p[i * 3 + 1] += Math.sin(time + velocities[i].phase) * 0.005;
          if (p[i * 3] > 15) p[i * 3] = -15;
          if (p[i * 3] < -15) p[i * 3] = 15;
        }
        windParticles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }


    init();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [variant, sunPosition[0], sunPosition[1], sunPosition[2]]);

  return <div ref={containerRef} className={className} />;
}
