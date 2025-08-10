"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Loader2,
  SendHorizontal,
  Upload,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ErrorCsvImport } from "./ErrorCsvImport";
import { FieldLabelTutorial } from "./FieldLabelTutorial";
import { FileUploader } from "./file-uploader";
import { useCsvError } from "./hooks/use-csv-error";
import { useHandleCsvImport } from "./hooks/use-handle-csv-import";
import { useParseCsv } from "./hooks/use-parse-csv";
import { useUploadFile } from "./hooks/use-upload-file";
import { PreviewTableHead } from "./PreviewTableHead";
import { RowContent } from "./RowContent";

export type CsvImporterPropsType<T> = React.ComponentPropsWithoutRef<
  typeof DialogTrigger
> &
  ButtonProps & {
    /**
     * Array of field mappings defining the imported data structure.
     * Each includes a label, value, and optional required flag.
     * @example fields={[{ label: 'Name', value: 'name', required: true }, { label: 'Email', value: 'email' }]}
     */
    fields: {
      /**
       * Field display label shown to the user.
       * @example "Name"
       */
      label: string;

      /**
       * Key identifying the field in the imported data.
       * @example "name"
       */
      value: string;

      /**
       * Optional flag indicating if the field is required.
       * Required fields cannot be unchecked during mapping.
       * @default false
       * @example true
       */
      required?: boolean;

      /**
       * Optional default value for the field.
       * @example "30"
       */
      default?: string;

      /**
       * Optional infos for the field.
       * @example <div>Infos</div>
       */
      infos?: React.ReactNode;

      /**
       * Optional description for the field.
       * @example "Identifiant unique du produit (ex: AH2203)"
       */
      description?: string;
    }[];
    recommendations?: string[];
    errorAlertTitle: string;
    errorAlertDescription: string;
    errorItemCard: (item: any, index: number) => React.ReactNode;
    schemaFn: (data: Record<string, unknown>[]) => z.ZodSchema<any>;
    formatFn: (item: Record<string, unknown>) => Record<string, unknown>;
    endpoint: string;
    onSuccess: (data: T[]) => void;
    messages?: {
      noData?: string;
      apiError?: string;
    };
    exampleDownloadInfos?: {
      url: string;
      filename: string;
    };
  };

