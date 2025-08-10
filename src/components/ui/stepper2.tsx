import { Fragment } from "react";
import { cn } from "@/src/lib/utils";
import { Hourglass } from "lucide-react";

interface StepDetail {
  icon: React.ReactNode;
  date?: string;
  time?: string;
  info: string;
  refunded?: boolean;
}

interface StepperIndicatorProps {
  activeStep: number;
  steps: Array<StepDetail>;
  orientation?: "horizontal" | "vertical";
  containerClassName?: string;
  stepClassName?: string;
}

const StepperIndicator = ({
  activeStep,
  steps,
  orientation = "horizontal",
  containerClassName,
  stepClassName,
}: StepperIndicatorProps) => {
  const isVertical = orientation === "vertical";
  return (
    <div
      className={cn(
        "mx-auto mt-2 w-full max-w-4xl",
        isVertical ? "flex flex-col space-y-4" : "flex flex-row space-x-4",
        containerClassName
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isCurrent = index === activeStep;
        const isLastStep = index === steps.length - 1;

        return (
          <Fragment key={index}>
            <div
              className={cn(
                "relative flex flex-1 items-center",
                isVertical ? "flex-row" : "my-4 flex-col items-center",
                !isLastStep &&
                  (isVertical
                    ? "after:absolute after:left-[15px] after:top-1/2 after:h-[calc(100%+25px)] after:w-[2px]"
                    : "after:absolute after:left-1/2 after:top-[15px] after:h-[2px] after:w-[calc(100%+32px)]"),
                !isLastStep &&
                  (isCompleted ? "after:bg-primary" : "after:bg-muted"),
                step.refunded && !isLastStep && "after:bg-red-600",
                stepClassName
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "z-[1] flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                    isCurrent ? "ring-primary ring-2 ring-offset-1" : "",
                    step.refunded && "bg-red-600 text-white"
                  )}
                >
                  {step.icon}
                </div>
              </div>
              <div className={cn("", isVertical ? "ml-2" : "mt-2 text-center")}>
                <h3
                  className={cn(
                    "text-[0.7rem] font-semibold",
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                  )}
                >
                  {step.info}
                </h3>
                <p className="text-muted-foreground text-[0.7rem]">
                  {step.date}
                </p>
                <p className="text-muted-foreground text-[0.7rem]">
                  {index === activeStep && !step.time ? (
                    <Hourglass
                      size={16}
                      className="mx-auto mt-2 animate-spin duration-1000"
                    />
                  ) : (
                    step.time
                  )}
                </p>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default StepperIndicator;
