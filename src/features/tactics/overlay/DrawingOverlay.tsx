import { useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTacticsStore } from '../store/useTacticsStore';
import type { ArrowCurvature, Stroke } from '../types';
import { arrowControlPoint, smoothPush } from './geometry';

let strokeCounter = 0;
function nextStrokeId() {
  strokeCounter += 1;
  return `str-${Date.now().toString(36)}-${strokeCounter}`;
}

/** Radio del puntito-origen tipo "blip de radar", en píxeles. */
const RADAR_DOT_RADIUS_PX = 6;
/** Radio del aro exterior del blip (px). */
const RADAR_DOT_HALO_PX = 11;
/** Radio del hit-test para el blip, en coordenadas normalizadas. */
const RADAR_DOT_HIT_RADIUS = 0.022;
/** Radio del handle de tip arrastrable (px). */
const TIP_HANDLE_RADIUS_PX = 7;
/** Radio del hit-test del handle del tip en normalizadas. */
const TIP_HANDLE_HIT_RADIUS = 0.028;

function drawRadarDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  // Halo exterior tenue.
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, RADAR_DOT_HALO_PX, 0, Math.PI * 2);
  ctx.stroke();
  // Dot interior brillante.
  ctx.globalAlpha = 1;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, RADAR_DOT_RADIUS_PX, 0, Math.PI * 2);
  ctx.fill();
  // Highlight blanco al centro.
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(x, y, RADAR_DOT_RADIUS_PX * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTipHandle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  // Anillo blanco-glow para indicar interactividad.
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(x, y, TIP_HANDLE_RADIUS_PX, 0, Math.PI * 2);
  ctx.stroke();
  // Núcleo del color de la flecha.
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, TIP_HANDLE_RADIUS_PX * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  w: number,
  h: number,
  flowPhase: number,
) {
  const pts = stroke.points;
  if (pts.length === 0) return;

  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = stroke.color;
  ctx.shadowBlur = 6;

  if (stroke.kind === 'arrow') {
    const start = pts[0];
    const end = pts[pts.length - 1];
    const curvature = stroke.curvature ?? 'convex';
    const ctrl = arrowControlPoint(start, end, curvature);
    const sx = start.x * w;
    const sy = start.y * h;
    const ex = end.x * w;
    const ey = end.y * h;
    const cx = ctrl.x * w;
    const cy = ctrl.y * h;

    // 1) Halo base translúcido — da el "cuerpo" sólido a la flecha.
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    if (curvature === 'flat') {
      ctx.lineTo(ex, ey);
    } else {
      ctx.quadraticCurveTo(cx, cy, ex, ey);
    }
    ctx.stroke();
    ctx.restore();

    // 2) Marching ants encima — dashes animados que dan la sensación de flujo.
    ctx.save();
    ctx.lineWidth = stroke.width * 1.1;
    ctx.setLineDash([16, 10]);
    ctx.lineDashOffset = -flowPhase;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    if (curvature === 'flat') {
      ctx.lineTo(ex, ey);
    } else {
      ctx.quadraticCurveTo(cx, cy, ex, ey);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Tangente en el extremo: para Bézier es end-control; para recta es end-start.
    const tx = curvature === 'flat' ? ex - sx : ex - cx;
    const ty = curvature === 'flat' ? ey - sy : ey - cy;
    const angle = Math.atan2(ty, tx);
    const head = Math.max(14, stroke.width * 3.4);
    const spread = Math.PI / 6;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - head * Math.cos(angle - spread), ey - head * Math.sin(angle - spread));
    ctx.lineTo(ex - head * Math.cos(angle + spread), ey - head * Math.sin(angle + spread));
    ctx.closePath();
    ctx.fill();

    // Blip de radar al origen — clicable para ciclar la curvatura.
    drawRadarDot(ctx, sx, sy, stroke.color);
    // Handle al tip — arrastrable para redirigir la flecha.
    drawTipHandle(ctx, ex, ey, stroke.color);
  } else {
    ctx.beginPath();
    ctx.moveTo(pts[0].x * w, pts[0].y * h);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x * w, pts[i].y * h);
    }
    ctx.stroke();
  }
  ctx.restore();
}

