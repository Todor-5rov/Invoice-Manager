<script setup>
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let scene, camera, renderer, material, geometry, mesh
let isAnimating = true

const init = () => {
  // Scene setup
  scene = new THREE.Scene()
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 15 // Moved camera back
  
  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  
  // Create geometry - larger and more detailed
  geometry = new THREE.TorusGeometry(8, 1.5, 64, 200)
  
  // Create material with custom shader
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ff3b30') }
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Add more pronounced wave effect
        float elevation = sin(pos.x * 2.0 + uTime) * 0.5;
        elevation += sin(pos.y * 2.0 + uTime) * 0.5;
        pos.z += elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform vec3 uColor;
      uniform float uTime;
      
      void main() {
        vec3 color = uColor;
        
        // Enhanced glow effect
        float strength = distance(vUv, vec2(0.5));
        strength = 1.0 - strength;
        strength = pow(strength, 2.0);
        
        // Add wave-based color variation
        color += vec3(vElevation * 0.2);
        
        // Increase overall brightness
        color *= 1.5;
        
        gl_FragColor = vec4(color, strength * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  
  // Create mesh and position it
  mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI * 0.25 // Tilt the torus
  scene.add(mesh)
  
  // Handle resize
  window.addEventListener('resize', onResize)
}

const animate = () => {
  if (!isAnimating) return
  
  requestAnimationFrame(animate)
  
  // Update uniforms with slower time progression
  material.uniforms.uTime.value += 0.005
  
  // Smoother rotation
  mesh.rotation.y += 0.001
  
  renderer.render(scene, camera)
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  isAnimating = false
  window.removeEventListener('resize', onResize)
  
  // Cleanup Three.js resources
  geometry.dispose()
  material.dispose()
  renderer.dispose()
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 w-full h-full -z-10 bg-transparent pointer-events-none"
  />
</template> 