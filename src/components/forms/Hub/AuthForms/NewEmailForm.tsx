"use client";

import { useEffect, useState, useTransition } from "react";
import { canSendNewEmailEmail } from "@/src/app/actions/auth";
import { updateUserEmail } from "@/src/app/actions/profile";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useModal } from "@/src/context/modalProvider";
import { useAuth } from "@/src/context/userProvider";
import { createEmailSchema } from "@/src/schemas/authSchemas";
import { translateMessage } from "@/src/utils/string/translateErrorMessage";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

const generateNewEmailFormSchema = (t: MessagesIntl) => {
  return z.object({
    email: createEmailSchema(t),
  });
};

export function NewEmailForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmit, setAlreadySubmit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const tForm = useTranslations("Forms");
  const tEmail = useTranslations("UpdateEmail");
  const schema = generateNewEmailFormSchema(tForm);
  const { profile } = useAuth();
  const { closeModal, isOpen } = useModal();

  const handleSubmit = async () => {
    setAlreadySubmit(true);
    startTransition(async () => {
      try {
        if (profile?.email?.toLowerCase() === email.toLowerCase()) {
          toast.error(tEmail("sameEmail"));
          throw new Error(tEmail("sameEmail"));
        }
        const parsedValues = schema.safeParse({ email: email?.toLowerCase() });
        if (!parsedValues.success) {
          throw new Error(tEmail("invalidEmail"));
        }
        setError(null);
      } catch (validationError) {
        if (validationError instanceof Error) {
          setError(validationError.message);
        }
        return;
      }

      const { success: emailCanBeSend, message } = await canSendNewEmailEmail(
        profile.id
      );

      if (!emailCanBeSend) {
        toast.error(
          translateMessage(message, tEmail("errorWhileSendingChangeEmail"))
        );
        return;
      }

      const { success: emailSend, message: updateEmailMessage } =
        await updateUserEmail(email);
      if (!emailSend) {
        toast.error(
          translateMessage(
            updateEmailMessage,
            tEmail("errorWhileSendingChangeEmail")
          )
        );
      } else {
        setError(null);
        setEmail("");
        setAlreadySubmit(false);
        toast.success(tEmail("emailSend"));
        if (isOpen) {
          closeModal();
        }
      }
    });
  };

  useEffect(() => {
    const parsedValues = schema.safeParse({ email: email?.toLowerCase() });
    if (parsedValues.success) {
      setError(null);
    } else {
      setError(tEmail("invalidEmail"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, schema]);

  return (
    <Card className="w-full bg-transparent p-0">
      <CardHeader className="pb-4 font-bold">
        <label htmlFor="email"> {tEmail("enterYourEmail")} </label>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          className="hover:ring-ring bg-accent hover:ring-1"
          name="email"
          id="email"
          aria-disabled="true"
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {error && alreadySubmit && (
          <p className="text-destructive mt-1 text-sm font-semibold capitalize">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start justify-center">
        <Button
          size="lg"
          className="w-full"
          variant="primary"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? <LoadIcon size={24} /> : tEmail("sendEmail")}
        </Button>
      </CardFooter>
    </Card>
  );
}
