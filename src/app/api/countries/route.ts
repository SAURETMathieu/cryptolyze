import { NextResponse } from "next/server";
import { createServer } from "@/src/lib/supabase/server";

interface CountriesResponse {
  isSuccess: boolean;
  message: string;
  countriesNameEN: string[];
  countriesNameFR: string[];
  countriesCodes: string[];
  countryCodesToIds: Record<string, number>;
}

//TODO add cache with supabase real-time
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes
let cache: CountriesResponse | null = null;
let cacheTimestamp: number | null = null;

export async function GET(req: Request) {
  const now = Date.now();
  if (cache && now - (cacheTimestamp || 0) < CACHE_DURATION) {
    return NextResponse.json(cache);
  }

  try {
    const supabase = createServer();
    let query = supabase.from("country").select("*").eq("is_active", true);

    const { error, data: countries } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const countryCodesToIds = countries.reduce(
      (acc: Record<string, number>, country) => {
        acc[country.iso2] = country.id;
        return acc;
      },
      {}
    );

    const countriesNameEN = countries.map((country) => country.name);
    const countriesNameFR = countries.map((country) => country.name_fr);
    const countriesCodes = countries.map((country) => country.iso2);

    cache = {
      isSuccess: true,
      message: "Countries fetched",
      countriesNameEN,
      countriesNameFR,
      countriesCodes,
      countryCodesToIds,
    };
    cacheTimestamp = now;

    return NextResponse.json(cache);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
