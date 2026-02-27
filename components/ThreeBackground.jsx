import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const ThreeBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const W = container.clientWidth;
        const H = container.clientHeight;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // ── Color palette ──
        const GREEN = new THREE.Color(0x00ff9d);
        const CYAN = new THREE.Color(0x00e5ff);
        const DIM = new THREE.Color(0x004d30);

        // ── 1. Particle stars ──
        const starCount = 1200;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 40;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: DIM, size: 0.06, transparent: true, opacity: 0.7 });
        scene.add(new THREE.Points(starGeo, starMat));

        // ── 2. Data-stream particles (fast moving) ──
        const streamCount = 300;
        const streamPos = new Float32Array(streamCount * 3);
        const streamVel = new Float32Array(streamCount * 3);
        for (let i = 0; i < streamCount; i++) {
            streamPos[i * 3] = (Math.random() - 0.5) * 20;
            streamPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            streamPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
            streamVel[i * 3] = (Math.random() - 0.5) * 0.01;
            streamVel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            streamVel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }
        const streamGeo = new THREE.BufferGeometry();
        streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
        const streamMat = new THREE.PointsMaterial({
            color: GREEN, size: 0.04, transparent: true, opacity: 0.9,
        });
        const streamPoints = new THREE.Points(streamGeo, streamMat);
        scene.add(streamPoints);

        // ── 3. Wireframe sphere (globe) ──
        const globeGeo = new THREE.SphereGeometry(1.55, 24, 16);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x00ff9d, wireframe: true,
            transparent: true, opacity: 0.08,
        });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        scene.add(globe);

        // Glowing dots ON the globe surface
        const dotCount = 180;
        const dotPositions = new Float32Array(dotCount * 3);
        for (let i = 0; i < dotCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.56;
            dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            dotPositions[i * 3 + 2] = r * Math.cos(phi);
        }
        const dotGeo = new THREE.BufferGeometry();
        dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
        const dotMat = new THREE.PointsMaterial({ color: GREEN, size: 0.05, transparent: true, opacity: 0.8 });
        const globeDots = new THREE.Points(dotGeo, dotMat);
        scene.add(globeDots);

        // ── 4. Connecting lines between nearby dots ──
        const linePositions = [];
        for (let i = 0; i < dotCount; i++) {
            for (let j = i + 1; j < dotCount; j++) {
                const ax = dotPositions[i * 3], ay = dotPositions[i * 3 + 1], az = dotPositions[i * 3 + 2];
                const bx = dotPositions[j * 3], by = dotPositions[j * 3 + 1], bz = dotPositions[j * 3 + 2];
                const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
                if (d < 0.7) {
                    linePositions.push(ax, ay, az, bx, by, bz);
                }
            }
        }
        if (linePositions.length > 0) {
            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
            const lineMat = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.15 });
            const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(linesMesh);
        }

        // ── 5. Outer ring torus ──
        const torusGeo = new THREE.TorusGeometry(2.1, 0.003, 8, 120);
        const torusMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35 });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.rotation.x = Math.PI / 3;
        scene.add(torus);

        const torus2 = torus.clone();
        torus2.rotation.x = -Math.PI / 4;
        torus2.rotation.y = Math.PI / 6;
        scene.add(torus2);

        // ── Mouse parallax ──
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Resize ──
        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // ── Animation loop ──
        let frame = 0;
        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            frame++;

            const t = frame * 0.005;

            // Animate stream particles
            const pos = streamGeo.attributes.position.array;
            for (let i = 0; i < streamCount; i++) {
                pos[i * 3] += streamVel[i * 3];
                pos[i * 3 + 1] += streamVel[i * 3 + 1];
                pos[i * 3 + 2] += streamVel[i * 3 + 2];
                // Wrap around
                if (Math.abs(pos[i * 3]) > 10) pos[i * 3] *= -0.9;
                if (Math.abs(pos[i * 3 + 1]) > 10) pos[i * 3 + 1] *= -0.9;
                if (Math.abs(pos[i * 3 + 2]) > 10) pos[i * 3 + 2] *= -0.9;
            }
            streamGeo.attributes.position.needsUpdate = true;
            streamMat.opacity = 0.5 + 0.4 * Math.sin(t * 2);

            // Globe rotation + parallax
            globe.rotation.y = t * 0.3;
            globe.rotation.x = t * 0.08;
            globeDots.rotation.y = globe.rotation.y;
            globeDots.rotation.x = globe.rotation.x;

            // Torus orbit
            torus.rotation.z = t * 0.15;
            torus2.rotation.z = -t * 0.2;

            // Camera parallax
            camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
            camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            // Pulse dots
            dotMat.opacity = 0.5 + 0.4 * Math.sin(t * 1.5);

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, #000d04 0%, #020a04 60%, #000000 100%)' }}
        />
    );
};
