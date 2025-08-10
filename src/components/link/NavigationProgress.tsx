"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface LoadingTopBarBeamProps {
  isLoading: boolean;
  color?: string;
  height?: number;
  duration?: number;
}

const LoadingTopBarBeam: React.FC<LoadingTopBarBeamProps> = ({
  isLoading,
  color = "bg-blue-500",
  height = 3,
  duration = 2,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setProgress((oldProgress) => {
        if (oldProgress < 90) {
          return oldProgress + 1;
        }
        return oldProgress;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    if (isLoading) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      setProgress(100);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full overflow-hidden transition-all duration-500 ${
        progress > 0 ? "opacity-100" : "opacity-0"
      }`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full ${color}`}
        style={{
          width: `${progress}%`,
          transition: `width ${duration}s ease-out`,
        }}
      />
    </div>
  );
};

export default LoadingTopBarBeam;
