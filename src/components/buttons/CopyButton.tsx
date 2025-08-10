"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  toCopy: string;
  srText?: string;
  copiedText?: string;
  size?: "icon" | "default" | "sm" | "lg" | null | undefined;
  className?: string;
  variant?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "primary"
    | null
    | undefined;
  iconClassName?: string;
}

export default function CopyButton({
  toCopy,
  srText = "Copy Order ID",
  copiedText = "Copied !",
  size = "icon",
  className = "",
  variant = "outline",
  iconClassName = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("relative size-6", className)}
      onClick={copyToClipboard}
    >
      {copied ? (
        <Check className={cn("size-4 text-green-600", iconClassName)} />
      ) : (
        <Copy className={cn("size-3", iconClassName)} />
      )}
      <span className="sr-only">{srText}</span>
    </Button>
  );
}
