import { useEffect, useRef } from "react";

type ThreeWorldProps = {
  active: number;
  kind: string;
  reacting: boolean;
  paused: boolean;
  onAntClick: () => void;
};

/**
 * Real WebGL scene. Three.js is loaded as an ES module at runtime so the
 * production bundle stays lean; the resume and navigation remain ordinary,
 * accessible React/HTML rather than text baked into a canvas.
 */
export default function ThreeWorld({ active, kind, reacting, paused, onAntClick }: ThreeWorldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ active, kind, reacting, paused, onAntClick });
  propsRef.current = { active, kind, reacting, paused, onAntClick };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let frame = 0;
    let renderer: any;
    let resizeObserver: ResizeObserver | undefined;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      if (typeof window.WebGLRenderingContext === "undefined") { host.dataset.error = "webgl-unavailable"; return; }
      const moduleUrl = "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
      const THREE: any = await import(/* @vite-ignore */ moduleUrl);
      if (cancelled || !host) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#171313");
      scene.fog = new THREE.Fog("#171313", 13, 34);
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
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
      const green = mat("#48796a", .48);
      const wall = mat("#302724", .92);
      const windowFrame = mat("#171b1e", .45);
      const windowGlass = new THREE.MeshStandardMaterial({ color: "#73959a", emissive: "#385e64", emissiveIntensity: .65, roughness: .3, metalness: .05 });
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

      // A small, warmly lit room gives the desk a real setting rather than a floating diorama.
      makeBox(20, 8.5, .28, wall, 0, 3.25, -6.75);
      makeBox(3.75, 2.85, .16, windowFrame, -6.25, 3.75, -6.54);
      makeBox(3.38, 2.48, .06, windowGlass, -6.25, 3.75, -6.43);
      makeBox(3.38, .055, .06, windowFrame, -6.25, 3.75, -6.37);
      makeBox(.055, 2.48, .06, windowFrame, -6.25, 3.75, -6.37);
      const windowLight = new THREE.PointLight("#8fbfc5", 11, 12); windowLight.position.set(-6, 4.1, -4.7); scene.add(windowLight);
      // A continuous, physical desktop environment.
      makeBox(19, .42, 12, wood, 0, -.28, -1);
      makeBox(19.1, .12, 12.1, woodEdge, 0, -.53, -1);
      for (let i = 0; i < 14; i++) {
        const grain = makeBox(18.6, .009, .018, mat(i % 2 ? "#78533f" : "#49332a"), 0, -.061 + i * .0002, -6.2 + i * .82);
        grain.receiveShadow = false;
      }
      // Monitor, stand, bezel and luminous screen.
      makeBox(5.2, 3.15, .22, dark, 0, 2.45, -4.35);
      const screenCanvas = document.createElement("canvas"); screenCanvas.width = 1200; screenCanvas.height = 700;
      const screenCtx = screenCanvas.getContext("2d");
      if (screenCtx) {
        screenCtx.fillStyle = "#142321"; screenCtx.fillRect(0, 0, 1200, 700);
        const glow = screenCtx.createRadialGradient(600, 300, 10, 600, 300, 680); glow.addColorStop(0, "#25413a"); glow.addColorStop(1, "#111b1b");
        screenCtx.fillStyle = glow; screenCtx.fillRect(0, 0, 1200, 700);
        screenCtx.fillStyle = "#dba982"; screenCtx.font = "500 28px monospace"; screenCtx.fillText("HELLO, I'M", 90, 160);
        screenCtx.fillStyle = "#fff0dc"; screenCtx.font = "700 70px Arial, sans-serif"; screenCtx.fillText("Vijayakumar", 90, 260); screenCtx.fillText("Chandiran", 90, 345);
        screenCtx.fillStyle = "#b5c7b9"; screenCtx.font = "26px Arial, sans-serif"; screenCtx.fillText("Lead Account Management", 90, 430); screenCtx.fillText("Service Delivery Operations", 90, 470);
        screenCtx.fillStyle = "#8cc2a9"; screenCtx.fillRect(90, 525, 310, 6);
        screenCtx.fillStyle = "#b5c7b9"; screenCtx.font = "20px monospace"; screenCtx.fillText("PEOPLE  ·  PROCESS  ·  PROGRESS", 90, 580);
      }
      const screenTexture = new THREE.CanvasTexture(screenCanvas); screenTexture.colorSpace = THREE.SRGBColorSpace;
      const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.82, 2.75), new THREE.MeshBasicMaterial({ map: screenTexture }));
      screenPlane.position.set(0, 2.48, -4.205); scene.add(screenPlane);
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
      // Two hands sit naturally at the front edge of the keyboard and type continuously.
      const skin = mat("#c58e6d", .72); const skinLight = mat("#e2b08c", .68);
      const typingFingers: any[] = [];
      for (const side of [-1, 1]) {
        const hand = new THREE.Group(); hand.position.set(side * 1.18, .12, 3.2); hand.rotation.y = side * -.08; scene.add(hand);
        makeSphere(.43, skin, 0, .08, .12, hand, 1.28, .48, 1.45);
        for (let finger = 0; finger < 4; finger++) {
          const digit = new THREE.Group(); digit.position.set((finger - 1.5) * .19, .06, -.23); hand.add(digit);
          makeCylinderBetween([0, 0, 0], [0, -.025, -.43 - (finger === 1 || finger === 2 ? .05 : 0)], .065, skinLight, digit);
          makeSphere(.065, skinLight, 0, -.025, -.44 - (finger === 1 || finger === 2 ? .05 : 0), digit, .9, .8, 1.15);
          typingFingers.push({ digit, phase: finger * .65 + (side > 0 ? .8 : 0) });
        }
        const thumb = makeSphere(.085, skinLight, side * -.39, .04, -.06, hand, 1, .9, 1.5);
        thumb.rotation.y = side * .6;
      }
      // A notebook, report folder and a little operations dashboard: props along one desk, not separate slides.
      // "About me" lives on the working notebook: the first quiet stop after the monitor.
      const notebook = new THREE.Group(); notebook.position.set(-5.2, .01, -.2); notebook.rotation.y = .12; scene.add(notebook);
      makeBox(2.35, .12, 3.1, mat("#b99a75"), 0, 0, 0, notebook);
      makeBox(2.14, .035, 2.85, cream, 0, .08, 0, notebook);
      for (let i = 0; i < 7; i++) makeBox(1.65, .012, .018, mat("#b9a38a"), -.05, .105, -.95 + i * .3, notebook);
      // The professional summary gets its own open book, with a spine, two pages and printed lines.
      const openBook = new THREE.Group(); openBook.position.set(-2.7, .015, -1.25); openBook.rotation.y = -.08; scene.add(openBook);
      makeBox(2.55, .1, 1.95, mat("#684734"), 0, 0, 0, openBook);
      makeBox(1.22, .035, 1.78, mat("#f1e5cc"), -.62, .065, 0, openBook);
      makeBox(1.22, .035, 1.78, mat("#f1e5cc"), .62, .065, 0, openBook);
      makeBox(.06, .055, 1.84, mat("#b99a75"), 0, .07, 0, openBook);
      for (let page = 0; page < 2; page++) {
        for (let line = 0; line < 6; line++) {
          const x = page === 0 ? -.62 : .62;
          const width = line === 0 ? .72 : .91;
          makeBox(width, .009, .018, mat(line === 0 ? "#b58a63" : "#cbbba2"), x, .091, -.62 + line * .22, openBook);
        }
      }
      // A separate case file gives the senior-associate chapter a third desk location.
      const caseFile = new THREE.Group(); caseFile.position.set(-1.75, .005, -3.45); caseFile.rotation.y = .07; scene.add(caseFile);
      makeBox(1.8, .1, 1.65, mat("#526b65"), 0, 0, 0, caseFile);
      makeBox(1.58, .025, 1.42, mat("#e8dbc3"), 0, .065, 0, caseFile);
      for (let line = 0; line < 5; line++) makeBox(1.05, .012, .02, mat("#b9a58c"), -.05, .083, -.42 + line * .19, caseFile);
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
      // Education is a framed diploma on the wall, distinct from the books used for certifications.
      const diplomaFrame = new THREE.Group(); diplomaFrame.position.set(7.65, 3.15, -6.49); scene.add(diplomaFrame);
      makeBox(2.45, 1.7, .16, mat("#9b744b", .36, .18), 0, 0, 0, diplomaFrame);
      makeBox(2.17, 1.42, .04, mat("#e7d6b3"), 0, 0, .095, diplomaFrame);
      makeBox(1.25, .045, .025, mat("#806343"), 0, .36, .125, diplomaFrame);
      makeBox(1.65, .018, .018, mat("#b39a76"), 0, .12, .125, diplomaFrame);
      makeBox(1.4, .018, .018, mat("#b39a76"), 0, -.04, .125, diplomaFrame);
      makeBox(1.15, .018, .018, mat("#b39a76"), 0, -.2, .125, diplomaFrame);
      const diplomaSeal = new THREE.Mesh(new THREE.CircleGeometry(.12, 24), mat("#a77843", .45, .15));
      diplomaSeal.position.set(.68, -.43, .13); diplomaFrame.add(diplomaSeal);
      // A recognisable sugar cube: softened edges, crystalline granules and tiny pores.
      // It sits directly on the desk and never floats or spins like a generic prop.
      const sugar = new THREE.Group(); sugar.position.set(7.0, -.07, 1.2); scene.add(sugar);
      const sugarShape = new THREE.Shape();
      sugarShape.moveTo(-.36, -.36); sugarShape.lineTo(.36, -.36); sugarShape.lineTo(.36, .36);
      sugarShape.lineTo(-.36, .36); sugarShape.closePath();
      const sugarGeometry = new THREE.ExtrudeGeometry(sugarShape, {
        depth: .72, bevelEnabled: true, bevelSegments: 4, steps: 1,
        bevelSize: .055, bevelThickness: .055, curveSegments: 4
      });
      sugarGeometry.translate(0, .415, -.36);
      const sugarMaterial = new THREE.MeshStandardMaterial({ color: "#fff8eb", roughness: .92, metalness: 0 });
      const sugarMesh = new THREE.Mesh(sugarGeometry, sugarMaterial);
      sugarMesh.position.y = 0; sugarMesh.castShadow = true; sugarMesh.receiveShadow = true; sugar.add(sugarMesh);
      const sugarGrain = mat("#e8dfd0", .98);
      const sugarBright = mat("#ffffff", .9);
      // Fine, irregular crystalline flecks on the visible front and top faces.
      const signed = (value: number) => Math.sin(value) * .29;
      for (let i = 0; i < 95; i++) {
        const x = signed(i * 12.9898);
        const y = .055 + signed(i * 4.1414 + 2);
        const radius = .009 + (i % 4) * .003;
        const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 0), i % 3 === 0 ? sugarBright : sugarGrain);
        // Crystals cling to the front face instead of hovering in front of the cube.
        crystal.position.set(x, .415 + y, -.366);
        crystal.scale.set(1.2, .7, .35); crystal.castShadow = true; sugar.add(crystal);
      }
      for (let i = 0; i < 45; i++) {
        const x = signed(i * 8.11);
        const z = signed(i * 3.17 + 1);
        const radius = .009 + (i % 3) * .003;
        const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 0), i % 2 ? sugarBright : sugarGrain);
        crystal.position.set(x, .78, z); crystal.scale.set(1.1, .35, 1.1); sugar.add(crystal);
      }

      // A desk lamp on the far edge casts a warm pool of light into the workspace.
      makeBox(.72, .12, .72, mat("#292424", .3, .28), 7.85, -.01, -2.25);
      makeCylinderBetween([7.85, .04, -2.25], [7.55, 1.65, -2.25], .085, mat("#b98d68", .32, .42), scene);
      const lampShade = new THREE.Mesh(new THREE.ConeGeometry(.62, .55, 24, 1, true), mat("#40332d", .38, .2));
      lampShade.position.set(7.48, 1.72, -2.25); lampShade.rotation.z = .38; lampShade.castShadow = true; scene.add(lampShade);
      const lampGlow = new THREE.PointLight("#ffc88d", 24, 8); lampGlow.position.set(7.15, 1.35, -2.05); scene.add(lampGlow);

      // Fully articulated ant: three pairs of legs, joints, abdomen, thorax, head, eyes and antennae.
      const ant = new THREE.Group();
      ant.position.set(-1.0, .14, 2.0);
      ant.scale.setScalar(.34);
      scene.add(ant);
      const antDark = mat("#402019", .42); const antShell = mat("#7c3528", .36); const antLight = mat("#b85d40", .38);
      makeSphere(.29, antShell, -.43, .45, 0, ant, 1.18, .95, 1.0);
      makeSphere(.2, antDark, -.06, .46, 0, ant, 1, .94, .9);
      makeSphere(.28, antLight, .31, .62, 0, ant, 1, .94, .92);
      const eyeWhite = mat("#fff8e9", .22); const pupilMat = mat("#211312", .15);
      const eyeWhites: any[] = []; const eyePupils: any[] = [];
      for (const side of [-1, 1]) {
        const white = makeSphere(.09, eyeWhite, .48, .68, side * .205, ant, 1, 1.15, .75); eyeWhites.push(white);
        const pupil = makeSphere(.045, pupilMat, .52, .68, side * .25, ant); eyePupils.push(pupil);
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
        const lower = makeCylinderBetween([upper.position.x + (i === 1 ? 0 : i === 0 ? -.13 : .13), -.16, side * .13], [i === 0 ? -.28 : i === 1 ? .04 : .31, -.39, side * .2], .026, antDark, hip);
        legs.push({ hip, phase: (i + (side === 1 ? 1 : 0)) * Math.PI, upper, lower, isScratchLeg: side === 1 && i === 2 });
      }

      // One deliberate destination per chapter. Coordinates match the physical prop surfaces:
      // keyboard -> monitor -> notebook -> open book -> dashboard -> monitor -> report
      // -> case file -> keyboard -> book stack -> diploma -> sugar cube.
      const path = [
        [-1.0, .18, 2.0],       // opening: keyboard, then monitor's right edge
        [-5.2, .086, -.2],      // About me: notebook top
        [-2.7, .10, -1.25],     // Professional summary: open-book page
        [2.95, 2.06, -2.66],    // Core competencies: top-right edge of dashboard
        [2.25, 4.02, -4.16],    // Team Manager: monitor's top-right bezel
        [5.1, .14, -.3],        // Team Leader: report top
        [-1.75, .095, -3.45],   // Senior Associate: case-file top
        [-1.0, .18, 2.0],       // Customer Support Associate: keyboard keys
        [-4.1, .83, -3.15],     // Certifications: top book, approached from its front edge
        [8.55, 4.02, -6.34],    // Education: diploma frame's top-right edge
        [6.35, -.08, 1.2]       // Ending: beside the sugar cube on the desk
      ];
      // Each raised landmark has a front-edge staging point. The ant climbs the edge,
      // then walks across the top instead of taking a diagonal shortcut through the prop.
      const approachZ: Record<number, number> = {
        1: 1.52, 2: -.12, 3: -2.54, 4: -4.03, 5: 1.25,
        6: -2.48, 7: 3.38, 8: -1.84, 9: -6.12
      };
      const onResize = () => {
        if (!host || !renderer) return;
        const w = Math.max(1, host.clientWidth); const h = Math.max(1, host.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        if (w / h < .72) {
          // Narrow phones: widen the view and keep the active landmark centered as the ant travels.
          camera.fov = 52;
          camera.position.y = 7.2;
          camera.position.z = 21.5;
        } else if (w / h < .95) {
          camera.fov = 46;
          camera.position.y = 6.2;
          camera.position.z = 18.5;
        } else {
          camera.fov = 38;
          camera.position.y = 5.1;
          camera.position.z = 13.5;
        }
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(onResize); resizeObserver.observe(host); onResize();
      // The transparent touch target follows the ant's actual projected position,
      // so tapping the desk elsewhere doesn't accidentally trigger its reaction.
      const antHitArea = host.querySelector<HTMLButtonElement>(".three-world-ant-hitarea");
      const clock = new THREE.Clock();
      let previousActive = -1;
      let routeStartedAt = 0;
      let lastFrameTime = 0;
      let routeDuration = 14;
      let routePoints: number[][] = [];
      const openingRoute = [
        [-1.0, .18, 2.0], [-.45, .18, 1.1], [2.25, .18, 1.1],
        [2.25, -.08, -2.8], [2.25, -.08, -3.95], [2.25, .08, -4.16],
        [2.25, .65, -4.16], [2.25, 1.35, -4.16], [2.25, 2.05, -4.16],
        [2.25, 2.8, -4.16], [2.25, 3.5, -4.16], [2.25, 4.02, -4.16]
      ];
      const makeRoute = (start: number[], destination: number[], chapterIndex: number) => {
        const floor = -.1;
        const points: number[][] = [[start[0], start[1], start[2]]];
        const add = (point: number[]) => {
          const last = points[points.length - 1];
          if (Math.hypot(point[0] - last[0], point[1] - last[1], point[2] - last[2]) > .04) points.push(point);
        };
        // Return from a raised surface to the desktop without cutting diagonally through props.
        if (start[1] > floor + .16) {
          add([start[0], floor, start[2]]);
          add([start[0], floor, 0]);
        }
        add([start[0], floor, 0]);
        add([destination[0], floor, 0]);
        const stageZ = approachZ[chapterIndex];
        if (stageZ !== undefined && destination[1] > floor + .04) {
          add([destination[0], floor, stageZ]);
          // Climb at the near edge, then crawl on the top/page/bezel to the chapter's landmark.
          add([destination[0], destination[1], stageZ]);
          add(destination);
        } else {
          add([destination[0], floor, destination[2]]);
          add(destination);
        }
        return points;
      };
      const routeLength = (points: number[][]) => points.slice(1).reduce((sum, point, index) => {
        const previous = points[index];
        return sum + Math.hypot(point[0] - previous[0], point[1] - previous[1], point[2] - previous[2]);
      }, 0);
      const animate = () => {
        if (cancelled) return;
        const t = clock.getElapsedTime();
        const { active: currentActive, reacting: isReacting, paused: isPaused } = propsRef.current;
        if ((isPaused || isReacting) && lastFrameTime) routeStartedAt += t - lastFrameTime;
        lastFrameTime = t;
        if (currentActive !== previousActive) {
          previousActive = currentActive;
          routeStartedAt = t;
          if (currentActive === 0) {
            routePoints = openingRoute.map((point) => [...point]);
            routeDuration = 14;
          } else {
            const destination = path[Math.min(currentActive, path.length - 1)] || path[0];
            routePoints = makeRoute([ant.position.x, ant.position.y, ant.position.z], destination, currentActive);
            routeDuration = Math.min(9, Math.max(2.8, routeLength(routePoints) / 2.15));
          }
        }
        let target = path[Math.min(currentActive, path.length - 1)] || path[0];
        let segmentStart = target;
        let segmentEnd = target;
        let moving = false;
        if (routePoints.length > 1) {
          const length = routeLength(routePoints);
          const progress = Math.min(1, Math.max(0, (t - routeStartedAt) / routeDuration));
          let distance = progress * length;
          let segment = 0;
          while (segment < routePoints.length - 2) {
            const a = routePoints[segment]; const b = routePoints[segment + 1];
            const part = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
            if (distance <= part) break;
            distance -= part; segment++;
          }
          segmentStart = routePoints[segment];
          segmentEnd = routePoints[Math.min(segment + 1, routePoints.length - 1)];
          const partLength = Math.max(.0001, Math.hypot(segmentEnd[0] - segmentStart[0], segmentEnd[1] - segmentStart[1], segmentEnd[2] - segmentStart[2]));
          const blend = progress >= 1 ? 1 : Math.min(1, distance / partLength);
          target = segmentStart.map((value, axis) => value + (segmentEnd[axis] - value) * blend);
          moving = progress < 1;
        }
        const verticalClimb = Math.abs(segmentEnd[1] - segmentStart[1]) > .15
          && Math.abs(segmentEnd[0] - segmentStart[0]) < .1
          && Math.abs(segmentEnd[2] - segmentStart[2]) < .1;
        if (!isPaused) {
          // Set height relative to the surface target. Never accumulate a positive bob frame after frame.
          const gaitBob = moving && !verticalClimb && !isReacting ? Math.abs(Math.sin(t * 12)) * .006 : 0;
          ant.position.set(target[0], target[1] + gaitBob, target[2]);
          const dx = segmentEnd[0] - segmentStart[0];
          const dz = segmentEnd[2] - segmentStart[2];
          const faceCamera = Math.atan2(-(camera.position.z - ant.position.z), camera.position.x - ant.position.x);
          ant.rotation.y = verticalClimb ? faceCamera : (isReacting || !moving
            ? faceCamera
            : Math.atan2(-dz, Math.abs(dx) < .001 ? .001 : dx));
          ant.rotation.z = verticalClimb ? Math.PI / 2 : (isReacting ? Math.sin(t * 9) * .035 : 0);
          legs.forEach((leg) => {
            const stride = moving ? Math.sin(t * 12 + leg.phase) : 0;
            leg.hip.rotation.z = isReacting && leg.isScratchLeg
              ? -1.1 + Math.sin(t * 18) * .12
              : stride * .22;
            leg.hip.rotation.x = moving ? Math.cos(t * 12 + leg.phase) * .07 : 0;
          });
          eyeWhites.forEach((eye, i) => {
            const blink = Math.pow(Math.max(0, Math.cos(t * 1.8 + i * 2.4)), 32);
            eye.scale.y = 1.15 * (1 - blink * .88);
            eyePupils[i].scale.y = 1 - blink * .85;
          });
          antennae.forEach((feeler, i) => { feeler.rotation.z = Math.sin(t * (isReacting ? 11 : 3.1) + i * 2.2) * (isReacting ? .19 : .11); feeler.rotation.x = Math.sin(t * 2.4 + i) * .045; });
          typingFingers.forEach((finger) => { finger.digit.position.y = .06 + Math.max(0, Math.sin(t * 8 + finger.phase)) * .045; });
          keyboard.children.forEach((key: any) => { if (key.userData.phase !== undefined) key.position.y = key.userData.homeY + Math.max(0, Math.sin(t * 8 + key.userData.phase)) * .025; });
          const cameraTargetX = currentActive > 0 ? target[0] * .85 : 0;
          camera.position.x += (cameraTargetX - camera.position.x) * .025;
        }
        camera.lookAt(currentActive > 0 ? target[0] * .85 : 0, Math.max(.7, target[1] * .55 + .45), target[2] * .28);
        if (antHitArea) {
          const projected = ant.position.clone();
          projected.y += .11;
          projected.project(camera);
          antHitArea.style.left = ((projected.x * .5 + .5) * host.clientWidth) + "px";
          antHitArea.style.top = ((-projected.y * .5 + .5) * host.clientHeight) + "px";
          antHitArea.style.width = Math.max(64, Math.min(88, host.clientWidth * .13)) + "px";
          antHitArea.style.height = Math.max(58, Math.min(78, host.clientWidth * .115)) + "px";
        }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();
      cleanup = () => {
        resizeObserver?.disconnect();
        scene.traverse((obj: any) => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { const materials = Array.isArray(obj.material) ? obj.material : [obj.material]; materials.forEach((m: any) => m.dispose()); } });
        screenTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    };

    boot().catch((error) => { if (!cancelled && host) { host.dataset.error = "3d-unavailable"; console.error("Unable to initialize the 3D career scene", error); } });
    return () => { cancelled = true; cancelAnimationFrame(frame); resizeObserver?.disconnect(); cleanup?.(); };
  }, []);

  return <div ref={hostRef} className="three-world" aria-label="Three-dimensional ant career story"><button type="button" className={"three-world-ant-hitarea" + (reacting ? " is-reacting" : "")} aria-label="Pause and greet the tiny ant" title="Tap the ant to say hello" onClick={onAntClick} /></div>;
}