export function CsvImporter<T>({
  fields,
  className,
  recommendations = [],
  errorAlertTitle,
  errorAlertDescription,
  errorItemCard,
  schemaFn,
  formatFn,
  endpoint,
  onSuccess,
  messages,
  exampleDownloadInfos,
  ...props
}: CsvImporterPropsType<T>) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<"upload" | "map">("upload");
  const [localData, setLocalData] = React.useState<Record<string, unknown>[]>(
    []
  );
  const [currentErrorIndex, setCurrentErrorIndex] = React.useState<number>(0);
  const [isImporting, setIsImporting] = React.useState<boolean>(false);
  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const tTable = useTranslations("Tables");

  const {
    data,
    fieldMappings,
    onParse,
    onFieldChange,
    onFieldToggle,
    onFieldsReset,
    getSanitizedData,
  } = useParseCsv({ fields });

  const {
    errors,
    importErrors,
    showImportErrors,
    setErrors,
    setImportErrors,
    setShowImportErrors,
    resetErrors,
  } = useCsvError();

  const { onUpload, isUploading } = useUploadFile("csvUploader");

  const { handleImport } = useHandleCsvImport<T>({
    rawData: getSanitizedData({ data: localData }),
    schemaFn,
    formatFn,
    endpoint,
    messages: {
      noData: messages?.noData ?? tTable("no_lines_inserted"),
      apiError: messages?.apiError ?? tTable("something_went_wrong"),
    },
    onSuccess,
    setErrors,
    setImportErrors,
    setShowImportErrors,
  });

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (open && event.state?.csvModalOpen) {
        event.preventDefault();
        setOpen(false);
      }
    };
    if (open) {
      window.history.pushState({ csvModalOpen: true }, "", "");
      window.history.pushState({ dummy: true }, "", "");
      window.addEventListener("popstate", handlePopState);
    }
  }, [open]);

  const handleCellEdit = React.useCallback(
    (rowIndex: number, fieldValue: string, value: string) => {
      setLocalData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [fieldValue]: value,
        };
        return newData;
      });
    },
    []
  );

  const scrollToRow = React.useCallback((rowIndex: number) => {
    const row = document.querySelector(`#csv-import-table-row-${rowIndex}`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const isRowValid = React.useCallback(
    (index: number) => {
      return !errors.some((error) => Number(error.path[0]) === index);
    },
    [errors]
  );

  const getCellError = React.useCallback(
    (rowIndex: number, fieldValue: string) => {
      const error = errors.find(
        (error) =>
          Number(error.path[0]) === rowIndex && error.path[1] === fieldValue
      );
      return error?.message;
    },
    [errors]
  );

  const errorRows = React.useMemo(() => {
    return errors
      .map((error) => Number(error.path[0]))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b);
  }, [errors]);

  React.useEffect(() => {
    if (currentErrorIndex >= errorRows.length && errorRows.length > 0) {
      setCurrentErrorIndex(errorRows.length - 1);
    }
  }, [errorRows, currentErrorIndex]);

  const navigateToNextError = React.useCallback(() => {
    if (errorRows.length === 0) return;
    const nextIndex = (currentErrorIndex + 1) % errorRows.length;
    setCurrentErrorIndex(nextIndex);
    scrollToRow(errorRows[nextIndex]);
  }, [currentErrorIndex, errorRows, scrollToRow]);

  const navigateToPreviousError = React.useCallback(() => {
    if (errorRows.length === 0) return;
    const prevIndex =
      (currentErrorIndex - 1 + errorRows.length) % errorRows.length;
    setCurrentErrorIndex(prevIndex);
    scrollToRow(errorRows[prevIndex]);
  }, [currentErrorIndex, errorRows, scrollToRow]);

  const rowProps = React.useMemo(
    () => ({
      fields,
      isRowValid,
      getCellError,
      onCellEdit: handleCellEdit,
      setCurrentErrorIndex,
      errorRows,
    }),
    [
      fields,
      isRowValid,
      getCellError,
      handleCellEdit,
      setCurrentErrorIndex,
      errorRows,
    ]
  );

  const handleDownloadExample = async () => {
    try {
      if (!exampleDownloadInfos) return;
      const response = await fetch(exampleDownloadInfos.url);
      if (!response.ok) throw new Error(tTable("something_went_wrong"));

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = exampleDownloadInfos.filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(tTable("something_went_wrong"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="green"
          size="sm"
          className={cn("h-9 w-fit", className)}
          {...props}
          title={tTable("import_csv")}
          aria-label={tTable("import_csv")}
        >
          <Upload className="size-4 xl:mr-2" aria-hidden="true" />
          <span className="hidden xl:block">{tTable("import")}</span>
        </Button>
      </DialogTrigger>
      {step === "upload" ? (
        <DialogContent className="p-6 sm:max-w-xl sm:p-8">
          <DialogHeader>
            <DialogTitle>{tTable("upload_csv")}</DialogTitle>
            <DialogDescription>
              {tTable("upload_csv_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {!showHelp && (
              <FileUploader
                accept={{ "text/csv": [] }}
                multiple={false}
                maxSize={0.5 * 1024 * 1024}
                maxFileCount={1}
                onValueChange={(files) => {
                  const file = files[0];
                  if (!file) return;

                  onParse({ file, limit: 1001 });

                  setStep("map");
                }}
                disabled={isUploading}
                extensionsText={"CSV"}
              />
            )}
            {showHelp && (
              <Card className="p-6">
                <CardContent className="space-y-3 p-0">
                  {fields.map((field) => (
                    <FieldLabelTutorial key={field.value} field={field} />
                  ))}
                </CardContent>
              </Card>
            )}
            <div className="flex flex-row items-center justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={() => setShowHelp((prev) => !prev)}
                aria-label={showHelp ? tTable("back") : tTable("help")}
                title={showHelp ? tTable("back") : tTable("help")}
              >
                {showHelp ? "<" : "?"}
              </Button>
              {exampleDownloadInfos && showHelp && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="ml-2"
                  onClick={handleDownloadExample}
                  aria-label={tTable("download_example")}
                  title={tTable("download_example")}
                >
                  {tTable("download_example")}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className={cn(
            "no-scrollbar max-h-[90vh] overflow-y-scroll p-4 sm:max-w-screen-xl sm:p-8",
            showImportErrors && "sm:w-fit"
          )}
        >
          {showImportErrors && (
            <ErrorCsvImport<T>
              failedImports={importErrors}
              resetErrors={resetErrors}
              setOpen={setOpen}
              recommendations={recommendations}
              errorAlertTitle={errorAlertTitle}
              errorAlertDescription={errorAlertDescription}
              errorItemCard={errorItemCard}
              fields={fields}
            />
          )}
          {!showImportErrors && (
            <>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <DialogHeader className="flex-1">
                  <DialogTitle>{tTable("map_fields")}</DialogTitle>
                  <DialogDescription>
                    {tTable("map_fields_description")}
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant="outline"
                  className="w-full sm:w-fit"
                  onClick={() => {
                    onFieldsReset();
                    setErrors([]);
                    setLocalData(data);
                  }}
                  disabled={isImporting}
                  aria-label={tTable("ariaImportResetButton")}
                  title={tTable("ariaImportResetButton")}
                >
                  {tTable("reset")}
                </Button>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <Table className="border-b" scrollBarClassName="!pt-[105px]">
                  <TableHeader className="bg-background sticky top-0 z-10 shadow">
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16 border-r">#</TableHead>
                      {fields.map((field) => (
                        <PreviewTableHead
                          key={field.value}
                          field={field}
                          onFieldChange={(f) => {
                            onFieldChange({
                              oldValue: f.value,
                              newValue: field.value,
                            });
                          }}
                          onFieldToggle={onFieldToggle}
                          originalFieldMappings={fieldMappings.original}
                          currentFieldMapping={
                            fieldMappings.current[field.value]
                          }
                          className="border-r"
                        />
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    id="csv-import-table-body"
                    className="max-h-[60vh] overflow-auto"
                  >
                    {localData.map((row, i) => (
                      <RowContent key={i} row={row} index={i} {...rowProps} />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter className="flex w-full flex-row items-center justify-end gap-2 sm:justify-between">
                <div className="text-muted-foreground hidden text-sm sm:block">
                  {localData.length}{" "}
                  {tTable("row") + (localData.length > 1 ? "s" : "")}
                </div>
                <div className="flex flex-row items-center gap-2">
                  {errorRows.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-8 backdrop-blur-sm sm:size-9"
                        onClick={navigateToPreviousError}
                        title={tTable("ariaImportPreviousErrorButton")}
                        aria-label={tTable("ariaImportPreviousErrorButton")}
                        disabled={isImporting}
                      >
                        <ChevronLeftIcon className="size-4 sm:size-5" />
                      </Button>
                      <div className="text-destructive w-12 text-center text-xs font-bold">
                        {currentErrorIndex + 1}/{errorRows.length}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-8 backdrop-blur-sm sm:size-9"
                        onClick={navigateToNextError}
                        title={tTable("ariaImportNextErrorButton")}
                        aria-label={tTable("ariaImportNextErrorButton")}
                        disabled={isImporting}
                      >
                        <ChevronRightIcon className="size-4 sm:size-5" />
                      </Button>
                      <div className="h-4" />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("upload");
                      setErrors([]);
                      setCurrentErrorIndex(0);
                    }}
                    className="h-9 min-w-14 sm:h-10"
                    disabled={isImporting}
                    aria-label={tTable("ariaImportCancelButton")}
                    title={tTable("ariaImportCancelButton")}
                  >
                    <X className="size-5 sm:mr-2" />
                    <span className="hidden sm:block">{tTable("cancel")}</span>
                  </Button>
                  <Button
                    onClick={async () => {
                      setIsImporting(true);
                      await new Promise((resolve) => setTimeout(resolve, 100));
                      const success = await handleImport();
                      if (success) {
                        setOpen(false);
                        setStep("upload");
                      }
                      setIsImporting(false);
                    }}
                    className="h-9 min-w-14 sm:h-10"
                    disabled={isImporting}
                    aria-label={tTable("ariaImportSubmitButton")}
                    title={tTable("ariaImportSubmitButton")}
                  >
                    {isImporting ? (
                      <Loader2 className="size-4 animate-spin sm:mr-2" />
                    ) : (
                      <SendHorizontal className="size-4 sm:mr-2" />
                    )}
                    <span className="hidden sm:block">{tTable("import")}</span>
                  </Button>
                </div>
              </DialogFooter>
              <div className="absolute right-0 top-[calc(50%+57px)] flex -translate-y-1/2 flex-col gap-2 sm:right-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 size-8 backdrop-blur-sm"
                  onClick={() => scrollToRow(0)}
                  title={tTable("ariaScrollStartTable")}
                  aria-label={tTable("ariaScrollStartTable")}
                  disabled={isImporting}
                >
                  <ChevronUpIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 size-8 backdrop-blur-sm"
                  onClick={() => scrollToRow(localData.length - 1)}
                  title={tTable("ariaScrollEndTable")}
                  aria-label={tTable("ariaScrollEndTable")}
                  disabled={isImporting}
                >
                  <ChevronDownIcon className="size-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
