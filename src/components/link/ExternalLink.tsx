import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type Props = {
  title: string;
  description: string;
  href: string;
  children?: ReactNode;
  className?: string;
  preventLink?: boolean;
};

export default function ExternalLink({
  description,
  href,
  title,
  children,
  className,
  preventLink,
}: Props) {
  return (
    <a
      className={cn("", className)}
      href={href}
      rel="noreferrer"
      target="_blank"
      onClick={(e) => {
        e.stopPropagation();
        if (preventLink) {
          e.preventDefault();
        }
      }}
      aria-label={description}
    >
      {children ? (
        children
      ) : (
        <>
          <p className="text-xl font-semibold text-white">
            {title} <span className="ml-2 inline-block">→</span>
          </p>
          <p className="mt-2 max-w-[250px] text-gray-400">{description}</p>
        </>
      )}
    </a>
  );
}
