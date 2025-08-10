import { Clock, Droplets, ShieldQuestion, ShoppingBag } from "lucide-react";

/**
 * Returns an icon and style based on the provided option.
 *
 * @param {string} option - The option for which the icon and style will be returned.
 *   - `tote_bag`: Returns an icon representing a shopping bag.
 *   - `impermeabilisation`: Returns an icon representing droplets with specific styles for impermeabilisation.
 *   - `extended_return`: Returns a clock icon with styles for extended return.
 *   - Default: Returns a shield question icon with a default style.
 *
 * @returns {{ icon: JSX.Element, style: string }} An object containing:
 *   - `icon`: The corresponding icon component based on the option.
 *   - `style`: The CSS class string associated with the icon.
 *
 * @example
 * const option = "impermeabilisation";
 * const { icon, style } = getOptionsIconAndStyle(option);
 * // icon will be <Droplets size={20} /> and style will be "bg-cyan-400 text-white border border-cyan-600 hover:bg-cyan-400"
 */
export const getOptionsIconAndStyle = (option: string) => {
  switch (option) {
    case "tote_bag":
      return {
        icon: <ShoppingBag size={20} />,
        style: "",
      };
    case "impermeabilisation":
      return {
        icon: <Droplets size={20} />,
        style:
          "bg-cyan-400 text-white border border-cyan-600 hover:bg-cyan-400",
      };
    case "extended_return":
      return {
        icon: <Clock size={20} />,
        style:
          "text-yellow-900 bg-yellow-300 border border-yellow-800 hover:bg-yellow-300",
      };
    default:
      return {
        icon: <ShieldQuestion size={20} />,
        style:
          "text-gray-500 bg-gray-300 border border-gray-400 hover:bg-gray-300",
      };
  }
};
