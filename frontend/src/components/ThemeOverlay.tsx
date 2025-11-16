import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ThemeOverlay() {
  const { theme } = useAuth();
  const objectRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ dx: 2, dy: 2 });

  useEffect(() => {
    if (!["spooky", "space"].includes(theme)) return;
    let animationFrameId: number;

    const animate = () => {
      const object = objectRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (!object) return;

      const objectRectangle = object.getBoundingClientRect();

      let { x, y } = position;
      let { dx, dy } = velocity;

      if (x + objectRectangle.width >= width || x < 0) {
        dx *= -1;
      }
      if (y + objectRectangle.height >= height || y < 0) {
        dy *= -1;
      }

      x += dx;
      y += dy;

      setPosition({ x, y });
      setVelocity({ dx, dy });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, velocity, theme]);

  if (theme === "spooky" || theme === "space") {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-52">
        <div
          ref={objectRef}
          className="absolute"
          style={{ left: position.x, top: position.y }}
        >
          {theme === "spooky" && (
            <img src="/ghost.png" alt="Spooky Ghost" className="w-24 h-auto" />
          )}
          {theme === "space" && (
            <img src="/alienUFO.png" alt="Alien UFO" className="w-24 h-auto" />
          )}
        </div>
        {theme === "space" && (
          <img
            src="/stars.png"
            alt="Starry Background"
            className="w-screen h-screen object-cover"
          />
        )}
      </div>
    );
  } else {
    return null;
  }
}
