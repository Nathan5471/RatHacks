import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ThemeOverlay() {
  const { theme } = useAuth();
  const objectRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ dx: 2, dy: 2 });
  const [frameworkColor, setFrameworkColor] = useState<
    "green" | "purple" | "pink"
  >("green");

  useEffect(() => {
    if (!["spooky", "space", "framework"].includes(theme)) return;
    let animationFrameId: number;

    const animate = () => {
      const object = objectRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (!object) return;

      const objectRectangle = object.getBoundingClientRect();

      let { x, y } = position;
      let { dx, dy } = velocity;

      let updateFramework = false;

      if (x + objectRectangle.width >= width || x < 0) {
        updateFramework = true;
        dx *= -1;
      }
      if (y + objectRectangle.height >= height || y < 0) {
        updateFramework = true;
        dy *= -1;
      }

      x += dx;
      y += dy;

      setPosition({ x, y });
      setVelocity({ dx, dy });

      if (theme === "framework" && updateFramework) {
        if (frameworkColor === "green") {
          document.documentElement.classList.remove("framework-green");
          document.documentElement.classList.add("framework-purple");
          setFrameworkColor("purple");
        } else if (frameworkColor === "purple") {
          document.documentElement.classList.remove("framework-purple");
          document.documentElement.classList.add("framework-pink");
          setFrameworkColor("pink");
        } else if (frameworkColor === "pink") {
          document.documentElement.classList.remove("framework-pink");
          document.documentElement.classList.add("framework-green");
          setFrameworkColor("green");
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, velocity, theme, frameworkColor]);

  if (theme === "spooky" || theme === "space" || theme === "framework") {
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
          {theme === "framework" && (
            <img
              src={
                frameworkColor === "green"
                  ? "/framework12Green.jpg"
                  : frameworkColor === "purple"
                  ? "/framework12Purple.jpg"
                  : "/framework12Pink.jpg"
              }
              alt="Framework 12"
              className="w-24 h-auto"
            />
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