type Props = {
  /** Ángulo Y aplicado al campo en 3D. La 2D overlay rota la misma cantidad
   *  alrededor del centro del canvas para que los trazos "viajen" con la cancha. */
  rotationY?: number;
  /** Factor de escala que sigue al zoom de la cámara 3D.
   *  >1 = cámara cerca (pitch grande en pantalla); <1 = cámara lejos. */
  zoomScale?: number;
};

export function DrawingOverlay({ rotationY = 0, zoomScale = 1 }: Props) {
  const reducedMotion = useReducedMotion() ?? false;
  const tool = useTacticsStore((s) => s.drawTool);
  const color = useTacticsStore((s) => s.drawColor);
  const strokes = useTacticsStore((s) => s.strokes);
  const addStroke = useTacticsStore((s) => s.addStroke);
  const eraseStrokeAt = useTacticsStore((s) => s.eraseStrokeAt);
  const cycleArrowCurvature = useTacticsStore((s) => s.cycleArrowCurvature);
  const updateArrowEndpoint = useTacticsStore((s) => s.updateArrowEndpoint);
  const updateArrowStartpoint = useTacticsStore((s) => s.updateArrowStartpoint);

  function findArrowBlipAt(p: { x: number; y: number }): string | null {
    // Recorre de la más reciente a la más antigua (encima primero).
    for (let i = strokes.length - 1; i >= 0; i--) {
      const st = strokes[i];
      if (st.kind !== 'arrow' || st.points.length === 0) continue;
      const start = st.points[0];
      if (Math.hypot(start.x - p.x, start.y - p.y) < RADAR_DOT_HIT_RADIUS) return st.id;
    }
    return null;
  }

  function findArrowTipAt(p: { x: number; y: number }): string | null {
    for (let i = strokes.length - 1; i >= 0; i--) {
      const st = strokes[i];
      if (st.kind !== 'arrow' || st.points.length < 2) continue;
      const end = st.points[st.points.length - 1];
      if (Math.hypot(end.x - p.x, end.y - p.y) < TIP_HANDLE_HIT_RADIUS) return st.id;
    }
    return null;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<Stroke | null>(null);
  const draggingTipRef = useRef<string | null>(null);
  const draggingBaseRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const flowPhaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el || !el.parentElement) return;
    const parent = el.parentElement;
    const update = () => {
      const rect = parent.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  function paint() {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0 || size.h === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size.w * dpr || canvas.height !== size.h * dpr) {
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    // Rotación + zoom sincronizados con la cámara 3D. Los trazos viven en
    // "field space" (canvas-normalizado, sin rotación, a la distancia de ref).
    // Aplicamos primero rotación, después escala — ambos centrados en el canvas.
    if (rotationY !== 0 || zoomScale !== 1) {
      ctx.translate(size.w / 2, size.h / 2);
      if (zoomScale !== 1) ctx.scale(zoomScale, zoomScale);
      if (rotationY !== 0) ctx.rotate(rotationY);
      ctx.translate(-size.w / 2, -size.h / 2);
    }

    const phase = flowPhaseRef.current;
    for (const stroke of strokes) drawStroke(ctx, stroke, size.w, size.h, phase);
    if (drawingRef.current) drawStroke(ctx, drawingRef.current, size.w, size.h, phase);
  }

  useEffect(() => {
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, size, rotationY, zoomScale]);

  // Flow loop: marching ants en flechas. Solo corre si hay al menos una flecha
  // (committed o in-progress) o si la herramienta de flecha está activa.
  // Respeta `prefers-reduced-motion`: si está activo, dejamos las flechas
  // estáticas sin marching ants.
  useEffect(() => {
    if (reducedMotion) return;
    const hasArrow = strokes.some((s) => s.kind === 'arrow') || tool === 'arrow';
    if (!hasArrow) return;

    let alive = true;
    const tick = () => {
      if (!alive) return;
      flowPhaseRef.current = (flowPhaseRef.current + 0.55) % 10000;
      paint();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, tool, size, rotationY, reducedMotion]);

  const active = tool !== 'none';

  function getNorm(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    // Offset desde el centro, en píxeles.
    let dx = e.clientX - rect.left - w / 2;
    let dy = e.clientY - rect.top - h / 2;
    // Inverso de la rotación (en píxel-space para que respete el aspect).
    if (rotationY !== 0) {
      const cos = Math.cos(-rotationY);
      const sin = Math.sin(-rotationY);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      dx = rx;
      dy = ry;
    }
    // Inverso del zoom.
    if (zoomScale !== 1) {
      dx /= zoomScale;
      dy /= zoomScale;
    }
    return { x: (dx + w / 2) / w, y: (dy + h / 2) / h };
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    const p = getNorm(e);

    if (tool !== 'eraser') {
      // Prioridad: tip handle (arrastrar para redirigir el destino).
      const tipId = findArrowTipAt(p);
      if (tipId) {
        draggingTipRef.current = tipId;
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
      // Base de la flecha: tap = ciclar curvatura, drag = mover el origen.
      // El cycle se decide en pointer-up si NO hubo movimiento real.
      const arrowId = findArrowBlipAt(p);
      if (arrowId) {
        draggingBaseRef.current = {
          id: arrowId,
          startX: e.clientX,
          startY: e.clientY,
          moved: false,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
    }

    e.currentTarget.setPointerCapture(e.pointerId);

    if (tool === 'eraser') {
      eraseStrokeAt(p.x, p.y);
      return;
    }

    drawingRef.current = {
      id: nextStrokeId(),
      kind: tool === 'arrow' ? 'arrow' : 'pen',
      color,
      width: tool === 'arrow' ? 4.5 : 3.5,
      points: [p],
      ...(tool === 'arrow' ? { curvature: 'convex' as ArrowCurvature } : {}),
    };
    paint();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    const p = getNorm(e);

    // Arrastrando el tip de una flecha existente.
    if (draggingTipRef.current) {
      updateArrowEndpoint(draggingTipRef.current, p.x, p.y);
      return;
    }

    // Arrastre desde la base — solo si el cursor se movió lo suficiente para
    // distinguir de un tap (que cicla la curvatura).
    if (draggingBaseRef.current) {
      const db = draggingBaseRef.current;
      if (!db.moved && Math.hypot(e.clientX - db.startX, e.clientY - db.startY) > 5) {
        db.moved = true;
      }
      if (db.moved) {
        updateArrowStartpoint(db.id, p.x, p.y);
      }
      return;
    }

    if (tool === 'eraser' && e.buttons === 1) {
      eraseStrokeAt(p.x, p.y);
      return;
    }

    const current = drawingRef.current;
    if (!current) return;

    if (current.kind === 'arrow') {
      current.points = [current.points[0], p];
    } else {
      current.points = smoothPush(current.points, p);
    }
    paint();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // capture may have already been released
    }
    if (draggingTipRef.current) {
      draggingTipRef.current = null;
      return;
    }
    if (draggingBaseRef.current) {
      const db = draggingBaseRef.current;
      draggingBaseRef.current = null;
      // Si no se arrastró, era un tap → ciclar curvatura.
      if (!db.moved) cycleArrowCurvature(db.id);
      return;
    }
    const current = drawingRef.current;
    drawingRef.current = null;
    if (!current) return;
    if (current.points.length < 2) return;
    addStroke(current);
  };

  // El overlay bloquea pointer events cuando hay un tool activo, pero el
  // wheel debe seguir llegando a OrbitControls (zoom de cámara). React monta
  // wheel como passive → necesitamos un listener nativo no-passive para
  // poder preventDefault y evitar que la página haga scroll.
  useEffect(() => {
    const overlay = canvasRef.current;
    if (!overlay) return;
    const handleWheel = (e: WheelEvent) => {
      if (!active) return;
      const outer = overlay.parentElement;
      if (!outer) return;
      const canvases = outer.querySelectorAll('canvas');
      const threeCanvas = Array.from(canvases).find((c) => c !== overlay) as
        | HTMLCanvasElement
        | undefined;
      if (!threeCanvas) return;
      e.preventDefault();
      e.stopPropagation();
      threeCanvas.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: e.deltaX,
          deltaY: e.deltaY,
          deltaZ: e.deltaZ,
          deltaMode: e.deltaMode,
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    overlay.addEventListener('wheel', handleWheel, { passive: false });
    return () => overlay.removeEventListener('wheel', handleWheel);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      data-tactics-overlay
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: active ? 'auto' : 'none',
        cursor: tool === 'eraser' ? 'cell' : active ? 'crosshair' : 'default',
        touchAction: active ? 'none' : 'auto',
        borderRadius: 20,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}
