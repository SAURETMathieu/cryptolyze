export const getVariantAndLabel = (
  status: "verified" | "needed" | "refused" | "pending" | null
) => {
  let variant = "black";
  let label = "Non requis";

  switch (status) {
    case "verified":
      variant = "green";
      label = "Vérifié";
      break;
    case "needed":
      variant = "orange";
      label = "A fournir";
      break;
    case "refused":
      variant = "red";
      label = "Refusé";
      break;
    case "pending":
      variant = "blue";
      label = "Envoyé";
      break;
  }

  return { variant, label };
};
