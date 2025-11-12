import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ThemeOverlay() {
  const { theme } = useAuth();
  const objectRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ dx: 2, dy: 2 });

  useEffect(() => {
    if (theme !== "spooky") return;
    let animationFrameId: number;

    const animate = () => {
      const object = objectRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (!object) return;

      const objectRectangle = object.getBoundingClientRect();

      let { x, y } = position;
      console.log(`x: ${x}, y: ${y}`);
      let { dx, dy } = velocity;
      console.log(`dx: ${dx}, dy: ${dy}`);

      if (x + objectRectangle.width >= width || x < 0) {
        dx *= -1;
      }
      if (y + objectRectangle.height >= height || y < 0) {
        dy *= -1;
      }
      console.log(`dx: ${dx}, dy: ${dy}`);

      x += dx;
      y += dy;
      console.log(`x: ${x}, y: ${y}`);

      setPosition({ x, y });
      setVelocity({ dx, dy });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, velocity, theme]);

  if (theme === "spooky") {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-51">
        <div
          ref={objectRef}
          className="absolute"
          style={{ left: position.x, top: position.y }}
        >
          <img src="/ghost.png" alt="Spooky Ghost" className="w-24 h-auto" />
        </div>
      </div>
    );
  } else {
    return null;
  }
}
