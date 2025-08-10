"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group [&>li[data-visible=false]]:pointer-events-none [&>li[data-visible=true]]:pointer-events-auto"
      visibleToasts={2}
      expand
      closeButton
      toastOptions={{
        duration: 2500,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg hover:cursor-pointer",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:text-red-900 group-[.toaster]:bg-red-300 group-[.toaster]:border-red-900 group-[.toaster]:p-4",
          success:
            "group-[.toaster]:text-green-900 group-[.toaster]:bg-green-300 group-[.toaster]:border-green-900 group-[.toaster]:p-4",
          warning:
            "group-[.toaster]:text-yellow-900 group-[.toaster]:bg-yellow-300 group-[.toaster]:border-yellow-900 group-[.toaster]:p-4",
          info: "group-[.toaster]:text-white group-[.toaster]:bg-blue-600 group-[.toaster]:border-blue-900 group-[.toaster]:p-4",
          closeButton:
            "group-[.toaster]:bg-accent group-[.toaster]:dark:bg-foreground group-[.toaster]:border-current",
          loading: "group-[.toaster]:border-current",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
