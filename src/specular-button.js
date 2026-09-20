import { Renderer, Program, Mesh, Triangle, Color } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/dist/ogl.mjs';

const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

function hexToRgb(hex) {
  const value = String(hex || '#ffffff').replace('#', '').trim();
  const normalized = value.length === 3
    ? value.split('').map(ch => ch + ch).join('')
    : value.padEnd(6, 'f').slice(0, 6);
  const n = parseInt(normalized, 16);
  if (!Number.isFinite(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function setupSpecularPill(btn) {
  if (!btn || btn.dataset.specularReady === 'true') return () => {};
  btn.dataset.specularReady = 'true';

  const fx = document.createElement('span');
  fx.className = 'specular-button__fx';
  fx.setAttribute('aria-hidden', 'true');
  btn.appendChild(fx);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let renderer;
  try {
    renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
  } catch (error) {
    btn.dataset.specularReady = 'fallback';
    fx.remove();
    return () => {};
  }

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const lineColor = hexToRgb('#ffffff');
  const baseColor = hexToRgb('#a855f7');

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uCenter: { value: [0, 0] },
      uHalfSize: { value: [1, 1] },
      uRadius: { value: 18 },
      uAngle: { value: 2.4 },
      uPx: { value: dpr },
      uLineColor: { value: lineColor },
      uBaseColor: { value: baseColor },
      uIntensity: { value: 0 },
      uShineSize: { value: (10 * Math.PI) / 180 },
      uShineFade: { value: (40 * Math.PI) / 180 },
      uThickness: { value: 1 * dpr },
      uBaseWidth: { value: dpr }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });
  fx.appendChild(gl.canvas);

  const size = { w: 1, h: 1 };
  let pointerAngle = 2.4;
  let proximity = 0;
  let angle = 2.4;
  let idleAngle = 2.4;
  let bright = 0;
  let last = performance.now();
  let raf = 0;
  let destroyed = false;

  const resize = () => {
    if (destroyed) return;
    const rect = btn.getBoundingClientRect();
    size.w = rect.width;
    size.h = rect.height;
    renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
    program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
    program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
    program.uniforms.uRadius.value = Math.min(18, Math.min(rect.width, rect.height) / 2) * dpr;
  };

  const onPointerMove = e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      const nx = (e.clientX - cx) / Math.max(rect.width / 2, 1);
      const ny = (cy - e.clientY) / Math.max(rect.height / 2, 1);
      pointerAngle = Math.atan2(2 / Math.max(rect.height, 1), -2 / Math.max(rect.width, 1)) + nx * 0.3 + ny * 0.15;
    } else {
      pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
    }

    const t = Math.max(0, 1 - dist / 250);
    proximity = t * t * (3 - 2 * t);
  };

  const onLeave = () => { proximity = 0; };

  const ro = new ResizeObserver(resize);
  ro.observe(btn);
  resize();

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  btn.addEventListener('mouseleave', onLeave);

  const update = now => {
    if (destroyed) return;
    raf = requestAnimationFrame(update);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    idleAngle += 0.35 * dt;
    const target = proximity > 0 ? pointerAngle : idleAngle;
    const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    angle += diff * (1 - Math.exp(-dt * 7));
    bright += (proximity - bright) * (1 - Math.exp(-dt * 8));

    program.uniforms.uAngle.value = angle;
    program.uniforms.uIntensity.value = bright;
    renderer.render({ scene: mesh });
  };

  raf = requestAnimationFrame(update);

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    btn.removeEventListener('mouseleave', onLeave);
    if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    fx.remove();
    delete btn.dataset.specularReady;
  };
}

function initSpecularButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pills = document.querySelectorAll('.pill-list .pill');
  const cleanups = Array.from(pills).map(setupSpecularPill);
  window.addEventListener('resize', () => {
    // ResizeObserver handles individual buttons; this listener intentionally
    // remains lightweight for browsers that resize without firing observers.
  });

  window.specularButtonsCleanup = () => cleanups.forEach(cleanup => cleanup());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpecularButtons, { once: true });
} else {
  initSpecularButtons();
}
