import { Badge } from "@/components/ui/badge";

/**
 * Returns the color associated with a given status.
 *
 * @param {string} status - The status value (e.g., "0", "1", "2", etc.).
 * @returns {string} The corresponding badge color for the status.
 */
export const getColorForDealStatus = (status: string) => {
  switch (status) {
    case "0":
      return "blue";
    case "1":
      return "yellow";
    case "2":
      return "lime";
    case "3":
      return "green";
    case "4":
      return "red";
    case "5":
      return "orange";
    default:
      return "none";
  }
};

/**
 * Returns the text associated with a given status.
 *
 * @param {string} status - The status value (e.g., "0", "1", "2", etc.).
 * @returns {string} The corresponding text for the status.
 */
export const getTextForDealStatus = (status: string) => {
  switch (status) {
    case "0":
      return "pending";
    case "1":
      return "authentication";
    case "2":
      return "payment";
    case "3":
      return "done";
    case "4":
      return "refused";
    case "5":
      return "cancelled";
    default:
      return "error";
  }
};

/**
 * Returns the step number associated with an anomaly status.
 *
 * @param {string} status - The anomaly status (e.g., "awaiting_payment", "to_ship", etc.).
 * @returns {number} The corresponding step number for the anomaly status.
 */
export const getStepForAnomalyStatus = (status: string) => {
  switch (status) {
    case "awaiting_payment":
      return 1;
    case "to_ship":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
};

/**
 * Returns an array of deal status options with corresponding labels and badge components.
 *
 * @param {any} tTable - The translation function used to localize status texts.
 * @returns {Array<{value: string, label: JSX.Element}>} An array of objects containing the value and label for each deal status option.
 */
export const getDealStatusOptionsLabels = (tTable: any) => {
  const BadgeStatus = ({ value, text }: { value: string; text: string }) => {
    return (
      <Badge
        variant={getColorForDealStatus(value)}
        className="text-md mx-auto flex w-fit rounded-lg px-1 capitalize"
      >
        {text}
      </Badge>
    );
  };
  return [
    {
      value: "0",
      label: <BadgeStatus text={tTable("pending")} value="0" />,
    },
    {
      value: "1",
      label: <BadgeStatus text={tTable("authentication")} value="1" />,
    },
    {
      value: "2",
      label: <BadgeStatus text={tTable("payment")} value="2" />,
    },
    {
      value: "3",
      label: <BadgeStatus text={tTable("realized")} value="3" />,
    },
    {
      value: "4",
      label: <BadgeStatus text={tTable("refused")} value="4" />,
    },
    {
      value: "5",
      label: <BadgeStatus text={tTable("cancelled")} value="5" />,
    },
  ];
};
