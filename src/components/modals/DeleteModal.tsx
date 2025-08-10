"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useDeleteModal } from "@/src/context/deleteModalProvider";

import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";

const Modal = () => {
  const {
    isOpen,
    closeModal,
    description,
    title,
    handleDelete,
    isDisabled,
    cancelButtonValue,
    confirmButtonValue,
  } = useDeleteModal();

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

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="max-h-[90vh]"
        onInteractOutside={handlePointerDownOutside}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-between gap-2">
          <Button variant="outline" onClick={closeModal} className="w-[45%]">
            {cancelButtonValue}
          </Button>
          <Button
            disabled={isDisabled}
            className="hover:bg-destructive/80 w-[45%]"
            variant="destructive"
            onClick={handleDelete}
          >
            {isDisabled ? <LoadIcon size={24} /> : confirmButtonValue}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
