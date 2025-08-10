import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGlobalMessage } from "@/src/lib/actions-cache/global/globalMessage";

export async function GET(request: Request) {
  try {
    const value = await getGlobalMessage(cookies());
    return NextResponse.json({
      success: true,
      message: "global_message_fetched",
      data: { value },
    });
  } catch (error: any) {
    console.error("getGlobalMessage error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
