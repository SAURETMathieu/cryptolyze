import { createClient } from "../../lib/supabase/client";

/**
 * Retrieves a file from a FormData object using the specified key.
 * @param formData - The FormData object containing the file.
 * @param key - The key used to retrieve the file from the FormData object.
 * @returns The file associated with the specified key.
 * @throws An error if no file is found for the specified key.
 */
export const getFile = (formData: FormData, key: string): File => {
  const file = formData.get(key) as File;
  if (!file) {
    throw new Error(`No ${key} file provided`);
  }
  return file;
};

export async function getFilesFromDirectoryBucket(
  bucket: string,
  path: string
) {
  const supabase = createClient();

  const { data: filesInfos, error: listError } = await supabase.storage
    .from(bucket)
    .list(path);

  if (listError) {
    return {
      success: false,
      message: listError.message,
      data: null,
    };
  }

  const downloadedFiles = await Promise.all(
    filesInfos.map(async (file) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(`${path}/${file.name}`);

      if (error) {
        return { success: false, message: "error_fetching_files", file: null };
      }

      const downloadedFile = new File([data], file.name, {
        type: data.type || "application/octet-stream",
      });

      return {
        success: true,
        message: "File downloaded",
        file: downloadedFile,
      };
    })
  );

  return {
    success: true,
    message: "All files downloaded",
    data: downloadedFiles,
  };
}

export function convertBase64ToFile(
  base64: string,
  name: string,
  type: string
) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type });

  return new File([blob], name, { type });
}
