"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useModal } from "@/src/context/modalProvider";
import { cn } from "@/src/lib/utils";

const Modal = () => {
  const { isOpen, closeModal, modalContent, description, title, maxWidth } =
    useModal();

  const handlePointerDownOutside = (event: Event) => {
    const floatingToolbar = document?.querySelector(".floating-toolbar");
    if (floatingToolbar?.contains(event.target as Node)) {
      event.preventDefault();
    }
    if ((event.target as Element)?.closest(".toast")) {
      event.preventDefault();
      return;
    }
  };

  // Prevent bug when closing the modal during a select input or other input inside the modal is open
  useEffect(() => {
    if (isOpen && document) {
      document.body.style.pointerEvents = "none";
      document.body.setAttribute("data-scroll-locked", "1");
    } else {
      document.body.style.pointerEvents = "";
      document.body.removeAttribute("data-scroll-locked");
    }

    return () => {
      document.body.style.pointerEvents = "";
      document.body.removeAttribute("data-scroll-locked");
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={cn("no-scrollbar max-h-[90vh] overflow-y-scroll", maxWidth)}
        onInteractOutside={handlePointerDownOutside}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {modalContent ? (
          modalContent
        ) : (
          <div className="text-center">No content.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
