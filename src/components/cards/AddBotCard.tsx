"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useModal } from "@/src/context/modalProvider";
import { Settings } from "lucide-react";

export function AddBotCard() {
  const { openModal, setTitle, setDescription } = useModal();
  return (
    <Card className="items-between flex flex-col">
      <CardHeader className="">
        <CardTitle className="relative flex justify-between gap-2 text-xl font-medium">
          Bots
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
          >
            <Settings className="size-5" />
          </Button>
        </CardTitle>
        <CardDescription className="max-w-lg text-balance text-sm leading-relaxed">
          Automate your trading
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          onClick={() => {
            setTitle("Create your bot");
            setDescription(
              "Create your bot for automate your trading strategy"
            );
            openModal("createBot");
          }}
        >
          Add a bot
        </Button>
      </CardFooter>
    </Card>
  );
}
