/**
 * Splits an address into two lines, with an optional complement added to the second line.
 * The address is split at the specified maximum length, and the complement (if provided) is appended to the second line.
 *
 * @param {string} address - The address string to be split into two lines.
 * @param {string} [complement=""] - An optional complement to be added to the second line of the address.
 * @param {number} [maxLength=40] - The maximum length of the first line. The address will be split at this length.
 *
 * @returns {{ line1: string, line2: string }} - An object containing the two lines of the split address.
 *  - `line1`: The first line of the address, which will not exceed `maxLength` in length.
 *  - `line2`: The second line of the address, which will contain the remaining part of the address and the complement (if provided).
 *
 * @example
 * const result = splitAddress("1234 Main Street, Some City, Some Country");
 * console.log(result);
 * // { line1: "1234 Main Street, Some", line2: "City, Some Country" }
 *
 * const resultWithComplement = splitAddress("1234 Main Street", "Apartment 5", 15);
 * console.log(resultWithComplement);
 * // { line1: "1234 Main Street", line2: "Apartment 5" }
 */
export function splitAddress(address: string, complement = "", maxLength = 40) {
  let line1 = "";
  let line2 = "";

  if (address.length <= maxLength) {
    line1 = address;
  } else {
    line1 = address.substring(0, maxLength);
    line2 = address.substring(maxLength).trim();
  }

  // Ajouter le complément à `line2` si présent
  if (complement) {
    line2 = line2 ? `${line2}, ${complement}` : complement;
  }

  return { line1, line2 };
}
