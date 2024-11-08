import React, { useState, useRef, useLayoutEffect, CSSProperties } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState<CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const calculatePosition = () => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const isOffscreenRight = rect.right > window.innerWidth;
      const isOffscreenLeft = rect.left < 0;

      let newPositionStyles: CSSProperties = { left: '50%', transform: 'translateX(-50%)' };

      if (isOffscreenRight) {
        newPositionStyles = { right: '0', transform: 'none' };
      } else if (isOffscreenLeft) {
        newPositionStyles = { left: '0', transform: 'none' };
      }

      setTooltipStyles(newPositionStyles);
    }
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          style={tooltipStyles}
          className="absolute bottom-full mb-2 w-max px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg z-10"
        >
          {text}
        </div>
      )}
    </div>
  );
};
