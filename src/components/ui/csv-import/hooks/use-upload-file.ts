import * as React from "react";

export function useUploadFile(
  endpoint: any,
  { defaultUploadedFiles = [], ...props }: any = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<any[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    // setIsUploading(true)
    // try {
    //   const res = await uploadFiles(endpoint, {
    //     ...props,
    //     files,
    //     onUploadProgress: ({ file, progress }) => {
    //       setProgresses((prev) => {
    //         return {
    //           ...prev,
    //           [file]: progress ?? 0,
    //         }
    //       })
    //     },
    //   })
    //   setUploadedFiles((prev) => (prev ? [...prev, ...res] : res))
    // } catch (err) {
    //   toast.error(getErrorMessage(err))
    // } finally {
    //   setProgresses({})
    //   setIsUploading(false)
    // }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
