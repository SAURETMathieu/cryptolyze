"use client";

import { ReactNode } from "react";
import { useModal } from "@/src/context/modalProvider";
import { cn } from "@/src/lib/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface AddButtonProps {
  modalTitle?: string;
  modalDescription?: string;
  modalContent: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  value: string;
  icon?: boolean;
}

export default function AddButton({
  modalTitle,
  modalDescription,
  modalContent,
  variant = "default",
  size = "default",
  className,
  value,
  icon = true,
}: AddButtonProps) {
  const { openModal, setDescription, setTitle } = useModal();
  const t = useTranslations("Forms");

  const handleClick = () => {
    setDescription(modalDescription ?? "");
    setTitle(modalTitle ?? t("ModalTitleCreate"));
    openModal(modalContent);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn("size-8 h-10 min-h-8 min-w-8 px-4 py-2", className)}
      size={size}
    >
      <span className="flex items-center justify-between gap-2">
        {<Plus className="size-4" />}
        {value ?? "Add"}
      </span>
    </Button>
  );
}
