import { useOverlay } from "../contexts/OverlayContext";

export default function Overlay() {
  const { isOverlayOpen, overlayContent, closeOverlay } = useOverlay();

  if (!isOverlayOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen h-screen"
      onClick={closeOverlay}
    >
      <div
        className="bg-surface-a1 p-6 rounded-lg text-white max-h-11/12 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {overlayContent}
      </div>
    </div>
  );
}
