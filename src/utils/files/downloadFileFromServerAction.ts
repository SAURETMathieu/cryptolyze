/**
 * Downloads a file from a server action
 * @param action - The server action function to call
 * @param params - Parameters to pass to the function
 * @param filename - Name of the file to download
 * @param mimeType - MIME type of the file (default: "application/pdf")
 */
export const downloadFileFromServerAction = async <
  T extends (
    ...args: any[]
  ) => Promise<{ data: string | null; success: boolean; message: string }>,
>(
  action: T,
  params: Parameters<T>,
  filename: string,
  mimeType: string = "application/pdf"
) => {
  try {
    const { data, success, message } = await action(...params);

    if (!success || !data) {
      throw new Error(message || "No message");
    }

    const byteCharacters = atob(data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error while downloading file:", error);
    return false;
  }
};
