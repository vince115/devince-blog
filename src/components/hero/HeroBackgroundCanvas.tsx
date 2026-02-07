// src/components/hero/HeroBackgroundCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

/* ================= Types ================= */

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    depth: number; // 0 (遠) -> 1 (近)
    hue: number;   // 綠 -> 紫
};

type Star = {
    x: number;
    y: number;
    r: number;
    alpha: number;
};

type Meteor = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    hue: number;
};

/* ================= Component ================= */

export default function HeroBackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        const ctx = canvasEl.getContext("2d");
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        let width = 0;
        let height = 0;
        let animationId = 0;

        /* ========== Tunable Params ========== */

        const STAR_COUNT = 160;

        const NODE_COUNT = 80;
        const LINK_DISTANCE = 170;
        const BASE_SPEED = 0.08;

        const HUE_MIN = 140; // green
        const HUE_MAX = 280; // purple

        const METEOR_CHANCE = 0.002; // 出現機率（越小越稀有）

        /* ========== State ========== */

        const stars: Star[] = [];
        const nodes: Node[] = [];
        const meteors: Meteor[] = [];

        /* ========== Resize ========== */

        function resize(
            canvasEl: HTMLCanvasElement,
            ctx: CanvasRenderingContext2D
        ) {
            width = canvasEl.offsetWidth;
            height = canvasEl.offsetHeight;

            canvasEl.width = width * window.devicePixelRatio;
            canvasEl.height = height * window.devicePixelRatio;

            ctx.setTransform(
                window.devicePixelRatio,
                0,
                0,
                window.devicePixelRatio,
                0,
                0
            );
        }

        /* ========== Init ========== */

        function initStars() {
            stars.length = 0;
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 0.8 + 0.2,
                    alpha: Math.random() * 0.3 + 0.05,
                });
            }
        }

        function initNodes() {
            nodes.length = 0;
            for (let i = 0; i < NODE_COUNT; i++) {
                const depth = Math.random();
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * BASE_SPEED * (0.4 + depth),
                    vy: (Math.random() - 0.5) * BASE_SPEED * (0.4 + depth),
                    depth,
                    hue: HUE_MIN + Math.random() * (HUE_MAX - HUE_MIN),
                });
            }
        }

        function spawnMeteor() {
            const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.75;
            const speed = 6 + Math.random() * 4;

            meteors.push({
                x: Math.random() * width,
                y: -50,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 50 + Math.random() * 30,
                hue: 200 + Math.random() * 40,
            });
        }

        /* ========== Update ========== */

        function update() {
            // nodes
            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
            }

            // meteors
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.x += m.vx;
                m.y += m.vy;
                m.life++;

                if (m.life > m.maxLife) meteors.splice(i, 1);
            }

            if (meteors.length < 1 && Math.random() < METEOR_CHANCE) {
                spawnMeteor();
            }
        }

        /* ========== Draw ========== */

        function drawStars(ctx: CanvasRenderingContext2D) {
            for (const s of stars) {
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawNodes(ctx: CanvasRenderingContext2D) {
            // lines
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < LINK_DISTANCE) {
                        const alpha = 1 - dist / LINK_DISTANCE;
                        const hue = (nodes[i].hue + nodes[j].hue) / 2;
                        const depth = (nodes[i].depth + nodes[j].depth) / 2;

                        ctx.strokeStyle = `hsla(${hue},70%,${55 + depth * 10}%,${alpha * 0.12})`;
                        ctx.lineWidth = 0.4 + depth * 0.6;

                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // nodes
            for (const n of nodes) {
                const r = 0.8 + n.depth * 1.8;
                ctx.fillStyle = `hsla(${n.hue},80%,${60 + n.depth * 10}%,${0.15 + n.depth * 0.25})`;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawMeteors(ctx: CanvasRenderingContext2D) {
            ctx.globalCompositeOperation = "lighter";

            for (const m of meteors) {
                const alpha = 1 - m.life / m.maxLife;
                ctx.strokeStyle = `hsla(${m.hue},80%,70%,${alpha})`;
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x - m.vx * 4, m.y - m.vy * 4);
                ctx.stroke();
            }

            ctx.globalCompositeOperation = "source-over";
        }

        function draw(ctx: CanvasRenderingContext2D) {
            ctx.clearRect(0, 0, width, height);
            drawStars(ctx);
            drawNodes(ctx);
            drawMeteors(ctx);
        }

        /* ========== Loop ========== */

        function loop(ctx: CanvasRenderingContext2D) {
            update();
            draw(ctx);
            animationId = requestAnimationFrame(() => loop(ctx));
        }

        /* ========== Start ========== */

        resize(canvasEl, ctx);
        initStars();
        initNodes();
        loop(ctx);

        const handleResize = () => {
            resize(canvasEl, ctx);
            initStars();
            initNodes();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
            aria-hidden
        />
    );
}