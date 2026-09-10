"use client";

import { useEffect, useRef } from "react";

/**
 * Babylon.js-powered "abyssal glow" — the closing moment of the page.
 * A full-screen shader: converging god-rays and slow caustics, a warm ember
 * under the pointer. Mirrors DeepScene's discipline: lazy-imports
 * @babylonjs/core, pauses offscreen, honours prefers-reduced-motion, and
 * falls back to a CSS gradient when WebGL is unavailable.
 */

const FRAG = `
precision highp float;
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
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x/uRes.y, 1.0);
  vec2 p = (uv - 0.5) * asp;
  float t = uTime * 0.06;

  // god-rays converging down from a far zenith
  float zenith = uv.y + 0.9;
  float ray = fbm(vec2(atan(p.x, zenith) * 5.0, length(p) * 0.8 - t * 2.2));
  ray = pow(ray, 3.0) * smoothstep(-0.3, 1.0, uv.y);

  // domain-warped caustics, one slow gate so the glow breathes
  float c = fbm(p * 2.4 + vec2(t * 0.7, -t * 0.4));
  c = fbm(p * 1.6 + c * 1.9 + vec2(t * 0.3, t * 0.5));
  float gate = 0.55 + 0.45 * sin(uTime * 0.25);
  float caust = smoothstep(0.42, 0.9, c) * gate;

  vec3 abyss = vec3(0.016, 0.090, 0.118);
  vec3 shelf = vec3(0.133, 0.314, 0.373);
  vec3 glow  = vec3(0.192, 0.878, 0.745);
  vec3 brass = vec3(0.784, 0.635, 0.290);

  vec3 col = mix(abyss, shelf, smoothstep(0.0, 1.1, ray) * 0.5);
  col += glow * caust * 0.16 + glow * ray * 0.24;

  // a warm ember where the pointer rests
  vec2 m = (uMouse - 0.5) * asp;
  float md = distance(p, m);
  col += (glow * 0.7 + brass * 0.3) * exp(-md * 4.5) * 0.24;

  col *= mix(0.45, 1.0, smoothstep(1.5, 0.1, length(p)));
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec3 position;
varying vec2 vUv;
void main(){ vUv = position.xz * 0.5 + 0.5; gl_Position = vec4(position.xz, 0.0, 1.0); }
`;

export function BabScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    import("@babylonjs/core")
      .then((B) => {
        if (cancelled || !el) return;

        const canvas = document.createElement("canvas");
        let engine: import("@babylonjs/core").Engine;
        try {
          engine = new B.Engine(canvas, true, {
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
          });
        } catch {
          return; // keep the CSS fallback
        }

        engine.setSize(el.clientWidth, el.clientHeight, false);
        engine.setHardwareScalingLevel(
          1 / Math.min(window.devicePixelRatio, 1.75),
        );
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        el.appendChild(canvas);

        const scene = new B.Scene(engine);
        scene.clearColor = new B.Color4(0, 0, 0, 0);
        new B.FreeCamera("cam", new B.Vector3(0, 0, -10), scene);

        const quad = B.MeshBuilder.CreatePlane(
          "quad",
          { width: 2, height: 2 },
          scene,
        );
        quad.alwaysSelectAsActiveMesh = true; // never frustum-cull the fullscreen quad

        const mat = new B.ShaderMaterial(
          "abyssal",
          scene,
          { vertexSource: VERT, fragmentSource: FRAG },
          {
            attributes: ["position"],
            uniforms: ["uTime", "uRes", "uMouse"],
          },
        );
        mat.backFaceCulling = false; // the quad is only addressable one way — keep it visible either way
        quad.material = mat;

        const mouse = new B.Vector2(0.5, 0.62);
        const res = new B.Vector2(1, 1);
        const onPointer = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          mouse.x = (e.clientX - r.left) / r.width;
          mouse.y = 1 - (e.clientY - r.top) / r.height;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const onResize = () =>
          engine.setSize(el.clientWidth, el.clientHeight, false);
        window.addEventListener("resize", onResize);

        let t = 0;
        let running = true;
        const render = () => {
          t += engine.getDeltaTime() / 1000;
          res.x = el.clientWidth;
          res.y = el.clientHeight;
          mat.setFloat("uTime", t);
          mat.setVector2("uRes", res);
          mat.setVector2("uMouse", mouse);
          scene.render();
        };
        engine.runRenderLoop(render);

        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !running) {
              running = true;
              engine.runRenderLoop(render);
            } else if (!entry.isIntersecting && running) {
              running = false;
              engine.stopRenderLoop();
            }
          },
          { threshold: 0.01 },
        );
        io.observe(el);

        const onVisibility = () => {
          if (document.hidden && running) {
            running = false;
            engine.stopRenderLoop();
          } else if (!document.hidden && !running) {
            running = true;
            engine.runRenderLoop(render);
          }
        };
        document.addEventListener("visibilitychange", onVisibility);

        cleanup = () => {
          running = false;
          io.disconnect();
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          engine.stopRenderLoop();
          canvas.remove();
          scene.dispose();
          engine.dispose();
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
      className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_100%,#0f3946_0%,#082530_55%,#04171e_100%)]"
    />
  );
}
