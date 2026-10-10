/* ============================================================================
   glow.js — ambient cinematic light.
   WebGL first, canvas 2D fallback, and it switches itself off for
   reduced-motion users or when the tab is hidden.
   ==========================================================================*/
(function () {
  "use strict";

  var canvas = document.getElementById("glow");
  if (!canvas) return;

  // matchMedia is missing in some embedded webviews — degrade to "no preference"
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: null };
  if (reduce.matches) { canvas.style.display = "none"; return; }

  var state = { scroll: 0, target: 0, mx: 0.5, my: 0.5, t: 0 };
  var running = true;
  var last = performance.now();
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  /* ---------------------------------------------------------------- inputs */
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    state.target = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("pointermove", function (e) {
    state.mx = e.clientX / window.innerWidth;
    state.my = e.clientY / window.innerHeight;
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    var was = running;
    running = !document.hidden;
    if (running && !was) { last = performance.now(); requestAnimationFrame(loop); }
  });

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }
  resize();
  window.addEventListener("resize", resize);

  /* ------------------------------------------------------- WebGL renderer */
  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

  var FRAG = [
    "precision mediump float;",
    "uniform vec2 u_res;uniform float u_time;uniform float u_scroll;uniform vec2 u_mouse;",
    "float blob(vec2 uv,vec2 c,float r){",
    "  float d=distance(uv,c);",
    "  return smoothstep(r,0.,d);",
    "}",
    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/u_res;",
    "  uv.y=1.-uv.y;",
    "  vec2 asp=vec2(u_res.x/u_res.y,1.);",
    "  float t=u_time*0.06;",
    // three drifting lights whose positions travel with the scroll position
    "  vec2 c1=vec2(0.22+0.10*sin(t*1.1), 0.18+u_scroll*0.55);",
    "  vec2 c2=vec2(0.82+0.08*cos(t*0.9), 0.72-u_scroll*0.40);",
    "  vec2 c3=vec2(0.50+0.14*sin(t*0.7+2.0), 0.50+0.20*cos(t*0.5));",
    "  float m=blob(uv*asp,u_mouse*asp,0.55);",
    "  float a=blob(uv*asp,c1*asp,0.62);",
    "  float b=blob(uv*asp,c2*asp,0.55);",
    "  float c=blob(uv*asp,c3*asp,0.45);",
    // palette shifts ember -> indigo as you move down the page
    "  vec3 ember=vec3(1.0,0.42,0.21);",
    "  vec3 indigo=vec3(0.42,0.48,1.0);",
    "  vec3 col=vec3(0.0);",
    "  col+=ember*a*0.55;",
    "  col+=indigo*b*0.50;",
    "  col+=mix(ember,indigo,u_scroll)*c*0.28;",
    "  col+=ember*m*0.10;",
    // keep it as light, never as a wash
    "  col*=0.30+0.25*u_scroll;",
    // ordered dither to kill banding on dark gradients
    "  float dth=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);",
    "  col+=(dth-0.5)/255.0;",
    "  gl_FragColor=vec4(max(col,0.0),1.0);",
    "}"
  ].join("\n");

  var gl = null;
  try {
    gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false });
  } catch (e) { gl = null; }

  var uni = {};

  if (gl) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, VERT);
    gl.shaderSource(fs, FRAG);
    gl.compileShader(vs);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) ||
        !gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      if (window.console) console.warn("glow: shader compile failed, using 2D fallback");
      gl = null;
    }
  }

  var prog = null;
  if (gl) {
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (window.console) console.warn("glow: link failed, using 2D fallback");
      gl = null; prog = null;
    }
  }

  if (gl && prog) {
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uni.res = gl.getUniformLocation(prog, "u_res");
    uni.time = gl.getUniformLocation(prog, "u_time");
    uni.scroll = gl.getUniformLocation(prog, "u_scroll");
    uni.mouse = gl.getUniformLocation(prog, "u_mouse");
  }

  /* ---------------------------------------------------- canvas 2D fallback */
  var ctx = gl ? null : canvas.getContext("2d");

  function drawGL(t) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uni.res, canvas.width, canvas.height);
    gl.uniform1f(uni.time, t);
    gl.uniform1f(uni.scroll, state.scroll);
    gl.uniform2f(uni.mouse, state.mx, state.my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function draw2D() {
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    function light(x, y, r, color) {
      var cx = x * w, cy = y * h, rad = r * Math.max(w, h);
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    var t = state.t;
    light(0.22 + 0.10 * Math.sin(t * 1.1), 0.18 + state.scroll * 0.55, 0.62, "rgba(255,107,53,0.30)");
    light(0.82 + 0.08 * Math.cos(t * 0.9), 0.72 - state.scroll * 0.40, 0.55, "rgba(108,123,255,0.26)");
    light(0.50, 0.50, 0.45, "rgba(255,107,53,0.10)");
  }

  /* ------------------------------------------------------------------ loop */
  function loop(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    state.t += dt;
    state.scroll += (state.target - state.scroll) * 0.055;
    if (gl) drawGL(state.t); else draw2D();
    requestAnimationFrame(loop);
  }

  onScroll();
  requestAnimationFrame(loop);

  if (reduce.addEventListener) {
    reduce.addEventListener("change", function (e) {
      if (e.matches) { running = false; canvas.style.display = "none"; }
    });
  }
})();
