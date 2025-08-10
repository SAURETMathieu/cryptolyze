"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { ZoomIn } from "lucide-react";

import placeholderImage from "@/components/icons/emptyImage2.svg";

type ImageHandlerProps = React.ComponentProps<typeof Image> & {
  placeholderSrc?: string;
};

export const ImageHandler: React.FC<ImageHandlerProps> = ({
  src,
  placeholderSrc = placeholderImage.src,
  alt,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || placeholderSrc);
  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setImageSrc(placeholderSrc)}
      priority
    />
  );
};

interface ImageWithMagnifierProps extends ImageHandlerProps {
  enableMagnifier?: boolean;
  enableModal?: boolean;
  modalSize?: "sm" | "md" | "lg" | "xl";
}

export const ImageWithMagnifier: React.FC<ImageWithMagnifierProps> = ({
  src,
  placeholderSrc = placeholderImage.src,
  alt,
  enableMagnifier = false,
  enableModal = false,
  modalSize = "lg",
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || placeholderSrc);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMagnifier) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (enableModal) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isModalOpen && event.state?.imageModalOpen) {
        event.preventDefault();
        setIsModalOpen(false);
        window.history.back();
      }
    };

    if (isModalOpen) {
      window.history.pushState({ imageModalOpen: true }, "", "");
      window.history.pushState({ dummy: true }, "", "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isModalOpen]);

  const getModalSizeClass = () => {
    switch (modalSize) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return "max-w-lg";
    }
  };

  const imageComponent = (
    <div
      className={`relative overflow-hidden ${className || ""}`}
      style={{ width: props.width, height: props.height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        onError={() => setImageSrc(placeholderSrc)}
        priority
        className="size-full object-cover transition-transform duration-200"
        style={{
          transform: isHovered && enableMagnifier ? "scale(2)" : "scale(1)",
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
      />
      {enableModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/20">
          <ZoomIn className="size-6 text-white opacity-0 transition-opacity duration-200 hover:opacity-100" />
        </div>
      )}
    </div>
  );

  if (enableModal) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>{imageComponent}</DialogTrigger>
        <DialogContent
          className={`${getModalSizeClass()} p-0 [&>button]:rounded-lg [&>button]:bg-black/30 [&>button]:p-1 [&>button]:text-white [&>button]:backdrop-blur-sm [&>button]:hover:bg-black/50`}
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
        >
          <div className="relative size-full">
            <Image
              src={imageSrc}
              alt={alt}
              width={800}
              height={600}
              className="h-auto w-full rounded-lg object-contain"
              onError={() => setImageSrc(placeholderSrc)}
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return imageComponent;
};
