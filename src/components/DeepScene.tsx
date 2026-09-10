"use client";

import { useEffect, useRef } from "react";

const FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;

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

  float topLight = pow(1.0 - uv.y, 1.6);
  float t = uTime * 0.05;

  float c = fbm(p * 3.0 + vec2(t, t*0.6));
  c = fbm(p * 2.0 + c * 1.5 + vec2(-t*0.5, t));
  float caustic = smoothstep(0.40, 0.95, c) * topLight;

  float ray = fbm(vec2(atan(p.x, p.y + 1.4) * 6.0, length(p) * 0.6 - t*2.0));
  ray = pow(ray, 2.0) * topLight * 0.8;

  vec3 deep = vec3(0.016, 0.090, 0.118);
  vec3 mid  = vec3(0.055, 0.215, 0.270);
  vec3 glow = vec3(0.192, 0.878, 0.745);

  vec3 col = mix(deep, mid, topLight);
  col += glow * caustic * 0.17;
  col += glow * ray * 0.10;
  col += glow * topLight * 0.03;

  float md = distance(p, (uMouse - 0.5) * asp);
  float bloomShape = 0.65 + 0.7 * fbm(p * 2.5 + t * 3.0);
  float bloom = (exp(-md * 2.1) * 0.26 + exp(-md * 5.0) * 0.16) * bloomShape;
  col += glow * bloom;

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

export function DeepScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    import("three")
      .then((THREE) => {
        if (cancelled || !el) return;

        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
        } catch {
          return; // keep the CSS fallback
        }

        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(w, h);
        renderer.autoClear = false;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        el.appendChild(renderer.domElement);

        // --- background shader ---
        const bgScene = new THREE.Scene();
        const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(w, h) },
          uMouse: { value: new THREE.Vector2(0.7, 0.4) },
        };
        const bgMat = new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms,
          depthTest: false,
          depthWrite: false,
        });
        const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
        bgScene.add(bgMesh);

        // --- marine snow ---
        const COUNT = 850;
        const positions = new Float32Array(COUNT * 3);
        const speed = new Float32Array(COUNT);
        const phase = new Float32Array(COUNT);
        const freq = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 16;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 2] = Math.random() * 5 - 3.5;
          speed[i] = 0.12 + Math.random() * 0.4;
          phase[i] = Math.random() * Math.PI * 2;
          freq[i] = 0.2 + Math.random() * 0.6;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const spriteCanvas = document.createElement("canvas");
        spriteCanvas.width = spriteCanvas.height = 64;
        const sctx = spriteCanvas.getContext("2d")!;
        const grd = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grd.addColorStop(0, "rgba(240,244,243,0.9)");
        grd.addColorStop(0.35, "rgba(169,191,196,0.35)");
        grd.addColorStop(1, "rgba(169,191,196,0)");
        sctx.fillStyle = grd;
        sctx.fillRect(0, 0, 64, 64);
        const sprite = new THREE.CanvasTexture(spriteCanvas);

        const pMat = new THREE.PointsMaterial({
          size: 0.085,
          map: sprite,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.62,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(pGeo, pMat);
        const fxScene = new THREE.Scene();
        fxScene.add(points);
        const fxCam = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        fxCam.position.z = 6;

        const clock = new THREE.Clock();
        const mouseTarget = new THREE.Vector2(0.7, 0.4);
        let raf = 0;
        let running = true;

        const onPointer = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          mouseTarget.set(
            (e.clientX - r.left) / r.width,
            1 - (e.clientY - r.top) / r.height,
          );
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const onResize = () => {
          const nw = el.clientWidth;
          const nh = el.clientHeight;
          renderer.setSize(nw, nh);
          uniforms.uRes.value.set(nw, nh);
          fxCam.aspect = nw / nh;
          fxCam.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        const render = () => {
          const dt = Math.min(clock.getDelta(), 0.05);
          const t = clock.elapsedTime;
          uniforms.uTime.value = t;
          uniforms.uMouse.value.lerp(mouseTarget, 0.045);

          const pos = pGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < COUNT; i++) {
            pos[i * 3 + 1] -= speed[i] * dt;
            if (pos[i * 3 + 1] < -6) pos[i * 3 + 1] = 6;
            pos[i * 3] += Math.sin(t * freq[i] + phase[i]) * 0.0016;
          }
          pGeo.attributes.position.needsUpdate = true;

          points.rotation.y = Math.sin(t * 0.03) * 0.06;
          fxCam.position.x += ((uniforms.uMouse.value.x - 0.5) * 0.9 - fxCam.position.x) * 0.03;
          fxCam.position.y += ((uniforms.uMouse.value.y - 0.5) * 0.5 - fxCam.position.y) * 0.03;
          fxCam.lookAt(0, 0, 0);

          renderer.clear();
          renderer.render(bgScene, bgCam);
          renderer.render(fxScene, fxCam);
        };

        const loop = () => {
          if (!running) return;
          render();
          raf = requestAnimationFrame(loop);
        };

        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !running) {
              running = true;
              clock.getDelta();
              loop();
            } else if (!entry.isIntersecting && running) {
              running = false;
              cancelAnimationFrame(raf);
            }
          },
          { threshold: 0.01 },
        );
        io.observe(el);

        const onVisibility = () => {
          if (document.hidden) {
            running = false;
            cancelAnimationFrame(raf);
          } else if (!running) {
            running = true;
            clock.getDelta();
            loop();
          }
        };
        document.addEventListener("visibilitychange", onVisibility);

        loop();

        cleanup = () => {
          running = false;
          cancelAnimationFrame(raf);
          io.disconnect();
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          renderer.domElement.remove();
          bgMesh.geometry.dispose();
          bgMat.dispose();
          pGeo.dispose();
          pMat.dispose();
          sprite.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_75%_0%,#0f3946_0%,#082530_45%,#04171e_100%)]"
    />
  );
}
