import  { useEffect, useRef, } from 'react';




 export const GlobeVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    // Globe configuration
    const DOTS_COUNT = 400; // Increased dots for bigger globe
    // Dynamic radius based on container size, slightly larger for "bigger" feel
    const GLOBE_RADIUS = Math.min(width, height) * 0.48; 
    const DOT_RADIUS = 1.5;
    const PERSPECTIVE = width * 0.8;
    const ROTATION_SPEED = 0.002;

    // Generate points on sphere (Fibonacci sphere algorithm)
    const points: {x: number, y: number, z: number, theta: number, phi: number}[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < DOTS_COUNT; i++) {
      const y = 1 - (i / (DOTS_COUNT - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      points.push({
        x: x * GLOBE_RADIUS,
        y: y * GLOBE_RADIUS,
        z: z * GLOBE_RADIUS,
        theta, // Original angle for reference
        phi: Math.acos(y)
      });
    }

    // Network "Hops" (active lines)
    interface Hop {
      startIdx: number;
      endIdx: number;
      progress: number;
      speed: number;
    }
    const hops: Hop[] = [];
    const MAX_HOPS = 8; // More traffic

    let rotationY = 0;
    let rotationX = 0.2; // Slight tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.2;

    const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.0005; // Slower mouse influence
      mouseY = (e.clientY - rect.top - height / 2) * 0.0005;
    };
    
    // Attach listener to parent container to capture mouse interaction better
    canvas.parentElement?.addEventListener('mousemove', handleMouseMove as any);

    let animationFrameId: number;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth rotation based on mouse or auto
      targetRotationY += ROTATION_SPEED;
      rotationY += (targetRotationY + mouseX * 20 - rotationY) * 0.05;
      rotationX += (targetRotationX + mouseY * 20 - rotationX) * 0.05;

      // Manage hops
      if (hops.length < MAX_HOPS && Math.random() > 0.94) {
        const start = Math.floor(Math.random() * points.length);
        let end = Math.floor(Math.random() * points.length);
        // Ensure some distance but not too far
        while (end === start) end = Math.floor(Math.random() * points.length);
        hops.push({ startIdx: start, endIdx: end, progress: 0, speed: 0.01 + Math.random() * 0.02 });
      }

      // Project and sort points (z-sorting for depth)
      const projectedPoints = points.map((point, idx) => {
        // Rotate around X
        let y = point.y * Math.cos(rotationX) - point.z * Math.sin(rotationX);
        let z = point.y * Math.sin(rotationX) + point.z * Math.cos(rotationX);
        let x = point.x;

        // Rotate around Y
        let x2 = x * Math.cos(rotationY) - z * Math.sin(rotationY);
        let z2 = x * Math.sin(rotationY) + z * Math.cos(rotationY);
        
        const scale = PERSPECTIVE / (PERSPECTIVE + z2);
        const x2d = x2 * scale + width / 2;
        const y2d = y * scale + height / 2;
        const alpha = Math.max(0.1, (z2 + GLOBE_RADIUS) / (2 * GLOBE_RADIUS)); // Fade back points

        return { x: x2d, y: y2d, z: z2, alpha, idx, x3d: x2, y3d: y, z3d: z2 };
      });

      // Draw Hops (Arced lines)
      hops.forEach((hop, i) => {
        hop.progress += hop.speed;
        if (hop.progress >= 1) {
          hops.splice(i, 1);
          return;
        }

        const p1 = projectedPoints[hop.startIdx];
        const p2 = projectedPoints[hop.endIdx];

        // Only draw if both points are somewhat visible (front-ish facing)
        if (p1.z > -GLOBE_RADIUS * 0.6 && p2.z > -GLOBE_RADIUS * 0.6) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            
            // Simple quadratic bezier for "arc" effect (pulling towards center or out)
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2 - 20 * Math.sin(hop.progress * Math.PI); // Arc up slightly
            
            ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
            
            // Gradient stroke
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(6, 182, 212, 0)`);
            gradient.addColorStop(0.5, `rgba(6, 182, 212, ${Math.sin(hop.progress * Math.PI)})`);
            gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw travelling packet
            const t = hop.progress;
            const tx = (1-t)*(1-t)*p1.x + 2*(1-t)*t*cx + t*t*p2.x;
            const ty = (1-t)*(1-t)*p1.y + 2*(1-t)*t*cy + t*t*p2.y;
            
            ctx.beginPath();
            ctx.arc(tx, ty, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
      });

      // Draw Points
      projectedPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS * (0.5 + p.alpha), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`; // Cyan
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove as any);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};