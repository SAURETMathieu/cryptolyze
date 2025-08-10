"use client";

import React, { useEffect } from "react";
import { getCurrentGlobalMessage } from "@/src/utils/string/getCurrentGlobalMessage";
import { X } from "lucide-react";
import { useLocale } from "next-intl";

export default function GlobalAlert() {
  const [message, setMessage] = React.useState<string | null>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const locale = useLocale();
  const currentMessage = getCurrentGlobalMessage(message, locale);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("globalAlertShown", "false");
  };

  useEffect(() => {
    const fetchGlobalMessage = async () => {
      try {
        const response = await fetch("/api/global/messages");
        const { data, success } = await response.json();
        const storedMessage = localStorage.getItem("globalAlertMessage");
        const storedShow = localStorage.getItem("globalAlertShown");

        if (!data?.value || !success) {
          setMessage(null);
          setShow(false);
          localStorage.setItem("globalAlertShown", "false");
        } else if (data.value !== storedMessage || storedShow === "true") {
          setMessage(data.value);
          setShow(true);
          localStorage.setItem("globalAlertMessage", data.value);
          localStorage.setItem("globalAlertShown", "true");
        } else {
          setMessage(storedMessage);
          setShow(storedShow === "true");
        }
      } catch (error) {
        console.error("Error fetching global message:", error);
        setMessage(null);
        setShow(false);
      }
    };
    fetchGlobalMessage();
  }, []);

  if (!show || !currentMessage) return null;

  return (
    <section
      id="global-alert"
      role="banner"
      className="bg-primary text-primary-foreground relative flex w-full items-center justify-center px-10 py-2"
      aria-label="global alert"
    >
      {getCurrentGlobalMessage(message, locale)}
      <X
        size={18}
        className="text-primary-foreground hover:text-primary-foreground/80 absolute right-4 hover:cursor-pointer"
        onClick={handleClose}
      />
    </section>
  );
}
