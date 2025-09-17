import { useOverlay } from "../contexts/OverlayContext";

export default function Overlay() {
  const { isOverlayOpen, overlayContent } = useOverlay();

  if (!isOverlayOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen h-screen">
      <div className="bg-surface-a0 p-6 rounded-lg text-white">
        {overlayContent}
      </div>
    </div>
  );
}
