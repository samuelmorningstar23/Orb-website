import { useEffect, useRef, useState } from 'react'

/*──────────────────────────────────────────────────────────
  STITCH-REPLICA BACKGROUND — WebGL Aurora

  Stitch uses a raymarched SDF-masked nebula shader (via Unicorn Studio).
  We replicate the key elements with a simplified WebGL approach:
  - SDF circle mask → creates the crescent/planet-rim shape
  - FBM noise for organic texture within the glow
  - Radial gradient falloff from the rim
  - Bloom blur via CSS filter on the canvas

  Plus the existing canvas dot grid with mouse displacement.
──────────────────────────────────────────────────────────*/

// ─── DOT GRID ─────────────
const DOT_SPACING  = 24
const DOT_RADIUS   = 1
const MOUSE_RADIUS = 600
const MAX_DISPLACE = 22
const LERP_BACK    = 0.04
const NOISE_SCALE  = 0.03
const NOISE_SPEED  = 0.0006

function cheapNoise(x: number, y: number, t: number): number {
  const a = Math.sin(x * 0.8 + t) * Math.cos(y * 0.6 - t * 0.7)
  const b = Math.sin(y * 1.1 - t * 0.5) * Math.cos(x * 0.9 + t * 1.1)
  return (a + b) * 0.5
}

interface Dot { gx: number; gy: number; cx: number; cy: number }

