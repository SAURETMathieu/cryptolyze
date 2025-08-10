import { initUserInfos } from "@/src/store/global.store";

export const initializeApp = async () => {
  try {
    await Promise.all([
      initUserInfos(),
    ]);
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};
