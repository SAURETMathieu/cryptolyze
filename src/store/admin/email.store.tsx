// import { toggleEmailConfigStatus } from "@/src/app/actions/admin/email";
import { supabaseClient } from "@/src/lib/supabase/client";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { create } from "zustand";

import { Database } from "@/types/supabase";

export type EmailType = Database["public"]["Tables"]["email_config"]["Row"];

type EmailStoreState = {
  emails: EmailType[];
  emailsFetched: boolean;
  setEmailsFetched: (bool: boolean) => void;
  setEmails: (emails: EmailType[]) => void;
  setStore: (store: EmailStoreState) => void;
};

export const useAdminEmailStore = create<EmailStoreState>((set, get) => ({
  emails: [],
  emailsFetched: false,
  setEmailsFetched: (bool) => set({ emailsFetched: bool }),

  setEmails: (emails) => set({ emails }),
  setStore: (store) => set(store),
}));

export const fetchEmails = async () => {
  const { setEmails, setEmailsFetched } = useAdminEmailStore.getState();

  try {
    const { error, data: emails } = await supabaseClient
      .schema("public")
      .from("email_config")
      .select("*")
      .order("key");

    if (error) {
      throw new Error(error.message);
    }

    if (Array.isArray(emails)) {
      setEmails(emails as EmailType[]);
      setEmailsFetched(true);
    } else {
      throw new Error("Fetched emails config is not an array or is undefined");
    }
  } catch (error: any) {
    console.error("Error fetching emails config:", error);
    toast.error("Une erreur est survenue lors de la récupération des emails");
    setEmailsFetched(true);
    setEmails([]);
    return false;
  }
};

export const toggleEmailStatus = async (email: EmailType) => {
  const { emails } = useAdminEmailStore.getState();
  const index = emails.findIndex((e) => e.key === email.key);
  // if (index !== -1) {
  //   emails[index].status = !email.status;
  //   useAdminEmailStore.getState().setEmails([...emails]);
  //   const { success, message } = await toggleEmailConfigStatus(
  //     emails[index].status,
  //     emails[index].id
  //   );
  //   if (!success) {
  //     console.error("Error toggling trigger:", message);
  //     toast.error(message);
  //     emails[index].status = email.status;
  //     useAdminEmailStore.getState().setEmails([...emails]);
  //   } else {
  //     toast.success(
  //       <div className="flex w-full items-center justify-between gap-2 text-base">
  //         <span className="font-semibold">{email.key}: </span>
  //         <span
  //           className={cn(
  //             "font-bold",
  //             !email.status ? "text-red-600" : "text-green-600"
  //           )}
  //         >
  //           {!email.status ? "Désactivé" : "Activé"}
  //         </span>
  //       </div>
  //     );
  //   }
  // }
};

export const insertEmailStore = async (newEmailConfig: EmailType) => {
  const { emails } = useAdminEmailStore.getState();

  const newEmails = [...emails, newEmailConfig].sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  setEmails(newEmails);
};

export const updateEmailStore = async (
  updatedEmailConfig: EmailType,
  id: number
) => {
  const { emails } = useAdminEmailStore.getState();

  const newEmails = emails.map((email) => {
    if (email.id === id) {
      return updatedEmailConfig;
    }
    return email;
  });

  setEmails(newEmails);
};

export const setEmails = (emails: EmailType[]) => {
  useAdminEmailStore.getState().setEmails(emails);
};
