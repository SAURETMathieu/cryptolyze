"use client";

import { useAuth } from "@/src/context/userProvider";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import UpdateButton from "@/components/buttons/UpdateButton";

import { NewEmailForm } from "./NewEmailForm";
import { modalContentForUpdatePassword } from "./PasswordChangeForm";

const InfosPersoForm = () => {
  const { profile } = useAuth();

  const t = useTranslations("Forms");

  if (!profile) {
    return <div>Loading...</div>;
  }

  const updatePasswordForm = modalContentForUpdatePassword(
    t("passwordChangeSuccess"),
    t("passwordChangeError")
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor="first_name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("firstnameLabel")}
        </label>
        <div className="rounded-lg border">
          <Input
            type="text"
            className="bg-accent"
            name="first_name"
            id="first_name"
            aria-disabled="true"
            disabled
            value={profile.first_name}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="last_name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("lastnameLabel")}
        </label>
        <div className="rounded-lg border">
          <Input
            type="text"
            className="bg-accent"
            name="last_name"
            id="last_name"
            aria-disabled="true"
            disabled
            value={profile.last_name}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="birth_date"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("birthDateLabel")}
        </label>
        <div className="rounded-lg border">
          <Input
            type="text"
            className="bg-accent"
            name="birth_date"
            id="birth_date"
            aria-disabled="true"
            disabled
            value={profile.birth_date}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("emailLabel")}
        </label>
        <div className="flex rounded-lg border">
          <Input
            type="text"
            className="bg-accent"
            name="email"
            id="email"
            aria-disabled="true"
            disabled
            value={profile.email}
            autoComplete="off"
          />
          <UpdateButton
            modalContent={<NewEmailForm />}
            variant="default"
            className="bg-primary my-auto h-[40px] w-[55px] rounded-none rounded-r-lg"
            modalTitle={t("updateEmailModalTitle")}
            modalDescription={t("updateEmailModalDescription")}
            ariaLabel={t("updateEmailAriaLabel")}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("passwordLabel")}
        </label>
        <div className="flex rounded-lg border">
          <Input
            type="text"
            className="bg-accent"
            name="password"
            id="password"
            aria-disabled="true"
            disabled
            value="************"
            autoComplete="off"
          />
          <UpdateButton
            modalContent={updatePasswordForm}
            variant="default"
            className="bg-primary my-auto h-[40px] w-[55px] rounded-none rounded-r-lg"
            modalTitle={t("updatePasswordModalTitle")}
            modalDescription={t("updatePasswordModalDescription")}
            ariaLabel={t("updatePasswordAriaLabel")}
          />
        </div>
      </div>
    </div>
  );
};

export default InfosPersoForm;
