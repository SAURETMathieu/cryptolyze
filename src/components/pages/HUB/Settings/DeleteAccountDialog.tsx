"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/src/app/actions/profile";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { useModal } from "@/src/context/modalProvider";
import { useAuth } from "@/src/context/userProvider";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeleteAccountDialog() {
  const tSettings = useTranslations("SettingsPage");
  const { openModal, setTitle, setDescription, closeModal, isOpen } =
    useModal();
  const { profile, setProfile, setUser } = useAuth();
  const router = useRouter();

  const DeleteAccountModalContent = () => {
    const [confirmation, setConfirmation] = useState("");
    const [isPending, startTransition] = useTransition();
    const handleConfirmDelete = () => {
      startTransition(async () => {
        if (confirmation === "DELETE") {
          const { success } = await deleteAccount(profile.id);
          if (success) {
            toast.success(tSettings("deleteAccountSuccess"));
            setProfile(null);
            setUser(null);
            if (isOpen) {
              closeModal();
            }
            router.replace("/login");
          } else {
            toast.error(tSettings("errorWhileDeletingAccount"));
          }
        }
      });
    };
    return (
      <>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="confirmation" className="text-right">
              {tSettings("typeDelete")}
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleConfirmDelete}
          disabled={confirmation !== "DELETE" || isPending}
          className="w-full"
        >
          {isPending ? <LoadIcon size={18} /> : tSettings("deleteAccount")}
        </Button>
      </>
    );
  };

  const handleDeleteAccount = () => {
    setTitle(tSettings("deleteAccount"));
    setDescription(tSettings("deleteAccountWarning"));
    openModal(<DeleteAccountModalContent />);
  };

  return (
    <Button
      variant="destructive"
      className="w-full"
      type="button"
      onClick={handleDeleteAccount}
    >
      {tSettings("deleteAccount")}
    </Button>
  );
}
