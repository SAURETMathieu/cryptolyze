import { createApiResponse } from "@/src/lib/api/createApiResponse";
import { getDictionnary } from "@/src/lib/api/getDictionnary";
import {getWalletsWithBalancesAndTransactions} from "@/src/lib/api/wallets";
import { withApiHandler } from "@/src/lib/api/withApiHandler";
import { createDecentralizeWalletWithMobula } from "@/src/lib/mobula/createDecentralizeWallet";
import { createServer } from "@/src/lib/supabase/server";
import {
  CreateDecentralizedWalletSchemaType,
  decentralizedWalletCreateSchema,
} from "@/src/schemas/walletSchemas";

// GET - Récupérer tous les wallets
export const GET = withApiHandler<any>(
  async (req, user) => {
    const supabase = createServer();
    const { data, error } = await supabase
      .from("wallet")
      .select(`*`)
      .eq("profile_id", user!.id);

    if (error) {
      throw new Error(error.message);
    }

    return createApiResponse(true, "wallets_fetched", data, null, 200);
  },
  {
    requireAuth: true,
    defaultDataOnError: [],
  }
);

type Validations = {
  body: CreateDecentralizedWalletSchemaType;
};

// POST - Créer un nouveau wallet
export const POST = withApiHandler<any, Validations>(
  async (req, user, validatedData) => {
    const supabase = createServer();
    const body = validatedData.body;

    // Check if the wallet already exists
    const { data: existingWallet, error: checkError } = await supabase
      .from("wallet")
      .select("id")
      .eq("address", body.address)
      .eq("blockchain", body.blockchain)
      .eq("profile_id", user!.id)
      .single();

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (existingWallet) {
      return createApiResponse(
        false,
        "wallet_already_exists",
        null,
        ["Wallet already exists"],
        409
      );
    }

    let newWallet: any;

    if (body.blockchain === "all") {
      // newWallet.type = "centralized";
    } else {
      try {
        newWallet = await createDecentralizeWalletWithMobula({
          ...body,
          type: "decentralized",
        });
      } catch (error) {
        throw error;
        // if (
        //   error instanceof WalletError &&
        //   newWallet.blockchain !== "Solana"
        // ) {
        //   if (error.message.includes("invalid wallet format")) {
        //     return createApiResponse(
        //       false,
        //       "invalid_wallet_format",
        //       null,
        //       ["Invalid wallet format"],
        //       400
        //     );
        //   }

        //   // Essayer avec Moralis
        //   try {
        //     newWallet = await createDecentralizeWalletWithMoralis(walletData);
        //   } catch (moralisError) {
        //     if (moralisError instanceof WalletError) {
        //       return createApiResponse(
        //         false,
        //         moralisError.message,
        //         null,
        //         [moralisError.message],
        //         moralisError.httpStatus
        //       );
        //     }
        //     throw moralisError;
        //   }
        // } else {
        //   if (error instanceof WalletError) {
        //     return createApiResponse(
        //       false,
        //       error.message,
        //       null,
        //       [error.message],
        //       error.httpStatus
        //     );
        //   }
        //   throw error;
        // }
      }
    }

    // Récupérer le wallet avec les balances et transactions
    const walletWithBalancesAndTransactions =
      await getWalletsWithBalancesAndTransactions(user!.id, newWallet.id);

    if (
      !walletWithBalancesAndTransactions ||
      walletWithBalancesAndTransactions.length === 0
    ) {
      throw new Error("Wallet created but failed to get information");
    }

    // Formater le wallet avec les calculs de balance et profits
    const formattedWallet = walletWithBalancesAndTransactions.map((wallet) => {
      const balance = wallet.balances
        .map((balance: any) => balance.nbToken * (balance.price ?? 0) || 0)
        .reduce((a: number, b: number) => a + b, 0);

      const profits = wallet.balances.reduce((acc: number, balance: any) => {
        return acc + (balance.realizedProfit ?? 0);
      }, 0);

      const modifiedWallet: any = {
        ...wallet,
        day: 1,
        day7: 1,
        month: 1,
        balance,
        profits,
        key: "key",
      };

      return modifiedWallet;
    });

    return createApiResponse(
      true,
      "wallet_created_successfully",
      formattedWallet,
      null,
      201
    );
  },
  {
    requireAuth: true,
    defaultDataOnError: null,
    validations: async () => {
      const t = await getDictionnary("Forms");
      return {
        body: decentralizedWalletCreateSchema(t),
      };
    },
  }
);
