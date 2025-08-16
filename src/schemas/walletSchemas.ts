import { z } from "zod";

import { blockchains } from "../data/enum";
import { getRegexForBlockchain } from "../utils/getRegexForBlockchain";
import { createEnumSchema, createStringSchema } from "./utils";

export const decentralizedWalletCreateSchema = (t: MessagesIntl) =>
  z
    .object({
      name: createStringSchema({
        minLength: 3,
        maxLength: 30,
        required: true,
        requiredError: "Wallet's name is required.",
      }),

      blockchain: createEnumSchema(
        blockchains,
        "Blockchain is required.",
        "Blockchain is invalid."
      ),

      address: createStringSchema({
        minLength: 26,
        maxLength: 44,
        required: true,
        requiredError: "Wallet's address is required.",
      }),
    })
    .refine(
      (data) => {
        const regex = getRegexForBlockchain(data.blockchain);
        if (!regex) return false;
        return regex.test(data.address);
      },
      {
        message: `This address is unvalid for this blockchain.`,
      }
    );

export type CreateDecentralizedWalletSchemaType = ReturnType<
  typeof decentralizedWalletCreateSchema
>;
