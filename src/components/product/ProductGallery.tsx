"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
  isMain: boolean;
}

/* ─── Lightbox with zoom & pan ─── */
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setIndex(i);
      resetView();
    },
    [resetView],
  );

  const goPrev = useCallback(
    () => goTo(index > 0 ? index - 1 : images.length - 1),
    [goTo, index, images.length],
  );

  const goNext = useCallback(
    () => goTo(index < images.length - 1 ? index + 1 : 0),
    [goTo, index, images.length],
  );

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.5, 5));
      if (e.key === "-") setScale((s) => Math.max(s - 0.5, 0.5));
      if (e.key === "0") resetView();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext, resetView]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => {
      const next = s + (e.deltaY < 0 ? 0.25 : -0.25);
      return Math.max(0.5, Math.min(5, next));
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || scale <= 1) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
    },
    [scale],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      resetView();
    } else {
      setScale(2.5);
    }
  }, [scale, resetView]);

  const img = images[index];

  return (
    <div className="fixed top-0 left-0 z-[60] h-dvh w-dvw bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white/60 text-sm font-medium">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.5, 5))}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom in (+)"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.5, 0.5))}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom out (-)"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset (0)"
          >
            <RotateCcw size={18} />
          </button>
          <span className="text-white/40 text-xs tabular-nums ml-1 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden select-none"
        style={{ cursor: scale > 1 ? (dragging.current ? "grabbing" : "grab") : "zoom-in" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={img.url}
          alt={img.alt}
          draggable={false}
          className="max-w-[90%] max-h-[90%] object-contain"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: dragging.current ? "none" : "transform 0.15s ease-out",
          }}
        />
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Bottom thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-4 py-3 shrink-0">
          {images.map((thumb, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                i === index
                  ? "border-white ring-1 ring-white/30"
                  : "border-white/20 hover:border-white/50 opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={thumb.url}
                alt={thumb.alt}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Gallery ─── */
export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const mainIndex = images.findIndex((img) => img.isMain);
  const [active, setActive] = useState(mainIndex >= 0 ? mainIndex : 0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {/* Main image — compact, clickable */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="group relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer"
        >
          <img
            src={images[active].url}
            alt={images[active].alt}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              <ZoomIn size={14} />
              <span>Click to zoom</span>
            </div>
          </div>
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  i === active
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={active}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
