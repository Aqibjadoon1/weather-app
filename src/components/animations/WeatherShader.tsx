"use client";

import { useEffect, useRef } from "react";

const vertexSrc = `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_position * 0.5 + 0.5;
}
`;

const fragmentSrc = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;
uniform float u_isNight;
uniform float u_rainIntensity;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = v_texCoord;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 pos = uv * aspect;

  vec2 mouseOffset = (u_mouse - 0.5) * 0.05;
  vec2 noiseCoord = pos * 1.5 + u_time * 0.02 + mouseOffset;

  float n1 = snoise(noiseCoord) * 0.5;
  float n2 = snoise(noiseCoord * 2.0 + 1.7) * 0.25;
  float n3 = snoise(noiseCoord * 4.0 + 3.2) * 0.125;
  float noise = n1 + n2 + n3;

  float gradient = uv.y * 0.8 + noise * 0.2;
  vec3 sky = mix(u_skyBottom, u_skyTop, clamp(gradient, 0.0, 1.0));

  float cloudNoise = snoise(pos * 2.0 + u_time * 0.005 + mouseOffset * 0.5);
  float cloudNoise2 = snoise(pos * 4.0 - u_time * 0.008 + 100.0);
  float cloud = smoothstep(0.15, 0.6, cloudNoise * 0.6 + cloudNoise2 * 0.4);
  float cloudAlpha = cloud * 0.35;
  vec3 cloudColor = mix(vec3(1.0), vec3(0.6, 0.65, 0.7), u_rainIntensity);
  sky = mix(sky, cloudColor, cloudAlpha);

  vec2 sunPos = vec2(0.85, 0.75);
  float sunDist = distance(uv, sunPos);
  float glowIntensity = 1.0 - u_isNight * 0.9;
  float sunGlow = exp(-sunDist * 4.0) * 0.6 * glowIntensity;
  sunGlow += exp(-sunDist * 12.0) * 0.3 * glowIntensity;
  vec3 sunColor = mix(vec3(1.0, 0.85, 0.5), vec3(0.3, 0.4, 0.7), u_isNight);
  sky += sunColor * sunGlow;

  float moonGlow = 0.0;
  if (u_isNight > 0.5) {
    vec2 moonPos = vec2(0.7, 0.8);
    float moonDist = distance(uv, moonPos);
    moonGlow = exp(-moonDist * 3.0) * 0.3;
    moonGlow += exp(-moonDist * 10.0) * 0.15;
    vec3 moonColor = vec3(0.85, 0.85, 0.9);
    sky += moonColor * moonGlow;

    float moonBody = smoothstep(0.04, 0.035, moonDist);
    float moonCrater = smoothstep(0.01, 0.005, distance(uv + vec2(0.008, 0.005), moonPos));
    sky += moonBody * vec3(0.95, 0.93, 0.9) * 0.15;
    sky -= moonCrater * vec3(0.1, 0.08, 0.05) * 0.3;
  }

  if (u_isNight > 0.5) {
    vec2 starUv = uv * 120.0;
    vec2 cell = floor(starUv);
    vec2 frac = fract(starUv) - 0.5;

    float r = hash(cell);
    float r2 = hash(cell + vec2(10.0, 20.0));
    float r3 = hash(cell + vec2(30.0, 40.0));

    float starSize = 0.05 + r2 * 0.1;
    float starBright = smoothstep(starSize, 0.0, length(frac));
    float twinkle = sin(u_time * (1.5 + r3 * 2.0) + r * 6.283) * 0.5 + 0.5;
    starBright *= 0.3 + 0.7 * twinkle;
    starBright *= step(0.7, r);

    float horizonMask = 1.0 - smoothstep(0.1, 0.5, uv.y);
    starBright *= horizonMask;

    sky += vec3(1.0, 0.98, 0.95) * starBright * min(1.0, starSize * 8.0);
  }

  if (u_rainIntensity > 0.01) {
    for (int i = 0; i < 3; i++) {
      float speed = 2.0 + float(i) * 1.2;
      float scale = 40.0 + float(i) * 30.0;

      vec2 rainPos = uv * scale;
      rainPos.y -= u_time * speed;
      rainPos.x += sin(u_time * speed * 0.3 + float(i) * 2.0) * 0.1;

      vec2 cell = floor(rainPos);
      vec2 frac = fract(rainPos);

      float r = hash(cell);
      float r2 = hash(cell + vec2(5.0, 10.0) * float(i + 1));

      float streak = smoothstep(0.96, 0.998, frac.y);
      float offset = (r - 0.5) * 0.3;
      float width = 0.002 + r2 * 0.003;
      float drop = step(abs(frac.x - offset), width) * streak;

      float opacity = u_rainIntensity * (0.12 + r * 0.18);
      vec3 rainColor = vec3(0.6, 0.65, 0.8);
      sky += rainColor * drop * opacity;
    }
  }

  float gloss = smoothstep(0.2, 0.8, uv.x * 0.6 + uv.y * 0.4);
  vec3 glossColor = vec3(1.0, 0.98, 0.95) * 0.06 * gloss;
  vec3 finalColor = sky * 0.35 + glossColor;
  fragColor = vec4(finalColor, 0.3);
}
`;

interface WeatherShaderProps {
  className?: string;
  skyTop?: [number, number, number];
  skyBottom?: [number, number, number];
  condition?: string;
  isNight?: boolean;
}

function getSkyColors(condition: string | undefined, isNight: boolean): { skyTop: [number, number, number]; skyBottom: [number, number, number] } {
  if (isNight) {
    return { skyTop: [0.02, 0.01, 0.08], skyBottom: [0.08, 0.04, 0.15] };
  }

  const cond = (condition || "").toLowerCase();

  if (cond.includes("thunderstorm") || cond.includes("squall") || cond.includes("tornado")) {
    return { skyTop: [0.15, 0.15, 0.18], skyBottom: [0.3, 0.32, 0.35] };
  }
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
    return { skyTop: [0.2, 0.25, 0.4], skyBottom: [0.5, 0.55, 0.6] };
  }
  if (cond.includes("snow") || cond.includes("sleet")) {
    return { skyTop: [0.55, 0.55, 0.6], skyBottom: [0.85, 0.87, 0.9] };
  }
  if (cond.includes("clouds") || cond.includes("overcast")) {
    return { skyTop: [0.45, 0.5, 0.6], skyBottom: [0.75, 0.77, 0.8] };
  }
  if (cond.includes("mist") || cond.includes("fog") || cond.includes("haze")) {
    return { skyTop: [0.55, 0.57, 0.6], skyBottom: [0.8, 0.8, 0.82] };
  }
  // Clear / default
  return { skyTop: [0, 0.48, 1], skyBottom: [0.97, 0.98, 1] };
}

function getRainIntensity(condition: string | undefined): number {
  const cond = (condition || "").toLowerCase();
  if (cond.includes("thunderstorm")) return 1.0;
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) return 1.0;
  if (cond.includes("snow") || cond.includes("sleet") || cond.includes("mist") || cond.includes("fog") || cond.includes("haze")) return 0.3;
  return 0.0;
}

export default function WeatherShader({
  className = "",
  skyTop: skyTopProp,
  skyBottom: skyBottomProp,
  condition,
  isNight = false,
}: WeatherShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaults = getSkyColors(condition, isNight);
  const skyTop = skyTopProp ?? defaults.skyTop;
  const skyBottom = skyBottomProp ?? defaults.skyBottom;
  const rainIntensity = getRainIntensity(condition);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      gl.deleteShader(vertexShader);
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uSkyTop = gl.getUniformLocation(program, "u_skyTop");
    const uSkyBottom = gl.getUniformLocation(program, "u_skyBottom");
    const uIsNight = gl.getUniformLocation(program, "u_isNight");
    const uRainIntensity = gl.getUniformLocation(program, "u_rainIntensity");

    const setUniforms = () => {
      gl.uniform3f(uSkyTop, skyTop[0], skyTop[1], skyTop[2]);
      gl.uniform3f(uSkyBottom, skyBottom[0], skyBottom[1], skyBottom[2]);
      gl.uniform1f(uIsNight, isNight ? 1.0 : 0.0);
      gl.uniform1f(uRainIntensity, rainIntensity);
    };
    setUniforms();

    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    handleResize();
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      return;
    }
    let animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [skyTop, skyBottom, isNight, rainIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