// ─── WEBGL AURORA SHADER ─────────────
const VERT_SRC = `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

const FRAG_SRC = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_light_mode;

  // Simple hash for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // FBM — fractional Brownian motion for organic texture
  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  // SDF circle
  float sdCircle(vec2 p, vec2 center, float radius) {
    return length(p - center) - radius;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    // ~8x faster base time — crescents complete visible sweeps in ~8-15s
    float t = u_time * 0.6;

    vec3 col = vec3(0.0);

    // ═══ ARC 1: Primary — sweeps horizontally across upper-middle ═══
    // Multi-frequency drift for non-repetitive, organic motion
    vec2 c1 = vec2(
      0.5 * aspect + sin(t * 0.17) * 0.35 * aspect + sin(t * 0.07 + 1.0) * 0.15 * aspect,
      1.85 + cos(t * 0.13) * 0.18 + sin(t * 0.09 + 2.0) * 0.08
    );
    float r1 = 1.55;
    float d1 = sdCircle(p, c1, r1);

    float rimWidth1 = 0.18;
    float glow1 = exp(-d1 * d1 / (rimWidth1 * rimWidth1));

    // FBM offset scrolls visibly along the arc
    float n1 = fbm(p * 3.0 + vec2(t * 0.3, t * 0.2));
    glow1 *= 0.6 + 0.5 * n1;

    float mask1 = smoothstep(-0.02, 0.08, d1);
    glow1 *= mask1;

    vec3 gold1 = mix(vec3(1.0, 0.62, 0.0), vec3(1.0, 0.78, 0.2), n1);
    vec3 blue1 = mix(vec3(0.48, 0.68, 0.88), vec3(0.55, 0.75, 0.95), n1);
    vec3 col1 = mix(gold1, blue1, u_light_mode);
    col += col1 * glow1 * 0.55;

    // ═══ ARC 2: Secondary — offset right, counter-phase ═══
    vec2 c2 = vec2(
      0.7 * aspect + cos(t * 0.14 + 3.0) * 0.30 * aspect + sin(t * 0.06) * 0.12 * aspect,
      1.65 + sin(t * 0.19 + 1.5) * 0.15 + cos(t * 0.08 + 0.5) * 0.06
    );
    float r2 = 1.2;
    float d2 = sdCircle(p, c2, r2);

    float rimWidth2 = 0.15;
    float glow2 = exp(-d2 * d2 / (rimWidth2 * rimWidth2));
    float n2 = fbm(p * 3.5 + vec2(-t * 0.25, t * 0.18));
    glow2 *= 0.5 + 0.4 * n2;
    float mask2 = smoothstep(-0.02, 0.06, d2);
    glow2 *= mask2;

    vec3 gold2 = mix(vec3(0.9, 0.55, 0.0), vec3(1.0, 0.7, 0.12), n2);
    vec3 blue2 = mix(vec3(0.42, 0.62, 0.85), vec3(0.52, 0.72, 0.92), n2);
    vec3 col2 = mix(gold2, blue2, u_light_mode);
    col += col2 * glow2 * 0.4;

    // ═══ ARC 3: Bottom accent — rises from bottom, counter-drift ═══
    vec2 c3 = vec2(
      0.5 * aspect + sin(t * 0.11 + 4.0) * 0.25 * aspect + cos(t * 0.05 + 1.0) * 0.10 * aspect,
      -0.55 + cos(t * 0.16 + 2.5) * 0.12 + sin(t * 0.07) * 0.05
    );
    float r3 = 0.9;
    float d3 = sdCircle(p, c3, r3);

    float rimWidth3 = 0.12;
    float glow3 = exp(-d3 * d3 / (rimWidth3 * rimWidth3));
    float n3 = fbm(p * 2.5 + vec2(t * 0.2, -t * 0.28));
    glow3 *= 0.4 + 0.35 * n3;
    float mask3 = smoothstep(-0.02, 0.05, d3);
    glow3 *= mask3;

    vec3 gold3 = mix(vec3(0.75, 0.42, 0.0), vec3(0.9, 0.58, 0.08), n3);
    vec3 blue3 = mix(vec3(0.45, 0.65, 0.88), vec3(0.55, 0.75, 0.95), n3);
    vec3 col3 = mix(gold3, blue3, u_light_mode);
    col += col3 * glow3 * 0.3;

    // ═══ ARC 4: Accent arc — sweeps from left ═══
    vec2 c4 = vec2(
      -0.1 * aspect + cos(t * 0.2 + 1.0) * 0.20 * aspect + sin(t * 0.09 + 3.0) * 0.08 * aspect,
      1.4 + sin(t * 0.15 + 1.5) * 0.12 + cos(t * 0.06 + 4.0) * 0.05
    );
    float r4 = 1.0;
    float d4 = sdCircle(p, c4, r4);

    float rimWidth4 = 0.1;
    float glow4 = exp(-d4 * d4 / (rimWidth4 * rimWidth4));
    float n4 = fbm(p * 4.0 + vec2(t * 0.35, t * 0.15));
    glow4 *= 0.35 + 0.3 * n4;
    float mask4 = smoothstep(-0.01, 0.04, d4);
    glow4 *= mask4;

    vec3 gold4 = vec3(1.0, 0.75, 0.15);
    vec3 blue4 = vec3(0.52, 0.72, 0.92);
    vec3 col4 = mix(gold4, blue4, u_light_mode);
    col += col4 * glow4 * 0.2;

    // ═══ Center darkening — keep text area readable ═══
    float centerDist = length(vec2(uv.x - 0.5, (uv.y - 0.45) * 1.3));
    float centerDark = smoothstep(0.0, 0.5, centerDist);
    col *= mix(0.3, 1.0, centerDark);

    // ═══ Light Mode: exact Sierra Blue (#7AA5C7) with organic alpha sweeps ═══
    vec3 light_color = vec3(0.28, 0.55, 0.82);
    float total_glow = glow1 * 0.65 + glow2 * 0.5 + glow3 * 0.35 + glow4 * 0.25;
    float light_glow = total_glow * mix(0.25, 1.0, centerDark);
    // Strong alpha at peak to block out the white background and show the exact color
    float light_alpha = clamp(light_glow * 1.8, 0.12, 0.95);

    // ═══ Dark Mode: rich multi-colored gold/amber auroras ═══
    vec3 dark_color = col / (1.0 + col);
    float dark_alpha = max(max(dark_color.r, dark_color.g), dark_color.b);
    dark_alpha = clamp(dark_alpha * 2.0, 0.0, 1.0);

    // ═══ Smooth theme transition LERP ═══
    vec3 final_color = mix(dark_color, light_color, u_light_mode);
    float final_alpha = mix(dark_alpha, light_alpha, u_light_mode);

    gl_FragColor = vec4(final_color * final_alpha, final_alpha);
  }

`

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(p))
    return null
  }
  return p
}

