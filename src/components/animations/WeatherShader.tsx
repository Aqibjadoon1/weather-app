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

uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

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
  vec3 cloudColor = vec3(1.0, 1.0, 1.0);
  sky = mix(sky, cloudColor, cloudAlpha);

  vec2 sunPos = vec2(0.85, 0.75);
  float sunDist = distance(uv, sunPos);
  float sunGlow = exp(-sunDist * 4.0) * 0.6;
  sunGlow += exp(-sunDist * 12.0) * 0.3;
  vec3 sunColor = vec3(1.0, 0.85, 0.5);
  sky += sunColor * sunGlow;

  fragColor = vec4(sky, 1.0);
}
`;

interface WeatherShaderProps {
  className?: string;
  skyTop?: [number, number, number];
  skyBottom?: [number, number, number];
}

export default function WeatherShader({
  className = "",
  skyTop = [0, 0.48, 1.0],
  skyBottom = [0.97, 0.98, 1.0],
}: WeatherShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: false });
    if (!gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
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

    gl.uniform3f(uSkyTop, skyTop[0], skyTop[1], skyTop[2]);
    gl.uniform3f(uSkyBottom, skyBottom[0], skyBottom[1], skyBottom[2]);

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
    let animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [skyTop, skyBottom]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
