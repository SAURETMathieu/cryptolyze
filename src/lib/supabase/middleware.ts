import { NextResponse, type NextRequest } from "next/server";

import { createServer } from "./server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    let userWithProfile;

    if (profile) {
      userWithProfile = { ...user, profile };
    } else {
      userWithProfile = { ...user };
    }

    supabaseResponse.headers.set("user", JSON.stringify(userWithProfile));
  }
  // else {
  //   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  //   const subdomain = supabaseUrl?.split("//")[1].split(".")[0];
  //   const baseAuthCookieName = `sb-${subdomain}-auth-token`;

  //   const allCookies = await cookies();
  //   const cookieNames = allCookies.getAll().map((cookie) => cookie.name);

  //   cookieNames.forEach((cookieName) => {
  //     if (cookieName.startsWith(baseAuthCookieName)) {
  //       supabaseResponse.cookies.delete(cookieName);
  //     }
  //   });
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