// Media queries that put the background into a cheap, single-frame mode:
// visitors who ask for reduced motion get a still frame, and mobile devices
// skip the perpetual loops entirely (battery). Both are re-checked live.
const REDUCE_MQ = '(prefers-reduced-motion: reduce)'
const MOBILE_MQ = '(max-width: 768px), (pointer: coarse)'
// Frame time used for the still frame — arcs sit in a pleasant position.
const STATIC_T = 14.0

export default function Aurora() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null)
  const dotCanvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  const targetLightMode = useRef(0.0)
  const currentLightMode = useRef(0.0)

  // Falls back to a CSS gradient when WebGL is unavailable or the shader
  // fails to compile — locked-down hospital browsers must never get a void.
  const [webglFailed, setWebglFailed] = useState(false)
  const [reduce, setReduce] = useState(() => window.matchMedia(REDUCE_MQ).matches)
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_MQ).matches)

  useEffect(() => {
    const reduceQ = window.matchMedia(REDUCE_MQ)
    const mobileQ = window.matchMedia(MOBILE_MQ)
    const onReduce = (e: MediaQueryListEvent) => setReduce(e.matches)
    const onMobile = (e: MediaQueryListEvent) => setMobile(e.matches)
    reduceQ.addEventListener('change', onReduce)
    mobileQ.addEventListener('change', onMobile)
    return () => {
      reduceQ.removeEventListener('change', onReduce)
      mobileQ.removeEventListener('change', onMobile)
    }
  }, [])

  const animated = !reduce && !mobile

  // ─── WebGL Aurora ───
  useEffect(() => {
    if (webglFailed) return
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    targetLightMode.current = isLight ? 1.0 : 0.0
    currentLightMode.current = targetLightMode.current

    const canvas = glCanvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!gl) { setWebglFailed(true); return }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    const prog = vs && fs ? createProgram(gl, vs, fs) : null
    if (!prog) { setWebglFailed(true); return }

    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    const resLoc = gl.getUniformLocation(prog, 'u_resolution')
    const timeLoc = gl.getUniformLocation(prog, 'u_time')
    const lightModeLoc = gl.getUniformLocation(prog, 'u_light_mode')

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)

    let w = 0, h = 0, raf = 0
    const t0 = performance.now()

    function resize() {
      w = Math.round(window.innerWidth * 0.5)
      h = Math.round(window.innerHeight * 0.5)
      canvas!.width = w
      canvas!.height = h
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      gl!.viewport(0, 0, w, h)
      if (!animated) renderFrame(STATIC_T)
    }

    function renderFrame(t: number) {
      gl!.useProgram(prog)
      gl!.uniform2f(resLoc, w, h)
      gl!.uniform1f(timeLoc, t)
      gl!.uniform1f(lightModeLoc, currentLightMode.current)

      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf)
      gl!.enableVertexAttribArray(posLoc)
      gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 0, 0)

      gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    }

    function loop() {
      // Smoothly LERP theme color shift
      currentLightMode.current += (targetLightMode.current - currentLightMode.current) * 0.08
      renderFrame((performance.now() - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }

    const handleThemeChange = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      targetLightMode.current = light ? 1.0 : 0.0
      if (!animated) {
        // No loop running — jump the lerp and redraw the still frame.
        currentLightMode.current = targetLightMode.current
        renderFrame(STATIC_T)
      }
    }
    window.addEventListener('theme-changed', handleThemeChange)

    // Don't burn GPU while the tab is hidden.
    const handleVisibility = () => {
      if (!animated) return
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    window.addEventListener('resize', resize)
    resize()
    if (animated) {
      raf = requestAnimationFrame(loop)
    } else {
      renderFrame(STATIC_T)
    }

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelAnimationFrame(raf)
    }
  }, [animated, webglFailed])

  // ─── Dot grid ─── (skipped entirely on mobile — not worth the battery)
  useEffect(() => {
    if (mobile) return
    const canvas = dotCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let dpr = 1, dots: Dot[] = [], w = 0, h = 0, time = 0, raf = 0

    function resize() {
      dpr = window.devicePixelRatio || 1
      w = window.innerWidth; h = window.innerHeight
      canvas!.width = w * dpr; canvas!.height = h * dpr
      canvas!.style.width = w + 'px'; canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(w / DOT_SPACING) + 2
      const rows = Math.ceil(h / DOT_SPACING) + 2
      const ox = (w - (cols - 1) * DOT_SPACING) / 2
      const oy = (h - (rows - 1) * DOT_SPACING) / 2
      dots = []
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const gx = ox + c * DOT_SPACING, gy = oy + r * DOT_SPACING
          dots.push({ gx, gy, cx: gx, cy: gy })
        }
      if (reduce) drawFrame(false)
    }

    function drawFrame(withMouse: boolean) {
      ctx!.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'

      for (const dot of dots) {
        const nx = cheapNoise(dot.gx * NOISE_SCALE, dot.gy * NOISE_SCALE, time * NOISE_SPEED)
        const ny = cheapNoise(dot.gy * NOISE_SCALE, dot.gx * NOISE_SCALE, time * NOISE_SPEED + 100)
        let tx = dot.gx + nx * 3, ty = dot.gy + ny * 3

        const ddx = tx - mx, ddy = ty - my
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        if (withMouse && dist < MOUSE_RADIUS && dist > 0) {
          const f = Math.pow(1 - dist / MOUSE_RADIUS, 3) * MAX_DISPLACE
          tx += (ddx / dist) * f; ty += (ddy / dist) * f
        }

        dot.cx += (tx - dot.cx) * LERP_BACK
        dot.cy += (ty - dot.cy) * LERP_BACK

        let a = 0.35
        if (withMouse && dist < MOUSE_RADIUS) a = 0.35 + (1 - dist / MOUSE_RADIUS) * 0.55

        ctx!.beginPath()
        ctx!.arc(dot.cx, dot.cy, DOT_RADIUS, 0, Math.PI * 2)
        ctx!.fillStyle = isLight ? `rgba(122, 165, 199, ${a * 0.65})` : `rgba(170,170,170,${a})`
        ctx!.fill()
      }
    }

    function loop() {
      time++
      drawFrame(true)
      raf = requestAnimationFrame(loop)
    }

    const onMM = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY }
    const handleVisibility = () => {
      if (reduce) return
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }
    const handleThemeChange = () => { if (reduce) drawFrame(false) }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('theme-changed', handleThemeChange)
    resize()
    if (reduce) {
      // Settle the lerp instantly for the still frame, then draw once.
      for (const dot of dots) { dot.cx = dot.gx; dot.cy = dot.gy }
      drawFrame(false)
    } else {
      window.addEventListener('mousemove', onMM)
      raf = requestAnimationFrame(loop)
    }
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMM)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('theme-changed', handleThemeChange)
      cancelAnimationFrame(raf)
    }
  }, [reduce, mobile])

  return (
    <>
      {/* Layer 0: WebGL aurora — SDF-masked volumetric glow.
          If WebGL is unavailable, a CSS gradient stands in so the page
          background never silently disappears. */}
      {webglFailed ? (
        <div className="aurora-fallback" aria-hidden="true" />
      ) : (
        <canvas
          ref={glCanvasRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            imageRendering: 'auto',
          }}
        />
      )}

      {/* Layer 1: Canvas dot grid with mouse displacement (desktop only) */}
      {!mobile && (
        <canvas
          ref={dotCanvasRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}
