"use client";

import { useState, useRef, useEffect } from "react";

const colors = [
  "#1a1a1a",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const brushSizes = [4, 8, 16, 24, 40];

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
    if (dark && color === "#1a1a1a") setColor("#ffffff");
    if (!dark && color === "#ffffff") setColor("#1a1a1a");

    const observer = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains("dark");
      setIsDark(nowDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? "#222222" : "#faf9f7";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const ctx = canvas.getContext("2d");
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (imageData) {
          ctx.putImageData(imageData, 0, 0);
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => window.removeEventListener("resize", updateSize);
  }, [bgColor]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    setLastPos(pos);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === "eraser" ? bgColor : color;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPos) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const pos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? bgColor : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.font = "16px Recoleta, serif";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)";
    ctx.textAlign = "right";
    ctx.fillText("Cryba.by", canvas.width - 16, canvas.height - 16);

    const link = document.createElement("a");
    link.download = `cryba-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <section className="h-[calc(100vh-180px)] overflow-hidden px-6 py-4 md:px-20 lg:px-32">
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="write-title text-4xl md:text-5xl font-bold dark:text-white">Let it out</h1>
            <p className="hero-subtitle text-base opacity-50 dark:text-white mt-2">Draw, scribble, release</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveDrawing}
              className="save-btn bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-6 py-2.5 rounded-full font-sans text-base font-medium"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          <div className="flex-1 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-[#faf9f7] dark:bg-[#222]">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="write-form flex flex-col gap-6 p-5 rounded-2xl bg-[#faf9f7] dark:bg-[#222] border border-black/5 dark:border-white/5 w-20">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTool("brush")}
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${
                  tool === "brush" ? "bg-[#1a1a1a] dark:bg-white" : "bg-black/5 dark:bg-white/10"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${tool === "brush" ? "text-white dark:text-[#1a1a1a]" : "dark:text-white"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => setTool("eraser")}
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${
                  tool === "eraser" ? "bg-[#1a1a1a] dark:bg-white" : "bg-black/5 dark:bg-white/10"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${tool === "eraser" ? "text-white dark:text-[#1a1a1a]" : "dark:text-white"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15.414l8.828-8.828a2 2 0 012.828 0l1.172 1.172a2 2 0 010 2.828l-8.828 8.828a2 2 0 01-1.414.586H4v-3.172a2 2 0 01.586-1.414z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16" />
                </svg>
              </button>
              <button
                onClick={clearCanvas}
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all bg-black/5 dark:bg-white/10 hover:bg-red-500/20"
              >
                <svg
                  className="w-5 h-5 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            <div className="flex flex-col gap-2 items-center">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setTool("brush"); }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c && tool === "brush" ? "scale-110 ring-2 ring-offset-2 ring-black/20 dark:ring-white/20" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            <div className="flex flex-col gap-2 items-center">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`rounded-full bg-[#1a1a1a] dark:bg-white transition-all ${
                    brushSize === size ? "ring-2 ring-offset-2 ring-black/20 dark:ring-white/20" : "opacity-40"
                  }`}
                  style={{ width: Math.max(size, 12), height: Math.max(size, 12) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
