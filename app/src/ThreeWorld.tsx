import { useEffect, useRef } from "react";

type ThreeWorldProps = {
  active: number;
  kind: string;
  reacting: boolean;
  onAntClick: () => void;
};

/**
 * Real WebGL scene. Three.js is loaded as an ES module at runtime so the
 * production bundle stays lean; the resume and navigation remain ordinary,
 * accessible React/HTML rather than text baked into a canvas.
 */
export default function ThreeWorld({ active, kind, reacting, onAntClick }: ThreeWorldProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let frame = 0;
    let renderer: any;
    let resizeObserver: ResizeObserver | undefined;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const moduleUrl = "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
      const THREE: any = await import(/* @vite-ignore */ moduleUrl);
      if (cancelled || !host) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#171313");
      scene.fog = new THREE.Fog("#171313", 10, 26);
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
      camera.position.set(0, 5.1, 13.5);
      camera.lookAt(0, 1.1, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.className = "three-world-canvas";
      renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional desk scene with a tiny ant exploring a career story");
      host.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight("#ffe7cf", "#28202b", 2.0));
      const keyLight = new THREE.DirectionalLight("#ffe1bd", 3.4);
      keyLight.position.set(-4, 9, 7); keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024); scene.add(keyLight);
      const rim = new THREE.PointLight("#df9369", 18, 18); rim.position.set(4, 4, -2); scene.add(rim);
      const screenGlow = new THREE.PointLight("#83c7ba", 8, 9); screenGlow.position.set(0, 3.5, -3); scene.add(screenGlow);

      const mat = (color: string, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
      const wood = mat("#594035"); const woodEdge = mat("#8b6045"); const dark = mat("#211d1d", .35);
      const keyMat = mat("#4a3b37", .4); const keyTop = mat("#b88d6c", .42);
      const cream = mat("#f1dfc4"); const gold = mat("#dfad73", .4, .18);
      const green = mat("#48796a", .48); const red = mat("#853d2e", .43);
      const makeBox = (w: number, h: number, d: number, material: any, x: number, y: number, z: number, parent: any = scene) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
      };
      const makeSphere = (r: number, material: any, x: number, y: number, z: number, parent: any, sx = 1, sy = 1, sz = 1) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), material);
        mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
      };
      const makeCylinderBetween = (a: any, b: any, radius: number, material: any, parent: any) => {
        const start = new THREE.Vector3(...a); const end = new THREE.Vector3(...b);
        const delta = new THREE.Vector3().subVectors(end, start);
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * .72, radius, delta.length(), 8), material);
        mesh.position.copy(start).add(end).multiplyScalar(.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
        mesh.castShadow = true; parent.add(mesh); return mesh;
      };

      // A continuous, physical desktop environment.
      makeBox(19, .42, 12, wood, 0, -.28, -1);
      makeBox(19.1, .12, 12.1, woodEdge, 0, -.53, -1);
      for (let i = 0; i < 14; i++) {
        const grain = makeBox(18.6, .009, .018, mat(i % 2 ? "#78533f" : "#49332a"), 0, -.061 + i * .0002, -6.2 + i * .82);
        grain.receiveShadow = false;
      }
      // Monitor, stand, bezel and luminous screen.
      makeBox(5.2, 3.15, .22, dark, 0, 2.45, -4.35);
      makeBox(4.92, 2.86, .04, mat("#18302f", .25, .1), 0, 2.48, -4.21);
      makeBox(.32, .8, .36, dark, 0, .48, -4.25);
      makeBox(1.8, .13, .85, dark, 0, .08, -4.1);
      makeBox(4.45, .018, .018, mat("#8bc4ac", .25, .1), 0, 3.38, -4.17);
      // Tiny glowing pixels give the screen depth without turning the resume into a HUD.
      for (let i = 0; i < 6; i++) makeBox(.12 + i * .045, .025, .018, mat("#77a99b", .35), -1.8 + i * .58, 1.7, -4.16);
      makeBox(2.7, .04, .04, gold, 0, 2.1, -4.15);

      // Physical keyboard with individual sculpted keys.
      const keyboard = new THREE.Group(); keyboard.position.set(0, -.02, 2.2); keyboard.rotation.x = -.055; scene.add(keyboard);
      makeBox(6.5, .2, 2.15, dark, 0, 0, 0, keyboard);
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 14; col++) {
          const key = makeBox(.36, .105, .29, (row + col) % 5 === 0 ? keyTop : keyMat, -2.91 + col * .448, .14, -.78 + row * .39, keyboard);
          key.userData.phase = (row * 14 + col) * .21;
          key.userData.homeY = key.position.y;
        }
      }
      makeBox(2.05, .075, .32, keyTop, 0, .14, 1.12, keyboard);
      // A notebook, report folder and a little operations dashboard: props along one desk, not separate slides.
      const notebook = new THREE.Group(); notebook.position.set(-5.2, .01, -.2); notebook.rotation.y = .12; scene.add(notebook);
      makeBox(2.35, .12, 3.1, mat("#b99a75"), 0, 0, 0, notebook);
      makeBox(2.14, .035, 2.85, cream, 0, .08, 0, notebook);
      for (let i = 0; i < 7; i++) makeBox(1.65, .012, .018, mat("#b9a38a"), -.05, .105, -.95 + i * .3, notebook);
      const report = new THREE.Group(); report.position.set(5.1, .03, -.3); report.rotation.y = -.16; scene.add(report);
      makeBox(2.1, .14, 2.8, mat("#d5c3a7"), 0, 0, 0, report);
      makeBox(1.8, .03, 2.48, mat("#eee0c6"), 0, .09, 0, report);
      for (let i = 0; i < 6; i++) makeBox(.17, .22 + (i % 3) * .12, .18, i % 2 ? green : gold, -.6 + i * .23, .23, -.42, report);
      const dashboard = new THREE.Group(); dashboard.position.set(3.9, 1.35, -2.8); scene.add(dashboard);
      makeBox(2.3, 1.4, .12, dark, 0, 0, 0, dashboard);
      makeBox(2.08, 1.18, .035, mat("#19302b", .32), 0, .02, .08, dashboard);
      for (let i = 0; i < 6; i++) makeBox(.18, .22 + (i % 4) * .14, .04, green, -.72 + i * .27, -.25 + (i % 4) * .055, .11, dashboard);
      const books = new THREE.Group(); books.position.set(-4.1, .1, -3.15); books.rotation.z = -.06; scene.add(books);
      for (let i = 0; i < 3; i++) makeBox(1.7, .28, 2.3, [mat("#9a6346"), mat("#c1a17a"), mat("#506e65")][i], 0, i * .29, 0, books);
      // Sugar cube waits at the far right end of the same desktop.
      const sugar = new THREE.Group(); sugar.position.set(7.0, .2, 1.2); scene.add(sugar);
      makeBox(.8, .8, .8, mat("#fff7e9", .28), 0, .25, 0, sugar);
      const sugarTop = makeBox(.63, .018, .63, mat("#ffffff", .3), 0, .66, 0, sugar);

      // Fully articulated ant: three pairs of legs, joints, abdomen, thorax, head, eyes and antennae.
      const ant = new THREE.Group(); scene.add(ant);
      const antDark = mat("#402019", .42); const antShell = mat("#7c3528", .36); const antLight = mat("#b85d40", .38);
      makeSphere(.29, antShell, -.43, .45, 0, ant, 1.18, .95, 1.0);
      makeSphere(.2, antDark, -.06, .46, 0, ant, 1, .94, .9);
      makeSphere(.28, antLight, .31, .62, 0, ant, 1, .94, .92);
      const eyeWhite = mat("#fff8e9", .22); const pupilMat = mat("#211312", .15);
      for (const side of [-1, 1]) {
        makeSphere(.09, eyeWhite, .48, .68, side * .205, ant, 1, 1.15, .75);
        makeSphere(.045, pupilMat, .52, .68, side * .25, ant);
        makeSphere(.017, mat("#ffffff", .1), .535, .715, side * .276, ant);
      }
      const antennae: any[] = [];
      for (const side of [-1, 1]) {
        const points = [new THREE.Vector3(.35, .83, side * .1), new THREE.Vector3(.42, 1.02, side * .16), new THREE.Vector3(.59, 1.06, side * .22)];
        const curve = new THREE.CatmullRomCurve3(points);
        const feeler = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, .022, 6, false), antDark); ant.add(feeler); antennae.push(feeler);
        makeSphere(.045, antLight, .59, 1.06, side * .22, ant);
      }
      const legs: any[] = [];
      for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
        const x = -.12 + i * .19; const z = side * .12;
        const hip = new THREE.Group(); hip.position.set(x, .43, z); ant.add(hip);
        const upper = makeCylinderBetween([0, 0, 0], [i - 1 === 0 ? -.16 : i - 1 > 0 ? .13 : -.13, -.16, side * .13], .035, antDark, hip);
        const knee = upper.position.clone().add(new THREE.Vector3(i === 1 ? .03 : (i === 0 ? -.13 : .13), -.08, side * .13));
        const lower = makeCylinderBetween([upper.position.x + (i === 1 ? 0 : i === 0 ? -.13 : .13), -.16, side * .13], [i === 0 ? -.28 : i === 1 ? .04 : .31, -.39, side * .2], .026, antDark, hip);
        legs.push({ hip, phase: (i + (side === 1 ? 1 : 0)) * Math.PI, upper, lower });
      }

      const path = [
        [-1.1, .25, 2.0], [-1.1, .25, .5], [0, .4, -1.1], [.45, 1.1, -3.1],
        [-2.2, .25, -.4], [-4.5, .22, -.4], [0, .22, -.3], [4.5, .22, -.3],
        [3.5, 1.55, -2.35], [5.0, .22, -.3], [-3.7, .42, -2.9], [7.0, .8, 1.2]
      ];
      const onResize = () => {
        if (!host || !renderer) return;
        const w = Math.max(1, host.clientWidth); const h = Math.max(1, host.clientHeight);
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(onResize); resizeObserver.observe(host); onResize();
      const pointerHandler = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        // The ant occupies the lower middle of the world in every chapter.
        if (y > .35 && y < .98 && x > .2 && x < .8) onAntClick();
      };
      renderer.domElement.addEventListener("pointerdown", pointerHandler);
      const clock = new THREE.Clock();
      const animate = () => {
        if (cancelled) return;
        const t = clock.getElapsedTime();
        const target = path[Math.min(active, path.length - 1)] || path[0];
        ant.position.set(target[0] + Math.sin(t * .75) * .035, target[1] + (reacting ? .04 : Math.abs(Math.sin(t * 7)) * .025), target[2]);
        ant.rotation.y = (active > 2 ? .35 : 0) + Math.sin(t * .8) * .06 + (reacting ? Math.PI : 0);
        ant.rotation.z = reacting ? Math.sin(t * 9) * .08 : Math.sin(t * 7) * .025;
        legs.forEach((leg) => { leg.hip.rotation.z = Math.sin(t * 11 + leg.phase) * .22; leg.hip.rotation.x = Math.sin(t * 11 + leg.phase) * .12; });
        antennae.forEach((feeler, i) => { feeler.rotation.z = Math.sin(t * 2.8 + i) * .08; });
        keyboard.children.forEach((key: any) => { if (key.userData.phase !== undefined) key.position.y = key.userData.homeY + Math.max(0, Math.sin(t * 8 + key.userData.phase)) * .025; });
        sugar.rotation.y = Math.sin(t * 1.2) * .06;
        if (kind === "ending" || active === path.length - 1) { sugar.position.y = .2 + Math.abs(Math.sin(t * 2)) * .025; }
        camera.position.x += ((active > 3 ? Math.max(-.8, Math.min(.8, target[0] * .075)) : 0) - camera.position.x) * .012;
        camera.lookAt(0, 1.0, -.1);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();
      cleanup = () => {
        renderer.domElement.removeEventListener("pointerdown", pointerHandler);
        resizeObserver?.disconnect();
        scene.traverse((obj: any) => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { const materials = Array.isArray(obj.material) ? obj.material : [obj.material]; materials.forEach((m: any) => m.dispose()); } });
        renderer.dispose(); renderer.domElement.remove();
      };
    };

    boot().catch((error) => { if (!cancelled && host) { host.dataset.error = "3d-unavailable"; console.error("Unable to initialize the 3D career scene", error); } });
    return () => { cancelled = true; cancelAnimationFrame(frame); resizeObserver?.disconnect(); cleanup?.(); };
  }, [active, kind, reacting, onAntClick]);

  return <div ref={hostRef} className="three-world" aria-hidden="false" />;
}
