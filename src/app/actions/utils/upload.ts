"use server";

import { createServer } from "@/src/lib/supabase/server";
import { getFile } from "@/src/utils/files/files";
import { parse } from "papaparse";

/**
 * Uploads a file to the specified bucket in Supabase storage.
 *
 * @param uid - The user ID associated with the file.
 * @param bucket - The name of the bucket to upload the file to.
 * @param file - The file to be uploaded.
 */
export async function uploadFile(
  uid: string,
  bucket: string,
  file: File,
  upsert: boolean,
  name?: string
) {
  const supabase = createServer();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${uid}/${name ? name : Date.now()}`, file, {
      upsert,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "File uploaded",
    data: data,
  };
}

/**
 * Uploads a CSV file containing listings and returns an array of products.
 * @param formData - The form data containing the CSV file.
 * @returns An array of products parsed from the CSV file.
 */
export async function uploadListingCSV(formData: FormData) {
  const linstingFile = getFile(formData, "listing");
  const products: any[] = [];

  parse(linstingFile, {
    complete: (result) => {
      result.data.forEach((product) => {
        products.push(product as any);
      });
    },
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  return products;
}
