<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let gl, program, positionBuffer, timeLocation, mouseLocation, resolutionLocation
const startTime = Date.now()
let animationFrameId

// Vertex shader
const vertexShaderSource = `#version 300 es
precision mediump float;
in vec3 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
  vVertexPosition = aVertexPosition;
}`

// Fragment shader
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 vTextureCoord;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;

out vec4 fragColor;

const float PI = 3.14159265359;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Film grain noise
float filmGrain(vec2 uv, float time) {
  float grain = random(uv + time * 0.001) * 0.1;
  float largeGrain = noise(uv * 8.0 + time * 0.0002) * 0.2;
  return mix(grain, largeGrain, 0.5);
}

vec3 getColor(int index) {
  if(index == 0) return vec3(0.0);
  if(index == 1) return vec3(0.082, 0.082, 0.2);                    // Keep same darkness level as original
  if(index == 2) return vec3(0.141, 0.298, 1.0);                    // Keep same intensity as original red
  if(index == 3) return vec3(0.298, 0.419, 0.949);                  // Keep same brightness ratio as original
  if(index == 4) return vec3(0.298, 0.419, 0.949);                  // Match index 3 like original
  return vec3(0.0);
}

mat2 rot(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec2 scaleAspect(vec2 st, float aspectRatio) {
  return st * vec2(aspectRatio, 1.0);
}

vec2 unscaleAspect(vec2 st, float aspectRatio) {
  return st * vec2(1.0/aspectRatio, 1.0);
}

void main() {
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 uv = vTextureCoord;
  
  // Mouse interaction with reduced influence and higher starting point
  vec2 pos = vec2(0.5, 1.8) + (uMousePos - 0.5) * 0.1;
  
  // Scale and rotate UV coordinates
  uv = scaleAspect(uv, aspectRatio);
  pos = scaleAspect(pos, aspectRatio);
  
  // Apply rotation
  uv = rot(-0.12 * 2.0 * PI) * (uv - pos) + pos;
  
  // Slower time and breathing effect
  float t = uTime * 0.0001;
  float breath = sin(t * 0.1) * 0.5 + 0.5;
  float divisions = 2.0 + 0.15 * 30.0;
  float radius = length(uv - pos);
  float segment = fract(radius * divisions - t);
  
  // Noise effect that darkens instead of brightens
  float noiseValue = noise(uv * 2.0 + t * 0.05) * 0.15;
  segment += noiseValue;
  
  // Color mixing
  vec3 color = mix(
    mix(getColor(1), getColor(2), segment * 2.0),
    mix(getColor(2), getColor(3), (segment - 0.5) / 0.5),
    step(0.5, segment)
  );
  
  // Add distortion with breathing
  float distAmount = 0.8 * (0.6 + breath * 0.4);
  vec2 diff = normalize(uv - pos);
  uv -= pow(color.r, 1.72) * 0.15 * distAmount * diff;
  uv += pow(color.b, 1.72) * 0.15 * distAmount * diff;
  
  // Edge fade with darkening noise
  float fade = 1.0 - smoothstep(0.0, 1.8, length((uv - pos) * vec2(1.0, 1.2)));
  fade *= (1.0 - noiseValue * 0.8); // Darken with noise instead of brighten
  color *= fade;
  
  // Apply noise as darkening
  color *= (1.0 - noiseValue * 0.5);
  
  // Breathing intensity
  color *= (0.7 + breath * 0.3);
  
  // Add film grain
  float grain = filmGrain(vTextureCoord, uTime);
  color = mix(color, color * (1.0 - grain), 0.7);
  
  // Add subtle grain to dark areas
  float darkGrain = filmGrain(vTextureCoord * 2.0, uTime + 1234.5) * 0.03;
  color += vec3(darkGrain) * (1.0 - length(color));
  
  fragColor = vec4(color, 1.0);
}`

const init = () => {
  const canvas = canvasRef.value
  
  // Set initial canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  // Get WebGL2 context
  gl = canvas.getContext('webgl2')
  if (!gl) {
    console.error('WebGL2 required')
    return
  }
  
  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  
  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders')
    return
  }
  
  // Create program
  program = createProgram(gl, vertexShader, fragmentShader)
  
  if (!program) {
    console.error('Failed to create program')
    return
  }
  
  // Get uniform locations
  timeLocation = gl.getUniformLocation(program, 'uTime')
  mouseLocation = gl.getUniformLocation(program, 'uMousePos')
  resolutionLocation = gl.getUniformLocation(program, 'uResolution')
  const mvMatrixLocation = gl.getUniformLocation(program, 'uMVMatrix')
  const pMatrixLocation = gl.getUniformLocation(program, 'uPMatrix')
  
  // Create and set up position buffer
  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  
  // Set rectangle vertices with texture coordinates
  const positions = new Float32Array([
    // Position (x, y, z), Texture coords (s, t)
    -1.0, -1.0, 0.0,   0.0, 0.0,
     1.0, -1.0, 0.0,   1.0, 0.0,
    -1.0,  1.0, 0.0,   0.0, 1.0,
     1.0,  1.0, 0.0,   1.0, 1.0
  ])
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  
  // Set up vertex attributes
  const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition')
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'aTextureCoord')
  
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT
  
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, stride, 0)
  
  gl.enableVertexAttribArray(texCoordAttributeLocation)
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
  
  // Set up transformation matrices
  const mvMatrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
  
  const pMatrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
  
  gl.useProgram(program)
  gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix)
  gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix)
  
  // Handle resize
  handleResize()
  window.addEventListener('resize', handleResize)
}

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    return null
  }
  
  return program
}

const handleResize = () => {
  if (!gl || !canvasRef.value) return
  
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  gl.viewport(0, 0, canvas.width, canvas.height)
}

// Add smooth mouse tracking
const mousePos = ref({ x: 0.5, y: 0.5 })
const targetMousePos = ref({ x: 0.5, y: 0.5 })
const mouseLerpSpeed = 0.03 // Lower = smoother/slower

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t
}

const easeOutCubic = (x) => {
  return 1 - Math.pow(1 - x, 3)
}

const handleMouseMove = (e) => {
  targetMousePos.value = {
    x: e.clientX / window.innerWidth,
    y: e.clientY / window.innerHeight
  }
}

const updateMousePosition = () => {
  // Apply easing to the lerp factor
  const lerpFactor = easeOutCubic(mouseLerpSpeed)
  
  mousePos.value = {
    x: lerp(mousePos.value.x, targetMousePos.value.x, lerpFactor),
    y: lerp(mousePos.value.y, targetMousePos.value.y, lerpFactor)
  }
}

const render = () => {
  if (!gl) return
  
  const time = Date.now() - startTime
  
  // Update mouse position with smoothing
  updateMousePosition()
  
  // Calculate mouse offset with very small range (-0.03 to 0.03)
  const mouseOffset = {
    x: (mousePos.value.x - 0.5) * 0.06,
    y: (mousePos.value.y - 0.5) * 0.06
  }
  
  gl.useProgram(program)
  gl.uniform1f(timeLocation, time)
  gl.uniform2f(mouseLocation, 0.5 + mouseOffset.x, 0.5 + mouseOffset.y)
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  
  animationFrameId = requestAnimationFrame(render)
}

onMounted(() => {
  init()
  render()
  window.addEventListener('mousemove', handleMouseMove)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <canvas 
    ref="canvasRef"
    class="fixed inset-0 w-screen h-screen"
    style="background: black;"
  />
</template> 