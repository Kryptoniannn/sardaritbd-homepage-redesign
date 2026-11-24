import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_vel;
uniform float u_scroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(u_res, vec2(1.0));
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);

  float d = length(p - m);
  float ripple = exp(-d * 3.8) * (0.35 + u_vel * 0.65);
  vec2 dir = normalize(p - m + vec2(0.0001));
  p -= dir * ripple * 0.22;

  float t = u_time * 0.16 + u_scroll * 0.35;
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(
    fbm(p * 2.1 + 2.4 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p * 2.1 + 2.4 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p * 1.8 + 2.2 * r);

  vec3 abyss = vec3(0.016, 0.020, 0.048);
  vec3 cobalt = vec3(0.098, 0.275, 0.878);
  vec3 electric = vec3(0.26, 0.46, 1.0);
  vec3 gold = vec3(1.0, 0.816, 0.0);

  vec3 col = mix(abyss, cobalt * 0.55, clamp(f * f * 2.1, 0.0, 1.0));
  col = mix(col, electric * 0.68, clamp(length(q) * 0.55, 0.0, 1.0));
  float goldMask = smoothstep(0.62, 0.96, r.x * f * 1.65) + ripple * 0.55;
  col = mix(col, gold * 0.72, clamp(goldMask * 0.42, 0.0, 0.55));

  float vignette = smoothstep(1.28, 0.2, length((uv - 0.5) * vec2(1.15, 1.05)));
  col *= 0.42 + 0.58 * vignette;

  gl_FragColor = vec4(col, 0.62);
}
`;

export default function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false }) ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uVel = gl.getUniformLocation(prog, "u_vel");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    let w = 1;
    let h = 1;
    const resize = () => {
      const scale = 0.5;
      w = Math.max(1, Math.floor(window.innerWidth * scale));
      h = Math.max(1, Math.floor(window.innerHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl?.viewport(0, 0, w, h);
    };
    resize();

    const target = { x: 0.65, y: 0.55 };
    const mouse = { x: 0.65, y: 0.55 };
    let vel = 0;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1 - e.clientY / Math.max(1, window.innerHeight);
      vel = Math.min(1.5, vel + Math.hypot(nx - target.x, ny - target.y) * 5);
      target.x = nx;
      target.y = ny;
    };

    let raf = 0;
    let lost = false;
    const start = performance.now();

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    const onRestored = () => {
      lost = false;
      resize();
    };

    const render = () => {
      if (!lost && gl && !document.hidden) {
        mouse.x += (target.x - mouse.x) * 0.06;
        mouse.y += (target.y - mouse.y) * 0.06;
        vel *= 0.93;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const sp = window.scrollY / maxScroll;

        gl.uniform2f(uRes, w, h);
        gl.uniform1f(uTime, (performance.now() - start) / 1000);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uVel, vel);
        gl.uniform1f(uScroll, sp);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-75 mix-blend-screen"
    />
  );
}
