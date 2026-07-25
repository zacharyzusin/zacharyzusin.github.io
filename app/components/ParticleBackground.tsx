"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  grabbed: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
  baseAlpha: number;
  tint: string; // rgb triplet for the star colour
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const COUNT = 160;
    const GRAB_RADIUS = 22;
    const RESTITUTION = 0.9;
    const FRICTION = 0.99;
    const EXPLOSION_RADIUS = 180;
    const EXPLOSION_STRENGTH = 8;

    // Cursor tracking for grab + fling
    const cursor = { x: -9999, y: -9999, px: -9999, py: -9999, down: false };
    let grabbed: Particle | null = null;

    const resize = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Rescale existing stars proportionally so a window resize (e.g. macOS
      // tiling the browser when Mail opens) redistributes them instead of
      // clamping them all into a line at the new edge.
      if (oldWidth > 0 && oldHeight > 0 && particles.length > 0) {
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;
        for (const p of particles) {
          p.x *= scaleX;
          p.y *= scaleY;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mostly white stars, with a few faint blue / warm ones for variety
    const tints = [
      "255,255,255",
      "255,255,255",
      "255,255,255",
      "203,224,255", // cool blue-white
      "255,244,224", // warm white
    ];

    const spawn = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const vx = (Math.random() - 0.5) * 0.25;
        const vy = (Math.random() - 0.5) * 0.25;
        // Weight toward small stars, a few larger ones
        const size = Math.pow(Math.random(), 2) * 1.8 + 0.6;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: size,
          grabbed: false,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          baseAlpha: 0.5 + Math.random() * 0.5,
          tint: tints[Math.floor(Math.random() * tints.length)],
        });
      }
    };
    spawn();

    // Respect reduced-motion: render a still starfield, no animation or physics
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      const staticDraw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.tint},${p.baseAlpha})`;
          ctx.fill();
        }
      };
      staticDraw();
      const onReduceResize = () => {
        spawn();
        staticDraw();
      };
      window.addEventListener("resize", onReduceResize);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", onReduceResize);
      };
    }

    const nearestParticle = (x: number, y: number, maxDist: number) => {
      let best: Particle | null = null;
      let bestD = maxDist;
      for (const p of particles) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      return best;
    };

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    const onDown = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.px = e.clientX;
      cursor.py = e.clientY;
      cursor.down = true;
      const p = nearestParticle(cursor.x, cursor.y, GRAB_RADIUS);
      if (p) {
        p.grabbed = true;
        grabbed = p;
      }

      // Shockwave — push nearby stars away from the click point
      for (const particle of particles) {
        if (particle === grabbed) continue;
        const dx = particle.x - cursor.x;
        const dy = particle.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < EXPLOSION_RADIUS && dist > 0) {
          const force = (1 - dist / EXPLOSION_RADIUS) * EXPLOSION_STRENGTH;
          particle.vx += (dx / dist) * force;
          particle.vy += (dy / dist) * force;
        }
      }
    };
    const onUp = () => {
      cursor.down = false;
      if (grabbed) {
        // Fling with the cursor's recent velocity
        grabbed.vx = (cursor.x - cursor.px) * 0.9;
        grabbed.vy = (cursor.y - cursor.py) * 0.9;
        grabbed.grabbed = false;
        grabbed = null;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    const step = () => {
      // Grabbed particle sticks to cursor; remember prev cursor for fling velocity
      if (grabbed) {
        cursor.px = grabbed.x;
        cursor.py = grabbed.y;
        grabbed.x = cursor.x;
        grabbed.y = cursor.y;
        grabbed.vx = 0;
        grabbed.vy = 0;
      }

      // Integrate motion
      for (const p of particles) {
        if (p.grabbed) continue;
        // Weak pull back toward gentle ambient drift so nothing freezes
        p.vx += (p.baseVx - p.vx) * 0.006;
        p.vy += (p.baseVy - p.vy) * 0.006;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Wall bounce
        if (p.x < p.radius) {
          p.x = p.radius;
          p.vx = Math.abs(p.vx) * 0.8;
        } else if (p.x > canvas.width - p.radius) {
          p.x = canvas.width - p.radius;
          p.vx = -Math.abs(p.vx) * 0.8;
        }
        if (p.y < p.radius) {
          p.y = p.radius;
          p.vy = Math.abs(p.vy) * 0.8;
        } else if (p.y > canvas.height - p.radius) {
          p.y = canvas.height - p.radius;
          p.vy = -Math.abs(p.vy) * 0.8;
        }
      }

      // Particle-particle collisions (elastic)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius;
          if (dist > 0 && dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) / 2;
            if (!a.grabbed) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }
            if (!b.grabbed) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
            const dvx = b.vx - a.vx;
            const dvy = b.vy - a.vy;
            const rel = dvx * nx + dvy * ny;
            if (rel < 0) {
              const m1 = a.radius * a.radius;
              const m2 = b.radius * b.radius;
              const impulse = (-(1 + RESTITUTION) * rel) / (1 / m1 + 1 / m2);
              const ix = impulse * nx;
              const iy = impulse * ny;
              if (!a.grabbed) {
                a.vx -= ix / m1;
                a.vy -= iy / m1;
              }
              if (!b.grabbed) {
                b.vx += ix / m2;
                b.vy += iy / m2;
              }
            }
          }
        }
      }
    };

    const draw = () => {
      step();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const p of particles) {
        // Twinkle: oscillate alpha over time
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.6 + 0.4 * Math.sin(p.twinklePhase);
        const alpha = Math.min(1, p.baseAlpha * twinkle);

        if (p.grabbed) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
          glow.addColorStop(0, "rgba(191,219,253,0.8)");
          glow.addColorStop(1, "rgba(147,197,253,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Soft halo for the brighter stars — gives that glinting look
        if (p.radius > 1.4) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
          halo.addColorStop(0, `rgba(${p.tint},${alpha * 0.5})`);
          halo.addColorStop(1, `rgba(${p.tint},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.grabbed ? p.radius * 1.6 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.tint},${p.grabbed ? 1 : alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
