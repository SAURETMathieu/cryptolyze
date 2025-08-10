import { Fragment } from "react";
import clsx from "clsx";
import { Hourglass } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface StepDetail {
  icon: React.ReactNode;
  date: string;
  time: string;
  info: string;
  refunded?: boolean;
}

interface StepperIndicatorProps {
  activeStep: number;
  steps: Array<StepDetail>;
}

const StepperIndicator = ({ activeStep, steps }: StepperIndicatorProps) => {
  return (
    <>
      <div className="flex max-w-full items-center justify-center px-4 pt-3 md:px-6 lg:px-10 xl:px-12">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div className="m-[5px] flex flex-col items-center">
              <div
                className={clsx(
                  "w-[35px] h-[35px] flex justify-center items-center border-[2px] rounded-full",
                  index < activeStep && "bg-primary text-primary-foreground",
                  index === activeStep && "border-primary text-primary",
                  index === steps.length - 1 &&
                    index <= activeStep &&
                    "bg-primary text-primary-foreground",
                  step.refunded && "bg-red-600 text-white border-primary"
                )}
              >
                {step.icon}
              </div>
            </div>

            {index !== steps.length - 1 && (
              <Separator
                orientation="vertical"
                className={clsx(
                  "flex-1 h-[2px]",
                  index < activeStep && "bg-primary",
                  step.refunded && "bg-red-600"
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex">
        {steps.map((step, index) => (
          <div
            key={step.info}
            className="text-muted-foreground flex-1 text-center text-[0.7rem]"
          >
            <div className="text-foreground flex-1 text-center font-bold">
              {step.info}
            </div>
            <div className="flex-1 text-center">{step.date}</div>
            <div className="flex-1 text-center">
              {index === activeStep && !step.time ? (
                <Hourglass
                  size={16}
                  className="mx-auto mt-2 animate-spin duration-1000"
                />
              ) : (
                step.time
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StepperIndicator;
