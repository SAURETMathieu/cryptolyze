"use server";

import { createServer } from "@/src/lib/supabase/server";

const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

//TODO add cache to this function

export async function getCountries(onlyActive = false) {
  if (typeof onlyActive !== "boolean") {
    return {
      success: false,
      message: "'onlyActive' must be a boolean value.",
      countriesNameEN: [],
      countriesNameFR: [],
      countriesCodes: [],
      countryCodesToIds: {},
      countries: [],
    };
  }

  const supabase = createServer();
  let query = supabase.from("country").select("*");

  if (onlyActive) {
    query = query.eq("is_active", true);
  }
  0;

  const { error, data: countries } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      countriesNameEN: [],
      countriesNameFR: [],
      countriesCodes: [],
      countryCodesToIds: {},
      countries: [],
    };
  }

  const countryCodesToIds: { [key: string]: number } = countries.reduce(
    (acc, country) => {
      acc[country.iso2] = country.id;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const countriesNameEN = countries.map((country) => country.name);

  const countriesNameFR = countries.map((country) => country.name_fr);

  const countriesCodes = countries.map((country) => country.iso2);

  return {
    isSuccess: true,
    message: "Countries fetched",
    countriesNameEN,
    countriesNameFR,
    countriesCodes,
    countryCodesToIds,
    countries,
  };
}
