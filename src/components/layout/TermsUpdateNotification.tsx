"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { acceptTerms } from "@/src/app/actions/profile";
import { useAuth } from "@/src/context/userProvider";
import { createClient } from "@/src/lib/supabase/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function isNewerVersion(current: string, reference: string): boolean {
  const currentParts = current.split(".").map(Number);
  const referenceParts = reference.split(".").map(Number);

  const length = Math.max(currentParts.length, referenceParts.length);

  while (currentParts.length < length) {
    currentParts.push(0);
  }
  while (referenceParts.length < length) {
    referenceParts.push(0);
  }

  for (let i = 0; i < length; i++) {
    if (currentParts[i] > referenceParts[i]) return true;
    if (currentParts[i] < referenceParts[i]) return false;
  }

  return false;
}

export function TermsUpdateNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [currentTermsVersion, setCurrentTermsVersion] = useState<string>("0.0");
  const [isPending, startTransition] = useTransition();
  const { profile, setProfile } = useAuth();
  const toastIdRef = useRef<string | number | null>(null);
  const tConditions = useTranslations("ConditionsPage");

  useEffect(() => {
    if (
      profile &&
      isNewerVersion(
        currentTermsVersion ?? "0.0",
        profile?.accept_terms_version ?? "0.0"
      ) &&
      profile.accept_terms_version !== null &&
      profile.accept_terms_at !== null &&
      profile.accept_terms_history !== null
    ) {
      setShowNotification(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTermsVersion, profile?.id]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "accept_terms_version" &&
        e.newValue === currentTermsVersion
      ) {
        setShowNotification(false);
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [profile?.id, currentTermsVersion]);

  useEffect(() => {
    const fetchVersion = async () => {
      const localStorageVersion = localStorage.getItem("accept_terms_version");
      if (localStorageVersion !== profile?.accept_terms_version) {
        localStorage.setItem(
          "accept_terms_version",
          profile?.accept_terms_version
        );
      }

      const supabase = createClient();
      const { data: conditionsInfos, error } = await supabase
        .from("config")
        .select("*")
        .eq("key", "accept_terms_version")
        .single();
      if (error) {
        console.error("Failed to fetch terms version", error);
        return;
      }
      setCurrentTermsVersion(conditionsInfos.value);
    };
    if (profile) {
      fetchVersion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const handleDismiss = () => {
    setShowNotification(false);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
  };

  const handleAcceptTerms = () => {
    setShowNotification(false);
    localStorage.setItem("accept_terms_version", currentTermsVersion);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    startTransition(async () => {
      const { success, data } = await acceptTerms();
      if (success) {
        setProfile((prev: any) => ({
          ...prev,
          accept_terms_at: data.accept_terms_at,
          accept_terms_version: currentTermsVersion,
        }));
      }
    });
  };

  useEffect(() => {
    if (showNotification) {
      toastIdRef.current = toast(
        <div>
          <h4 className="text-xl font-bold">
            {tConditions("termsConditionsUpdated")}
          </h4>
          <p className="text-muted-foreground mb-4">
            {tConditions("termsConditionsUpdatedDescription")}
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              {tConditions("dismiss")}
            </Button>
            <a href="/conditions" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                {tConditions("viewTerms")}
              </Button>
            </a>
            <Button variant="primary" size="sm" onClick={handleAcceptTerms}>
              {tConditions("accept")}
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  return null;
}
