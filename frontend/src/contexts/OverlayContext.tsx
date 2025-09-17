import { createContext, useState, useContext } from "react";

interface OverlayContextType {
  isOverlayOpen: boolean;
  overlayContent: React.ReactNode | null;
  openOverlay: (content: React.ReactNode) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayContent, setOverlayContent] = useState<React.ReactNode | null>(
    null
  );

  const openOverlay = (content: React.ReactNode) => {
    setOverlayContent(content);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayContent(null);
    setIsOverlayOpen(false);
  };

  const contextValue = {
    isOverlayOpen,
    overlayContent,
    openOverlay,
    closeOverlay,
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
    </OverlayContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOverlay = (): OverlayContextType => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
