"use client";

import { useEffect, useState, useTransition } from "react";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import NavigationLink from "@/src/components/link/NavigationLink";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { createEmailSchema } from "@/src/schemas/authSchemas";
import { translateMessage } from "@/src/utils/string/translateErrorMessage";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import {
  canSendRecoverPasswordEmail,
  resetPasswordForEmail,
} from "../../actions/auth";

const generateResetPasswordFormSchema = (t: MessagesIntl) => {
  return z.object({
    email: createEmailSchema(t),
  });
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmit, setAlreadySubmit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const tForm = useTranslations("Forms");
  const tReset = useTranslations("ResetPassword");
  const schema = generateResetPasswordFormSchema(tForm);

  const handleSubmit = async () => {
    setAlreadySubmit(true);
    startTransition(async () => {
      try {
        const parsedValues = schema.safeParse({ email });
        if (!parsedValues.success) {
          throw new Error(tReset("invalidEmail"));
        }
        setError(null);
      } catch (validationError) {
        if (validationError instanceof Error) {
          setError(validationError.message);
        }
        return;
      }

      const { success, message } = await canSendRecoverPasswordEmail(email);

      if (!success) {
        toast.error(
          translateMessage(message, tReset("errorWhileSendingRecoverEmail"))
        );
        return;
      }

      const { success: emailSend, message: resetPasswordMessage } =
        await resetPasswordForEmail(email);
      if (!emailSend) {
        setError(
          translateMessage(
            resetPasswordMessage,
            tReset("errorWhileSendingRecoverEmail")
          )
        );
      } else {
        setError(null);
        setEmail("");
        setAlreadySubmit(false);
        toast.success(tReset("resetPasswordEmailSent"));
      }
    });
  };

  useEffect(() => {
    const parsedValues = schema.safeParse({ email });
    if (parsedValues.success) {
      setError(null);
    } else {
      setError(tReset("invalidEmail"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, schema]);

  return (
    <main className="min-h-main p-4">
      <Card className="max-w-screen-s mx-auto mt-8 p-0">
        <CardHeader>
          <CardTitle>{tReset("recoverPassword")}</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="email"> {tReset("enterYourEmail")} </label>
          <Input
            type="text"
            className="hover:ring-ring hover:ring-1"
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
            {isPending ? <LoadIcon size={24} /> : tReset("sendEmail")}
          </Button>
          <p className="mt-4 text-sm">
            {tReset("rememberPassword")}
            <NavigationLink
              href="/login"
              className="text-primary ml-1 underline"
            >
              {tReset("login")}
            </NavigationLink>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
