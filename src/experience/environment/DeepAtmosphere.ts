import * as THREE from "three";
import type { EnvironmentState } from "./environment-config";
import type { SceneQuality } from "../experience-types";

const FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTopLight;
uniform float uCaustic;
uniform float uRay;
uniform float uBloom;
uniform float uDarkness;
uniform float uAbyssRays;
uniform float uAbyssEmber;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0,0)), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x/uRes.y, 1.0);
  vec2 p = (uv - 0.5) * asp;

  float topLight = pow(max(0.0, 1.0 - uv.y), 1.6) * uTopLight;
  float t = uTime * 0.05;

  // Surface caustic patterns
  float c = fbm(p * 3.0 + vec2(t, t*0.6));
  c = fbm(p * 2.0 + c * 1.5 + vec2(-t*0.5, t));
  float caustic = smoothstep(0.40, 0.95, c) * topLight * uCaustic;

  // Descending surface god rays
  float ray = fbm(vec2(atan(p.x, p.y + 1.4) * 6.0, length(p) * 0.6 - t*2.0));
  ray = pow(max(0.0, ray), 2.0) * topLight * 0.8 * uRay;

  // Terminal abyssal god-rays converging from deep zenith (adapted from BabScene)
  float zenith = uv.y + 0.9;
  float aRay = fbm(vec2(atan(p.x, zenith) * 5.0, length(p) * 0.8 - t * 2.2));
  aRay = pow(max(0.0, aRay), 3.0) * smoothstep(-0.3, 1.0, uv.y) * uAbyssRays;

  // Breathing caustics in deep abyssal plain
  float gate = 0.55 + 0.45 * sin(uTime * 0.25);
  float aCaust = smoothstep(0.42, 0.9, c) * gate * uAbyssRays * 0.7;

  // Palette: deep abyss, shelf, biolume glow, instrument brass
  vec3 abyss = vec3(0.016, 0.090, 0.118);     // #04171e
  vec3 deepFloor = vec3(0.008, 0.045, 0.060);
  vec3 mid   = vec3(0.055, 0.215, 0.270);
  vec3 glow  = vec3(0.192, 0.878, 0.745);     // biolume #31e0be
  vec3 brass = vec3(0.784, 0.635, 0.290);     // brass #c8a24a

  vec3 baseDeep = mix(abyss, deepFloor, uDarkness);
  vec3 col = mix(baseDeep, mid, topLight * (1.0 - uDarkness * 0.5));
  col += glow * caustic;
  col += glow * ray;
  col += glow * topLight * 0.03;

  // Terminal abyssal rays & caustics
  col += glow * aCaust * 0.18 + glow * aRay * 0.22;

  // Surface pointer bloom
  float md = distance(p, (uMouse - 0.5) * asp);
  float bloomShape = 0.65 + 0.7 * fbm(p * 2.5 + t * 3.0);
  float bloom = (exp(-md * 2.1) * 0.26 + exp(-md * 5.0) * 0.16) * bloomShape * uBloom;
  col += glow * bloom;

  // Terminal pointer warm ember (blending biolume and instrument brass)
  col += (glow * 0.7 + brass * 0.3) * exp(-md * 4.5) * uAbyssEmber;

  // Edge vignette
  float vig = smoothstep(1.4, 0.15, length(p));
  col *= mix(0.55, 1.0, vig);
  col *= mix(0.68, 1.0, smoothstep(0.0, 0.6, uv.x));

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export interface DeepAtmosphereInstance {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  update: (
    time: number,
    env: EnvironmentState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
  ) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createDeepAtmosphere(
  quality: SceneQuality,
  initWidth: number,
  initHeight: number,
): DeepAtmosphereInstance {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(initWidth, initHeight) },
    uMouse: { value: new THREE.Vector2(0.7, 0.4) },
    uTopLight: { value: 1.0 },
    uCaustic: { value: 0.24 },
    uRay: { value: 0.16 },
    uBloom: { value: 0.32 },
    uDarkness: { value: 0.0 },
    uAbyssRays: { value: 0.0 },
    uAbyssEmber: { value: 0.0 },
  };

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });

  const geo = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const isDesktop = quality === "HIGH" || quality === "MEDIUM";

  const update = (
    time: number,
    env: EnvironmentState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
  ) => {
    uniforms.uTime.value = time;
    uniforms.uRes.value.set(viewport.width, viewport.height);

    // Update depth-driven parameters
    uniforms.uTopLight.value = env.topLight;
    uniforms.uCaustic.value = env.causticStrength;
    uniforms.uRay.value = env.rayStrength;
    uniforms.uBloom.value = isDesktop ? env.bloomStrength : 0.0;
    uniforms.uDarkness.value = env.darknessMix;
    uniforms.uAbyssRays.value = env.abyssRays;
    uniforms.uAbyssEmber.value = isDesktop ? env.abyssEmber : 0.0;

    // Pointer coordinates mapped from normalized (-1..1) to UV (0..1)
    if (isDesktop) {
      uniforms.uMouse.value.set(
        (pointer.x + 1) * 0.5,
        (pointer.y + 1) * 0.5,
      );
    }
  };

  const resize = (width: number, height: number) => {
    uniforms.uRes.value.set(width, height);
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return {
    scene,
    camera,
    update,
    resize,
    dispose,
  };
}
